'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export default function Results() {
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [pin, setPin] = useState('');
  const [group, setGroup] = useState('');
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState('');
  
  useEffect(() => {
    // Tarayıcı tarafında çalıştığından emin ol
    if (typeof window !== 'undefined') {
      const storedSessionId = localStorage.getItem('dots_session_id');
      
      if (!storedSessionId) {
        // Oturum ID yoksa ana sayfaya yönlendir
        router.push('/');
        return;
      }
      
      setSessionId(storedSessionId);
      
      // Firebase'den verileri çek
      const fetchData = async () => {
        try {
          // Oturum bilgilerini al
          const sessionDoc = await getDoc(doc(db, "sessions", storedSessionId));
          if (sessionDoc.exists()) {
            const sessionData = sessionDoc.data();
            setPin(sessionData.pin);
            setGroup(sessionData.group);
          }
          
          // Deneme sonuçlarını al
          const trialsSnapshot = await getDocs(collection(db, "sessions", storedSessionId, "trials"));
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
        } catch (error) {
          console.error("Error fetching data: ", error);
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [router]);
  
  const [stats, setStats] = useState({
    totalTrials: 0,
    correctTrials: 0,
    averageRT: 0,
    accuracyRate: 0,
    threatFollowedRT: 0,
    neutralFollowedRT: 0
  });
  
  const calculateStats = (resultsData) => {
    if (!resultsData || resultsData.length === 0) return;
    
    const totalTrials = resultsData.length;
    const correctTrials = resultsData.filter(trial => trial.correct).length;
    const totalRT = resultsData.reduce((sum, trial) => sum + trial.responseTime, 0);
    const averageRT = totalRT / totalTrials;
    const accuracyRate = (correctTrials / totalTrials) * 100;
    
    // Tehdit ve nötr kelime sonrası tepki süreleri
    const threatFollowedTrials = resultsData.filter(trial => trial.probeFollowsThreat && trial.correct);
    const neutralFollowedTrials = resultsData.filter(trial => !trial.probeFollowsThreat && trial.correct);
    
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
      neutralFollowedRT
    });
  };
  
  const handleFinish = () => {
    // Oturumu temizle ve ana sayfaya dön
    localStorage.removeItem('dots_session_id');
    router.push('/');
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
  
  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-white">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-8">Sonuçlar</h1>
        
        {loading ? (
          <p className="text-lg text-center">Sonuçlar yükleniyor...</p>
        ) : (
          <>
            <div className="bg-gray-100 p-6 rounded mb-8">
              <h2 className="text-2xl font-semibold mb-4">Özet İstatistikler</h2>
              <ul className="space-y-2 text-lg">
                <li><strong>Katılımcı PIN:</strong> {pin}</li>
                <li><strong>Grup:</strong> {group === 'experimental' ? 'Deney Grubu' : 'Kontrol Grubu'}</li>
                <li><strong>Toplam Deneme:</strong> {stats.totalTrials}</li>
                <li><strong>Doğru Yanıtlar:</strong> {stats.correctTrials}</li>
                <li><strong>Doğruluk Oranı:</strong> {stats.accuracyRate.toFixed(2)}%</li>
                <li><strong>Ortalama Tepki Süresi:</strong> {stats.averageRT.toFixed(2)} ms</li>
                <li><strong>Tehdit Kelimesi Sonrası Ortalama Tepki Süresi:</strong> {stats.threatFollowedRT.toFixed(2)} ms</li>
                <li><strong>Nötr Kelime Sonrası Ortalama Tepki Süresi:</strong> {stats.neutralFollowedRT.toFixed(2)} ms</li>
              </ul>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">Detaylı Sonuçlar</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2">Sıra</th>
                    <th className="border border-gray-300 p-2">Tehdit Kelimesi</th>
                    <th className="border border-gray-300 p-2">Nötr Kelime</th>
                    <th className="border border-gray-300 p-2">Ok Konumu</th>
                    <th className="border border-gray-300 p-2">Ok Yönü</th>
                    <th className="border border-gray-300 p-2">Tehdit Kelimesi Konumu</th>
                    <th className="border border-gray-300 p-2">Sonuç</th>
                    <th className="border border-gray-300 p-2">Tepki Süresi (ms)</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((trial, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="border border-gray-300 p-2 text-center">{trial.trialNumber}</td>
                      <td className="border border-gray-300 p-2">{trial.threatWord}</td>
                      <td className="border border-gray-300 p-2">{trial.neutralWord}</td>
                      <td className="border border-gray-300 p-2 text-center">
                        {getProbePositionText(trial.probePosition, trial.threatPosition)}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        {getProbeDirectionText(trial.probeDirection)}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        {getThreatPositionText(trial.threatPosition)}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        {getCorrectText(trial.correct)}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        {trial.responseTime ? Math.round(trial.responseTime) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <p className="text-lg text-center mt-8">
              Tebrikler! DOTS görevini başarıyla tamamladınız. Katılımınız için teşekkür ederiz.
            </p>
            
            <p className="text-center text-gray-600 mb-8">
              Bu sonuçlar araştırma ekibimiz tarafından analiz edilecek ve çalışmanın sonuçları hakkında bilgilendirileceksiniz.
            </p>
            
            <button
              onClick={handleFinish}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded text-lg font-medium"
            >
              Bitir
            </button>
          </>
        )}
      </div>
    </div>
  );
}
