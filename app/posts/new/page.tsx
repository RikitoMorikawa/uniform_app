"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "タイトルは5文字以上で入力してください。",
  }),
  category: z.string({
    required_error: "カテゴリーを選択してください。",
  }),
});

const categories = [
  { value: "workwear", label: "作業服" },
  { value: "coolingwear", label: "空調服" },
  { value: "securitywear", label: "警備服" },
];

export default function NewPostPage() {
  const [content, setContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // ページ読み込み時にモーダルを表示
  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // ここで投稿データを送信する処理を実装
      console.log({ ...values, content });
      toast.success("記事を投稿しました。");
      form.reset();
      setContent("");
    } catch (error) {
      toast.error("エラーが発生しました。もう一度お試しください。");
    }
  }

  return (
    <div className="container py-8 max-w-4xl">
      {/* 改修中モーダル */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">改修中のお知らせ</DialogTitle>
            <DialogDescription className="pt-4 text-base">申し訳ありませんが、投稿機能は現在改修中です。準備が整い次第ご利用いただけます。</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center sm:justify-center mt-4">
            <Button
              onClick={() => {
                setIsModalOpen(false);
                router.push("/");
              }}
              className="w-full"
            >
              トップページに戻る
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <h1 className="text-3xl font-bold mb-8">新規投稿</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>タイトル</FormLabel>
                <FormControl>
                  <Input className="bg-white" placeholder="記事のタイトルを入力" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>カテゴリー</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="カテゴリーを選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <FormLabel>本文</FormLabel>
            <div data-color-mode="light">
              <MDEditor value={content} onChange={(value) => setContent(value || "")} height={400} preview="edit" />
            </div>
          </div>
          <Button type="submit" className="w-full md:w-auto">
            投稿する
          </Button>
        </form>
      </Form>
    </div>
  );
}
