import { useNavigate } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-dark-950/20 via-dark-900/60 to-dark-900 z-10"></div>
          <video 
            autoPlay 
            muted 
            loop 
            className="w-full h-full object-cover opacity-30"
            poster="https://images.unsplash.com/photo-1554034483-04fda0d3507b?auto=format&fit=crop&q=80&w=2000"
          >
            {/* Fallback image if no video */}
          </video>
        </div>

        <div className="container-app relative z-20 text-center">
          <div className="inline-block px-4 py-1 border border-heritage-600/30 rounded-full bg-heritage-600/5 mb-6 animate-fade-in">
            <span className="text-[10px] uppercase tracking-[0.3em] text-heritage-600 font-black">
              Premium Antique Marketplace
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-tight tracking-tighter">
            BUY <span className="text-heritage-600">HISTORY.</span><br />
            SELL <span className="text-heritage-600">LEGACY.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            The world's most trusted platform for authentic heritage collectibles and rare antiquities.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => navigate('/marketplace')}
              className="btn-primary px-12 py-5 text-lg shadow-2xl shadow-heritage-600/20"
            >
              Enter Marketplace
            </button>
            <button
              onClick={() => navigate('/add-product')}
              className="group text-white font-bold flex items-center gap-2 hover:text-heritage-600 transition-colors"
            >
              List Your Artifact 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>

        {/* Floating Accents */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-heritage-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-heritage-600/5 rounded-full blur-[150px]"></div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 px-4 bg-dark-800">
        <div className="container-app">
          <div className="text-center mb-16">
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-subtitle">Discover treasures across multiple categories</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Ancient Coins', icon: '🪙', color: 'from-blue-600 to-blue-900' },
              { name: 'Vintage Watches', icon: '⏰', color: 'from-purple-600 to-purple-900' },
              { name: 'Rare Books', icon: '📚', color: 'from-orange-600 to-orange-900' },
              { name: 'Jewelry', icon: '💎', color: 'from-pink-600 to-pink-900' },
              { name: 'Paintings', icon: '🎨', color: 'from-red-600 to-red-900' },
              { name: 'Sculptures', icon: '🗿', color: 'from-cyan-600 to-cyan-900' },
              { name: 'Cameras', icon: '📷', color: 'from-green-600 to-green-900' },
              { name: 'Artifacts', icon: '🏺', color: 'from-amber-600 to-amber-900' },
            ].map((category, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/marketplace?category=${category.name}`)}
                className="card p-6 text-center cursor-pointer group"
              >
                <div className={`bg-gradient-to-br ${category.color} w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold text-heritage-600 group-hover:text-heritage-500 transition-colors">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Why Choose Us */}
      <section className="py-20 px-4">
        <div className="container-app">
          <div className="text-center mb-16">
            <h2 className="section-title">Why Choose HeritageHUB?</h2>
            <p className="section-subtitle">The premier platform for heritage enthusiasts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Verified Authenticity',
                description: 'Every item is carefully verified and authenticated by our expert team.',
                icon: '✓'
              },
              {
                title: 'Secure Auctions',
                description: 'Bid with confidence in our transparent and secure bidding system.',
                icon: '🔒'
              },
              {
                title: 'Heritage Stories',
                description: 'Learn the rich history and cultural significance of each artifact.',
                icon: '📖'
              },
              {
                title: 'Global Community',
                description: 'Connect with collectors and historians from around the world.',
                icon: '🌍'
              },
              {
                title: 'Fair Pricing',
                description: 'Market-driven prices that reflect true collector value.',
                icon: '💰'
              },
              {
                title: 'Expert Support',
                description: 'Get personalized assistance from our heritage specialists.',
                icon: '👥'
              },
            ].map((feature, idx) => (
              <div key={idx} className="card p-8 text-center">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-heritage-600 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-luxury">
        <div className="container-app text-center">
          <h2 className="text-4xl font-cinzel font-bold text-heritage-600 mb-6">
            Ready to Begin Your Collection?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of collectors preserving history one artifact at a time.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="btn-primary text-lg px-8 py-4"
          >
            Start Trading Now
          </button>
        </div>
      </section>
    </div>
  );
}