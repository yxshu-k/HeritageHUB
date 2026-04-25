import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/product/${product._id}`)}
      className="group relative bg-dark-800 border border-dark-700 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-heritage-600 hover:-translate-y-1 hover:shadow-2xl hover:shadow-heritage-600/10"
    >
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-white text-sm font-semibold flex items-center gap-2">
            View Details <span className="text-heritage-600">→</span>
          </span>
        </div>
        
        {product.verificationStatus === 'verified' && (
          <div className="absolute top-4 left-4 bg-dark-900/80 backdrop-blur-md border border-green-500/30 text-green-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            VERIFIED
          </div>
        )}
      </div>

      <div className="p-4 md:p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-cinzel text-lg font-bold text-heritage-600 line-clamp-1 group-hover:text-heritage-500 transition-colors">
            {product.title}
          </h3>
        </div>

        <div className="flex items-center gap-3 mb-4 text-xs text-slate-400">
          <span className="bg-dark-700 px-2 py-1 rounded border border-dark-600">
            {product.category}
          </span>
          <span className="flex items-center gap-1">
            <span className="opacity-60">Age:</span> {product.estimatedAge}
          </span>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-dark-700">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-semibold">Starting at</p>
            <p className="text-xl font-bold text-white group-hover:text-heritage-600 transition-colors">
              ₹{product.price?.toLocaleString()}
            </p>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Heritage</span>
              <span className="text-xs font-bold text-heritage-600">{product.heritageScore}/10</span>
            </div>
            <div className="w-16 h-1 bg-dark-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-heritage-600 transition-all duration-1000" 
                style={{ width: `${(product.heritageScore / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}