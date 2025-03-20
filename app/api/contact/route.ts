import { ContactFormData } from "@/types/contact";
import { NextResponse } from "next/server";
import { connect, DB_NAME, disconnect } from "@/lib/mongodb";
import { MongoClient } from "mongodb";
import { sendAdminNotificationEmail } from "@/lib/email/contact/email-service";

export async function POST(request: Request) {
  let client!: MongoClient;

  try {
    // リクエストボディからフォームデータを取得
    const formData: ContactFormData = await request.json();
    console.log("フォームデータ受信:", formData);

    // データをコレクションに挿入するためのデータ準備
    const contactData = {
      ...formData,
      createdAt: new Date(),
    };

    // MongoDBに接続
    client = await connect();

    // セッションを開始してトランザクションを使用
    const session = client.startSession();
    let dbResult;

    try {
      // トランザクション開始
      await session.withTransaction(async () => {
        const db = client.db(DB_NAME);
        const collection = db.collection("Contact");

        // データベースに保存
        dbResult = await collection.insertOne(contactData, { session });
        console.log("データベースに保存しました: ID =", dbResult.insertedId);
      });
    } finally {
      // セッションを終了
      await session.endSession();
    }

    // 管理者へのメール通知送信
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      try {
        const emailResult = await sendAdminNotificationEmail(formData);
        if (emailResult.success) {
          console.log("管理者通知メール送信完了");
        } else {
          console.warn("管理者通知メール送信失敗:", emailResult.error);
        }
      } catch (emailError) {
        console.error("メール送信エラー:", emailError);
        // メール送信エラーはログに記録するが、APIレスポンスには影響させない
      }
    }

    // すべての処理が完了した後にレスポンスを返す
    return NextResponse.json({
      success: true,
      message: "お問い合わせを受け付けました。担当者から数日以内にご連絡いたします。",
    });
  } catch (error: any) {
    console.error("APIルートエラー:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "エラーが発生しました",
      },
      {
        status: 500,
      }
    );
  } finally {
    // 必ずデータベース接続を閉じる
    if (client) {
      try {
        await disconnect();
        console.log("DB接続を閉じました");
      } catch (closeError) {
        console.error("DB接続を閉じる際にエラーが発生:", closeError);
      }
    }
  }
}
