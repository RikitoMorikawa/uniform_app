// ConsentSection.tsx
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ConsentSectionProps {
  isAgreed: boolean;
  setIsAgreed: (value: boolean) => void;
}

export default function ConsentSection({ isAgreed, setIsAgreed }: ConsentSectionProps) {
  return (
    <div className="space-y-4 mt-4">
      <div className="border rounded-lg bg-gray-50">
        <ScrollArea className="h-36 rounded-md p-4">
          <div className="space-y-4 text-sm text-gray-600">
            <p className="font-medium">【個人情報の取り扱いについて】</p>
            <p>
              1.
              本サービスは、ワークウェアプロが運営する作業服の情報提供サイトです。お客様からいただいた個人情報は、適切に管理し、提携している作業服専門業者への取次ぎおよび以下に記載する目的のためにのみ利用させていただきます。
            </p>
            <p>
              2. ご提供いただいた個人情報は、以下の目的でのみ使用いたします：
              <br />
              ・作業服専門業者からの見積もり・サンプル提供
              <br />
              ・関連する商品やサービスのご案内
              <br />
              ・お問い合わせへの回答やご連絡
              <br />
              ・サービス品質向上のための統計データ作成（個人を特定しない形で使用）
              <br />
              ・その他、お客様との取引・契約を適切に行うために必要な業務
            </p>
            <p>3. お客様の個人情報は、法令に基づく場合を除き、お客様の同意なく第三者（提携作業服専門業者を除く）に提供することはありません。</p>
            <p>
              4.
              個人情報の取り扱いに関するお問い合わせや、個人情報の開示・訂正・削除のご要望は、当サイトのお問い合わせフォームよりご連絡ください。お客様からのご要望には、法令に従い、迅速かつ適切に対応いたします。
            </p>
            <p>5. 本規約に同意いただけない場合は、サービスをご利用いただけません。なお、同意後も、法令の範囲内でいつでも同意を撤回することが可能です。</p>
          </div>
        </ScrollArea>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="consent" checked={isAgreed} onCheckedChange={(checked) => setIsAgreed(checked as boolean)} />
        <Label htmlFor="consent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          上記の個人情報取扱いについて確認し、同意します
        </Label>
      </div>
    </div>
  );
}
