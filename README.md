# রাজকীয় পাঞ্জাবি — সম্পূর্ণ সেটআপ গাইড

## এই প্রজেক্টে কী আছে?
- **Next.js 14** 
- **Supabase** 
- **Admin Panel**

---

## ধাপ ১ — Supabase সেটআপ

1. https://supabase.com এ ফ্রি অ্যাকাউন্ট খুলুন
2. "New Project" তৈরি করুন
3. Dashboard > **SQL Editor** এ যান

---

## ধাপ ২ — লোকাল সেটআপ

```bash
# প্রজেক্ট ফোল্ডারে যান
cd punjabi-store

# Dependencies ইন্সটল করুন
npm install

```bash
# লোকালে চালু করুন
npm run dev
# → http://localhost:3000
```

---

## ধাপ ৩ — Vercel-এ ফ্রি Deploy

1. https://github.com এ ফ্রি অ্যাকাউন্ট খুলুন
2. এই ফোল্ডারটি GitHub-এ push করুন
3. https://vercel.com এ GitHub দিয়ে লগইন করুন
4. "Import Project" করুন
5. **Environment Variables** সেকশনে `.env.local` এর সব ভ্যালু যোগ করুন
6. Deploy করুন — ফ্রিতে লাইভ হবে! 


## ফাইল স্ট্রাকচার

```
punjabi-store/
├── app/
│   ├── page.js              ← মূল স্টোর পেইজ
│   ├── admin/
│   │   ├── page.js          ← Admin লগইন
│   │   └── dashboard/
│   │       └── page.js      ← Admin Dashboard
│   └── api/
│       ├── products/route.js ← Products API
│       └── categories/route.js
├── lib/
│   └── supabase.js          ← Supabase Client
├── supabase/
│   └── schema.sql           ← Database Schema
└── .env.local               ← আপনার Config
```

---

## সমস্যা হলে

- `npm install` এরর → Node.js 18+ ইন্সটল করুন
- Supabase এরর → `.env.local` এর key ঠিকমতো দিয়েছেন কিনা চেক করুন
- ছবি আপলোড হচ্ছে না → Supabase Storage bucket `product-images` আছে কিনা দেখুন

---
