// Kelime çiftleri (tehdit ve nötr kelimeler)
export const wordPairs = [
  { threatWord: "MSÜ", neutralWord: "GENİŞ MEKANLAR" },
  { threatWord: "NET", neutralWord: "LAVANTA" },
  { threatWord: "NOT", neutralWord: "OYUNCAK" },
  { threatWord: "OBP", neutralWord: "ARMUT" },
  { threatWord: "TYT", neutralWord: "HAYVANSEVER" },
  { threatWord: "YDT", neutralWord: "KARABİBER" },
  { threatWord: "YKS", neutralWord: "KÜÇÜK TİLKİ" },
  { threatWord: "ZOR", neutralWord: "MUTFAK ROBOTU" },
  { threatWord: "AİLE", neutralWord: "LAVANTA" },
  { threatWord: "DERS", neutralWord: "SARIKANAT" },
  { threatWord: "ETÜT", neutralWord: "MANDOLİN" },
  { threatWord: "FULL", neutralWord: "SEBZELİ OMLET" },
  { threatWord: "HATA", neutralWord: "MOR YILDIZ" },
  { threatWord: "KONU", neutralWord: "RÜZGARGÜLÜ" },
  { threatWord: "OKUL", neutralWord: "ELMA" },
  { threatWord: "ÖSYM", neutralWord: "PEMBE" },
  { threatWord: "PLAN", neutralWord: "SARIMSAKLI" },
  { threatWord: "PUAN", neutralWord: "LASTİK" },
  { threatWord: "RİSK", neutralWord: "KAR" },
  { threatWord: "SIRA", neutralWord: "RENDELEMEK" },
  { threatWord: "SORU", neutralWord: "KERTENKELE" },
  { threatWord: "SÜRE", neutralWord: "SEMİZOTU" },
  { threatWord: "TEST", neutralWord: "KANARYA" },
  { threatWord: "BASKI", neutralWord: "SEBZELİ OMLET" },
  { threatWord: "BÖLME", neutralWord: "ELMA" },
  { threatWord: "BÖLÜM", neutralWord: "TEMİZ KIYAFET" },
  { threatWord: "BRANŞ", neutralWord: "LASTİK" },
  { threatWord: "ÇABUK", neutralWord: "TEPEDEKİ KÖYLER" },
  { threatWord: "ÇÖZÜM", neutralWord: "KIRLANGIÇ" },
  { threatWord: "DETAY", neutralWord: "LOKANTACILIK" },
  { threatWord: "EZBER", neutralWord: "YORGAN" },
  { threatWord: "HAVUZ", neutralWord: "MAYMUN" },
  { threatWord: "HEDEF", neutralWord: "TRT BELGESEL" },
  { threatWord: "HIZLI", neutralWord: "BÖREKÇİLİK" },
  { threatWord: "KARAR", neutralWord: "ÇEKMECE" },
  { threatWord: "KAYGI", neutralWord: "KARABİBER" },
  { threatWord: "KIYAS", neutralWord: "SICAK RENKLER" },
  { threatWord: "KİTAP", neutralWord: "MUHALLEBİ" },
  { threatWord: "KORKU", neutralWord: "AHŞAP ZEMİN" },
  { threatWord: "ÖRNEK", neutralWord: "SERİN" },
  { threatWord: "PANİK", neutralWord: "KIYMALI MANTI" },
  { threatWord: "RAKİP", neutralWord: "YEŞİL ZEYTİN" },
  { threatWord: "RUTİN", neutralWord: "ARMUT" },
  { threatWord: "SINAV", neutralWord: "ZEYTİN" },
  { threatWord: "SINIR", neutralWord: "HEYKELTIRAŞ" },
  { threatWord: "SONUÇ", neutralWord: "PAMUK ŞEKER" },
  { threatWord: "SORUN", neutralWord: "BÖREKÇİLİK" },
  { threatWord: "STRES", neutralWord: "TOPRAK" },
  { threatWord: "SÜREÇ", neutralWord: "DİREKSİYON" },
  { threatWord: "TELAŞ", neutralWord: "KALORİFER" },
  { threatWord: "YOĞUN", neutralWord: "MENEKŞE" },
  { threatWord: "YÜZDE", neutralWord: "BAHÇE" },
  { threatWord: "True", neutralWord: "RÜZGARGÜLÜ" },
  { threatWord: "AĞLAMA", neutralWord: "AKUPUNKTUR" },
  { threatWord: "AZİMLİ", neutralWord: "KUŞ" },
  { threatWord: "BAŞARI", neutralWord: "MAVİ" },
  { threatWord: "BOŞLUK", neutralWord: "BUZDOLABI" },
  { threatWord: "DENEME", neutralWord: "METROPOL" },
  { threatWord: "DİKKAT", neutralWord: "ŞEHRİYE ÇORBASI" },
  { threatWord: "ELEMEK", neutralWord: "SEMİZOTU" },
  { threatWord: "ENDİŞE", neutralWord: "KAMPANYA" },
  { threatWord: "FORMÜL", neutralWord: "ZEYTİN" },
  { threatWord: "GÜÇSÜZ", neutralWord: "KOLEKSİYON" },
  { threatWord: "İKİLEM", neutralWord: "RÜZGARGÜLÜ" },
  { threatWord: "KAYNAK", neutralWord: "HAMSİ" },
  { threatWord: "LİMİT ", neutralWord: "KOVA" },
  { threatWord: "SİSTEM", neutralWord: "VANİLYA" },
  { threatWord: "TEMBEL", neutralWord: "KIRLANGIÇ" },
  { threatWord: "TERCİH", neutralWord: "PEMBE" },
  { threatWord: "UNUTMA", neutralWord: "AYDINLIK ŞEHİR" },
  { threatWord: "UYUŞMA", neutralWord: "SARIKANAT" },
  { threatWord: "YAZILI", neutralWord: "OYUN PARKI" },
  { threatWord: "False", neutralWord: "MANDOLİN" },
  { threatWord: "A ŞIKKI", neutralWord: "KABAK ÇEKİRDEĞİ" },
  { threatWord: "ACELECİ", neutralWord: "TEMİZ KIYAFET" },
  { threatWord: "AĞLAMAK", neutralWord: "YORGAN" },
  { threatWord: "AZİMSİZ", neutralWord: "BÖREKÇİLİK" },
  { threatWord: "BASKICI", neutralWord: "SABUN KÖPÜĞÜ" },
  { threatWord: "BAŞVURU", neutralWord: "ANTARKTİKA" },
  { threatWord: "BUNALIM", neutralWord: "SARIMSAKLI" },
  { threatWord: "ÇALIŞMA", neutralWord: "TATLI ÇÖREK" },
  { threatWord: "DENKLEM", neutralWord: "DENİZ MAYMUNU" },
  { threatWord: "DERSANE", neutralWord: "RENDELEMEK" },
  { threatWord: "FASİKÜL", neutralWord: "DİREKSİYON" },
  { threatWord: "GECİKME", neutralWord: "ŞEHRİYE ÇORBASI" },
  { threatWord: "GELECEK", neutralWord: "KABLO" },
  { threatWord: "GERİLİM", neutralWord: "TV KONSOLU" },
  { threatWord: "KAZANIM", neutralWord: "SEHPA" },
  { threatWord: "KIZARMA", neutralWord: "PERSONEL" },
  { threatWord: "KODLAMA", neutralWord: "KAMERAMAN" },
  { threatWord: "KONULAR", neutralWord: "ZAMBAK KOKUSU" },
  { threatWord: "ÖNYARGI", neutralWord: "YAĞMURLUK" },
  { threatWord: "ÖZDEBİR", neutralWord: "KAMPANYA" },
  { threatWord: "PLANSIZ", neutralWord: "LASTİK" },
  { threatWord: "PROBLEM", neutralWord: "PAMUK ŞEKER" },
  { threatWord: "REKABET", neutralWord: "ÖRDEK" },
  { threatWord: "SEÇENEK", neutralWord: "SABUN KÖPÜĞÜ" },
  { threatWord: "STRESLİ", neutralWord: "TATLI ÇÖREK" },
  { threatWord: "ŞANSSIZ", neutralWord: "KÜÇÜK TİLKİ" },
  { threatWord: "TELAŞLI", neutralWord: "KARABİBER" },
  { threatWord: "TİTREME", neutralWord: "LOKANTACILIK" },
  { threatWord: "TOPLAMA", neutralWord: "ÇEKMECE" },
  { threatWord: "TYT FEN", neutralWord: "DOMATES" },
  { threatWord: "UMUTSUZ", neutralWord: "GÖKYÜZÜ" },
  { threatWord: "UNUTMAK", neutralWord: "KİRAZ ÇİÇEĞİ RENGİ" },
  { threatWord: "ZORUNLU", neutralWord: "RENGARENK" },
  { threatWord: "AÇIKLAMA", neutralWord: "KABAK ÇEKİRDEĞİ" },
  { threatWord: "BEKLENTİ", neutralWord: "MOR YILDIZ" },
  { threatWord: "BIRAKMAK", neutralWord: "ASTRONOT" },
  { threatWord: "ÇALIŞKAN", neutralWord: "MAYMUNCUK" },
  { threatWord: "ÇARPINTI", neutralWord: "BUKALEMUN" },
  { threatWord: "DEĞİŞKEN", neutralWord: "TEL" },
  { threatWord: "DİSİPLİN", neutralWord: "ŞADIRVAN" },
  { threatWord: "ELEŞTİRİ", neutralWord: "PARLAK DENİZ" },
  { threatWord: "ERTELEME", neutralWord: "TATLI ÇÖREK" },
  { threatWord: "GEÇERSİZ", neutralWord: "DENİZ MAYMUNU" },
  { threatWord: "GEOMETRİ", neutralWord: "DOMATES" },
  { threatWord: "GÖZETMEN", neutralWord: "KERTENKELE" },
  { threatWord: "HAZIRLIK", neutralWord: "KARINCA" },
  { threatWord: "İMKANSIZ", neutralWord: "AHŞAP ZEMİN" },
  { threatWord: "İRADESİZ", neutralWord: "BAHÇE" },
  { threatWord: "KAYDIRMA", neutralWord: "ZEYTİN" },
  { threatWord: "KİTAPÇIK", neutralWord: "MOR YILDIZ" },
  { threatWord: "MÜKEMMEL", neutralWord: "GÜNEŞLİ GÜNLER" },
  { threatWord: "OLASILIK", neutralWord: "NAFTALİN" },
  { threatWord: "ÖĞRETMEN", neutralWord: "AKUPUNKTUR" },
  { threatWord: "PARAGRAF", neutralWord: "KESTANE" },
  { threatWord: "SARSILMA", neutralWord: "SARIKANAT" },
  { threatWord: "SIRALAMA", neutralWord: "SICAK RENKLER" },
  { threatWord: "SON SENE", neutralWord: "BAHÇE" },
  { threatWord: "TARTIŞMA", neutralWord: "GÖKYÜZÜ" },
  { threatWord: "TEREDDÜT", neutralWord: "ARMUT" },
  { threatWord: "YANILMAK", neutralWord: "ZAMBAK KOKUSU" },
  { threatWord: "YETERSİZ", neutralWord: "GÜNEŞLİ GÜNLER" },
  { threatWord: "YOĞUNLUK", neutralWord: "SEMİZOTU" },
  { threatWord: "ZOR SORU", neutralWord: "TOPRAK" },
  { threatWord: "AKRABALAR", neutralWord: "SANDIK" },
  { threatWord: "ANKSİYETE", neutralWord: "MAVİ" },
  { threatWord: "ANLAMADIM", neutralWord: "CEVİZ" },
  { threatWord: "AYT FİZİK", neutralWord: "VANİLYA" },
  { threatWord: "AYT KİMYA", neutralWord: "TOPRAK" },
  { threatWord: "AYT TARİH", neutralWord: "PARLAK DENİZ" },
  { threatWord: "BAŞARISIZ", neutralWord: "HALI YIKAMA" },
  { threatWord: "BİLEMEDİM", neutralWord: "KAMERAMAN" },
  { threatWord: "DALGINLIK", neutralWord: "SEHPA" },
  { threatWord: "DONAKALMA", neutralWord: "HACIYATMAZ" },
  { threatWord: "DÜŞÜK NET", neutralWord: "PERSONEL" },
  { threatWord: "HAKSIZLIK", neutralWord: "NAFTALİN" },
  { threatWord: "HESAPLAMA", neutralWord: "KALORİFER" },
  { threatWord: "HİSSİZLİK", neutralWord: "HACIYATMAZ" },
  { threatWord: "İSABETSİZ", neutralWord: "KABLO" },
  { threatWord: "KAR-ZARAR", neutralWord: "SERİN" },
  { threatWord: "KAYBETMEK", neutralWord: "KİRAZ ÇİÇEĞİ RENGİ" },
  { threatWord: "KISITLAMA", neutralWord: "BALONCUK" },
  { threatWord: "KRONOMERE", neutralWord: "HALI YIKAMA" },
  { threatWord: "KÜTÜPHANE", neutralWord: "DENİZ MAYMUNU" },
  { threatWord: "PANİKLEME", neutralWord: "KAHVERENGİ" },
  { threatWord: "PES ETMEK", neutralWord: "DİREKSİYON" },
  { threatWord: "PSİKOLOJİ", neutralWord: "KAHVERENGİ" },
  { threatWord: "PÜF NOKTA", neutralWord: "TRT BELGESEL" },
  { threatWord: "SİSTEMSİZ", neutralWord: "BUKALEMUN" },
  { threatWord: "SORU KÖKÜ", neutralWord: "KUŞ" },
  { threatWord: "SORU TİPİ", neutralWord: "METROPOL" },
  { threatWord: "TATMİNSİZ", neutralWord: "KABLO" },
  { threatWord: "UZUN SORU", neutralWord: "AKUPUNKTUR" },
  { threatWord: "VAZGEÇMEK", neutralWord: "SANDIK" },
  { threatWord: "YANLIŞLIK", neutralWord: "VANİLYA" },
  { threatWord: "YAPAMADIM", neutralWord: "BEYAZ PERDE" },
  { threatWord: "YORGUNLUK", neutralWord: "ÇEKMECE" },
  { threatWord: "YORUMLAMA", neutralWord: "KOVA" },
  { threatWord: "YÖK ATLAS", neutralWord: "OYUNCAK" },
  { threatWord: "ZAMANLAMA", neutralWord: "KERTENKELE" },
  { threatWord: "ACELECİLİK", neutralWord: "TATLI" },
  { threatWord: "AYT TÜRKÇE", neutralWord: "BALKON" },
  { threatWord: "BAŞ AĞRISI", neutralWord: "SABAHLIK" },
  { threatWord: "BECERİKSİZ", neutralWord: "GENİŞ MEKANLAR" },
  { threatWord: "BOŞ VERMEK", neutralWord: "HAMSİ" },
  { threatWord: "CESARETSİZ", neutralWord: "ANTARKTİKA" },
  { threatWord: "ÇARESİZLİK", neutralWord: "ALIŞVERİŞ" },
  { threatWord: "DAĞINIKLIK", neutralWord: "MUTFAK ROBOTU" },
  { threatWord: "ENGELLENME", neutralWord: "TENCERE" },
  { threatWord: "FEDAKARLIK", neutralWord: "HAYVANSEVER" },
  { threatWord: "GEÇ KALMAK", neutralWord: "MAYMUN" },
  { threatWord: "GELECEKSİZ", neutralWord: "ANTARKTİKA" },
  { threatWord: "GÜN SAYMAK", neutralWord: "ŞADIRVAN" },
  { threatWord: "İSTİKRARLI", neutralWord: "KAHVERENGİ" },
  { threatWord: "KIYASLAMAK", neutralWord: "ŞEHRİYE ÇORBASI" },
  { threatWord: "MECBURİYET", neutralWord: "BUZDOLABI" },
  { threatWord: "ODAKLANMAK", neutralWord: "KAMERAMAN" },
  { threatWord: "OKUL PUANI", neutralWord: "MUHALLEBİ" },
  { threatWord: "OPTİK FORM", neutralWord: "KOLEKSİYON" },
  { threatWord: "PANİK ATAK", neutralWord: "TOKA" },
  { threatWord: "PANİK OLMA", neutralWord: "BEYAZ PERDE" },
  { threatWord: "PANİKLEMEK", neutralWord: "ZAMBAK KOKUSU" },
  { threatWord: "PROBLEMLER", neutralWord: "TEPEDEKİ KÖYLER" },
  { threatWord: "SABAHLAMAK", neutralWord: "BALONCUK" },
  { threatWord: "SINAV KOÇU", neutralWord: "KANARYA" },
  { threatWord: "SORUMLULUK", neutralWord: "MANDOLİN" },
  { threatWord: "ŞANSSIZLIK", neutralWord: "TEL" },
  { threatWord: "ŞIK ELEMEK", neutralWord: "PAMUK ŞEKER" },
  { threatWord: "TAMAMLAMAK", neutralWord: "SEHPA" },
  { threatWord: "TELAŞLANMA", neutralWord: "CEVİZ" },
  { threatWord: "TER DÖKMEK", neutralWord: "DOMATES" },
  { threatWord: "TUZAK SORU", neutralWord: "MENEKŞE" },
  { threatWord: "TYT SOSYAL", neutralWord: "SERİN" },
  { threatWord: "TYT TÜRKÇE", neutralWord: "KARINCA" },
  { threatWord: "UMUTSUZLUK", neutralWord: "KOLEKSİYON" },
  { threatWord: "UNUTKANLIK", neutralWord: "KASA" },
  { threatWord: "UYKUSUZLUK", neutralWord: "HEYKELTIRAŞ" },
  { threatWord: "ÜMİTSİZLİK", neutralWord: "BEYAZ PERDE" },
  { threatWord: "ÜNİVERSİTE", neutralWord: "YEŞİL ZEYTİN" },
  { threatWord: "YENİ NESİL", neutralWord: "KIYMALI MANTI" },
  { threatWord: "YETERSİZİM", neutralWord: "BALONCUK" },
  { threatWord: "YETİŞTİRME", neutralWord: "KASA" },
  { threatWord: "ANLAMSIZLIK", neutralWord: "KARINCA" },
  { threatWord: "BELİRSİZLİK", neutralWord: "KESTANE" },
  { threatWord: "DİSİPLİNSİZ", neutralWord: "TV KONSOLU" },
  { threatWord: "DÜZENSİZLİK", neutralWord: "OYUN PARKI" },
  { threatWord: "EĞİTİM KOÇU", neutralWord: "METROPOL" },
  { threatWord: "EKSİK BİLGİ", neutralWord: "MAYMUN" },
  { threatWord: "GERİ KALMAK", neutralWord: "ALIŞVERİŞ" },
  { threatWord: "HASTALANMAK", neutralWord: "OYUN PARKI" },
  { threatWord: "HEDEFSİZLİK", neutralWord: "RENDELEMEK" },
  { threatWord: "İMKANSIZLIK", neutralWord: "KUŞ" },
  { threatWord: "İSTİKRARSIZ", neutralWord: "AYDINLIK ŞEHİR" },
  { threatWord: "KAPASİTESİZ", neutralWord: "KÜÇÜK TİLKİ" },
  { threatWord: "KARARSIZLIK", neutralWord: "ALIŞVERİŞ" },
  { threatWord: "KONU EKSİĞİ", neutralWord: "SABUN KÖPÜĞÜ" },
  { threatWord: "KONU ELEMEK", neutralWord: "TEL" },
  { threatWord: "NET ARALIĞI", neutralWord: "SEBZELİ OMLET" },
  { threatWord: "ÖSYM KALEMİ", neutralWord: "MAVİ" },
  { threatWord: "PANİK OLMAK", neutralWord: "TV KONSOLU" },
  { threatWord: "SORU ÇÖZMEK", neutralWord: "MUTFAK ROBOTU" },
  { threatWord: "SORU ELEMEK", neutralWord: "LOKANTACILIK" },
  { threatWord: "SÜRE TUTMAK", neutralWord: "NAFTALİN" },
  { threatWord: "TEST ÇÖZMEK", neutralWord: "KALORİFER" },
  { threatWord: "YAPAMIYORUM", neutralWord: "KABAK ÇEKİRDEĞİ" },
  { threatWord: "YERLEŞEMEME", neutralWord: "KANARYA" },
  { threatWord: "YETİŞEMEDİM", neutralWord: "YORGAN" },
  { threatWord: "ADALETSİZLİK", neutralWord: "GENİŞ MEKANLAR" },
  { threatWord: "ARADA KALMAK", neutralWord: "SABAHLIK" },
  { threatWord: "AYT BİYOLOJİ", neutralWord: "BALKON" },
  { threatWord: "AYT COĞRAFYA", neutralWord: "KAMPANYA" },
  { threatWord: "AYT EDEBİYAT", neutralWord: "KASA" },
  { threatWord: "BOŞ BIRAKMAK", neutralWord: "CEVİZ" },
  { threatWord: "BOŞVERMİŞLİK", neutralWord: "MAYMUNCUK" },
  { threatWord: "GÖĞÜS AĞRISI", neutralWord: "HAMSİ" },
  { threatWord: "İŞLEM HATASI", neutralWord: "TOKA" },
  { threatWord: "KARIN AĞRISI", neutralWord: "RENGARENK" },
  { threatWord: "KONU TEKRARI", neutralWord: "GÜNEŞLİ GÜNLER" },
  { threatWord: "ÖDEVLENDİRME", neutralWord: "YAĞMURLUK" },
  { threatWord: "RAKİP ELEMEK", neutralWord: "KOVA" },
  { threatWord: "SORU BANKASI", neutralWord: "PEMBE" },
  { threatWord: "AYT MATEMATİK", neutralWord: "HİNDİSTAN CEVİZİ" },
  { threatWord: "ÇALIŞMA KAMPI", neutralWord: "GÖKYÜZÜ" },
  { threatWord: "ÇALIŞMA PLANI", neutralWord: "KİRAZ ÇİÇEĞİ RENGİ" },
  { threatWord: "ÇEVRE BASKISI", neutralWord: "MAYMUNCUK" },
  { threatWord: "DENEME SONUCU", neutralWord: "BALKON" },
  { threatWord: "DERECE YAPMAK", neutralWord: "HİNDİSTAN CEVİZİ" },
  { threatWord: "DERS PROGRAMI", neutralWord: "ASTRONOT" },
  { threatWord: "DİKKAT HATASI", neutralWord: "MENEKŞE" },
  { threatWord: "KONTROL ETMEK", neutralWord: "ELMA" },
  { threatWord: "MANTIK SORUSU", neutralWord: "YAĞMURLUK" },
  { threatWord: "MEZUNA KALMAK", neutralWord: "HİNDİSTAN CEVİZİ" },
  { threatWord: "NEFES ALAMAMA", neutralWord: "PERSONEL" },
  { threatWord: "NEFES DARLIĞI", neutralWord: "PARLAK DENİZ" },
  { threatWord: "NET SİHİRBAZI", neutralWord: "HAYVANSEVER" },
  { threatWord: "ODAKLANAMAMAK", neutralWord: "TEPEDEKİ KÖYLER" },
  { threatWord: "SICAK BASMASI", neutralWord: "BUZDOLABI" },
  { threatWord: "SINAV KAYGISI", neutralWord: "MUHALLEBİ" },
  { threatWord: "TEKRAR YAPMAK", neutralWord: "YEŞİL ZEYTİN" },
  { threatWord: "TYT MATEMATİK", neutralWord: "TEMİZ KIYAFET" },
  { threatWord: "YDT İNGİLİZCE", neutralWord: "ÖRDEK" },
  { threatWord: "CEVAP ANAHTARI", neutralWord: "ÖRDEK" },
  { threatWord: "ÇALIŞMA MASASI", neutralWord: "HACIYATMAZ" },
  { threatWord: "HARİTA BİLGİSİ", neutralWord: "LAVANTA" },
  { threatWord: "KALP SIKIŞMASI", neutralWord: "AYDINLIK ŞEHİR" },
  { threatWord: "KAZANIM SORUSU", neutralWord: "SICAK RENKLER" },
  { threatWord: "MİDE BULANTISI", neutralWord: "SARIMSAKLI" },
  { threatWord: "MÜKEMMELİYETÇİ", neutralWord: "TATLI" },
  { threatWord: "TÜRKİYE GENELİ", neutralWord: "SANDIK" },
  { threatWord: "YANILTICI SORU", neutralWord: "TATLI" },
  { threatWord: "YÜZDELİK DİLİM", neutralWord: "SABAHLIK" },
  { threatWord: "BELGE EKSİKLİĞİ", neutralWord: "HALI YIKAMA" },
  { threatWord: "HAYAL KIRIKLIĞI", neutralWord: "OYUNCAK" },
  { threatWord: "MEZUNA BIRAKMAK", neutralWord: "ASTRONOT" },
  { threatWord: "ÖĞRENME GÜÇLÜĞÜ", neutralWord: "KAR" },
  { threatWord: "REHBER ÖĞRETMEN", neutralWord: "AHŞAP ZEMİN" },
  { threatWord: "SINAV ÖĞRENCİSİ", neutralWord: "KESTANE" },
  { threatWord: "TEMEL KAVRAMLAR", neutralWord: "KAR" },
  { threatWord: "YENİ NESİL SORU", neutralWord: "RENGARENK" },
  { threatWord: "DERECE ÖĞRENCİSİ", neutralWord: "BUKALEMUN" },
  { threatWord: "DİKKAT EKSİKLİĞİ", neutralWord: "TOKA" },
  { threatWord: "KAÇ SAAT ÇALIŞTIN", neutralWord: "TRT BELGESEL" },
  { threatWord: "DİKKAT DAĞINIKLIĞI", neutralWord: "KIYMALI MANTI" },
  { threatWord: "NETLERİN ARTMAMASI", neutralWord: "KIRLANGIÇ" },
  { threatWord: "SIKIŞMIŞ HİSSETMEK", neutralWord: "TENCERE" },
  { threatWord: "ZİHİNSEL YORGUNLUK", neutralWord: "TENCERE" },
  { threatWord: "YOUTUBE'DAN ÇALIŞMAK", neutralWord: "HEYKELTIRAŞ" },
];
