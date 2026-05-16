'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801XXXXXXXXX'
const FB = process.env.NEXT_PUBLIC_FB_PAGE || 'https:/Core Lab'
const LOGO = '/corelab.jpg'

function waLink(msg) {
  return `https://wa.me/${WA}?text=${encodeURIComponent(msg || 'আমি পাঞ্জাবি অর্ডার করতে চাই')}`
}

export default function StorePage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts(activeCategory)
  }, [activeCategory])

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      if (!res.ok) {
        setApiError(data.error || 'ক্যাটাগরি লোড ব্যর্থ')
        setCategories([])
        return
      }
      setCategories(Array.isArray(data) ? data : [])
    } catch {
      setApiError('সার্ভারে সংযোগ করা যাচ্ছে না')
      setCategories([])
    }
  }

  async function fetchProducts(category = 'all') {
    setLoading(true)
    try {
      const url = category === 'all'
        ? '/api/products'
        : `/api/products?category=${category}`
      const res = await fetch(url)
      const data = await res.json()
      if (!res.ok) {
        setApiError(data.error || 'প্রোডাক্ট লোড ব্যর্থ')
        setProducts([])
        return
      }
      setProducts(Array.isArray(data) ? data : [])
    } catch {
      setApiError('সার্ভারে সংযোগ করা যাচ্ছে না')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Topbar */}
      <div className="bg-deep text-gold-light text-center py-3 text-medium tracking-widest uppercase">
        🎁 ঈদ স্পেশাল — সীমিত সময়ের জন্য ২০% ছাড় | দ্রুত অর্ডার করুন
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b border-gold-pale flex items-center justify-between px-2 py-4">
        <a href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Image
            src={LOGO}
            alt="Core Lab"
            width={44}
            height={44}
            className="rounded-xl object-cover border border-gold-pale bg-deep"
            priority
          />
          <div>
            <div className="text-xl font-bold text-ink">Core Lab</div>
            <div className="text-[10px] text-gold tracking-widest italic">Rajkiyo Punjabi</div>
          </div>
        </a>
        <div className="hidden md:flex items-center gap-6">
          <a href="#products" className="text-muted text-m hover:text-black transition-colors">প্রোডাক্ট</a>
          <a href="#why" className="text-muted text-m hover:text-black transition-colors">কেন আমরা</a>
          <a href={waLink('অর্ডার করতে চাই')} target="_blank"
            className="bg-deep text-white text-[12px] px-4 py-2 rounded hover:bg-ink transition-colors">
            📞 অর্ডার করুন
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-deep relative overflow-hidden">
        <div className="absolute inset-0 opacity-80"
          style={{ backgroundImage: 'url(/hero.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 border border-black bg-black/50 text-white px-4 py-1.5 rounded-full text-xs tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse text-white" />
            নতুন কালেকশন এসেছে
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
            সেরা মানের<br/>
            <span className="text-gold">পাঞ্জাবি</span>
          </h1>
          <p className="text-white max-w-md text-sm leading-relaxed">
            হাতে বাছাই করা কাপড়, অনন্য ডিজাইন এবং নিখুঁত সেলাই। প্রতিটি পাঞ্জাবি তৈরি হয় আপনার স্বাচ্ছন্দ্যের কথা মাথায় রেখে।
          </p>
          {/*<div className="flex flex-wrap gap-3 justify-center">
            <a href={waLink('আমি পাঞ্জাবি অর্ডার করতে চাই')} target="_blank" className="btn-wa">
              💬 WhatsApp-এ অর্ডার
            </a>
            <a href={FB} target="_blank" className="btn-fb">
              📘 Facebook-এ মেসেজ
            </a>
          </div> 
          <div className="flex gap-8 mt-4">
            {[['৫০০+', 'খুশি কাস্টমার'], ['৩০+', 'ডিজাইন'], ['⭐ ৪.৯', 'রেটিং']].map(([num, lbl]) => (
              <div key={lbl} className="text-center">
                <div className="text-white font-bold text-xl">{num}</div>
                <div className="text-white/40 text-xs mt-0.5">{lbl}</div>
              </div>
            ))}
          </div>*/}
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="text-gold text-xs tracking-widest uppercase mb-2">Our Collection</div>
          <h2 className="text-3xl font-bold text-ink">আমাদের পাঞ্জাবি কালেকশন</h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-12 bg-gold-light opacity-50" />
            <span className="text-gold text-sm">✦</span>
            <div className="h-px w-12 bg-gold-light opacity-50" />
          </div>
        </div>

        {apiError && (
          <div className="mb-8 px-4 py-3 rounded-lg text-sm text-center bg-amber-50 text-amber-900 border border-amber-200">
            ⚠️ {apiError} — .env.local-এ Supabase keys সেট করুন এবং dev server রিস্টার্ট করুন।
          </div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2 rounded-full text-sm border transition-all ${
              activeCategory === 'all'
                ? 'bg-deep border-deep text-gold-light'
                : 'bg-white border-cream-2 text-muted hover:border-gold'
            }`}
          >
            সব
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-sm border transition-all ${
                activeCategory === cat.id
                  ? 'bg-deep border-deep text-gold-light'
                  : 'bg-white border-cream-2 text-muted hover:border-gold'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-[3/4] bg-cream-2" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-cream-2 rounded w-3/4" />
                  <div className="h-3 bg-cream-2 rounded w-1/2" />
                  <div className="h-5 bg-cream-2 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <div className="text-5xl mb-4">👘</div>
            <p>এই ক্যাটাগরিতে কোনো প্রোডাক্ট নেই</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Why Us */}
      <section id="why" className="bg-deep py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <div className="w-96 h-96 rounded-full bg-gold" />
        </div>
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-12">
            <div className="text-gold-light text-xs tracking-widest uppercase mb-2">Why Choose Us</div>
            <h2 className="text-3xl font-bold text-white">কেন আমাদের পাঞ্জাবি?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              ['🏆', 'সেরা কোয়ালিটি', 'প্রতিটি পাঞ্জাবি বাছাই করা উচ্চমানের কাপড় দিয়ে তৈরি।'],
              ['🚚', 'দ্রুত ডেলিভারি', 'ঢাকায় ২৪ ঘণ্টা, সারাদেশে ২–৩ দিনে ডেলিভারি।'],
              ['💰', 'সাশ্রয়ী মূল্য', 'কারখানা থেকে সরাসরি আপনার কাছে, কোনো মধ্যস্বত্বভোগী নেই।'],
              ['🔄', 'সহজ রিটার্ন', '৭ দিনের মধ্যে বিনা প্রশ্নে রিটার্নের সুবিধা।'],
              ['📏', 'সব সাইজ', 'S থেকে XXL পর্যন্ত, কাস্টম সাইজও করা যায়।'],
              ['💬', 'সার্বক্ষণিক সাপোর্ট', 'WhatsApp ও Messenger-এ সাথে সাথে রেসপন্স।'],
            ].map(([icon, title, desc]) => (
              <div key={title} className="bg-white/5 border border-gold/15 rounded-xl p-6 text-center hover:border-gold/30 transition-colors">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-white/60 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream/95 py-16 px-6 text-center relative overflow-hidden">
        <div className="relative max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-deep mb-3">আজই অর্ডার করুন!</h2>
          <p className="text-deep/70 text-sm mb-8">স্টক সীমিত — দেরি না করে এখনই অর্ডার দিন</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href={waLink('আমি পাঞ্জাবি অর্ডার করতে চাই')} target="_blank"
              className="bg-deep text-white px-8 py-3 rounded font-bold text-sm hover:-translate-y-0.5 transition-all hover:shadow-lg hover:shadow-black/30 inline-flex items-center gap-2">
              💬 WhatsApp-এ অর্ডার করুন
            </a>
            <a href={FB} target="_blank"
              className="bg-deep text-white px-8 py-3 rounded font-bold text-sm hover:-translate-y-0.5 transition-all hover:shadow-lg hover:shadow-black/30 inline-flex items-center gap-2">
              📘 Facebook Messenger
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-deep text-white/40 px-6 py-12">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10 mb-8">
          <div>
            <div className="text-white font-bold text-xl mb-3">Core Lab</div>
            <p className="text-xs leading-relaxed text-white">
              হাতে বাছাই করা কাপড়, অনন্য ডিজাইন — প্রতিটি পাঞ্জাবি তৈরি হয় আপনার কথা মাথায় রেখে।
            </p>
            <div className="flex gap-3 mt-4">
              <a href={waLink('হ্যালো')} target="_blank"
                className="text-xs bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1.5 rounded hover:bg-green-500/20 transition-colors">
                💬 WhatsApp
              </a>
              <a href={FB} target="_blank"
                className="text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1.5 rounded hover:bg-blue-500/20 transition-colors">
                📘 Facebook
              </a>
            </div>
          </div>
          <div>
            <div className="text-white text-sm font-semibold mb-4">ক্যাটাগরি</div>
            <div className="flex flex-col gap-2">
              {categories.map(cat => (
                <button key={cat.id} onClick={() => { setActiveCategory(cat.id); document.getElementById('products').scrollIntoView() }}
                  className="text-xs text-white/60 hover:text-white transition-colors text-left">
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-white text-sm font-semibold mb-4">তথ্য</div>
            <div className="flex flex-col gap-2 text-xs text-white">
              <span>📦 ডেলিভারি: সারাদেশে</span>
              <span>🔄 রিটার্ন: ৭ দিন</span>
              <span>💳 পেমেন্ট: bKash, Nagad, Cash on delivery</span>
              <span>⏰ সাপোর্ট: সকাল ৯টা — রাত ১১টা</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 text-center text-xs">
          © ২০২৫ Core Lab — সর্বস্বত্ব সংরক্ষিত
        </div>
      </footer>

      {/* Floating Buttons */}
      <div className="fixed bottom-5 right-4 z-50 flex flex-col gap-2">
        <a href={waLink('আমি পাঞ্জাবি অর্ডার করতে চাই')} target="_blank"
          className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full text-sm font-bold shadow-xl hover:scale-105 transition-all">
          <span className="text-lg">💬</span>
          <span className="hidden md:inline">WhatsApp</span>
        </a>
        <a href={FB} target="_blank"
          className="flex items-center gap-2 bg-[#1877F2] text-white px-4 py-3 rounded-full text-sm font-bold shadow-xl hover:scale-105 transition-all">
          <span className="text-lg">📘</span>
          <span className="hidden md:inline">Messenger</span>
        </a>
      </div>
    </div>
  )
}

function ProductCard({ product }) {
  const router = useRouter()
  const href = `/products/${product.id}`
  const wa = waLink(product.whatsapp_message || `${product.name} অর্ডার করতে চাই`)
  const fb = process.env.NEXT_PUBLIC_FB_PAGE || 'https://m.me/your-page'

  function goToProduct() {
    router.push(href)
  }

  function handleKeyDown(e) {
    if (e.target.closest('a')) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      goToProduct()
    }
  }

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={goToProduct}
      onKeyDown={handleKeyDown}
      className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-cream-2 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 transition-all duration-300"
    >
      <div className="relative aspect-[3/4] bg-cream overflow-hidden">
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl text-muted/30">👘</div>
        )}
        {product.badge && (
          <span className={`absolute top-2 left-2 text-xs font-bold px-2.5 py-1 rounded-full ${
            product.badge === 'নতুন' ? 'bg-gold text-deep' : 'bg-accent text-white'
          }`}>
            {product.badge}
          </span>
        )}
        {/* Hover Order Buttons */}
        <div className="absolute inset-x-0 bottom-0 p-2 flex gap-1.5 bg-gradient-to-t from-black/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 md:flex">
          <a href={wa} target="_blank" onClick={e => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1 bg-[#25D366] text-white text-xs font-bold py-2 rounded hover:brightness-110 transition-all">
            💬 WhatsApp
          </a>
          <a href={fb} target="_blank" onClick={e => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1 bg-[#1877F2] text-white text-xs font-bold py-2 rounded hover:brightness-110 transition-all">
            📘 FB
          </a>
        </div>
      </div>
      <div className="p-3">
        <div className="font-semibold text-ink text-sm mb-0.5 line-clamp-1">{product.name}</div>
        {product.description && (
          <div className="text-muted text-xs mb-2 line-clamp-1">{product.description}</div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-gold font-bold text-base">৳ {Number(product.price || 0).toLocaleString('bn-BD')}</span>
          {product.old_price != null && (
            <span className="text-muted text-xs line-through">৳ {Number(product.old_price).toLocaleString('bn-BD')}</span>
          )}
        </div>
        {product.sizes?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.sizes.map(s => (
              <span key={s} className="text-[10px] bg-cream border border-cream-2 text-muted px-1.5 py-0.5 rounded font-semibold">{s}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
