import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/mongodb";
import { sendWorkwearInquiryNotification } from "@/lib/email/workwear_recommend/email-service";
import { toJapanese, getSelectedFeatureJa } from "@/lib/enums";

export async function POST(req: NextRequest) {
  try {
    // リクエストボディを取得
    const body = await req.json();

    // 必要なデータが揃っているか確認
    const {
      companyName,
      contactPerson,
      email,
      category,
      season,
      coolingType,
      securityBrand,
      workwearFeature,
      coolingFeature,
      recommendations,
      comments, // コメント欄を追加
      consent, // 同意フラグ
    } = body;

    if (!companyName || !contactPerson || !email) {
      return NextResponse.json({ message: "必須項目が入力されていません" }, { status: 400 });
    }

    // 同意確認
    if (!consent) {
      return NextResponse.json({ message: "個人情報の取り扱いに同意していただく必要があります" }, { status: 400 });
    }

    // 現在の日時を取得
    const createdAt = new Date();

    // 日本語に変換
    const categoryJa = toJapanese("category", category);

    // 季節情報の処理
    let seasonJa = "未指定";
    if (category === "workwear" || category === "security") {
      seasonJa = toJapanese("season", season);
    }

    // 空調服タイプの処理
    let coolingTypeJa = "未指定";
    if (category === "cooling") {
      coolingTypeJa = toJapanese("coolingType", coolingType);
    }

    // 特徴情報の処理
    let selectedFeatureJa = "未指定";
    if (category === "workwear" && workwearFeature) {
      selectedFeatureJa = toJapanese("workwearFeature", workwearFeature);
    } else if (category === "security" && securityBrand) {
      selectedFeatureJa = toJapanese("securityBrand", securityBrand);
    } else if (category === "cooling" && coolingFeature) {
      selectedFeatureJa = toJapanese("coolingFeature", coolingFeature);
    }

    // MongoDBに接続
    const db = await getDb();

    // 問い合わせデータをコレクションに挿入（日本語で保存）
    const result = await db.collection("workwear_inquiries").insertOne({
      companyName,
      contactPerson,
      email,
      category: categoryJa,
      season: seasonJa,
      coolingType: coolingTypeJa,
      selectedFeature: selectedFeatureJa,
      recommendations,
      comments, // コメント欄の内容を保存
      status: "新規", // 新規問い合わせのステータス（日本語）
      consent: true, // 同意フラグをtrueで保存
      createdAt,
    });

    // 管理者通知メールの送信
    try {
      const notificationResult = await sendWorkwearInquiryNotification(
        email,
        companyName,
        contactPerson,
        category,
        season,
        coolingType,
        securityBrand,
        workwearFeature,
        coolingFeature,
        recommendations || [],
        comments // コメント内容もメールに含める
      );

      if (notificationResult.success) {
        console.log("管理者通知メール送信完了");
      } else {
        console.warn("管理者通知メール送信失敗:", notificationResult.error);
      }
    } catch (emailError) {
      // メール送信エラーはロギングするがAPI応答には影響させない
      console.error("メール送信エラー:", emailError);
    }

    return NextResponse.json({ message: "お問い合わせを受け付けました", id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("問い合わせの保存中にエラーが発生しました:", error);
    return NextResponse.json({ message: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
