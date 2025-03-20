// components/search-bar.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Calendar, Tag as TagIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ja } from "date-fns/locale";

const categories = [
  { value: "all", label: "すべて" },
  { value: "workwear", label: "作業服" },
  { value: "coolingwear", label: "空調服" },
  { value: "securitywear", label: "警備服" },
];

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [title, setTitle] = useState(searchParams.get("title") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [date, setDate] = useState<Date | undefined>(
    searchParams.get("date") ? new Date(searchParams.get("date")!) : undefined
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (title) params.set("title", title);
    if (category !== "all") params.set("category", category);
    if (date) params.set("date", format(date, "yyyy-MM-dd"));

    router.push(`/?${params.toString()}`);
  };

  const handleReset = () => {
    setTitle("");
    setCategory("all");
    setDate(undefined);
    router.push("/");
  };

  return (
    <div className="bg-card rounded-lg p-4 shadow-lg border border-primary/5">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="記事タイトルで検索" value={title} onChange={(e) => setTitle(e.target.value)} className="pl-9 bg-white" />
            </div>
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[140px] bg-white">
              <SelectValue placeholder="カテゴリー" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-[140px] justify-start text-left font-normal bg-white", !date && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "yyyy年MM月dd日", { locale: ja }) : "日付を選択"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleReset}>
            リセット
          </Button>
          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            検索
          </Button>
        </div>
      </div>
    </div>
  );
}