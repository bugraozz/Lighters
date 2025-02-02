'use client'

export default function IadePolitikasiPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">İADE POLİTİKASI</h1>
      <p className="text-lg mb-4">Bizim için müşteri memnuniyeti önceliklidir. Ancak, tüm ürünlerimiz el yapımı ve kişiye özel tasarım olduğu için belirli şartlar dahilinde iade kabul edilmektedir.</p>
      
      <h3 className="text-2xl font-semibold mb-4">1. İade Kabul Edilen Durumlar:</h3>
      <ul className="list-disc list-inside mb-4">
        <li className="text-lg mb-2">Yanlış veya hatalı ürün gönderildiyse</li>
        <li className="text-lg mb-2">Kargoda hasar görmüşse <em>(Kargo teslimatı sırasında tutanak tutulmalıdır)</em></li>
        <li className="text-lg mb-2">Ürün, belirtilen özelliklerden farklı geldiyse</li>
      </ul>
      
      <h3 className="text-2xl font-semibold mb-4">2. İade Kabul Edilmeyen Durumlar:</h3>
      <ul className="list-disc list-inside mb-4">
        <li className="text-lg mb-2">Kişiye özel tasarlanan ürünler <em>(İsim, tarih, özel tasarım gibi)</em></li>
        <li className="text-lg mb-2">Kullanılmış veya hasar görmüş ürünler</li>
        <li className="text-lg mb-2">Müşteri tarafından yanlış sipariş edilen ürünler</li>
      </ul>
      
      <h3 className="text-2xl font-semibold mb-4">3. İade ve Değişim Süreci:</h3>
      <ul className="list-disc list-inside mb-4">
        <li className="text-lg mb-2">İade talebiniz için <strong>sipariş teslim tarihinden itibaren 3 gün içinde</strong> bizimle iletişime geçmelisiniz.</li>
        <li className="text-lg mb-2">Ürünün eksiksiz ve orijinal ambalajında geri gönderilmesi gerekmektedir.</li>
        <li className="text-lg mb-2">Onaylanan iadeler için <strong>değişim veya hediye çeki</strong> sunulabilir.</li>
        <li className="text-lg mb-2">Para iadesi politikamız satış platformuna bağlı olarak değişebilmektedir.</li>
      </ul>
      
      <h3 className="text-2xl font-semibold mb-4">4. Hasarlı Ürün Durumunda Ne Yapmalıyım?</h3>
      <p className="text-lg mb-4">Eğer siparişiniz kargoda hasar gördüyse, <strong>kargo teslimatı sırasında tutanak tutturmanız gerekmektedir</strong>. Aksi halde iade kabul edilemez.</p>
      
      <h3 className="text-2xl font-semibold mb-4">5. İade ve Değişim İçin İletişim:</h3>
      <p className="text-lg mb-4">İade talepleriniz için bizimle <strong>iletişim sayfamızdan</strong> veya sosyal medya hesaplarımızdan iletişime geçebilirsiniz.</p>
      
      <p className="text-lg">Teşekkür ederiz!</p>
    </div>
  )
}