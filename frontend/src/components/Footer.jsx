export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-800 border-t border-dark-700 mt-20">
      <div className="container-app py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-3xl font-cinzel font-black text-white mb-6 tracking-tighter">
              HERITAGE<span className="text-heritage-600">HUB</span>
            </h3>
            <p className="text-slate-400 font-light italic mb-6">
              "Buy History. Sell Legacy. Preserve Heritage."
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              The world's premier platform for authentic heritage collectibles and rare antiquities. Our mission is to bridge the past and future by preserving the stories behind every artifact.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-heritage-600 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-slate-400 hover:text-heritage-600 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/marketplace" className="text-slate-400 hover:text-heritage-600 transition-colors">
                  Marketplace
                </a>
              </li>
              <li>
                <a href="/add-product" className="text-slate-400 hover:text-heritage-600 transition-colors">
                  Sell Items
                </a>
              </li>
              <li>
                <a href="/wishlist" className="text-slate-400 hover:text-heritage-600 transition-colors">
                  Wishlist
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-heritage-600 mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <a href="/marketplace?category=Ancient Coins" className="text-slate-400 hover:text-heritage-600 transition-colors">
                  Ancient Coins
                </a>
              </li>
              <li>
                <a href="/marketplace?category=Vintage Watches" className="text-slate-400 hover:text-heritage-600 transition-colors">
                  Vintage Watches
                </a>
              </li>
              <li>
                <a href="/marketplace?category=Rare Books" className="text-slate-400 hover:text-heritage-600 transition-colors">
                  Rare Books
                </a>
              </li>
              <li>
                <a href="/marketplace?category=Antique Jewelry" className="text-slate-400 hover:text-heritage-600 transition-colors">
                  Antique Jewelry
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-heritage-600 mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-slate-400">
                Email: <span className="text-heritage-600">info@heritagehub.com</span>
              </li>
              <li className="text-slate-400">
                Phone: <span className="text-heritage-600">+1 (555) 123-4567</span>
              </li>
              <li className="text-slate-400">
                Hours: Mon - Fri, 9AM - 6PM EST
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dark-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm mb-4 md:mb-0">
            © {currentYear} HeritageHUB. All rights reserved.
          </p>
          <div className="flex gap-6 text-slate-400">
            <a href="#" className="hover:text-heritage-600 transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-heritage-600 transition-colors text-sm">
              Terms of Service
            </a>
            <a href="#" className="hover:text-heritage-600 transition-colors text-sm">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}