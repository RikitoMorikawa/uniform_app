import { NextResponse, NextRequest } from "next/server";
import { getDb } from "@/lib/mongodb";
import { sendWorkwearInquiryNotification } from "@/lib/email/workwear_recommend/email-service";

export async function POST(req: NextRequest) {
  try {
    // リクエストボディを取得
    const body = await req.json();

    // 必要なデータが揃っているか確認
    const { companyName, contactPerson, email, category, selectedFeature, recommendations } = body;

    if (!companyName || !contactPerson || !email) {
      return NextResponse.json({ message: "必須項目が入力されていません" }, { status: 400 });
    }

    // 現在の日時を取得
    const createdAt = new Date();

    // MongoDBに接続
    const db = await getDb();

    // 問い合わせデータをコレクションに挿入
    const result = await db.collection("workwear_inquiries").insertOne({
      companyName,
      contactPerson,
      email,
      category,
      selectedFeature,
      recommendations,
      status: "new", // 新規問い合わせのステータス
      createdAt,
    });

    // 管理者通知メールの送信
    try {
      const notificationResult = await sendWorkwearInquiryNotification(email, companyName, contactPerson, category, recommendations || []);

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
