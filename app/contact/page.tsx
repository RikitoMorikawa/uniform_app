"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { ContactFormData } from "@/types/contact"; // 型定義がある場合
import SuccessDialog from "@/components/SuccessDialog";

const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "会社名は2文字以上で入力してください。",
  }),
  department: z.string().optional(),
  name: z.string().min(2, {
    message: "お名前は2文字以上で入力してください。",
  }),
  email: z.string().email({
    message: "有効なメールアドレスを入力してください。",
  }),
  phone: z.string().min(10, {
    message: "電話番号を正しく入力してください。",
  }),
  postalCode: z.string().min(7, {
    message: "郵便番号を正しく入力してください。",
  }),
  address: z.string().min(5, {
    message: "住所を入力してください。",
  }),
  purpose: z.string({
    required_error: "目的を選択してください。",
  }),
  quantity: z.string().optional(),
  preferredColors: z.string().optional(),
  preferredMaterials: z.string().optional(),
  needsConsultation: z.boolean().default(false),
  message: z.string().min(10, {
    message: "お問い合わせ内容は10文字以上で入力してください。",
  }),
});

const purposes = [
  { value: "purchase", label: "購入を検討" },
  { value: "bulk", label: "まとめ買いを検討" },
  { value: "custom", label: "カスタマイズ製品の相談" },
  { value: "info", label: "製品について質問" },
  { value: "other", label: "その他" },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      department: "",
      name: "",
      email: "",
      phone: "",
      postalCode: "",
      address: "",
      purpose: "",
      quantity: "",
      preferredColors: "",
      preferredMaterials: "",
      needsConsultation: false,
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);

      // APIルートを呼び出し
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (result.success) {
        // 成功メッセージをセット
        setSuccessMessage(result.message || "お問い合わせを受け付けました。担当者から数日以内にご連絡いたします。");
        // 成功ダイアログを表示
        setShowSuccessDialog(true);
        // フォームをリセット
        form.reset();
      } else {
        throw new Error(result.error || "エラーが発生しました。");
      }
    } catch (error: any) {
      toast.error(`エラーが発生しました。${error.message || "もう一度お試しください。"}`);
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">お問い合わせ</CardTitle>
          <CardDescription className="text-lg mt-2">製品に関するご質問やご相談を承ります</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>会社名</FormLabel>
                      <FormControl>
                        <Input placeholder="株式会社〇〇" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>部署名</FormLabel>
                      <FormControl>
                        <Input placeholder="総務部" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>担当者名</FormLabel>
                      <FormControl>
                        <Input placeholder="山田 太郎" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>メールアドレス</FormLabel>
                      <FormControl>
                        <Input placeholder="taro.yamada@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>電話番号</FormLabel>
                      <FormControl>
                        <Input placeholder="03-1234-5678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>郵便番号</FormLabel>
                      <FormControl>
                        <Input placeholder="1230001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>住所</FormLabel>
                    <FormControl>
                      <Input placeholder="東京都〇〇区〇〇1-2-3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>お問い合わせ目的</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="目的を選択してください" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {purposes.map((purpose) => (
                          <SelectItem key={purpose.value} value={purpose.value}>
                            {purpose.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>希望数量</FormLabel>
                      <FormControl>
                        <Input placeholder="例: 100着" {...field} />
                      </FormControl>
                      <FormDescription>具体的な数量が決まっていない場合は空欄で構いません</FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferredColors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>希望カラー</FormLabel>
                      <FormControl>
                        <Input placeholder="例: ネイビー、ブラック" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="preferredMaterials"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>希望素材</FormLabel>
                    <FormControl>
                      <Input placeholder="例: 綿100%、ポリエステル混紡" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="needsConsultation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>専門スタッフからの提案を希望する</FormLabel>
                      <FormDescription>チェックを入れると、当社の専門スタッフから最適な商品のご提案をさせていただきます</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>お問い合わせ内容</FormLabel>
                    <FormControl>
                      <Textarea placeholder="ご要望やご質問の詳細をご記入ください" className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "送信中..." : "送信する"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* 成功ダイアログ */}
      <SuccessDialog isOpen={showSuccessDialog} onClose={() => setShowSuccessDialog(false)} message={successMessage} />
    </div>
  );
}
