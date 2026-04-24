import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import Login from './pages/Login'
import Register from './pages/Register'
import ProductDetail from './pages/ProductDetail'
import AddProduct from './pages/AddProduct'
import Wishlist from './pages/Wishlist'
import SellerDashboard from './pages/SellerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-dark-900">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/marketplace' element={<Marketplace />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/product/:id' element={<ProductDetail />} />
              <Route
                path='/add-product'
                element={<ProtectedRoute><AddProduct /></ProtectedRoute>}
              />
              <Route
                path='/wishlist'
                element={<ProtectedRoute><Wishlist /></ProtectedRoute>}
              />
              <Route
                path='/dashboard'
                element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>}
              />
              <Route
                path='/admin'
                element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>}
              />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1008',
              color: '#f5e6c8',
              border: '1px solid #c9a84c',
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App