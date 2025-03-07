'use client';

import { useRouter } from 'next/navigation';

export default function Info() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-8">Bilgilendirme</h1>
        
        <div className="space-y-6 mb-8 text-lg">
          <p className="font-bold text-center">
            DOTS uygulaması araştırma projesine katılmayı kabul ettiğiniz için teşekkür ederiz!
          </p>
          
          <div className="text-center">
            <p className="font-semibold mb-2">DOTS uygulaması nedir?</p>
            <p>
              DOTS uygulaması, &quot;Dikkat Odak Takip Stratejisi&quot; uygulaması anlamına gelir. 
              Psikologlar, insanların sınavlarla ilgili olumsuz düşüncelere daha az dikkat 
              ederlerse sınavlar konusunda daha rahat hissedebileceklerini düşünüyorlar. 
              DOTS, bunun doğru olup olmadığını inceleyen bir projedir.
            </p>
          </div>
          
          <div className="text-center">
            <p className="font-semibold mb-2">DOTS projesinde ne yapmam gerekecek?</p>
            <p>
              DOTS projesine katılan her katılımcı, bugün yaklaşık 20 dakika boyunca bir 
              bilgisayar programı üzerinde çalışacak. DOTS bilgisayar programını nerede 
              yapacağım? DOTS bilgisayar programına evimden katılıyor? Farklı ortamlardan 
              11 sınıftan 300 öğrenci katılmaya davet edilmiştir.
            </p>
          </div>
          
          <p className="font-bold text-center">
            Kesintiye uğramayacağınız sessiz bir ortamda girmeniz gerekmektedir.
          </p>
        </div>
        
        <button 
          onClick={() => router.push('/instructions')}
          className="w-full py-3 px-6 bg-blue-600 text-white rounded text-lg font-medium"
        >
          Talimatları Görüntüle
        </button>
      </div>
    </div>
  );
}