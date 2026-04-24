const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const DEMO_PRODUCTS = [
  {
    title: 'Imperial Mughal Emerald Ring',
    category: 'Antique Jewelry',
    description: 'A magnificent 18th-century gold ring set with a massive carved emerald, once part of the treasury of the Mughal Empire. The craftsmanship reflects the peak of Indo-Islamic jewelry art.',
    story: 'Recovered from a private collection in Hyderabad, this ring bears the signature seal of a high-ranking court official from the era of Shah Alam II.',
    price: 850000,
    estimatedAge: '220 Years',
    heritageScore: 9.8,
    verificationStatus: 'verified',
    images: [
      'https://images.unsplash.com/photo-1588444839799-eb64299bba14?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1000'
    ]
  },
  {
    title: 'Rare 1940s Patek Philippe Calatrava',
    category: 'Vintage Watches',
    description: 'An exceptionally rare reference 96 in 18k yellow gold. This timepiece is the epitome of horological minimalism and remains in pristine mechanical condition.',
    story: 'Acquired at a Sotheby\'s auction in Geneva, this watch was originally gifted to a prominent diplomat in 1945.',
    price: 1250000,
    estimatedAge: '81 Years',
    heritageScore: 9.2,
    verificationStatus: 'verified',
    images: [
      'https://images.unsplash.com/photo-1509048191080-d2984bad6ad5?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=1000'
    ]
  },
  {
    title: 'Ancient Greek Attic Kylix',
    category: 'Sculptures',
    description: 'A black-figure drinking cup (kylix) depicting a scene of Dionysian revelry. This piece is remarkably intact with vibrant glaze and fine line work.',
    story: 'Found in an excavation site near Corinth in the early 20th century, documented in the archeological registry of 1924.',
    price: 650000,
    estimatedAge: '2400 Years',
    heritageScore: 10,
    verificationStatus: 'verified',
    images: [
      'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1578320339911-7f714298135a?auto=format&fit=crop&q=80&w=1000'
    ]
  },
  {
    title: '17th Century Manuscript of Omar Khayyam',
    category: 'Rare Books',
    description: 'A beautifully illuminated Persian manuscript of the Rubaiyat, featuring hand-painted miniatures and gold leaf borders on vellum.',
    story: 'Preserved by a noble family in Isfahan for generations before being cataloged by the Heritage Registry.',
    price: 450000,
    estimatedAge: '380 Years',
    heritageScore: 9.5,
    verificationStatus: 'verified',
    images: [
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1474932430478-3a7fb9065ba0?auto=format&fit=crop&q=80&w=1000'
    ]
  },
  {
    title: 'Victorian Rosewood Grand Piano',
    category: 'Traditional Artifacts',
    description: 'A Broadwood & Sons concert grand piano with exquisite rosewood inlay and ivory keys. A testament to 19th-century musical craftsmanship.',
    story: 'Formerly housed in the music room of a Victorian estate in Yorkshire.',
    price: 950000,
    estimatedAge: '160 Years',
    heritageScore: 8.5,
    verificationStatus: 'verified',
    images: [
      'https://images.unsplash.com/photo-1520529688554-10c2fc935820?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&q=80&w=1000'
    ]
  },
  {
    title: 'Ming Dynasty Celadon Vase',
    category: 'Traditional Artifacts',
    description: 'A classic longquan celadon vase with a subtle sea-foam glaze and faint lotus patterns under the surface.',
    story: 'Recovered from a maritime trade wreck in the South China Sea, professionally restored and stabilized.',
    price: 720000,
    estimatedAge: '500 Years',
    heritageScore: 9.7,
    verificationStatus: 'verified',
    images: [
      'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=1000'
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Find an admin or any user to be the seller
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = await User.findOne({});
    }

    if (!admin) {
      console.error('No user found in database. Please register a user first.');
      process.exit(1);
    }

    console.log(`Using user ${admin.name} (${admin._id}) as seller for demo products.`);

    // Clear existing products if needed (optional)
    // await Product.deleteMany({});
    // console.log('Cleared existing products.');

    for (const prod of DEMO_PRODUCTS) {
      await Product.create({
        ...prod,
        sellerId: admin._id,
        currentBid: prod.price,
        auctionActive: true
      });
    }

    console.log('Successfully seeded 6 premium demo products! 🏺');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
