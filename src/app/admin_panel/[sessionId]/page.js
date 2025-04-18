'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { db } from '../../../../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// ChartJS bileşenlerini kaydet
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SessionDetails() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId;
  
  const [results, setResults] = useState([]);
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalTrials: 0,
    correctTrials: 0,
    averageRT: 0,
    accuracyRate: 0,
    threatFollowedRT: 0,
    neutralFollowedRT: 0,
    totalDuration: 0
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // URL'den gelen ID'yi decode et
        const decodedSessionId = decodeURIComponent(sessionId);
        console.log("Fetching session with ID:", decodedSessionId);
        
        // Oturum bilgilerini al
        const sessionDoc = await getDoc(doc(db, "sessions", decodedSessionId));
        
        if (!sessionDoc.exists()) {
          console.error("Session document not found:", decodedSessionId);
          setError("Oturum bulunamadı. ID: " + decodedSessionId);
          setLoading(false);
          return;
        }
        
        const sessionDataFromDB = sessionDoc.data();
        console.log("Session data:", sessionDataFromDB);
        
        setSessionData({
          id: sessionDoc.id,
          ...sessionDataFromDB,
          formattedDate: new Date(sessionDataFromDB.timestamp).toLocaleString('tr-TR')
        });
        
        // Deneme sonuçlarını al
        const trialsSnapshot = await getDocs(collection(db, "sessions", decodedSessionId, "trials"));
        const trialsData = [];
        
        trialsSnapshot.forEach((doc) => {
          trialsData.push(doc.data());
        });
        
        // Deneme numarasına göre sırala
        trialsData.sort((a, b) => a.trialNumber - b.trialNumber);
        setResults(trialsData);
        
        // İstatistikleri hesapla
        calculateStats(trialsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Veriler yüklenirken bir hata oluştu: " + err.message);
        setLoading(false);
      }
    };
    
    if (sessionId) {
      fetchData();
    }
  }, [sessionId]);
  
  const calculateStats = (resultsData) => {
    if (!resultsData || resultsData.length === 0) return;
    
    const totalTrials = resultsData.length;
    const correctTrials = resultsData.filter(trial => trial.correct).length;
    const totalRT = resultsData.reduce((sum, trial) => sum + trial.responseTime, 0);
    const averageRT = totalRT / totalTrials;
    const accuracyRate = (correctTrials / totalTrials) * 100;
    
    // Toplam geçen süre (milisaniye cinsinden)
    const totalDuration = totalRT;
    
    // Tehdit ve nötr kelime sonrası tepki süreleri
    const threatFollowedTrials = resultsData.filter(trial => trial.probePosition === trial.threatPosition);
    const neutralFollowedTrials = resultsData.filter(trial => trial.probePosition !== trial.threatPosition);
    
    const threatFollowedRT = threatFollowedTrials.length > 0 
      ? threatFollowedTrials.reduce((sum, trial) => sum + trial.responseTime, 0) / threatFollowedTrials.length 
      : 0;
      
    const neutralFollowedRT = neutralFollowedTrials.length > 0 
      ? neutralFollowedTrials.reduce((sum, trial) => sum + trial.responseTime, 0) / neutralFollowedTrials.length 
      : 0;
    
    setStats({
      totalTrials,
      correctTrials,
      averageRT,
      accuracyRate,
      threatFollowedRT,
      neutralFollowedRT,
      totalDuration
    });
  };
  
  // Probe yönünü metin olarak göster
  const getProbeDirectionText = (direction) => {
    return direction === 0 ? 'Sol (←)' : 'Sağ (→)';
  };
  
  // Probe konumunu metin olarak göster
  const getProbePositionText = (position, threatPosition) => {
    if (position === threatPosition) {
      return 'Tehdit';
    } else {
      return 'Nötr';
    }
  };
  
  // Tehdit kelimesinin konumunu metin olarak göster
  const getThreatPositionText = (position) => {
    return position === 0 ? 'Yukarı' : 'Aşağı';
  };
  
  // Doğru/Yanlış gösterimi
  const getCorrectText = (correct) => {
    return correct ? 'Doğru' : 'Yanlış';
  };

  // CSV dışa aktarma
  const exportToCSV = (data, filename) => {
    // CSV başlıkları
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Sıra,Tehdit Kelimesi,Nötr Kelime,Ok Konumu,Ok Yönü,Tehdit Kelimesi Konumu,Sonuç,Tepki Süresi (ms)\n";
    
    data.forEach(trial => {
      csvContent += `${trial.trialNumber},${trial.threatWord},${trial.neutralWord},${getProbePositionText(trial.probePosition, trial.threatPosition)},${getProbeDirectionText(trial.probeDirection)},${getThreatPositionText(trial.threatPosition)},${getCorrectText(trial.correct)},${Math.round(trial.responseTime)}\n`;
    });
    
    // CSV dosyasını indir
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  // Grafik verilerini hazırlayalım
  const rtChartData = {
    labels: ['Tehdit Kelimesi', 'Nötr Kelime'],
    datasets: [
      {
        label: 'Ortalama Tepki Süresi (ms)',
        data: [calculateRTByWordType(results).threat, calculateRTByWordType(results).neutral],
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
        text: 'Kelime Tipine Göre Tepki Süresi',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Oturum Detayları</h1>
          <div>
            <button 
              onClick={() => router.push('/admin_panel')}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors mr-2"
            >
              Geri Dön
            </button>
            <button 
              onClick={() => exportToCSV(results, `session_${sessionId}_results.csv`)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors mr-2"
            >
              CSV İndir
            </button>
            <button 
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Ana Sayfa
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Veriler yükleniyor...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {sessionData && (
              <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">Oturum Bilgileri</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">PIN:</p>
                    <p className="text-xl font-medium">{sessionData.pin}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Grup:</p>
                    <p className="text-xl font-medium">
                      <span className={`px-2 py-1 text-sm font-semibold rounded-full ${
                        sessionData.group === 'experimental' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {sessionData.group === 'experimental' ? 'Deney Grubu' : 'Kontrol Grubu'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tarih:</p>
                    <p className="text-xl font-medium">{sessionData.formattedDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Durum:</p>
                    <p className="text-xl font-medium">
                      <span className="px-2 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                        Tamamlandı
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Özet İstatistikler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">Toplam Deneme:</p>
                  <p className="text-2xl font-bold">{stats.totalTrials}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">Doğru Yanıtlar:</p>
                  <p className="text-2xl font-bold">{stats.correctTrials}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">Doğruluk Oranı:</p>
                  <p className="text-2xl font-bold">{stats.accuracyRate.toFixed(2)}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">Ortalama Tepki Süresi:</p>
                  <p className="text-2xl font-bold">{stats.averageRT.toFixed(2)} ms</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">Toplam Geçen Süre:</p>
                  <p className="text-2xl font-bold">{(stats.totalDuration / 1000).toFixed(2)} saniye</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">Tehdit Kelimesi Sonrası Ortalama Tepki Süresi:</p>
                  <p className="text-2xl font-bold">{stats.threatFollowedRT.toFixed(2)} ms</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">Nötr Kelime Sonrası Ortalama Tepki Süresi:</p>
                  <p className="text-2xl font-bold">{stats.neutralFollowedRT.toFixed(2)} ms</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Tepki Süresi Analizi</h2>
              <div style={{ height: "300px" }}>
                <Bar data={rtChartData} options={chartOptions} />
              </div>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4 bg-blue-600 text-white">
                <h2 className="text-xl font-semibold">Detaylı Sonuçlar</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Sıra
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Tehdit Kelimesi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Nötr Kelime
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Ok Konumu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Ok Yönü
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Tehdit Kelimesi Konumu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Sonuç
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Tepki Süresi (ms)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.map((trial, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {trial.trialNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {trial.threatWord}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {trial.neutralWord}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getProbePositionText(trial.probePosition, trial.threatPosition)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getProbeDirectionText(trial.probeDirection)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getThreatPositionText(trial.threatPosition)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            trial.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {getCorrectText(trial.correct)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {trial.responseTime ? Math.round(trial.responseTime) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}