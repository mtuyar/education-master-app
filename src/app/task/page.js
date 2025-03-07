'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { wordPairs } from '../data/sample_data';
import { db } from '../../../firebase';
import { collection, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';

// Kelime verileri
const threatWords = ["başarısızlık", "yetersiz", "soru", "sınav", "hata", "başaramama", "zor", "kaygı"];
const neutralWords = ["defter", "masa", "bardak", "kalem", "kitap", "sandalye", "pencere", "lamba"];

export default function DotProbeTask() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState('');
  
  const [currentTrial, setCurrentTrial] = useState(0);
  const [maxTrials] = useState(15); // Toplam deneme sayısı
  const [phase, setPhase] = useState('fixation'); // fixation, stimulus, probe, feedback
  const [trialData, setTrialData] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [responseCorrect, setResponseCorrect] = useState(null);
  
  // Oturum bilgilerini Firebase'den al
  useEffect(() => {
    const fetchSessionData = async () => {
      const storedSessionId = localStorage.getItem('dots_session_id');
      if (storedSessionId) {
        setSessionId(storedSessionId);
        
        try {
          await getDoc(doc(db, "sessions", storedSessionId));
          // Grup bilgisini kullanmak istiyorsanız burada alabilirsiniz
        } catch (error) {
          console.error("Error fetching session data: ", error);
        }
      } else {
        // Oturum ID yoksa ana sayfaya yönlendir
        router.push('/');
      }
    };
    
    fetchSessionData();
  }, [router]);
  
  // Yeni deneme oluştur
  const createTrial = useCallback(() => {
    // Rastgele bir kelime çifti seçelim
    const randomPairIndex = Math.floor(Math.random() * wordPairs.length);
    const selectedPair = wordPairs[randomPairIndex];
    
    // Tehdit kelimesinin konumu (üst: 0, alt: 1)
    const threatPosition = Math.random() < 0.5 ? 0 : 1;
    
    // Probe'un konumu - rastgele olarak %50 ihtimalle tehdit kelimesinin, %50 ihtimalle nötr kelimenin konumunda
    const probeFollowsThreat = Math.random() < 0.5;
    const probePosition = probeFollowsThreat ? threatPosition : (threatPosition === 0 ? 1 : 0);
    
    // Probe'un yönü (sol: 0, sağ: 1)
    const probeDirection = Math.random() < 0.5 ? 0 : 1;
    
    return {
      trialNumber: currentTrial + 1,
      threatWord: selectedPair.threatWord,
      neutralWord: selectedPair.neutralWord,
      threatPosition,
      probePosition,
      probeFollowsThreat,
      probeDirection,
      startTime: null,
      responseTime: null,
      correct: null
    };
  }, [currentTrial]);
  
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
      
      // Sonuçları kaydet
      const updatedTrialData = {
        ...trialData,
        responseTime: rt,
        correct: key === correctKey
      };
      
      // Firebase'e deneme sonucunu kaydet
      const saveTrialToFirebase = async () => {
        try {
          await addDoc(collection(db, "sessions", sessionId, "trials"), updatedTrialData);
        } catch (error) {
          console.error("Error saving trial: ", error);
        }
      };
      
      saveTrialToFirebase();
      setPhase('feedback');
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [phase, trialData, sessionId]);
  
  // Deneme akışını yönet
  useEffect(() => {
    let timeoutId;
    
    if (currentTrial >= maxTrials) {
      // Görev tamamlandı, oturumu tamamlandı olarak işaretle
      const completeSession = async () => {
        try {
          await setDoc(doc(db, "sessions", sessionId), { completed: true }, { merge: true });
        } catch (error) {
          console.error("Error completing session: ", error);
        }
      };
      
      completeSession();
      
      // Sonuç sayfasına yönlendir
      router.push('/results');
      return;
    }
    
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
      // 1000ms sonra bir sonraki denemeye geç
      timeoutId = setTimeout(() => {
        setCurrentTrial(prev => prev + 1);
        setPhase('fixation');
      }, 1000);
    }
    
    // Temizleme fonksiyonu
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [phase, currentTrial, maxTrials, createTrial, sessionId, router]);
  
  // Ana sayfaya dön
  const goToHomePage = () => {
    router.push('/');
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="relative w-full max-w-md h-80 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center">
        {phase === 'fixation' && (
          <div className="text-3xl">+</div>
        )}
        
        {phase === 'stimulus' && trialData && (
          <div className="flex flex-col items-center space-y-16">
            <div className="text-xl font-medium">
              {trialData.threatPosition === 0 ? trialData.threatWord : trialData.neutralWord}
            </div>
            <div className="text-xl font-medium">
              {trialData.threatPosition === 1 ? trialData.threatWord : trialData.neutralWord}
            </div>
          </div>
        )}
        
        {phase === 'probe' && trialData && (
          <div className="flex flex-col items-center space-y-16">
            <div className="h-8 flex items-center justify-center">
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
            <div className="text-sm text-gray-600 mt-2">
              Tepki süresi: {responseTime.toFixed(0)} ms
            </div>
          </div>
        )}
        
        {phase === 'completed' && (
          <div className="flex flex-col items-center">
            <div className="text-2xl text-green-600 font-bold mb-4">
              Tebrikler!
            </div>
            <div className="text-lg text-center mb-6">
              Görevi başarıyla tamamladınız.
            </div>
            <button 
              onClick={goToHomePage}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        )}
        
        {phase !== 'completed' && (
          <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-500">
            Deneme: {currentTrial + 1} / {maxTrials}
          </div>
        )}
      </div>
    </div>
  );
}
