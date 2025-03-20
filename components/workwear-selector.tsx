"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shirt, Shield, Wind } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
// 外部ファイルからインポート
import { getRecommendations, Category, SecurityBrand, WorkwearFeature, CoolingFeature } from "@/lib/workwear-recommendations";

interface ContactInfo {
  companyName: string;
  contactPerson: string;
  email: string;
}

export default function WorkwearSelector() {
  // state定義
  const [category, setCategory] = useState<Category>(null);
  const [securityBrand, setSecurityBrand] = useState<SecurityBrand>(null);
  const [workwearFeature, setWorkwearFeature] = useState<WorkwearFeature>(null);
  const [coolingFeature, setCoolingFeature] = useState<CoolingFeature>(null);
  const [showResults, setShowResults] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    companyName: "",
    contactPerson: "",
    email: "",
  });

  // グローエフェクトの周期的な切り替え
  useEffect(() => {
    const glowInterval = setInterval(() => {
      setIsGlowing((prev) => !prev);
    }, 5000); // 3秒ごとに切り替え

    return () => clearInterval(glowInterval);
  }, []);

  // モーダルが閉じられた時にリセットする
  useEffect(() => {
    if (!isDialogOpen) {
      resetSelections();
    }
  }, [isDialogOpen]);

  // 関数定義
  const resetSelections = () => {
    setCategory(null);
    setSecurityBrand(null);
    setWorkwearFeature(null);
    setCoolingFeature(null);
    setShowResults(false);
    setShowContactForm(false);
    setContactInfo({
      companyName: "",
      contactPerson: "",
      email: "",
    });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("お問い合わせを受け付けました。担当者からご連絡いたします。");
    setIsDialogOpen(false); // モーダルを閉じる
  };

  // 現在の選択に基づいて推奨製品を取得
  const recommendations = getRecommendations(category, securityBrand, workwearFeature, coolingFeature);

  return (
    <div className="fixed-selector">
      {/* 固定ボタン */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsDialogOpen(true)}
          className={`relative overflow-hidden ${isGlowing ? "shadow-lg shadow-primary/40" : ""} transition-all duration-700`}
          style={{
            background: "linear-gradient(90deg, #3b82f6 0%, #0ea5e9 50%, #3b82f6 100%)",
            backgroundSize: "200% 100%",
            animation: "gradientShift 3s ease infinite",
          }}
          size="lg"
        >
          {/* 光るエフェクト */}
          <span className={`absolute inset-0 bg-white/20 skew-x-[-20deg] transform -translate-x-full ${isGlowing ? "animate-shine" : "opacity-0"}`}></span>
          最適な作業服を探す
        </Button>
      </div>

      {/* アニメーション用のスタイル */}
      <style jsx global>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-20deg);
          }
          100% {
            transform: translateX(200%) skewX(-20deg);
          }
        }

        .animate-shine {
          animation: shine 1s ease;
        }
      `}</style>

      {/* ダイアログ本体 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {showContactForm ? "お問い合わせ情報の入力" : showResults ? "おすすめの作業服" : "最適な作業服を探す"}
            </DialogTitle>
          </DialogHeader>

          {showContactForm ? (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-foreground font-medium">
                  会社名
                </Label>
                <Input
                  id="companyName"
                  value={contactInfo.companyName}
                  onChange={(e) => setContactInfo({ ...contactInfo, companyName: e.target.value })}
                  required
                  placeholder="例：株式会社ワークウェア"
                  className="bg-white border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson" className="text-foreground font-medium">
                  担当者名
                </Label>
                <Input
                  id="contactPerson"
                  value={contactInfo.contactPerson}
                  onChange={(e) => setContactInfo({ ...contactInfo, contactPerson: e.target.value })}
                  required
                  placeholder="例：山田 太郎"
                  className="bg-white border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  メールアドレス
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  required
                  placeholder="例：info@workwear.co.jp"
                  className="bg-white border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              <div className="space-y-3 pt-4">
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
                  送信する
                </Button>
                <div className="flex justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowContactForm(false)} className="border-gray-300">
                    戻る
                  </Button>
                </div>
              </div>
            </form>
          ) : !showResults ? (
            <div className="grid gap-4">
              {!category && (
                <div className="grid grid-cols-3 gap-4">
                  <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setCategory("workwear")}>
                    <CardHeader className="text-center">
                      <Shirt className="w-12 h-12 mx-auto mb-2" />
                      <CardTitle>作業服</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setCategory("security")}>
                    <CardHeader className="text-center">
                      <Shield className="w-12 h-12 mx-auto mb-2" />
                      <CardTitle>警備服</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setCategory("cooling")}>
                    <CardHeader className="text-center">
                      <Wind className="w-12 h-12 mx-auto mb-2" />
                      <CardTitle>空調服</CardTitle>
                    </CardHeader>
                  </Card>
                </div>
              )}

              {category === "security" && (
                <div className="grid grid-cols-2 gap-4">
                  <Card
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => {
                      setSecurityBrand("best");
                      setShowResults(true);
                    }}
                  >
                    <CardHeader>
                      <CardTitle>ベストユニフォーム</CardTitle>
                      <CardDescription>高品質・高機能な警備服</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => {
                      setSecurityBrand("kinsei");
                      setShowResults(true);
                    }}
                  >
                    <CardHeader>
                      <CardTitle>金星</CardTitle>
                      <CardDescription>コストパフォーマンスに優れた警備服</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              )}

              {category === "workwear" && (
                <div className="grid grid-cols-3 gap-4">
                  <Card
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => {
                      setWorkwearFeature("durability");
                      setShowResults(true);
                    }}
                  >
                    <CardHeader>
                      <CardTitle>耐久性重視</CardTitle>
                      <CardDescription>過酷な現場でも安心</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => {
                      setWorkwearFeature("comfort");
                      setShowResults(true);
                    }}
                  >
                    <CardHeader>
                      <CardTitle>快適性重視</CardTitle>
                      <CardDescription>長時間の作業も快適に</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => {
                      setWorkwearFeature("cost");
                      setShowResults(true);
                    }}
                  >
                    <CardHeader>
                      <CardTitle>コスト重視</CardTitle>
                      <CardDescription>リーズナブルで実用的</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              )}

              {category === "cooling" && (
                <div className="grid grid-cols-3 gap-4">
                  <Card
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => {
                      setCoolingFeature("battery");
                      setShowResults(true);
                    }}
                  >
                    <CardHeader>
                      <CardTitle>バッテリー重視</CardTitle>
                      <CardDescription>長時間の使用が可能</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => {
                      setCoolingFeature("airflow");
                      setShowResults(true);
                    }}
                  >
                    <CardHeader>
                      <CardTitle>風量重視</CardTitle>
                      <CardDescription>強力な冷却効果</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => {
                      setCoolingFeature("lightweight");
                      setShowResults(true);
                    }}
                  >
                    <CardHeader>
                      <CardTitle>軽量重視</CardTitle>
                      <CardDescription>負担の少ない着用感</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              )}

              {category && (
                <Button variant="outline" onClick={resetSelections} className="mt-4">
                  選択をリセット
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4">
                {recommendations.map((recommendation, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{recommendation}</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
              <Button
                onClick={() => setShowContactForm(true)}
                className="w-full bg-orange-400 hover:bg-orange-500 text-white text-lg font-bold shadow-md transition-all hover:shadow-lg py-3 rounded-lg"
              >
                提案を依頼
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <DialogClose asChild>
                  <Button variant="outline" className="w-full">
                    終了
                  </Button>
                </DialogClose>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowResults(false);
                    setCategory(null);
                  }}
                  className="w-full"
                >
                  選び直す
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
