import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Contact from '@/models/Contact';
import nodemailer from 'nodemailer';

if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
  throw new Error('Please define the GMAIL_USER and GMAIL_APP_PASSWORD environment variables inside .env');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const data = await req.json();
    
    // データベースに保存
    const contact = await Contact.create({
      companyName: data.companyName,
      department: data.department,
      name: data.name,
      email: data.email,
      phone: data.phone,
      postalCode: data.postalCode,
      address: data.address,
      purpose: data.purpose,
      quantity: data.quantity,
      preferredColors: data.preferredColors,
      preferredMaterials: data.preferredMaterials,
      needsConsultation: data.needsConsultation,
      message: data.message
    });

    // メール送信
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: '新しいお問い合わせが届きました',
      text: `
会社名: ${data.companyName}
部署名: ${data.department || '未入力'}
担当者名: ${data.name}
メールアドレス: ${data.email}
電話番号: ${data.phone}
郵便番号: ${data.postalCode}
住所: ${data.address}
お問い合わせ目的: ${data.purpose}
希望数量: ${data.quantity || '未入力'}
希望カラー: ${data.preferredColors || '未入力'}
希望素材: ${data.preferredMaterials || '未入力'}
専門スタッフからの提案: ${data.needsConsultation ? '希望する' : '希望しない'}

お問い合わせ内容:
${data.message}
      `
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('メール送信エラー:', error);
    }

    return NextResponse.json({ success: true, data: contact });
  } catch (error) {
    console.error('エラー:', error);
    return NextResponse.json(
      { success: false, error: 'お問い合わせの送信に失敗しました。' },
      { status: 500 }
    );
  }
}