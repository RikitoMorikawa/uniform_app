import { Category, SecurityBrand, WorkwearFeature, CoolingFeature, CoolingType } from "@/lib/enums";

/**
 * カテゴリと選択された特徴に基づいて推奨製品のリストを返す関数
 */
export function getRecommendations(
  category: Category,
  securityBrand: SecurityBrand,
  workwearFeature: WorkwearFeature,
  coolingFeature: CoolingFeature,
  coolingType?: CoolingType
): string[] {
  if (category === "workwear") {
    if (workwearFeature === "premium") {
      return ["ジーベック", "アイトス", "コーコス信岡"];
    } else if (workwearFeature === "cost") {
      return ["自重堂", "シンメン", "桑和"];
    } else if (workwearFeature === "style") {
      return ["バートル", "ジーベック", "TSデザイン"];
    }
  } else if (category === "security") {
    return ["ベスト"];
  } else if (category === "cooling") {
    if (coolingFeature === "battery") {
      return ["バートル", "村上被服", "ジーベック"];
    } else if (coolingFeature === "airflow") {
      return ["バートル", "桑和", "村上被服"];
    } else if (coolingFeature === "cost") {
      return ["バートル", "アイトス", "シンメン"];
    }
  }

  // デフォルト（選択がない場合）
  return ["選択条件に合った製品をご提案いたします", "お客様のご要望に応じてカスタマイズも可能です", "お問い合わせいただければ、詳細な製品情報をご案内します"];
}
