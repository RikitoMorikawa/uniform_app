// lib/workwear-recommendations.ts

// 型定義
export type Category = "workwear" | "security" | "cooling" | null;
export type SecurityBrand = "best" | "kinsei" | null;
export type WorkwearFeature = "durability" | "comfort" | "cost" | null;
export type CoolingFeature = "battery" | "airflow" | "lightweight" | null;

// 推奨製品を取得する関数
export const getRecommendations = (
  category: Category,
  securityBrand: SecurityBrand,
  workwearFeature: WorkwearFeature,
  coolingFeature: CoolingFeature
): string[] => {
  if (category === "security") {
    return securityBrand === "best"
      ? ["ベストユニフォーム 警備服Aシリーズ", "ベストユニフォーム プロフェッショナルライン"]
      : ["金星 警備服プレミアム", "金星 オールシーズンモデル"];
  }

  if (category === "workwear") {
    switch (workwearFeature) {
      case "durability":
        return ["タカヤ 耐久王シリーズ", "自重堂 Z-DRAGON", "寅壱 プロフェッショナル"];
      case "comfort":
        return ["バートル エアークラフト", "アイトス 快適作業服", "クロダルマ AIR SERIES"];
      case "cost":
        return ["桑和 VALUE SERIES", "アタックベース エコノミー", "コーコス 現場職人"];
      default:
        return [];
    }
  }

  if (category === "cooling") {
    switch (coolingFeature) {
      case "battery":
        return ["空調服 バッテリー重視モデル", "サンエス 長時間稼働タイプ", "村上被服 大容量バッテリー"];
      case "airflow":
        return ["空調服 風量重視モデル", "サンエス パワフルエアー", "村上被服 ターボファン"];
      case "lightweight":
        return ["空調服 軽量モデル", "サンエス フェザーライト", "村上被服 ウルトラライト"];
      default:
        return [];
    }
  }

  return [];
};
