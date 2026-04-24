const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const DEMO_PRODUCTS = [
  {
    title: 'Imperial Mughal Emerald Ring',
    category: 'Antique Jewelry',
    description: 'A magnificent 18th-century gold ring set with a massive carved emerald, once part of the treasury of the Mughal Empire.',
    story: 'Recovered from a private collection in Hyderabad, this ring bears the signature seal of a high-ranking court official.',
    price: 850000,
    estimatedAge: '220 Years',
    heritageScore: 9.8,
    verificationStatus: 'verified',
    images: [
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1200'
    ]
  },
  {
    title: 'Rare 1940s Patek Philippe Calatrava',
    category: 'Vintage Watches',
    description: 'An exceptionally rare reference 96 in 18k yellow gold. Pristine mechanical condition.',
    story: 'Acquired at a Sotheby\'s auction in Geneva, this watch was originally gifted to a prominent diplomat.',
    price: 1250000,
    estimatedAge: '81 Years',
    heritageScore: 9.2,
    verificationStatus: 'verified',
    images: [
      'https://images.unsplash.com/photo-1509048191080-d2984bad6ad5?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=1200'
    ]
  },
  {
    title: 'Ancient Greek Attic Kylix',
    category: 'Sculptures',
    description: 'A black-figure drinking cup depicting Dionysian revelry. Remarkably intact.',
    story: 'Found in an excavation site near Corinth in the early 20th century.',
    price: 650000,
    estimatedAge: '2400 Years',
    heritageScore: 10,
    verificationStatus: 'verified',
    images: [
      'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1578320339911-7f714298135a?auto=format&fit=crop&q=80&w=1200'
    ]
  },
  {
    title: '17th Century Manuscript of Omar Khayyam',
    category: 'Rare Books',
    description: 'A beautifully illuminated Persian manuscript with hand-painted miniatures.',
    story: 'Preserved by a noble family in Isfahan for generations.',
    price: 450000,
    estimatedAge: '380 Years',
    heritageScore: 9.5,
    verificationStatus: 'verified',
    images: [
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1474932430478-3a7fb9065ba0?auto=format&fit=crop&q=80&w=1200'
    ]
  },
  {
    title: 'Rare Kushan Gold Dinar',
    category: 'Ancient Coins',
    description: 'A gold dinar of Kanishka I. A masterwork of ancient numismatic art.',
    story: 'Discovered in a hoard near Taxila.',
    price: 350000,
    estimatedAge: '1850 Years',
    heritageScore: 9.7,
    verificationStatus: 'verified',
    images: [
      'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=1200'
    ]
  },
  {
    title: 'Leica III Rangefinder Camera',
    category: 'Historical Cameras',
    description: 'The camera that revolutionized photojournalism.',
    story: 'Owned by a war correspondent in the 1940s.',
    price: 180000,
    estimatedAge: '90 Years',
    heritageScore: 8.9,
    verificationStatus: 'verified',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200'
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

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products.');

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
