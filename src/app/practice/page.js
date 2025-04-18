'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Alıştırma için sabit kelime çiftleri
const practiceWordPairs = [
  { neutralWord: "MAVİ", neutralWord2: "KASA" },
  { neutralWord: "HAMSİ", neutralWord2: "ARMUT" },
  { neutralWord: "DOMATES", neutralWord2: "OYUNCAK" },
  { neutralWord: "BALONCUK", neutralWord2: "ASTRONOT" },
  { neutralWord: "OYUN PARKI", neutralWord2: "RÜZGARGÜLÜ" },
  { neutralWord: "KÜÇÜK TİLKİ", neutralWord2: "BEYAZ PERDE" }
];

export default function Practice() {
  const router = useRouter();
  
  const [currentTrial, setCurrentTrial] = useState(0);
  const [maxTrials] = useState(6); // Alıştırma için 6 deneme
  const [phase, setPhase] = useState('ready'); // ready, fixation, stimulus, probe, feedback
  const [trialData, setTrialData] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [responseCorrect, setResponseCorrect] = useState(null);
  
  // Yeni alıştırma denemesi oluştur
  const createTrial = useCallback(() => {
    // Sabit kelime çiftlerini kullan
    const { neutralWord, neutralWord2 } = practiceWordPairs[currentTrial];
    
    // Tehdit kelimesinin konumu (üst: 0, alt: 1)
    const threatPosition = Math.random() < 0.5 ? 0 : 1;
    
    // Probe'un konumu - %50 ihtimalle tehdit kelimesinin, %50 ihtimalle nötr kelimenin konumunda
    const probeFollowsThreat = Math.random() < 0.5;
    const probePosition = probeFollowsThreat ? threatPosition : (threatPosition === 0 ? 1 : 0);
    
    // Probe'un yönü (sol: 0, sağ: 1)
    const probeDirection = Math.random() < 0.5 ? 0 : 1;
    
    return {
      neutralWord,
      neutralWord2,
      threatPosition,
      probePosition,
      probeFollowsThreat,
      probeDirection,
      startTime: null
    };
  }, [currentTrial]);
  
  // Alıştırmayı başlat
  const startPractice = () => {
    setPhase('fixation');
  };
  
  // Tuş basımlarını dinle
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (phase !== 'probe') return;
      
      const key = e.key.toLowerCase();
      const correctKey = trialData.probeDirection === 0 ? 'z' : 'm';
      
      const endTime = performance.now();
      const rt = endTime - trialData.startTime;
      
      setResponseTime(rt);
      setResponseCorrect(key === correctKey);
      setPhase('feedback');
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [phase, trialData]);
  
  // Deneme fazlarını yönet
  useEffect(() => {
    let timeoutId;
    
    if (phase === 'fixation') {
      // Yeni deneme oluştur
      setTrialData(createTrial());
      
      // 500ms sonra stimulus fazına geç
      timeoutId = setTimeout(() => {
        setPhase('stimulus');
      }, 500);
    } 
    else if (phase === 'stimulus') {
      // 500ms sonra probe fazına geç
      timeoutId = setTimeout(() => {
        setPhase('probe');
        // Tepki süresini ölçmeye başla
        setTrialData(prev => ({
          ...prev,
          startTime: performance.now()
        }));
      }, 500);
    }
    else if (phase === 'feedback') {
      // 1000ms sonra bir sonraki denemeye geç veya tamamla
      timeoutId = setTimeout(() => {
        if (currentTrial < maxTrials - 1) {
          setCurrentTrial(prev => prev + 1);
          setPhase('fixation');
        } else {
          setPhase('complete');
        }
      }, 1000);
    }
    
    // Temizleme fonksiyonu
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [phase, currentTrial, maxTrials, createTrial]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      {phase === 'ready' && (
        <div className="w-full max-w-2xl text-center">
          <h1 className="text-3xl font-bold mb-8">Alıştırma</h1>
          <div className="mb-8 text-lg">
            <p className="mb-4">Şimdi 6 denemelik bir alıştırma yapacaksınız.</p>
            <p>Hazır olduğunuzda başlamak için aşağıdaki düğmeye tıklayın.</p>
          </div>
          
          <button
            onClick={startPractice}
            className="px-6 py-3 bg-blue-600 text-white rounded text-lg font-medium"
          >
            Alıştırmaya Başla
          </button>
        </div>
      )}
      
      {phase !== 'ready' && phase !== 'complete' && (
        <div className="relative w-full max-w-2xl h-80 bg-white border border-gray-300 rounded flex flex-col items-center justify-center">
          {phase === 'fixation' && (
            <div className="text-4xl">+++</div>
          )}
          
          {phase === 'stimulus' && trialData && (
            <div className="flex flex-col items-center">
              <div className="text-xl font-medium" style={{ marginBottom: '3cm' }}>
                {trialData.threatPosition === 0 ? trialData.neutralWord : trialData.neutralWord2}
              </div>
              <div className="text-xl font-medium">
                {trialData.threatPosition === 1 ? trialData.neutralWord : trialData.neutralWord2}
              </div>
            </div>
          )}
          
          {phase === 'probe' && trialData && (
            <div className="flex flex-col items-center">
              <div className="h-8 flex items-center justify-center" style={{ marginBottom: '3cm' }}>
                {trialData.probePosition === 0 && (
                  <div className="text-2xl">
                    {trialData.probeDirection === 0 ? '←' : '→'}
                  </div>
                )}
              </div>
              <div className="h-8 flex items-center justify-center">
                {trialData.probePosition === 1 && (
                  <div className="text-2xl">
                    {trialData.probeDirection === 0 ? '←' : '→'}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {phase === 'feedback' && (
            <div className={`text-xl ${responseCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {responseCorrect ? 'Doğru!' : 'Yanlış!'}
              <div className="mt-4 text-lg text-gray-700">
                Sol ok için <strong>Z</strong> tuşuna, sağ ok için <strong>M</strong> tuşuna basın
              </div>
            </div>
          )}
          
          <div className="absolute bottom-4 left-0 right-0 text-center text-lg text-gray-500">
            Alıştırma: {currentTrial + 1} / {maxTrials}
          </div>
        </div>
      )}
      
      {phase === 'complete' && (
        <div className="w-full max-w-2xl text-center">
          <h1 className="text-3xl font-bold mb-8">Alıştırma Tamamlandı</h1>
          <p className="mb-8 text-lg">
            Tebrikler! Alıştırmayı tamamladınız. Şimdi ana göreve geçebilirsiniz.
          </p>
          <button
            onClick={() => router.push('/task')}
            className="px-6 py-3 bg-blue-600 text-white rounded text-lg font-medium"
          >
            Ana Göreve Başla
          </button>
        </div>
      )}
    </div>
  );
}
