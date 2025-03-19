// app/api/contact/route.ts
import { ContactFormData } from "@/types/contact";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // リクエストボディからフォームデータを取得
    const formData: ContactFormData = await request.json();

    // 成功レスポンスをすぐに返す
    console.log("フォームデータ受信:", formData);

    // バックグラウンドで処理（別のタスクとして実行）
    processingFormData(formData).catch((err) => console.error("バックグラウンド処理エラー:", err));

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
  }
}

// 非同期に実行する関数
async function processingFormData(formData: ContactFormData) {
  try {
    const { connect, DB_NAME, disconnect } = await import("@/lib/mongodb");
    const nodemailer = await import("nodemailer");

    // MongoDBに接続
    const client = await connect();
    const db = client.db(DB_NAME);
    const collection = db.collection("Contact");

    // データをコレクションに挿入
    const contactData = {
      ...formData,
      createdAt: new Date(),
    };

    await collection.insertOne(contactData);

    // メール送信の設定
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.default.createTransport({
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
    }

    // 接続を閉じる
    if (process.env.NODE_ENV !== "development") {
      await disconnect();
    }
  } catch (error) {
    console.error("バックグラウンド処理でエラーが発生:", error);
  }
}
