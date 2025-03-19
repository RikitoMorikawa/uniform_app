// /Users/apple/uniform_app/app/api/contact/route.ts

import { Contact, ContactFormData } from "@/types/contact";
import nodemailer from "nodemailer";
import { connect, DB_NAME, disconnect } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // リクエストボディからフォームデータを取得
    const formData: ContactFormData = await request.json();

    // 簡単なログ出力だけ
    console.log("フォームデータ受信:", formData);

    // 環境変数のチェック
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI 環境変数が設定されていません");
    }

    // 現在の日時を追加
    const contactData = {
      ...formData,
      createdAt: new Date(),
    };

    // MongoDBに接続
    const client = await connect();

    // データベースとコレクションを選択
    const db = client.db(DB_NAME);
    const collection = db.collection<Contact>("Contact");

    // データをコレクションに挿入
    const result = await collection.insertOne(contactData);
    console.log("データベースに保存しました: ID =", result.insertedId);

    // メール送信の設定
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      try {
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

        // メール送信
        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error("メール送信エラー:", emailError);
      }
    }

    return NextResponse.json({ success: true, message: "お問い合わせを受け付けました。" });
  } catch (error: any) {
    console.error("APIルートエラー:", error);

    // エラーメッセージを詳細に
    let errorMessage = "お問い合わせの送信に失敗しました。";
    if (error.message) {
      errorMessage += ` 詳細: ${error.message}`;
    }

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  } finally {
    // 本番環境でのみ接続を閉じる
    if (process.env.NODE_ENV !== "development") {
      try {
        await disconnect();
      } catch (closeError) {
        console.error("MongoDB接続を閉じる際にエラーが発生しました:", closeError);
      }
    }
  }
}
