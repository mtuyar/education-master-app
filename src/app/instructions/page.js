'use client';

import { useRouter } from 'next/navigation';

export default function Instructions() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-2xl p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Görev Talimatları</h1>
        
        <div className="space-y-4 mb-8">
          <p>Bu görevde, ekranda dikey olarak iki kelime göreceksiniz. Kelimeler kısa bir süre sonra kaybolacak ve yerlerinden birinde bir ok işareti belirecektir.</p>
          
          <p>Sizden istenen, ok işaretinin yönünü (sağa veya sola) mümkün olduğunca hızlı ve doğru bir şekilde belirlemenizdir.</p>
          
          <ul className="list-disc pl-5 space-y-2">
            <li>Ok sola doğru ise <strong>Z</strong> tuşuna basın</li>
            <li>Ok sağa doğru ise <strong>M</strong> tuşuna basın</li>
          </ul>
          
          <p>Önce kısa bir alıştırma yapacak, ardından ana göreve geçeceksiniz.</p>
        </div>
        
        <button 
          onClick={() => router.push('/practice')}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-center rounded-lg transition-colors"
        >
          Alıştırmaya Başla
        </button>
      </div>
    </div>
  );
}
