'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

export default function Admin() {
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // Tamamlanmış oturumları al
        const sessionsQuery = query(
          collection(db, "sessions"),
          where("completed", "==", true),
          orderBy("timestamp", "asc")
        );
        
        const sessionsSnapshot = await getDocs(sessionsQuery);
        const sessionsData = [];
        
        sessionsSnapshot.forEach((doc) => {
          sessionsData.push({
            id: doc.id,
            ...doc.data(),
            formattedDate: new Date(doc.data().timestamp).toLocaleString('tr-TR')
          });
        });
        
        setSessions(sessionsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setError("Oturumlar yüklenirken bir hata oluştu.");
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleSessionClick = (sessionId) => {
    // Seçilen oturumun detaylarını görüntülemek için yönlendir
    router.push(`/admin_panel/${sessionId}`);
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
            <p className="text-lg text-gray-600">Oturumlar yükleniyor...</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Tamamlanmış Oturumlar</h2>
              </div>
              
              {sessions.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Henüz tamamlanmış oturum bulunmamaktadır.
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PIN
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grup
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarih
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlem
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sessions.map((session) => (
                      <tr key={session.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{session.pin}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            session.group === 'experimental' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {session.group === 'experimental' ? 'Deney' : 'Kontrol'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {session.formattedDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleSessionClick(session.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Detayları Görüntüle
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}