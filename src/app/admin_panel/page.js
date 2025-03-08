'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../../firebase';
import { collection, getDocs, query, where, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// ChartJS bileşenlerini kaydet
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Admin() {
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionResults, setSessionResults] = useState([]);
  const [viewingResults, setViewingResults] = useState(false);
  
  // Filtreleme için state'ler
  const [filterDate, setFilterDate] = useState('');
  const [searchPin, setSearchPin] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // Tamamlanmış oturumları al
        const sessionsQuery = query(
          collection(db, "sessions"),
          where("completed", "==", true),
          orderBy("timestamp", "desc")
        );
        
        const sessionsSnapshot = await getDocs(sessionsQuery);
        const sessionsData = [];
        
        sessionsSnapshot.forEach((doc) => {
          sessionsData.push({
            id: doc.id,
            ...doc.data(),
            formattedDate: new Date(doc.data().timestamp).toLocaleString('tr-TR'),
            date: new Date(doc.data().timestamp).toISOString().split('T')[0]
          });
        });
        
        setSessions(sessionsData);
        setFilteredSessions(sessionsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setError("Oturumlar yüklenirken bir hata oluştu.");
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Filtreleme işlevi
  useEffect(() => {
    let result = [...sessions];
    
    // Tarih filtreleme
    if (filterDate) {
      result = result.filter(session => {
        // Timestamp'i tarih formatına çevir ve karşılaştır
        const sessionDate = new Date(session.timestamp).toISOString().split('T')[0];
        return sessionDate === filterDate;
      });
    }
    
    // PIN arama
    if (searchPin) {
      result = result.filter(session => 
        session.pin.toLowerCase().includes(searchPin.toLowerCase())
      );
    }
    
    setFilteredSessions(result);
  }, [sessions, filterDate, searchPin]);

  const handleSessionClick = (sessionId) => {
    // Doğrudan router.push ile yönlendir
    router.push(`/admin_panel/${sessionId}`);
  };

  const handleBackToSessions = () => {
    setViewingResults(false);
    setSelectedSession(null);
    setSessionResults([]);
  };

  const calculateAverageRT = (results) => {
    if (results.length === 0) return 0;
    const totalRT = results.reduce((sum, trial) => sum + trial.responseTime, 0);
    return (totalRT / results.length).toFixed(2);
  };

  const calculateAccuracy = (results) => {
    if (results.length === 0) return 0;
    const correctTrials = results.filter(trial => trial.correct).length;
    return ((correctTrials / results.length) * 100).toFixed(2);
  };

  // Tehdit ve nötr kelimelere verilen tepki sürelerini hesapla
  const calculateRTByWordType = (results) => {
    if (results.length === 0) return { threat: 0, neutral: 0 };
    
    const threatTrials = results.filter(trial => trial.probePosition === trial.threatPosition);
    const neutralTrials = results.filter(trial => trial.probePosition !== trial.threatPosition);
    
    const threatRT = threatTrials.length > 0 
      ? threatTrials.reduce((sum, trial) => sum + trial.responseTime, 0) / threatTrials.length 
      : 0;
      
    const neutralRT = neutralTrials.length > 0 
      ? neutralTrials.reduce((sum, trial) => sum + trial.responseTime, 0) / neutralTrials.length 
      : 0;
      
    return { 
      threat: threatRT.toFixed(2), 
      neutral: neutralRT.toFixed(2)
    };
  };

  // CSV dışa aktarma
  const exportToCSV = (data, filename) => {
    // CSV başlıkları
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (viewingResults) {
      // Oturum sonuçları için CSV
      csvContent += "Deneme No,Tehdit Kelimesi,Nötr Kelime,Tepki Süresi (ms),Doğru mu\n";
      
      data.forEach(result => {
        csvContent += `${result.trialNumber},${result.threatWord},${result.neutralWord},${result.responseTime.toFixed(2)},${result.correct ? 'Evet' : 'Hayır'}\n`;
      });
    } else {
      // Oturumlar listesi için CSV
      csvContent += "PIN,Grup,Tarih\n";
      
      data.forEach(session => {
        csvContent += `${session.pin},${session.group === 'experimental' ? 'Deney' : 'Kontrol'},${session.formattedDate}\n`;
      });
    }
    
    // CSV dosyasını indir
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Grafik verilerini hazırlayalım
  const rtChartData = {
    labels: ['Tehdit Kelimesi', 'Nötr Kelime'],
    datasets: [
      {
        label: 'Ortalama Tepki Süresi (ms)',
        data: viewingResults ? [calculateRTByWordType(sessionResults).threat, calculateRTByWordType(sessionResults).neutral] : [0, 0],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Kelime Tipine Göre Tepki Süresi Analizi',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Silme işlemi için onay iste
  const handleDeleteClick = (session, e) => {
    e.stopPropagation(); // Tıklamanın üst elemanlara yayılmasını engelle
    setSessionToDelete(session);
    setShowDeleteConfirm(true);
  };
  
  // Oturumu sil
  const confirmDelete = async () => {
    if (!sessionToDelete) return;
    
    try {
      // Önce oturuma ait tüm denemeleri sil
      const trialsSnapshot = await getDocs(collection(db, "sessions", sessionToDelete.id, "trials"));
      const deleteTrialPromises = [];
      
      trialsSnapshot.forEach((trialDoc) => {
        deleteTrialPromises.push(deleteDoc(doc(db, "sessions", sessionToDelete.id, "trials", trialDoc.id)));
      });
      
      await Promise.all(deleteTrialPromises);
      
      // Sonra oturumu sil
      await deleteDoc(doc(db, "sessions", sessionToDelete.id));
      
      // State'i güncelle
      setSessions(prev => prev.filter(s => s.id !== sessionToDelete.id));
      
      // Onay penceresini kapat
      setShowDeleteConfirm(false);
      setSessionToDelete(null);
      
    } catch (error) {
      console.error("Error deleting session:", error);
      alert("Oturum silinirken bir hata oluştu");
    }
  };
  
  // Silme işlemini iptal et
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setSessionToDelete(null);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Yönetici Paneli</h1>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Ana Sayfaya Dön
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-600">Yükleniyor...</p>
          </div>
        ) : (
          <>
            {viewingResults ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="px-6 py-4 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Oturum Sonuçları</h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => exportToCSV(sessionResults, `session_${selectedSession}_results.csv`)}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-sm"
                    >
                      CSV İndir
                    </button>
                    <button
                      onClick={handleBackToSessions}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm"
                    >
                      Geri Dön
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Ortalama Tepki Süresi</h3>
                      <p className="text-2xl font-bold">{calculateAverageRT(sessionResults)} ms</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Doğruluk Oranı</h3>
                      <p className="text-2xl font-bold">%{calculateAccuracy(sessionResults)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Toplam Deneme</h3>
                      <p className="text-2xl font-bold">{sessionResults.length}</p>
                    </div>
                  </div>
                  
                  {/* Grafik */}
                  <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium mb-4">Tepki Süresi Analizi</h3>
                    <div className="h-64">
                      <Bar data={rtChartData} options={chartOptions} />
                    </div>
                  </div>
                  
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Deneme No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tehdit Kelimesi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nötr Kelime
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tepki Süresi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Doğru mu?
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sessionResults.map((result) => (
                        <tr key={result.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {result.trialNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {result.threatWord}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {result.neutralWord}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {result.responseTime.toFixed(2)} ms
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              result.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {result.correct ? 'Doğru' : 'Yanlış'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                  <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">Oturumları Filtrele</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="filter-date" className="block text-sm font-medium text-gray-700 mb-1">
                          Tarih
                        </label>
                        <input
                          type="date"
                          id="filter-date"
                          value={filterDate}
                          onChange={(e) => setFilterDate(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label htmlFor="search-pin" className="block text-sm font-medium text-gray-700 mb-1">
                          PIN Ara
                        </label>
                        <input
                          type="text"
                          id="search-pin"
                          value={searchPin}
                          onChange={(e) => setSearchPin(e.target.value)}
                          placeholder="PIN kodunu ara..."
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => {
                            setFilterDate('');
                            setSearchPin('');
                          }}
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                        >
                          Filtreleri Temizle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">Tamamlanmış Oturumlar</h2>
                  </div>
                  
                  {filteredSessions.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      Filtrelere uygun oturum bulunamadı.
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            PIN
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tarih
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Durum
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            İşlemler
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredSessions.map((session) => (
                          <tr 
                            key={session.id} 
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{session.pin}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{session.formattedDate}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                session.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {session.completed ? 'Tamamlandı' : 'Devam Ediyor'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => handleSessionClick(session.id)}
                                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  Detaylar
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(session, e);
                                  }}
                                  className="p-1.5 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                                  title="Sil"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}
          </>
        )}
        
        {/* Silme Onay Modalı */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Silme Onayı</h3>
              <p className="text-gray-600 mb-6">
                <strong>{sessionToDelete?.pin}</strong> PIN kodlu oturumu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}