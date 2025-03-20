import nodemailer from "nodemailer";
import { ContactFormData } from "@/types/contact";

// 環境変数からメール設定を取得
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

// トランスポーターの作成
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
});

/**
 * 管理者向けの問い合わせ通知メールを送信する
 * @param formData お問い合わせフォームのデータ
 * @returns 送信結果
 */
export async function sendAdminNotificationEmail(formData: ContactFormData) {
  try {
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      console.error("メール設定が不足しています");
      return { success: false, error: "メール設定が不足しています" };
    }

    // HTMLフォーマットのメール本文を作成
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3b82f6; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">新しいお問い合わせが届きました</h2>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
        <h3 style="margin-top: 0; color: #0f172a;">お客様情報</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 30%;">会社名:</td>
            <td style="padding: 8px 0;">${formData.companyName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">部署名:</td>
            <td style="padding: 8px 0;">${formData.department || "未入力"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">担当者名:</td>
            <td style="padding: 8px 0;">${formData.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">メールアドレス:</td>
            <td style="padding: 8px 0;"><a href="mailto:${formData.email}" style="color: #3b82f6;">${formData.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">電話番号:</td>
            <td style="padding: 8px 0;">${formData.phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">郵便番号:</td>
            <td style="padding: 8px 0;">${formData.postalCode}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">住所:</td>
            <td style="padding: 8px 0;">${formData.address}</td>
          </tr>
        </table>
      </div>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
        <h3 style="margin-top: 0; color: #0f172a;">お問い合わせ詳細</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 30%;">お問い合わせ目的:</td>
            <td style="padding: 8px 0;">${formData.purpose}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">希望数量:</td>
            <td style="padding: 8px 0;">${formData.quantity || "未入力"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">希望カラー:</td>
            <td style="padding: 8px 0;">${formData.preferredColors || "未入力"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">希望素材:</td>
            <td style="padding: 8px 0;">${formData.preferredMaterials || "未入力"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">専門スタッフからの提案:</td>
            <td style="padding: 8px 0;">${formData.needsConsultation ? "希望する" : "希望しない"}</td>
          </tr>
        </table>
        
        <div style="margin-top: 15px;">
          <p style="font-weight: bold; margin-bottom: 5px;">お問い合わせ内容:</p>
          <div style="background-color: white; padding: 15px; border-radius: 4px; border: 1px solid #e2e8f0;">
            ${formData.message.replace(/\n/g, "<br>")}
          </div>
        </div>
      </div>
      
      <p style="background-color: #fef2f2; color: #b91c1c; padding: 10px; border-radius: 4px; font-weight: bold;">
        このお問い合わせには速やかに対応してください。
      </p>
      
      <p style="color: #64748b; font-size: 0.9em; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
        このメールは自動送信されています。お問い合わせ管理システムからも確認できます。
      </p>
    </div>
    `;

    // メール送信オプション
    const mailOptions = {
      from: GMAIL_USER,
      to: GMAIL_USER,
      subject: `【新規お問い合わせ】${formData.companyName} - ${formData.purpose}`,
      html: html,
    };

    // メール送信
    const info = await transporter.sendMail(mailOptions);
    console.log("管理者通知メール送信成功:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("管理者通知メール送信エラー:", error);
    return { success: false, error };
  }
}
