// types/contact.ts

export interface ContactFormInput {
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

export interface ContactFormData extends ContactFormInput {
  createdAt?: Date;
}

// データベースに保存されるコンタクトデータの型定義
export interface Contact extends ContactFormData {
  _id?: string;
}

// APIレスポンスの型定義
export interface ContactResponse {
  success: boolean;
  message?: string;
  error?: string;
  id?: string;
}
