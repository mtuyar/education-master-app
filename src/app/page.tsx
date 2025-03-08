'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../firebase';
import { doc, setDoc, query, collection, where, getDocs } from 'firebase/firestore';

export default function Home() {
  const [pin, setPin] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPin(e.target.value);
  };
  
  const handleSubmit = async () => {
    if (!pin.trim()) return;
    
    // Özel PIN kodu kontrolü
    if (pin.trim() === "424242result") {
      router.push('/admin_panel');
      return;
    }
    
    try {
      setLoading(true);
      
      // Önce bu PIN ile mevcut bir oturum var mı kontrol et
      const sessionsQuery = query(
        collection(db, "sessions"),
        where("pin", "==", pin.trim())
      );
      
      const sessionsSnapshot = await getDocs(sessionsQuery);
      let existingSessionId = null;
      let isCompleted = false;
      let completionDate = null;
      
      sessionsSnapshot.forEach((doc) => {
        existingSessionId = doc.id;
        isCompleted = doc.data().completed || false;
        completionDate = doc.data().completedAt ? new Date(doc.data().completedAt) : null;
      });
      
      if (existingSessionId && isCompleted) {
        // Oturum zaten tamamlanmışsa, modal göster
        setShowCompletionModal(true);
        setLoading(false);
        return;
      }
      
      if (existingSessionId) {
        // Mevcut oturumu kullan
        localStorage.setItem('dots_session_id', existingSessionId);
        
        // Her zaman bilgilendirme sayfasından başla
        router.push('/info');
      } else {
        // Yeni oturum oluştur
        // Rastgele grup ataması (deneysel veya kontrol)
        const group = Math.random() < 0.5 ? 'experimental' : 'control';
        
        // Firestore'da yeni bir oturum belgesi oluştur
        await setDoc(doc(db, "sessions", pin.trim()), {
          pin: pin.trim(),
          group,
          timestamp: new Date().toISOString(),
          completed: false
        });
        
        // Oturum ID'sini localStorage'a kaydet
        localStorage.setItem('dots_session_id', pin.trim());
        
        // Bilgilendirme sayfasına yönlendir
        router.push('/info');
      }
    } catch (error) {
      console.error("Error creating session: ", error);
      setError("Oturum oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
      setLoading(false);
    }
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">DOTS&apos;a Hoş Geldiniz!</h1>
        
        <div className="mb-4">
          <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1">
            Kullanıcı adınızı/PIN kodunuzu buraya girin: 
          </label>
          <input
            type="text"
            id="pin"
            value={pin}
            onChange={handlePinChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="XXXX"
          />
        </div>
        
        <button
          onClick={handleSubmit}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-center rounded-lg transition-colors"
          disabled={!pin.trim() || loading}
        >
          {loading ? 'Lütfen bekleyin...' : 'Devam Et'}
        </button>
        
        {error && (
          <div className="mt-3 text-red-500 text-sm text-center">
            {error}
          </div>
        )}
      </div>
      
      {/* Tamamlanmış Oturum Modalı */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <svg className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Görev Tamamlandı</h3>
              <p className="text-gray-600 mb-6">
                Bu PIN kodu ile görev zaten tamamlanmış. Teşekkür ederiz!
              </p>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}