import { Noto_Serif_Bengali } from 'next/font/google'
import './globals.css'

const bengali = Noto_Serif_Bengali({
  subsets: ['bengali'],
  weight: ['400', '600', '700'],
  variable: '--font-bengali',
  display: 'swap',
})

export const metadata = {
  title: 'Core Lab — সেরা মানের পাঞ্জাবি কালেকশন',
  description: 'হাতে বাছাই করা কাপড়, অনন্য ডিজাইন এবং নিখুঁত সেলাই। WhatsApp ও Facebook-এ অর্ডার করুন।',
  icons: {
    icon: '/corelab.jpg',
    apple: '/corelab.jpg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body className={`${bengali.variable} font-bengali bg-cream text-ink antialiased`}>
        {children}
      </body>
    </html>
  )
}
