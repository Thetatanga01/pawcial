export default function HowToHelp() {
  const helpOptions = [
    {
      title: 'Gönüllü Ol',
      description: 'Zamanınızı ve sevginizi paylaşarak barınaktaki dostlarımıza yardımcı olun.',
      buttonText: 'Detaylı Bilgi',
      link: '#',
    },
    {
      title: 'Yuva Ol',
      description: 'Bir patiye kalıcı ve sevgi dolu bir yuva sunarak hayatını değiştirin.',
      buttonText: 'Sahiplen',
      link: '#',
    },
    {
      title: 'Geçici Yuva Ol',
      description: 'Kalıcı yuvası bulunana kadar bir patiye geçici olarak evinizi açın.',
      buttonText: 'Başvur',
      link: '#',
    },
    {
      title: 'Koruyucu Aile Ol',
      description: 'Bakıma ihtiyaç duyan bir patinin masraflarını üstlenerek destek olun.',
      buttonText: 'Destek Ol',
      link: '#',
    },
  ];

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Kahraman Ol!</h2>
        <p className="section-lead">Sahiplenme ve destek süreçlerimize katılarak bir canın hayatını değiştirin. Farklı yollarla bize ve patili dostlarımıza destek olabilirsiniz.</p>
        <div className="help-grid">
          {helpOptions.map((option, index) => (
            <article className="help-card" key={index}>
              <h3>{option.title}</h3>
              <p>{option.description}</p>
              <a href={option.link} className="btn btn-soft">{option.buttonText}</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


