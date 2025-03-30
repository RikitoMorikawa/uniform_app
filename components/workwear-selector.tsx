"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shirt, Shield, Wind, Sun, Snowflake, Star, DollarSign, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getRecommendations } from "@/lib/workwear-recommendations";
import { Category, SecurityBrand, WorkwearFeature, CoolingFeature, CoolingType, Season } from "@/lib/enums";
import SuccessDialog from "@/components/SuccessDialog";
import ConsentSection from "@/components/ConsentSection";
import { Textarea } from "./ui/textarea";

interface ContactInfo {
  companyName: string;
  contactPerson: string;
  email: string;
  comments: string;
}

export default function WorkwearAdvisor() {
  // 状態管理
  const [category, setCategory] = useState<Category>(null);
  const [season, setSeason] = useState<Season>(null);
  const [coolingType, setCoolingType] = useState<CoolingType>(null);
  const [securityBrand, setSecurityBrand] = useState<SecurityBrand>(null);
  const [workwearFeature, setWorkwearFeature] = useState<WorkwearFeature>(null);
  const [coolingFeature, setCoolingFeature] = useState<CoolingFeature>(null);
  const [showResults, setShowResults] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    companyName: "",
    contactPerson: "",
    email: "",
    comments: "",
  });
  const [isMobile, setIsMobile] = useState(false);

  // 同意チェックボックスのstate
  const [isAgreed, setIsAgreed] = useState(false);

  // 光るエフェクト
  useEffect(() => {
    const glowInterval = setInterval(() => {
      setIsGlowing((prev) => !prev);
    }, 5000);

    return () => clearInterval(glowInterval);
  }, []);

  // レスポンシブ対応のためのウィンドウサイズ検出
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // 初期化時に一度実行
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ダイアログが閉じたときにリセット
  useEffect(() => {
    if (!isDialogOpen) {
      resetSelections();
    }
  }, [isDialogOpen]);

  const resetSelections = () => {
    setCategory(null);
    setSeason(null);
    setCoolingType(null);
    setSecurityBrand(null);
    setWorkwearFeature(null);
    setCoolingFeature(null);
    setShowResults(false);
    setShowContactForm(false);
    setIsAgreed(false);
    setContactInfo({
      companyName: "",
      contactPerson: "",
      email: "",
      comments: "",
    });
  };

  const recommendations = getRecommendations(category, securityBrand, workwearFeature, coolingFeature, coolingType);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!isAgreed) {
      toast.error("個人情報の取り扱いに同意してください");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/workwear_recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...contactInfo,
          category,
          season,
          coolingType,
          securityBrand,
          workwearFeature,
          coolingFeature,
          recommendations: recommendations || [],
          consent: isAgreed,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "お問い合わせの送信に失敗しました");
      }

      setSuccessMessage("お問い合わせを受け付けました。担当者から数日以内にご連絡いたします。");
      setIsDialogOpen(false);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("問い合わせ送信エラー:", error);
      toast.error(error instanceof Error ? error.message : "エラーが発生しました。後でもう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 季節選択のレンダリング
  const renderSeasonSelection = () => (
    <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-4`}>
      <Card
        className="cursor-pointer hover:scale-105 transition-all hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-amber-50 to-orange-50"
        onClick={() => {
          setSeason("summer");
        }}
      >
        <CardHeader className="text-center">
          <Sun className="w-12 h-12 mx-auto mb-2 text-orange-500" />
          <CardTitle className="text-orange-700">夏用</CardTitle>
          <CardDescription>暑さ対策重視の夏向けモデル</CardDescription>
        </CardHeader>
      </Card>
      <Card
        className="cursor-pointer hover:scale-105 transition-all hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-blue-50 to-indigo-50"
        onClick={() => {
          setSeason("all");
        }}
      >
        <CardHeader className="text-center">
          <Snowflake className="w-12 h-12 mx-auto mb-2 text-blue-500" />
          <CardTitle className="text-blue-700">通年用</CardTitle>
          <CardDescription>オールシーズン対応モデル</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );

  // 空調服タイプ選択のレンダリング
  const renderCoolingTypeSelection = () => (
    <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-3"} gap-4`}>
      <Card
        className="cursor-pointer hover:scale-105 transition-all hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-purple-50 to-violet-50"
        onClick={() => {
          setCoolingType("vest");
        }}
      >
        <CardHeader className="text-center">
          <Wind className="w-12 h-12 mx-auto mb-2 text-purple-500" />
          <CardTitle className="text-purple-700">ベスト</CardTitle>
          <CardDescription>動きやすいベストタイプ</CardDescription>
        </CardHeader>
      </Card>
      <Card
        className="cursor-pointer hover:scale-105 transition-all hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-cyan-50 to-blue-50"
        onClick={() => {
          setCoolingType("short");
        }}
      >
        <CardHeader className="text-center">
          <Wind className="w-12 h-12 mx-auto mb-2 text-cyan-500" />
          <CardTitle className="text-cyan-700">半袖</CardTitle>
          <CardDescription>腕まわりも涼しく快適</CardDescription>
        </CardHeader>
      </Card>
      <Card
        className="cursor-pointer hover:scale-105 transition-all hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-emerald-50 to-green-50"
        onClick={() => {
          setCoolingType("long");
        }}
      >
        <CardHeader className="text-center">
          <Wind className="w-12 h-12 mx-auto mb-2 text-emerald-500" />
          <CardTitle className="text-emerald-700">長袖</CardTitle>
          <CardDescription>紫外線対策も万全</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );

  return (
    <div className="fixed-selector">
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
          <span className={`absolute inset-0 bg-white/20 skew-x-[-20deg] transform -translate-x-full ${isGlowing ? "animate-shine" : "opacity-0"}`}></span>
          あなたにピッタリの作業着を見つける
        </Button>
      </div>

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

        /* モバイル対応のスクロール設定 */
        .dialog-scrollable {
          max-height: 85vh;
          overflow-y: auto;
          padding-bottom: 20px;
        }
      `}</style>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gradient-to-b from-white to-gray-50 p-0">
          <div className="dialog-scrollable">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="text-2xl text-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-600 to-primary">
                {showContactForm ? "お見積り・問い合わせ情報の入力" : showResults ? "プロが厳選！おすすめウェア" : "最適な作業着を探そう"}
              </DialogTitle>
            </DialogHeader>

            <div className="px-6 pb-6">
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
                      placeholder="例：株式会社ワークスタイル"
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
                      placeholder="例：田中 太郎"
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
                      placeholder="例：info@workstyle.co.jp"
                      className="bg-white border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comments" className="text-foreground font-medium">
                      お問い合わせ内容・ご要望
                    </Label>
                    <Textarea
                      id="comments"
                      value={contactInfo.comments}
                      onChange={(e) => setContactInfo({ ...contactInfo, comments: e.target.value })}
                      placeholder="ご質問やご要望があればご記入ください"
                      className="bg-white border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary transition-colors min-h-[100px]"
                    />
                  </div>

                  <ConsentSection isAgreed={isAgreed} setIsAgreed={setIsAgreed} />

                  <div className="space-y-3 pt-4">
                    <Button
                      type="submit"
                      className={`w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all ${
                        !isAgreed && "opacity-50 cursor-not-allowed"
                      }`}
                      disabled={isSubmitting || !isAgreed}
                    >
                      {isSubmitting ? "送信中..." : "送信"}
                    </Button>
                    <div className="flex justify-end">
                      <Button type="button" variant="outline" onClick={() => setShowContactForm(false)} className="border-gray-300 hover:bg-gray-100">
                        戻る
                      </Button>
                    </div>
                  </div>
                </form>
              ) : !showResults ? (
                <div className="grid gap-4">
                  {!category && (
                    <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-3"} gap-4`}>
                      <Card
                        className="cursor-pointer hover:scale-105 transition-all hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-blue-50 to-indigo-50"
                        onClick={() => setCategory("workwear")}
                      >
                        <CardHeader className="text-center">
                          <Shirt className="w-12 h-12 mx-auto mb-2 text-blue-600" />
                          <CardTitle className="text-blue-700">作業服</CardTitle>
                        </CardHeader>
                      </Card>
                      <Card
                        className="cursor-pointer hover:scale-105 transition-all hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-slate-50 to-gray-100"
                        onClick={() => setCategory("security")}
                      >
                        <CardHeader className="text-center">
                          <Shield className="w-12 h-12 mx-auto mb-2 text-slate-700" />
                          <CardTitle className="text-slate-800">警備服</CardTitle>
                        </CardHeader>
                      </Card>
                      <Card
                        className="cursor-pointer hover:scale-105 transition-all hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-cyan-50 to-sky-100"
                        onClick={() => setCategory("cooling")}
                      >
                        <CardHeader className="text-center">
                          <Wind className="w-12 h-12 mx-auto mb-2 text-cyan-600" />
                          <CardTitle className="text-cyan-700">空調服</CardTitle>
                        </CardHeader>
                      </Card>
                    </div>
                  )}

                  {category === "cooling" && !coolingType && renderCoolingTypeSelection()}

                  {(category === "workwear" || category === "security") && !season && renderSeasonSelection()}

                  {category === "security" && season && (
                    <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-4`}>
                      <Card
                        className="cursor-pointer hover:scale-105 transition-all hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-gray-50 to-slate-100"
                        onClick={() => {
                          setSecurityBrand("best1");
                          setShowResults(true);
                        }}
                      >
                        <CardHeader>
                          <CardTitle className="text-slate-800">プレミアムライン</CardTitle>
                          <CardDescription>高品質・高機能なセキュリティウェア</CardDescription>
                        </CardHeader>
                      </Card>
                      <Card
                        className="cursor-pointer hover:scale-105 transition-all hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-blue-50 to-indigo-100"
                        onClick={() => {
                          setSecurityBrand("best2");
                          setShowResults(true);
                        }}
                      >
                        <CardHeader>
                          <CardTitle className="text-blue-800">スタンダードライン</CardTitle>
                          <CardDescription>コストパフォーマンスに優れた警備服</CardDescription>
                        </CardHeader>
                      </Card>
                    </div>
                  )}

                  {category === "workwear" && season && (
                    <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-3"} gap-4`}>
                      <Card
                        className="cursor-pointer hover:scale-105 transition-all hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-indigo-50 to-violet-100"
                        onClick={() => {
                          setWorkwearFeature("premium");
                          setShowResults(true);
                        }}
                      >
                        <CardHeader>
                          <CardTitle className="text-indigo-800">高機能重視</CardTitle>
                          <CardDescription>最新テクノロジー素材採用</CardDescription>
                          <Star className="w-8 h-8 mx-auto mt-2 text-indigo-500" />
                        </CardHeader>
                      </Card>
                      <Card
                        className="cursor-pointer hover:scale-105 transition-all hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-green-50 to-emerald-100"
                        onClick={() => {
                          setWorkwearFeature("cost");
                          setShowResults(true);
                        }}
                      >
                        <CardHeader>
                          <CardTitle className="text-emerald-800">安さ重視</CardTitle>
                          <CardDescription>コスト重視で大量導入向け</CardDescription>
                          <DollarSign className="w-8 h-8 mx-auto mt-2 text-emerald-500" />
                        </CardHeader>
                      </Card>
                      <Card
                        className="cursor-pointer hover:scale-105 transition-all hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-rose-50 to-red-100"
                        onClick={() => {
                          setWorkwearFeature("style");
                          setShowResults(true);
                        }}
                      >
                        <CardHeader>
                          <CardTitle className="text-rose-800">カッコよさ重視</CardTitle>
                          <CardDescription>デザイン性の高いモデル</CardDescription>
                          <Heart className="w-8 h-8 mx-auto mt-2 text-rose-500" />
                        </CardHeader>
                      </Card>
                    </div>
                  )}

                  {category === "cooling" && coolingType && (
                    <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-3"} gap-4`}>
                      <Card
                        className="cursor-pointer hover:scale-105 transition-all hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-purple-50 to-indigo-100"
                        onClick={() => {
                          setCoolingFeature("battery");
                          setShowResults(true);
                        }}
                      >
                        <CardHeader>
                          <CardTitle className="text-indigo-800">持続力重視</CardTitle>
                          <CardDescription>長時間稼働可能なバッテリー</CardDescription>
                        </CardHeader>
                      </Card>
                      <Card
                        className="cursor-pointer hover:scale-105 transition-all hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-cyan-50 to-blue-100"
                        onClick={() => {
                          setCoolingFeature("airflow");
                          setShowResults(true);
                        }}
                      >
                        <CardHeader>
                          <CardTitle className="text-blue-800">風量重視</CardTitle>
                          <CardDescription>強力なファンシステム搭載</CardDescription>
                        </CardHeader>
                      </Card>
                      <Card
                        className="cursor-pointer hover:scale-105 transition-all hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-teal-50 to-emerald-100"
                        onClick={() => {
                          setCoolingFeature("cost");
                          setShowResults(true);
                        }}
                      >
                        <CardHeader>
                          <CardTitle className="text-emerald-800">安さ重視</CardTitle>
                          <CardDescription>コスト重視で大量導入向け</CardDescription>
                        </CardHeader>
                      </Card>
                    </div>
                  )}

                  {category && (
                    <Button variant="outline" onClick={resetSelections} className="mt-4 hover:bg-gray-100 transition-colors">
                      選択をリセット
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {recommendations.map((recommendation, index) => (
                      <Card key={index} className="bg-gradient-to-r from-white to-gray-50 hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-gray-800 text-sm">{recommendation}</CardTitle>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                  <Button
                    onClick={() => setShowContactForm(true)}
                    className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white text-lg font-bold shadow-md transition-all hover:shadow-lg py-3 rounded-lg"
                  >
                    提案を希望する
                  </Button>
                  <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-2`}>
                    <DialogClose asChild>
                      <Button variant="outline" className="w-full hover:bg-gray-100">
                        終了
                      </Button>
                    </DialogClose>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowResults(false);
                        setCategory(null);
                        setSeason(null);
                        setCoolingType(null);
                      }}
                      className="w-full hover:bg-gray-100"
                    >
                      選び直す
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SuccessDialog isOpen={showSuccessDialog} onClose={() => setShowSuccessDialog(false)} message={successMessage} />
    </div>
  );
}
