"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, PenSquare } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="flex items-center space-x-2">
            <Image src="/favicon.png" alt="ユニフォームナビ" width={36} height={36} />
            <div className="flex flex-col">
              <span className="font-bold text-gray-800">ユニフォームナビ</span>
              <span className="text-xs text-gray-500 hidden sm:inline">現場のチカラ - 作業服情報サイト</span>
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/" ? "text-primary font-semibold" : "text-gray-600"}`}
          >
            ホーム
          </Link>
          <Link
            href="/posts/new"
            className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5 ${
              pathname === "/posts/new" ? "text-primary font-semibold" : "text-gray-600"
            }`}
          >
            <PenSquare className="h-4 w-4" />
            投稿する
          </Link>
          <Link
            href="/contact"
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/contact" ? "text-primary font-semibold" : "text-gray-600"}`}
          >
            お問い合わせ
          </Link>
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100">
              <Menu className="h-5 w-5" />
              <span className="sr-only">メニュー</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-gray-200">
            <DropdownMenuItem asChild className="text-gray-700 focus:bg-gray-50 focus:text-primary">
              <Link href="/">ホーム</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="text-gray-700 focus:bg-gray-50 focus:text-primary">
              <Link href="/posts/new">投稿する</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="text-gray-700 focus:bg-gray-50 focus:text-primary">
              <Link href="/contact">お問い合わせ</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
