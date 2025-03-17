import { Shirt } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center gap-4 py-10 md:h-24 md:flex-row md:justify-between md:py-0">
        <div className="flex items-center gap-4">
          <Shirt className="h-6 w-6" />
          <p className="text-sm leading-loose text-muted-foreground md:text-left">
            © 2024 ワークウェアブログ. All rights reserved.
          </p>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/contact" className="transition-colors hover:text-foreground/80 text-foreground/60">
            お問い合わせ
          </Link>
          <Link href="/privacy-policy" className="transition-colors hover:text-foreground/80 text-foreground/60">
            プライバシーポリシー
          </Link>
        </nav>
      </div>
    </footer>
  )
}