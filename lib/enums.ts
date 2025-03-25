/**
 * 作業着関連の型定義と日本語表示のマッピング
 */

// 内部コード用の型定義
export type Category = "workwear" | "security" | "cooling" | null;
export type SecurityBrand = "best1" | "best2" | null;
export type WorkwearFeature = "premium" | "cost" | "style" | null;
export type CoolingFeature = "battery" | "airflow" | "cost" | null;
export type CoolingType = "vest" | "short" | "long" | null;
export type Season = "all" | "summer" | null;

// 日本語マッピング - 内部コードから日本語表示への変換マップ
export const CategoryJa = {
  workwear: "作業服",
  security: "警備服",
  cooling: "空調服",
} as const;

export const SecurityBrandJa = {
  best1: "プレミアムライン",
  best2: "スタンダードライン",
} as const;

export const WorkwearFeatureJa = {
  premium: "高機能重視",
  cost: "安さ重視",
  style: "カッコよさ重視",
} as const;

export const CoolingFeatureJa = {
  battery: "持続力重視",
  airflow: "風量重視",
  cost: "安さ重視",
} as const;

export const CoolingTypeJa = {
  vest: "ベスト",
  short: "半袖",
  long: "長袖",
} as const;

export const SeasonJa = {
  all: "通年用",
  summer: "夏用",
} as const;

// 選択されたカテゴリに応じた特徴を日本語に変換する関数
export function getSelectedFeatureJa(
  category: Category,
  securityBrand: SecurityBrand,
  workwearFeature: WorkwearFeature,
  coolingFeature: CoolingFeature
): string {
  if (category === "workwear" && workwearFeature) {
    return WorkwearFeatureJa[workwearFeature] || "未指定";
  } else if (category === "security" && securityBrand) {
    return SecurityBrandJa[securityBrand] || "未指定";
  } else if (category === "cooling" && coolingFeature) {
    return CoolingFeatureJa[coolingFeature] || "未指定";
  }
  return "未指定";
}

/**
 * 内部コードを日本語に変換する関数
 * @param type 変換する項目の種類
 * @param value 変換する値（内部コード）
 * @returns 日本語表示
 */
export function toJapanese(type: "category" | "securityBrand" | "workwearFeature" | "coolingFeature" | "coolingType" | "season", value: string | null): string {
  if (!value) return "未指定";

  switch (type) {
    case "category":
      return CategoryJa[value as keyof typeof CategoryJa] || "未指定";
    case "securityBrand":
      return SecurityBrandJa[value as keyof typeof SecurityBrandJa] || "未指定";
    case "workwearFeature":
      return WorkwearFeatureJa[value as keyof typeof WorkwearFeatureJa] || "未指定";
    case "coolingFeature":
      return CoolingFeatureJa[value as keyof typeof CoolingFeatureJa] || "未指定";
    case "coolingType":
      return CoolingTypeJa[value as keyof typeof CoolingTypeJa] || "未指定";
    case "season":
      return SeasonJa[value as keyof typeof SeasonJa] || "未指定";
    default:
      return "未指定";
  }
}
