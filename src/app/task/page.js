'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { wordPairs } from '../data/sample_data';
import { db } from '../../../firebase';
import { collection, addDoc, doc, setDoc, getDoc, getDocs } from 'firebase/firestore';

export default function DotProbeTask() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState('');
  
  const [currentTrial, setCurrentTrial] = useState(0);
  const [maxTrials] = useState(300); // Toplam deneme sayısı
  const [phase, setPhase] = useState('fixation'); // fixation, blank1, stimulus, probe, blank2, break, completed
  const [trialData, setTrialData] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [responseCorrect, setResponseCorrect] = useState(null);
  const [responseGiven, setResponseGiven] = useState(false); // Tepki verildi mi?
  
  // Mevcut ilerlemeyi kontrol etmek için state ekleyin
  const [completedTrials, setCompletedTrials] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Kullanılmış kelime çiftlerini takip etmek için useRef kullanıyoruz
  const usedPairIndicesRef = useRef([]);
  
  // Mola durumu için yeni state
  const [isBreak, setIsBreak] = useState(false);
  
  // Oturum bilgilerini ve mevcut ilerlemeyi kontrol eden useEffect
  useEffect(() => {
    const fetchSessionData = async () => {
      const storedSessionId = localStorage.getItem('dots_session_id');
      if (storedSessionId) {
        setSessionId(storedSessionId);
        
        try {
          // Oturum bilgilerini kontrol et
          const sessionDoc = await getDoc(doc(db, "sessions", storedSessionId));
          if (sessionDoc.exists() && sessionDoc.data().completed) {
            // Oturum zaten tamamlanmışsa, ana sayfaya yönlendir
            router.push('/');
            return;
          }
          
          // Mevcut ilerlemeyi kontrol et
          const trialsSnapshot = await getDocs(collection(db, "sessions", storedSessionId, "trials"));
          const existingTrials = [];
          trialsSnapshot.forEach((doc) => {
            existingTrials.push(doc.data());
          });
          
          // Tamamlanan denemeleri kaydet
          setCompletedTrials(existingTrials);
          
          // Kullanılmış kelime çiftlerinin indekslerini kaydet
          const usedIndices = existingTrials.map(trial => trial.pairIndex).filter(index => index !== undefined);
          usedPairIndicesRef.current = usedIndices;
          
          // Eğer tamamlanan denemeler varsa, kaldığı yerden devam et
          if (existingTrials.length > 0) {
            setCurrentTrial(existingTrials.length);
            // Eğer tüm denemeler tamamlanmışsa, tamamlandı fazına geç
            if (existingTrials.length >= maxTrials) {
              setPhase('completed');
            } else {
              setPhase('fixation');
            }
          }
          
          setIsInitializing(false);
        } catch (error) {
          console.error("Error fetching session data: ", error);
          setIsInitializing(false);
        }
      } else {
        // Oturum ID yoksa ana sayfaya yönlendir
        router.push('/');
      }
    };
    
    fetchSessionData();
  }, [router, maxTrials]);
  
  // Yeni deneme oluştur
  const createTrial = useCallback(() => {
    // Eğer tüm kelime çiftleri kullanıldıysa, kullanılmış indeksleri sıfırla
    if (usedPairIndicesRef.current.length >= wordPairs.length) {
      console.log("Tüm kelime çiftleri kullanıldı, indeksler sıfırlanıyor...");
      usedPairIndicesRef.current = [];
    }
    
    // Kullanılmamış bir kelime çifti seç
    let randomPairIndex;
    do {
      randomPairIndex = Math.floor(Math.random() * wordPairs.length);
    } while (usedPairIndicesRef.current.includes(randomPairIndex));
    
    // Seçilen indeksi kullanılmış olarak işaretle
    usedPairIndicesRef.current.push(randomPairIndex);
    
    // Seçilen kelime çiftini al
    const { threatWord, neutralWord } = wordPairs[randomPairIndex];
    
    // Deneme numarası (0-299)
    const trialNum = currentTrial;
    
    // Dengelenmiş koşullar için hesaplamalar
    // Her koşul için toplam 300 denemede tam olarak 150 kez oluşmalı
    
    // 1. Tehdit kelimesinin konumu (0: üst, 1: alt)
    // İlk 150 denemede 75 üst, 75 alt; son 150 denemede 75 üst, 75 alt
    const halfSize = Math.floor(maxTrials / 2);
    const quarterSize = Math.floor(maxTrials / 4);
    
    let threatPosition;
    if (trialNum < quarterSize) {
      // İlk çeyrek: üst
      threatPosition = 0;
    } else if (trialNum < halfSize) {
      // İkinci çeyrek: alt
      threatPosition = 1;
    } else if (trialNum < halfSize + quarterSize) {
      // Üçüncü çeyrek: üst
      threatPosition = 0;
    } else {
      // Son çeyrek: alt
      threatPosition = 1;
    }
    
    // 2. Probe'un konumu (tehdit kelimesinin konumunda mı değil mi)
    // Her tehdit konumu için yarısında probe tehdit kelimesinin konumunda olmalı
    const probeFollowsThreat = (trialNum % 2 === 0);
    const probePosition = probeFollowsThreat ? threatPosition : (threatPosition === 0 ? 1 : 0);
    
    // 3. Probe'un yönü (0: sol, 1: sağ)
    // Her probe konumu için yarısında sol, yarısında sağ
    const probeDirection = (Math.floor(trialNum / 4) % 2 === 0) ? 0 : 1;
    
    return {
      trialNumber: trialNum + 1,
      pairIndex: randomPairIndex,
      threatWord,
      neutralWord,
      threatPosition,
      probePosition,
      probeDirection,
      probeFollowsThreat,
      startTime: null
    };
  }, [currentTrial, maxTrials]);
  
  // Deneme sonuçlarını kaydetme fonksiyonu
  const saveTrialResult = useCallback(async (trialData) => {
    try {
      // Deneme zaten kaydedilmiş mi kontrol et
      const existingTrial = completedTrials.find(trial => trial.trialNumber === trialData.trialNumber);
      if (existingTrial) {
        console.log(`Trial ${trialData.trialNumber} already saved, skipping...`);
        return;
      }
      
      // Yeni deneme sonucunu kaydet
      await addDoc(collection(db, "sessions", sessionId, "trials"), trialData);
      
      // Tamamlanan denemeleri güncelle
      setCompletedTrials(prev => [...prev, trialData]);
    } catch (error) {
      console.error("Error saving trial result: ", error);
    }
  }, [sessionId, completedTrials]);
  
  // Görev tamamlandığında tamamlanma tarihini de kaydet
  const completeTask = useCallback(async () => {
    try {
      await setDoc(doc(db, "sessions", sessionId), { 
        completed: true,
        completedAt: new Date().toISOString()
      }, { merge: true });
      setPhase('completed');
    } catch (error) {
      console.error("Error completing session: ", error);
    }
  }, [sessionId]);
  
  // Deneme akışını yönet
  useEffect(() => {
    let timeoutId;
    
    if (phase === 'fixation') {
      // Tepki verildi mi durumunu sıfırla
      setResponseGiven(false);
      
      // Yeni deneme oluştur
      setTrialData(createTrial());
      
      // 500ms sonra boş ekran fazına geç
      timeoutId = setTimeout(() => {
        setPhase('blank1');
      }, 500);
    } 
    else if (phase === 'blank1') {
      // 500ms sonra stimulus fazına geç
      timeoutId = setTimeout(() => {
        setPhase('stimulus');
      }, 500);
    }
    else if (phase === 'stimulus') {
      // 500ms sonra probe fazına geç (boşluksuz)
      timeoutId = setTimeout(() => {
        setPhase('probe');
        // Tepki süresini ölçmeye başla
        setTrialData(prev => ({
          ...prev,
          startTime: performance.now()
        }));
      }, 500);
    }
    else if (phase === 'blank2') {
      // 500ms sonra bir sonraki denemeye geç veya mola ver
      timeoutId = setTimeout(() => {
        // Her 50 denemede bir mola ver
        if ((currentTrial + 1) % 50 === 0 && currentTrial < maxTrials - 1) {
          setIsBreak(true);
          setPhase('break');
        } else if (currentTrial >= maxTrials - 1) {
          // Görev tamamlandı
          completeTask();
        } else {
          // Bir sonraki denemeye geç
          setCurrentTrial(prev => prev + 1);
          setPhase('fixation');
        }
      }, 500);
    }
    
    // Temizleme fonksiyonu
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [phase, currentTrial, maxTrials, createTrial, completeTask]);
  
  // Klavye olaylarını dinleyen useEffect
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Mola ekranında boşluk tuşuna basılırsa devam et
      if (phase === 'break' && e.keyCode === 32) { // 32: Boşluk tuşu
        setIsBreak(false);
        setCurrentTrial(prev => prev + 1);
        setPhase('fixation');
        return;
      }
      
      // Sadece Z tuşu (sol) veya M tuşu (sağ) için tepki ver
      if (phase === 'probe' && !responseGiven && (e.keyCode === 90 || e.keyCode === 77)) {
        const endTime = performance.now();
        const responseTime = endTime - trialData.startTime;
        
        // Kullanıcının cevabını kontrol et
        const correctResponse = (trialData.probeDirection === 0 && e.keyCode === 90) || 
                               (trialData.probeDirection === 1 && e.keyCode === 77);
        
        // Tepki verdiğini işaretle
        setResponseGiven(true);
        
        // Tepki sonuçlarını kaydet
        setResponseTime(responseTime);
        setResponseCorrect(correctResponse);
        
        // Sonucu kaydet
        const updatedTrialData = {
          ...trialData,
          responseTime,
          correct: correctResponse
        };
        
        saveTrialResult(updatedTrialData);
        
        // Yanıt sonrası boş ekran fazına geç
        setPhase('blank2');
      }
      // Diğer tuşlara basıldığında hiçbir şey yapma
    };
    
    // Klavye olayını dinle
    window.addEventListener('keydown', handleKeyDown);
    
    // Temizleme fonksiyonu
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [phase, trialData, responseGiven, saveTrialResult]);
  
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
        
        {(phase === 'blank1' || phase === 'blank2') && (
          <div></div> // Boş ekran
        )}
        
        {phase === 'stimulus' && trialData && (
          <div className="flex flex-col items-center">
            <div className="text-xl font-medium" style={{ marginBottom: '3cm' }}>
              {trialData.threatPosition === 0 ? trialData.threatWord : trialData.neutralWord}
            </div>
            <div className="text-xl font-medium">
              {trialData.threatPosition === 1 ? trialData.threatWord : trialData.neutralWord}
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
        
        {phase === 'break' && (
          <div className="flex flex-col items-center text-center p-6">
            <div className="text-xl font-bold mb-4">KISA BİR MOLA</div>
            <div className="text-lg mb-6">
              Hazır olduğunuzda devam etmek için boşluk tuşuna basın.
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
        
        {phase !== 'completed' && phase !== 'break' && (
          <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-500">
            Deneme: {currentTrial + 1} / {maxTrials}
          </div>
        )}
      </div>
    </div>
  );
}

export function generateTrials(wordPairs, trialCount) {
  const trials = [];
  
  for (let i = 0; i < trialCount; i++) {
    // Rastgele bir kelime çifti seç
    const randomPairIndex = Math.floor(Math.random() * wordPairs.length);
    const { threat, neutral } = wordPairs[randomPairIndex];
    
    // Tehdit kelimesinin konumu (0: üst, 1: alt) - %50 ihtimalle
    const threatPosition = Math.random() < 0.5 ? 0 : 1;
    
    // Probe'un konumu (0: üst, 1: alt) - %50 ihtimalle
    const probePosition = Math.random() < 0.5 ? 0 : 1;
    
    // Probe'un yönü (0: sol, 1: sağ) - %50 ihtimalle
    const probeDirection = Math.random() < 0.5 ? 0 : 1;
    
    trials.push({
      trialNumber: i + 1,
      threatWord: threat,
      neutralWord: neutral,
      threatPosition,
      probePosition,
      probeDirection,
      probeFollowsThreat: probePosition === threatPosition
    });
  }
  
  return trials;
}
