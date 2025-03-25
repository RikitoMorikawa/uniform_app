import nodemailer from "nodemailer";
import { toJapanese, getSelectedFeatureJa } from "@/lib/enums";

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

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

/**
 * メールを送信する関数
 * @param emailData 送信するメールのデータ
 * @returns 送信結果
 */
export async function sendEmail(emailData: EmailData) {
  try {
    // メールオプションの設定
    const mailOptions = {
      from: GMAIL_USER,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    };

    // メール送信
    const info = await transporter.sendMail(mailOptions);
    console.log("メール送信成功:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("メール送信エラー:", error);
    return { success: false, error };
  }
}

/**
 * ワークウェア問い合わせ通知を管理者にのみ送信
 */
export async function sendWorkwearInquiryNotification(
  customerEmail: string,
  companyName: string,
  contactPerson: string,
  category: string,
  season: string | null,
  coolingType: string | null,
  securityBrand: string | null,
  workwearFeature: string | null,
  coolingFeature: string | null,
  selectedProducts: string[]
) {
  // カテゴリー、季節、空調服タイプの日本語名を取得
  const categoryName = toJapanese("category", category);
  const seasonName = toJapanese("season", season);
  const coolingTypeName = toJapanese("coolingType", coolingType);

  // 選択された特徴の日本語名を取得
  let selectedFeatureName = "未指定";
  if (category === "workwear" && workwearFeature) {
    selectedFeatureName = toJapanese("workwearFeature", workwearFeature);
  } else if (category === "security" && securityBrand) {
    selectedFeatureName = toJapanese("securityBrand", securityBrand);
  } else if (category === "cooling" && coolingFeature) {
    selectedFeatureName = toJapanese("coolingFeature", coolingFeature);
  }

  // 製品タイプの詳細テキスト作成
  let productDetailsHtml = `
    <p><strong>カテゴリ:</strong> ${categoryName}</p>`;

  if (category === "workwear" || category === "security") {
    productDetailsHtml += `
    <p><strong>季節:</strong> ${seasonName}</p>
    <p><strong>特徴:</strong> ${selectedFeatureName}</p>`;
  } else if (category === "cooling") {
    productDetailsHtml += `
    <p><strong>タイプ:</strong> ${coolingTypeName}</p>
    <p><strong>特徴:</strong> ${selectedFeatureName}</p>`;
  }

  // 製品リストをHTML形式に変換
  const productsHtml = selectedProducts.map((product) => `<li>${product}</li>`).join("");

  // 管理者向けメールの本文を作成
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3b82f6;">新しい作業着アドバイザー問い合わせがありました</h2>
      
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #0f172a;">問い合わせ詳細</h3>
        <p><strong>会社名:</strong> ${companyName}</p>
        <p><strong>担当者名:</strong> ${contactPerson}</p>
        <p><strong>メールアドレス:</strong> ${customerEmail}</p>
        
        <h4 style="margin-top: 15px; color: #334155;">選択内容</h4>
        ${productDetailsHtml}
        
        <h4 style="margin-top: 15px; color: #334155;">おすすめ製品</h4>
        <ul style="padding-left: 20px;">
          ${productsHtml}
        </ul>
      </div>
      
      <p>管理画面からこの問い合わせの詳細を確認し、対応してください。</p>
    </div>
  `;

  // 管理者へのメール送信
  return sendEmail({
    to: GMAIL_USER || "",
    subject: "【作業着アドバイザー】新規お問い合わせ",
    html: adminHtml,
  });
}
