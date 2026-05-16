'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '../../../lib/supabase-browser'

const SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL']
const BADGES = ['', 'হট', 'নতুন', 'সেল']
const EMPTY_PRODUCT = {
  name: '', description: '', price: '', old_price: '',
  category_id: '', sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  badge: '', image_url: '', whatsapp_message: '', is_active: true,
  details: '',
  materials: '',
  care: '',
}

export default function AdminDashboard() {
  const router = useRouter()
  const [pw, setPw] = useState('')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('products') // products | add | categories
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm] = useState(EMPTY_PRODUCT)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [newCatName, setNewCatName] = useState('')
  const [newCatIcon, setNewCatIcon] = useState('👘')
  const [search, setSearch] = useState('')
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    const stored = sessionStorage.getItem('admin_pw')
    if (!stored) { router.push('/admin'); return }
    setPw(stored)
  }, [router])

  useEffect(() => {
    if (pw) { fetchAll() }
  }, [pw])

  async function fetchAll() {
    setLoading(true)
    setApiError('')
    try {
      await Promise.all([fetchProducts(), fetchCategories()])
    } catch {
      setApiError('ডেটা লোড করতে পারছি না। ইন্টারনেট বা Supabase সেটআপ চেক করুন।')
    } finally {
      setLoading(false)
    }
  }

  async function fetchProducts() {
    const res = await fetch('/api/products?admin=true', { headers: { 'x-admin-password': pw } })
    const data = await res.json()
    if (!res.ok) {
      setApiError(data.error || 'প্রোডাক্ট লোড ব্যর্থ। .env.local-এ Supabase keys সঠিক কিনা দেখুন।')
      setProducts([])
      return
    }
    setProducts(Array.isArray(data) ? data : [])
  }

  async function fetchCategories() {
    const res = await fetch('/api/categories')
    const data = await res.json()
    if (!res.ok) {
      setApiError(data.error || 'ক্যাটাগরি লোড ব্যর্থ। .env.local-এ Supabase keys সঠিক কিনা দেখুন।')
      setCategories([])
      return
    }
    setCategories(Array.isArray(data) ? data : [])
  }

  function startEdit(product) {
    setEditProduct(product)
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      old_price: product.old_price || '',
      category_id: product.category_id || '',
      sizes: product.sizes || ['S', 'M', 'L', 'XL', 'XXL'],
      badge: product.badge || '',
      image_url: product.image_url || '',
      whatsapp_message: product.whatsapp_message || '',
      is_active: product.is_active,
      details: product.details || '',
      materials: product.materials || '',
      care: product.care || '',
    })
    setTab('add')
    window.scrollTo(0, 0)
  }

  function resetForm() {
    setForm(EMPTY_PRODUCT)
    setEditProduct(null)
    setImageFile(null)
  }

  async function uploadImage() {
    if (!imageFile) return form.image_url
    if (!supabase) {
      alert('Supabase সেটআপ করা হয়নি। .env.local-এ আসল URL ও anon key দিন।')
      return form.image_url
    }
    const ext = imageFile.name.split('.').pop()
    const path = `products/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('product-images').upload(path, imageFile)
    if (error) { alert('ছবি আপলোড ব্যর্থ: ' + error.message); return form.image_url }
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    return data.publicUrl
  }

  async function handleSave() {
    if (!form.name || !form.price) { setMessage('নাম এবং দাম দেওয়া আবশ্যক।'); return }
    setSaving(true)
    setMessage('')

    const imageUrl = await uploadImage()
    const payload = {
      ...form,
      price: Number(form.price),
      old_price: form.old_price ? Number(form.old_price) : null,
      image_url: imageUrl,
      category_id: form.category_id || null,
      badge: form.badge || null,
      whatsapp_message: form.whatsapp_message || form.name + ' অর্ডার করতে চাই',
      details: form.details || null,
      materials: form.materials || null,
      care: form.care || null,
    }

    const method = editProduct ? 'PATCH' : 'POST'
    if (editProduct) payload.id = editProduct.id

    const res = await fetch('/api/products', {
      method,
      headers: { 'Content-Type': 'application/json', 'x-admin-password': pw },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      setMessage(editProduct ? '✅ প্রোডাক্ট আপডেট হয়েছে!' : '✅ নতুন প্রোডাক্ট যোগ হয়েছে!')
      resetForm()
      fetchProducts()
      setTab('products')
    } else {
      const err = await res.json()
      setMessage('❌ ত্রুটি: ' + err.error)
    }
    setSaving(false)
  }

  async function toggleActive(product) {
    await fetch('/api/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': pw },
      body: JSON.stringify({ id: product.id, is_active: !product.is_active }),
    })
    fetchProducts()
  }

  async function deleteProduct(product) {
    if (!confirm(`"${product.name}" মুছে ফেলবেন?`)) return
    await fetch(`/api/products?id=${product.id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': pw },
    })
    fetchProducts()
  }

  async function addCategory() {
    if (!newCatName) return
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': pw },
      body: JSON.stringify({ name: newCatName, icon: newCatIcon }),
    })
    setNewCatName(''); setNewCatIcon('👘')
    fetchCategories()
  }

  async function deleteCategory(id) {
    if (!confirm('এই ক্যাটাগরি মুছে ফেলবেন?')) return
    await fetch(`/api/categories?id=${id}`, { method: 'DELETE', headers: { 'x-admin-password': pw } })
    fetchCategories()
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-deep border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-gold-light font-bold text-lg">Core Lab — Admin</div>
          <div className="text-white/30 text-xs">Product Management Dashboard</div>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" className="text-white/40 text-xs hover:text-white/70 transition-colors">
            🌐 সাইট দেখুন
          </a>
          <button onClick={() => { sessionStorage.removeItem('admin_pw'); router.push('/admin') }}
            className="text-xs bg-white/10 text-white/60 px-3 py-1.5 rounded hover:bg-white/20 transition-colors">
            🚪 লগআউট
          </button>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-white border-b px-6 py-3 flex gap-8">
        {[
          ['মোট প্রোডাক্ট', products.length],
          ['সক্রিয়', products.filter(p => p.is_active).length],
          ['নিষ্ক্রিয়', products.filter(p => !p.is_active).length],
          ['ক্যাটাগরি', categories.length],
        ].map(([label, count]) => (
          <div key={label} className="text-center">
            <div className="text-xl font-bold text-ink">{count}</div>
            <div className="text-muted text-xs">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white border-b px-6 flex gap-0">
        {[
          ['products', '📦 প্রোডাক্ট লিস্ট'],
          ['add', editProduct ? '✏️ প্রোডাক্ট এডিট' : '➕ নতুন প্রোডাক্ট'],
          ['categories', '🏷️ ক্যাটাগরি'],
        ].map(([key, label]) => (
          <button key={key} onClick={() => { setTab(key); if (key !== 'add') resetForm() }}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === key ? 'border-gold text-gold' : 'border-transparent text-muted hover:text-ink'
            }`}>
            {label}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {apiError && (
          <div className="mb-5 px-4 py-3 rounded-lg text-sm bg-amber-50 text-amber-900 border border-amber-200">
            ⚠️ {apiError}
          </div>
        )}

        {message && (
          <div className={`mb-5 px-4 py-3 rounded-lg text-sm ${
            message.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* ── PRODUCT LIST TAB ── */}
        {tab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <input
                type="text"
                placeholder="🔍 প্রোডাক্ট খুঁজুন..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
              <button onClick={() => setTab('add')}
                className="bg-gold text-deep px-5 py-2 rounded-lg text-sm font-bold hover:bg-gold-light transition-colors">
                ➕ নতুন প্রোডাক্ট
              </button>
            </div>

            {loading ? (
              <div className="text-center py-20 text-muted text-sm">লোড হচ্ছে...</div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs text-muted uppercase tracking-wide">প্রোডাক্ট</th>
                      <th className="text-left px-4 py-3 text-xs text-muted uppercase tracking-wide">দাম</th>
                      <th className="text-left px-4 py-3 text-xs text-muted uppercase tracking-wide">ক্যাটাগরি</th>
                      <th className="text-left px-4 py-3 text-xs text-muted uppercase tracking-wide">স্ট্যাটাস</th>
                      <th className="text-right px-4 py-3 text-xs text-muted uppercase tracking-wide">একশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-12 rounded bg-cream flex-shrink-0 overflow-hidden">
                              {product.image_url
                                ? <Image src={product.image_url} alt={product.name} width={40} height={48} className="object-cover w-full h-full" />
                                : <div className="w-full h-full flex items-center justify-center text-lg">👘</div>
                              }
                            </div>
                            <div>
                              <div className="font-medium text-ink">{product.name}</div>
                              {product.badge && (
                                <span className="text-[10px] bg-gold/10 text-gold px-1.5 py-0.5 rounded">{product.badge}</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-gold">৳{product.price}</div>
                          {product.old_price && <div className="text-xs text-muted line-through">৳{product.old_price}</div>}
                        </td>
                        <td className="px-4 py-3 text-muted text-xs">
                          {product.categories?.name || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => toggleActive(product)}
                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              product.is_active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                            {product.is_active ? '● সক্রিয়' : '○ নিষ্ক্রিয়'}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => startEdit(product)}
                              className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded hover:bg-blue-100 transition-colors">
                              ✏️ এডিট
                            </button>
                            <button onClick={() => deleteProduct(product)}
                              className="text-xs bg-red-50 text-red-500 px-3 py-1.5 rounded hover:bg-red-100 transition-colors">
                              🗑️ মুছুন
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={5} className="text-center py-12 text-muted text-sm">কোনো প্রোডাক্ট পাওয়া যায়নি</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── ADD / EDIT TAB ── */}
        {tab === 'add' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-ink mb-6">
              {editProduct ? `✏️ এডিট: ${editProduct.name}` : '➕ নতুন প্রোডাক্ট যোগ করুন'}
            </h2>

            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="label">পাঞ্জাবির নাম *</label>
                <input className="input" placeholder="যেমন: সাদা কটন পাঞ্জাবি"
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>

              {/* Description */}
              <div>
                <label className="label">বিবরণ</label>
                <input className="input" placeholder="যেমন: হালকা ওজনের, আরামদায়ক কাপড়"
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>

              {/* Price Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">বর্তমান দাম (৳) *</label>
                  <input type="number" className="input" placeholder="850"
                    value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                </div>
                <div>
                  <label className="label">আগের দাম (৳) — ঐচ্ছিক</label>
                  <input type="number" className="input" placeholder="1200"
                    value={form.old_price} onChange={e => setForm(f => ({ ...f, old_price: e.target.value }))} />
                </div>
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">ক্যাটাগরি</label>
                  <select className="input" value={form.category_id}
                    onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}>
                    <option value="">ক্যাটাগরি নেই</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">ব্যাজ</label>
                  <select className="input" value={form.badge}
                    onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}>
                    {BADGES.map(b => <option key={b} value={b}>{b || 'কোনো ব্যাজ নেই'}</option>)}
                  </select>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="label">সাইজ</label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(s => (
                    <button key={s} type="button"
                      onClick={() => setForm(f => ({
                        ...f,
                        sizes: f.sizes.includes(s) ? f.sizes.filter(x => x !== s) : [...f.sizes, s]
                      }))}
                      className={`px-3 py-1.5 rounded text-sm font-semibold border transition-all ${
                        form.sizes.includes(s)
                          ? 'bg-deep text-gold-light border-deep'
                          : 'bg-white text-muted border-gray-200 hover:border-gold'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="label">ছবি</label>
                <div className="space-y-2">
                  <input type="file" accept="image/*"
                    onChange={e => setImageFile(e.target.files[0])}
                    className="w-full text-sm text-muted file:mr-3 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gold/10 file:text-gold hover:file:bg-gold/20 cursor-pointer" />
                  <div className="text-xs text-muted">অথবা সরাসরি URL দিন:</div>
                  <input className="input" placeholder="https://example.com/image.jpg"
                    value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} />
                  {(form.image_url || imageFile) && (
                    <div className="w-20 h-24 rounded overflow-hidden bg-cream">
                      {imageFile
                        ? <img src={URL.createObjectURL(imageFile)} alt="preview" className="w-full h-full object-cover" />
                        : <img src={form.image_url} alt="preview" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                      }
                    </div>
                  )}
                </div>
              </div>

              {/* ── Accordion Fields ── */}
<div className="border-t border-gray-100 pt-5">
  <div className="text-sm font-semibold text-ink mb-4">
    📋 Accordion সেকশন (product page-এ দেখাবে)
  </div>

  <div className="space-y-4">
    <div>
      <label className="label">Details</label>
      <textarea rows={3} className="input resize-none"
        placeholder="কলার ডিজাইন, পকেট, বোতাম — যেকোনো বিস্তারিত তথ্য"
        value={form.details}
        onChange={e => setForm(f => ({ ...f, details: e.target.value }))} />
    </div>

    <div>
      <label className="label">Materials</label>
      <textarea rows={3} className="input resize-none"
        placeholder="যেমন: ১০০% কটন, ওজন ১৮০ গ্রাম/বর্গমিটার"
        value={form.materials}
        onChange={e => setForm(f => ({ ...f, materials: e.target.value }))} />
    </div>

    <div>
      <label className="label">Care Instructions</label>
      <textarea rows={3} className="input resize-none"
        placeholder="যেমন: ঠান্ডা পানিতে ধুন, রোদে না শুকান"
        value={form.care}
        onChange={e => setForm(f => ({ ...f, care: e.target.value }))} />
    </div>
  </div>
</div>

              {/* WhatsApp Message */}
              <div>
                <label className="label">WhatsApp অর্ডার মেসেজ</label>
                <input className="input" placeholder={`${form.name || 'পাঞ্জাবি'} অর্ডার করতে চাই`}
                  value={form.whatsapp_message} onChange={e => setForm(f => ({ ...f, whatsapp_message: e.target.value }))} />
                <p className="text-xs text-muted mt-1">ফাঁকা রাখলে স্বয়ংক্রিয়ভাবে সেট হবে।</p>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                  className={`relative w-12 h-6 rounded-full transition-colors ${form.is_active ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.is_active ? 'left-7' : 'left-1'}`} />
                </button>
                <span className="text-sm text-ink">{form.is_active ? 'সক্রিয় (ওয়েবসাইটে দেখাবে)' : 'নিষ্ক্রিয় (লুকানো থাকবে)'}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 bg-gold text-deep font-bold py-3 rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50 text-sm">
                  {saving ? 'সেভ হচ্ছে...' : editProduct ? '💾 আপডেট করুন' : '✅ প্রোডাক্ট যোগ করুন'}
                </button>
                <button onClick={() => { resetForm(); setTab('products') }}
                  className="px-5 py-3 bg-gray-100 text-muted rounded-lg text-sm hover:bg-gray-200 transition-colors">
                  বাতিল
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── CATEGORIES TAB ── */}
        {tab === 'categories' && (
          <div className="max-w-lg">
            <h2 className="text-xl font-bold text-ink mb-6">🏷️ ক্যাটাগরি ম্যানেজমেন্ট</h2>

            {/* Add Category */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
              <div className="text-sm font-semibold text-ink mb-4">নতুন ক্যাটাগরি যোগ করুন</div>
              <div className="flex gap-3">
                <input className="input w-16 text-center text-xl" placeholder="👘"
                  value={newCatIcon} onChange={e => setNewCatIcon(e.target.value)} />
                <input className="input flex-1" placeholder="ক্যাটাগরির নাম"
                  value={newCatName} onChange={e => setNewCatName(e.target.value)} />
                <button onClick={addCategory}
                  className="bg-gold text-deep px-4 py-2 rounded-lg font-bold text-sm hover:bg-gold-light transition-colors whitespace-nowrap">
                  ➕ যোগ করুন
                </button>
              </div>
            </div>

            {/* Category List */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {categories.length === 0 ? (
                <div className="text-center py-10 text-muted text-sm">কোনো ক্যাটাগরি নেই</div>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {categories.map(cat => (
                    <li key={cat.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
                      <span className="text-sm text-ink">{cat.icon} {cat.name}</span>
                      <button onClick={() => deleteCategory(cat.id)}
                        className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2.5 py-1 rounded transition-colors">
                        🗑️ মুছুন
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
