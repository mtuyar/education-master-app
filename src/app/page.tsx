'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function Home() {
  const [pin, setPin] = useState('');
  const router = useRouter();
  
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPin(e.target.value);
  };
  
  const handleSubmit = async () => {
    // Yönetici girişi kontrolü
    if (pin === '424242result') {
      router.push('/admin_panel');
      return;
    }
    
    if (pin.trim()) {
      // Rastgele deney veya kontrol grubuna atama
      const isExperimental = Math.random() < 0.5;
      const group = isExperimental ? 'experimental' : 'control';
      
      // Oturum ID oluştur
      const timestamp = new Date().getTime();
      const sessionId = `${pin}_${timestamp}`;
      
      // Firebase'e kullanıcı bilgilerini kaydet
      try {
        await setDoc(doc(db, "sessions", sessionId), {
          pin: pin,
          group: group,
          timestamp: timestamp,
          completed: false
        });
        
        // Oturum ID'sini localStorage'a kaydet
        localStorage.setItem('dots_session_id', sessionId);
        
        router.push('/info');
      } catch (error) {
        console.error("Error creating session: ", error);
        alert("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
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
          disabled={!pin.trim()}
        >
          Devam Et
        </button>
      </div>
    </main>
  );
}