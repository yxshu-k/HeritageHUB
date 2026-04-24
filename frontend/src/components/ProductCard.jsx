import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/product/${product._id}`)} style={{
      background: 'linear-gradient(135deg, #1a1008 0%, #2d1f0a 100%)',
      border: '1px solid #3d2e0a',
      borderRadius: '12px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'transform 0.2s, border-color 0.2s',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = '#c9a84c';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#3d2e0a';
      }}
    >
      <img
        src={product.images?.[0] || 'https://via.placeholder.com/300x200?text=Antique'}
        alt={product.title}
        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
      />
      <div style={{ padding: '1rem' }}>
        <h3 style={{
          fontFamily: 'Cinzel, serif',
          color: '#c9a84c',
          fontSize: '1rem',
          marginBottom: '0.5rem'
        }}>{product.title}</h3>

        <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          📅 {product.estimatedAge}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#e8d5b0', fontWeight: '600', fontSize: '1.1rem' }}>
            ₹{product.price?.toLocaleString()}
          </span>
          {product.verificationStatus === 'verified' && (
            <span style={{
              background: '#1a3a1a',
              color: '#4caf50',
              padding: '0.2rem 0.6rem',
              borderRadius: '20px',
              fontSize: '0.75rem'
            }}>✅ Verified</span>
          )}
        </div>

        <div style={{
          marginTop: '0.5rem',
          background: '#0a0a0a',
          borderRadius: '4px',
          padding: '0.3rem 0.6rem',
          display: 'inline-block'
        }}>
          <span style={{ color: '#c9a84c', fontSize: '0.8rem' }}>
            Heritage Score: {product.heritageScore}/10
          </span>
        </div>
      </div>
    </div>
  );
}