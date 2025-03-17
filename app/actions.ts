"use server";

import dbConnect from "@/lib/db";
import Contact from "@/models/Contact";
import nodemailer from "nodemailer";
import mongoose from "mongoose";

interface ContactFormData {
  companyName: string;
  department?: string;
  name: string;
  email: string;
  phone: string;
  postalCode: string;
  address: string;
  purpose: string;
  quantity?: string;
  preferredColors?: string;
  preferredMaterials?: string;
  needsConsultation: boolean;
  message: string;
}

export async function submitContactForm(formData: ContactFormData) {
  console.log("サーバーアクション: コンタクトフォーム送信を処理します");

  try {
    // 環境変数のチェック
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI 環境変数が設定されていません");
    }

    // データベース接続
    console.log("データベースに接続しています...");
    await dbConnect();
    console.log("データベース接続成功 - データベース名:", mongoose.connection.db?.databaseName);

    // データベースに保存
    console.log("データベースに保存しています...");
    const contact = await Contact.create(formData);
    console.log("データベースに保存しました: ID =", contact._id);
    console.log("保存先コレクション:", Contact.collection.name);

    // メール送信の設定
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      console.log("メール送信を設定しています...");
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
        console.log("メール送信成功");
      } catch (emailError) {
        console.error("メール送信エラー:", emailError);
        // メール送信エラーはフォーム送信の成功に影響しない
      }
    }

    return { success: true, message: "お問い合わせを受け付けました。" };
  } catch (error: any) {
    console.error("サーバーアクションエラー:", error);

    // エラーメッセージを詳細に
    let errorMessage = "お問い合わせの送信に失敗しました。";
    if (error.message) {
      errorMessage += ` 詳細: ${error.message}`;
    }

    if (error.name === "ValidationError") {
      return {
        success: false,
        error: errorMessage,
        validationErrors: error.errors,
      };
    }

    return { success: false, error: errorMessage };
  }
}
