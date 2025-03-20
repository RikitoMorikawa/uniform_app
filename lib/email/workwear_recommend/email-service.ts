import nodemailer from "nodemailer";

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
  selectedProducts: string[]
) {
  // カテゴリーの日本語名を取得
  const categoryName = getCategoryName(category);

  // 製品リストをHTML形式に変換
  const productsHtml = selectedProducts.map((product) => `<li>${product}</li>`).join("");

  // 管理者向けメールの本文を作成
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3b82f6;">新しいワークウェア提案依頼がありました</h2>
      
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #0f172a;">問い合わせ詳細</h3>
        <p><strong>会社名:</strong> ${companyName}</p>
        <p><strong>担当者名:</strong> ${contactPerson}</p>
        <p><strong>メールアドレス:</strong> ${customerEmail}</p>
        <p><strong>カテゴリー:</strong> ${categoryName}</p>
        <p><strong>興味のある製品:</strong></p>
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
    subject: "【ワークウェア提案依頼】新規お問い合わせ",
    html: adminHtml,
  });
}

/**
 * カテゴリーコードから日本語名を取得
 */
function getCategoryName(category: string): string {
  switch (category) {
    case "workwear":
      return "ワークウェア";
    case "security":
      return "セキュリティウェア";
    case "cooling":
      return "クーリングウェア";
    default:
      return "作業服全般";
  }
}
