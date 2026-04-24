import { useNavigate } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Primary Hero Carousel */}
      <HeroCarousel />

      {/* Categories Preview */}
      <section className="py-24 px-4 bg-dark-900 relative">
        <div className="container-app">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-heritage-600/10 border border-heritage-600/30 rounded-full mb-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-heritage-600 font-black">Curated Archives</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">
              BROWSE BY <span className="text-heritage-600">CATEGORY</span>
            </h2>
            <p className="text-slate-400 font-light max-w-xl mx-auto italic">Explore rare antiquities categorized by their historical era and cultural significance.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Ancient Coins', icon: '🪙', color: 'from-blue-600 to-blue-950', delay: '0' },
              { name: 'Vintage Watches', icon: '⏰', color: 'from-amber-600 to-amber-950', delay: '100' },
              { name: 'Rare Books', icon: '📚', color: 'from-emerald-600 to-emerald-950', delay: '200' },
              { name: 'Antique Jewelry', icon: '💎', color: 'from-purple-600 to-purple-950', delay: '300' },
              { name: 'Paintings', icon: '🎨', color: 'from-rose-600 to-rose-950', delay: '400' },
              { name: 'Sculptures', icon: '🗿', color: 'from-cyan-600 to-cyan-950', delay: '500' },
              { name: 'Historical Cameras', icon: '📷', color: 'from-slate-600 to-slate-950', delay: '600' },
              { name: 'Traditional Artifacts', icon: '🏺', color: 'from-orange-600 to-orange-950', delay: '700' },
            ].map((category, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/marketplace?category=${encodeURIComponent(category.name)}`)}
                className="group relative h-64 overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-40 group-hover:opacity-60 transition-opacity`}></div>
                <div className="absolute inset-0 bg-dark-950/40 backdrop-blur-[2px] group-hover:backdrop-blur-0 transition-all"></div>
                
                <div className="relative h-full p-8 flex flex-col items-center justify-center text-center">
                  <div className="text-5xl mb-4 transform group-hover:scale-125 transition-transform duration-500">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                    {category.name}
                  </h3>
                  <div className="w-8 h-1 bg-heritage-600 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                  
                  <button className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-heritage-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    View Archive →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-4 border-y border-dark-800">
        <div className="container-app">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">
              WHY <span className="text-heritage-600">HERITAGEHUB?</span>
            </h2>
            <p className="text-slate-400 font-light italic">The global gold standard for antiquity trade and preservation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: 'Verified Authenticity',
                description: 'Every artifact undergoes rigorous multi-stage verification by certified heritage experts.',
                icon: '📜',
                accent: 'bg-blue-500/10'
              },
              {
                title: 'Secure Custody',
                description: 'State-of-the-art blockchain tracing ensures the provenance and security of your collection.',
                icon: '🔐',
                accent: 'bg-amber-500/10'
              },
              {
                title: 'Global Outreach',
                description: 'Connect with elite collectors and institutions from over 120 countries worldwide.',
                icon: '🌍',
                accent: 'bg-emerald-500/10'
              }
            ].map((feature, idx) => (
              <div key={idx} className="relative group">
                <div className={`absolute -inset-2 ${feature.accent} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                <div className="relative card p-10 h-full border-t-4 border-heritage-600">
                  <div className="text-4xl mb-6">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed font-light">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1459706484596-7140c49739c4?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10 grayscale"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/90 to-dark-900"></div>
        
        <div className="container-app relative z-10 text-center">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
            READY TO <span className="text-heritage-600">OWN HISTORY?</span>
          </h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-light italic">
            Join our exclusive community of curators and begin your journey into the past today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="btn-primary px-12 py-5 text-lg"
            >
              Start Your Collection
            </button>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-12 py-5 border border-dark-700 text-white rounded-xl font-bold hover:bg-dark-800 transition-colors"
            >
              Explore All Items
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}