'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801XXXXXXXXX'
const FB = process.env.NEXT_PUBLIC_FB_PAGE || 'https://m.me/your-page'
const LOGO = '/corelab.jpg'

function waLink(msg) {
  return `https://wa.me/${WA}?text=${encodeURIComponent(msg || 'আমি পাঞ্জাবি অর্ডার করতে চাই')}`
}


function AccordionItem({ title, content }) {
  const [open, setOpen] = useState(false)
  if (!content) return null

  return (
    <div className="border-t border-cream-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="text-sm font-semibold text-ink group-hover:text-gold transition-colors">
          {title}
        </span>
        <span className={`text-muted text-xl leading-none transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-96 pb-5' : 'max-h-0'}`}>
        <p className="text-sm text-muted leading-relaxed whitespace-pre-line">
          {content}
        </p>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────
export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [descExpanded, setDescExpanded] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError('')
    fetch(`/api/products/${id}`)
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          setError(data.error || 'প্রোডাক্ট পাওয়া যায়নি')
          setProduct(null)
        } else {
          setProduct(data)
        }
      })
      .catch(() => setError('লোড করতে পারছি না'))
      .finally(() => setLoading(false))
  }, [id])

  const orderMsg = product?.whatsapp_message || (product ? `${product.name} অর্ডার করতে চাই` : '')

  const DESC_LIMIT = 120
  const hasMoreDesc = (product?.description?.length || 0) > DESC_LIMIT

  return (
    <div className="min-h-screen bg-cream">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b border-gold-pale flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <Image src={LOGO} alt="Core Lab" width={40} height={40}
            className="rounded-xl object-cover border border-gold-pale bg-deep" />
          <div>
            <div className="text-lg font-bold text-ink">Core Lab</div>
            <div className="text-[10px] text-gold tracking-widest italic">Rajkiyo Punjabi</div>
          </div>
        </Link>
        <Link href="/#products" className="text-sm text-muted hover:text-gold transition-colors">
          ← সব প্রোডাক্ট
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* Loading */}
        {loading && (
          <div className="text-center py-24 text-muted text-sm">লোড হচ্ছে...</div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">👘</div>
            <p className="text-muted mb-6">{error}</p>
            <Link href="/" className="btn-gold">হোমে ফিরুন</Link>
          </div>
        )}

        {/* Product */}
        {!loading && product && (
          <>
            {/* Breadcrumb */}
            <div className="text-xs text-muted mb-6 flex items-center gap-1.5">
              <Link href="/" className="hover:text-gold transition-colors">হোম</Link>
              <span>/</span>
              <Link href="/#products" className="hover:text-gold transition-colors">প্রোডাক্ট</Link>
              <span>/</span>
              <span className="text-ink">{product.name}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-10">

              {/* ── Image ── */}
              <div className="relative aspect-[3/4] bg-white rounded-2xl overflow-hidden border border-cream-2 shadow-lg">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-8xl text-muted/30">👘</div>
                )}
                {product.badge && (
                  <span className={`absolute top-4 left-4 text-sm font-bold px-3 py-1.5 rounded-full ${
                    product.badge === 'নতুন' ? 'bg-gold text-deep' : 'bg-accent text-white'
                  }`}>
                    {product.badge}
                  </span>
                )}
              </div>

              {/* ── Right Column ── */}
              <div className="flex flex-col">

                {/* Category */}
                {product.categories && (
                  <div className="text-sm text-muted mb-2">
                    {product.categories.icon} {product.categories.name}
                  </div>
                )}

                {/* Name */}
                <h1 className="text-3xl font-bold text-ink mb-4">{product.name}</h1>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="text-3xl font-bold text-gold">
                    ৳ {Number(product.price || 0).toLocaleString('bn-BD')}
                  </span>
                  {product.old_price != null && (
                    <>
                      <span className="text-lg text-muted line-through">
                        ৳ {Number(product.old_price).toLocaleString('bn-BD')}
                      </span>
                      <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        {Math.round((1 - product.price / product.old_price) * 100)}% ছাড়
                      </span>
                    </>
                  )}
                </div>

                {/* Description + Read more */}
                {product.description && (
                  <div className="mb-5">
                    <p className="text-muted text-sm leading-relaxed">
                      {descExpanded
                        ? product.description
                        : product.description.slice(0, DESC_LIMIT) + (hasMoreDesc ? '...' : '')
                      }
                    </p>
                    {hasMoreDesc && (
                      <button
                        onClick={() => setDescExpanded(e => !e)}
                        className="text-sm font-medium text-ink underline underline-offset-2 mt-2 hover:text-gold transition-colors"
                      >
                        {descExpanded ? 'Read less' : 'Read more'}
                      </button>
                    )}
                  </div>
                )}

                {/* Sizes */}
                {product.sizes?.length > 0 && (
                  <div className="mb-6">
                    <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">সাইজ</div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(s => (
                        <span key={s}
                          className="px-4 py-2 bg-white border border-cream-2 rounded-lg text-sm font-semibold text-ink">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {/* ── Accordion ── */}
                <div className="mt-8">
                  <AccordionItem title="Details"            content={product.details} />
                  <AccordionItem title="Materials"          content={product.materials} />
                  <AccordionItem title="Care Instructions"  content={product.care} />
                  {(product.details || product.materials || product.care) && (
                    <div className="border-t border-cream-2" />
                  )}
                </div>
                {/* Order Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href={waLink(orderMsg)} target="_blank" rel="noopener noreferrer"
                    className="btn-wa flex-1 justify-center">
                    💬 WhatsApp-এ অর্ডার
                  </a>
                  <a href={FB} target="_blank" rel="noopener noreferrer"
                    className="btn-fb flex-1 justify-center">
                    📘 Messenger-এ মেসেজ
                  </a>
                </div>

              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
