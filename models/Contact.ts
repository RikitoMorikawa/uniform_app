import mongoose, { Schema } from "mongoose";

// スキーマ定義
const ContactSchema = new Schema({
  companyName: {
    type: String,
    required: [true, "会社名は必須です"],
  },
  department: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: [true, "担当者名は必須です"],
  },
  email: {
    type: String,
    required: [true, "メールアドレスは必須です"],
    match: [/^\S+@\S+\.\S+$/, "有効なメールアドレスを入力してください"],
  },
  phone: {
    type: String,
    required: [true, "電話番号は必須です"],
  },
  postalCode: {
    type: String,
    required: [true, "郵便番号は必須です"],
  },
  address: {
    type: String,
    required: [true, "住所は必須です"],
  },
  purpose: {
    type: String,
    required: [true, "お問い合わせの目的は必須です"],
  },
  quantity: {
    type: String,
    required: false,
  },
  preferredColors: {
    type: String,
    required: false,
  },
  preferredMaterials: {
    type: String,
    required: false,
  },
  needsConsultation: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    required: [true, "お問い合わせ内容は必須です"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// モデルが既に存在する場合は再利用し、存在しない場合は新規作成
// モデル名とコレクション名を一致させる
const ContactModel = mongoose.models.Contact || mongoose.model("Contact", ContactSchema, "Contact");

export default ContactModel;
