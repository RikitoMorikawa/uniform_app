// app/api/contact/route.ts
import { ContactFormData } from "@/types/contact";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { connect, DB_NAME, disconnect } from "@/lib/mongodb";
import { MongoClient } from "mongodb";

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

    // メール送信処理
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      // メール送信オプション
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER,
        subject: "新しいお問い合わせが届きました",
        text: `
会社名: ${formData.companyName}
部署名: ${formData.department || "未入力"}
担当者名: ${formData.name}
メールアドレス: ${formData.email}
電話番号: ${formData.phone}
郵便番号: ${formData.postalCode}
住所: ${formData.address}
お問い合わせ目的: ${formData.purpose}
希望数量: ${formData.quantity || "未入力"}
希望カラー: ${formData.preferredColors || "未入力"}
希望素材: ${formData.preferredMaterials || "未入力"}
専門スタッフからの提案: ${formData.needsConsultation ? "希望する" : "希望しない"}

お問い合わせ内容:
${formData.message}
        `,
      };

      // メール送信を待機
      await transporter.sendMail(mailOptions);
      console.log("メール送信完了");
    }

    // すべての処理が完了した後にレスポンスを返す
    return NextResponse.json({
      success: true,
      message: "お問い合わせを受け付けました。",
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
