"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shirt, Menu, PenSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Shirt className="h-6 w-6" />
          <span className="font-bold">ワークウェアブログ</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            ホーム
          </Link>
          <Link 
            href="/posts/new" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/posts/new" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Button variant="outline" size="sm" className="gap-2">
              <PenSquare className="h-4 w-4" />
              投稿する
            </Button>
          </Link>
          <Link 
            href="/contact" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/contact" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            お問い合わせ
          </Link>
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">メニュー</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/">ホーム</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/posts/new">投稿する</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/contact">お問い合わせ</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}