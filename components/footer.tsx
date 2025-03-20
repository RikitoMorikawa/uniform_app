import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container flex flex-col items-center gap-4 py-10 md:h-24 md:flex-row md:justify-between md:py-0">
        <div className="flex items-center gap-3">
          <Image src="/favicon.png" alt="ワークウェアブログ" width={24} height={24} />
          <p className="text-sm text-gray-600 md:text-left">© 2024 ワークウェアブログ. All rights reserved.</p>
        </div>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/contact" className="text-gray-600 transition-colors hover:text-primary">
            お問い合わせ
          </Link>
          <Link href="" className="text-gray-600 transition-colors hover:text-primary">
            プライバシーポリシー
          </Link>
        </nav>
      </div>
    </footer>
  );
}
