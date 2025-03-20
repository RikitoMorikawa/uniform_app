import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container flex flex-col items-center gap-4 py-10 md:h-24 md:flex-row md:justify-between md:py-0">
        <div className="flex flex-col items-center md:flex-row md:items-center md:gap-3">
          <div className="flex items-center gap-2 mb-2 md:mb-0">
            <Image src="/favicon.png" alt="ユニフォームナビ" width={24} height={24} />
            <span className="font-medium text-gray-700">ユニフォームナビ</span>
          </div>
          <p className="text-xs text-gray-500 md:ml-2">
            <span className="hidden md:inline">|</span> 現場のチカラ - 作業服情報サイト
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/contact" className="text-gray-600 transition-colors hover:text-primary">
              お問い合わせ
            </Link>
            <Link href="/" className="text-gray-600 transition-colors hover:text-primary">
              プライバシーポリシー
            </Link>
          </nav>
          <p className="text-xs text-gray-500">© 2024 ユニフォームナビ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
