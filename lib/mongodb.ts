// lib/mongodb.ts
import { MongoClient, ServerApiVersion, Db } from "mongodb";

// MongoDB接続用URI
const uri = process.env.MONGODB_URI || "";

// クライアント設定
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

// グローバル変数の型定義
declare global {
  var mongoClient: MongoClient | undefined;
}

// 接続状態を追跡する変数
let isConnected = false;

// 開発環境では接続を再利用するためのクライアントキャッシュ
let cachedClient: MongoClient = global.mongoClient || new MongoClient(uri, options);

// 開発モードの場合のみグローバル変数に保存（Hot Reloadingでの再接続を防止）
if (process.env.NODE_ENV === "development") {
  global.mongoClient = cachedClient;
}

// データベース名の定数
export const DB_NAME = "Uniform";

/**
 * MongoDB接続クライアントを取得する
 * @returns 接続済みのMongoClientインスタンス
 */
export async function connect(): Promise<MongoClient> {
  if (!isConnected) {
    try {
      await cachedClient.connect();
      isConnected = true;
      console.log("MongoDB接続を確立しました");
    } catch (error) {
      console.error("MongoDB接続エラー:", error);
      throw error;
    }
  }
  return cachedClient;
}

/**
 * 指定されたデータベースを取得する
 * @param dbName データベース名 (デフォルトはUniform)
 * @returns データベースインスタンス
 */
export async function getDb(dbName: string = DB_NAME): Promise<Db> {
  const client = await connect();
  return client.db(dbName);
}

/**
 * 接続を閉じる（主にプロダクション環境用）
 */
export async function disconnect(): Promise<void> {
  if (process.env.NODE_ENV !== "development") {
    if (cachedClient && isConnected) {
      try {
        await cachedClient.close();
        isConnected = false;
        console.log("MongoDB接続を閉じました");
      } catch (error) {
        console.error("MongoDB切断エラー:", error);
        throw error;
      }
    }
  }
}

/**
 * 接続テストを実行する
 * @returns 接続が成功したかどうか
 */
export async function testConnection(): Promise<boolean> {
  try {
    const client = await connect();
    // 簡単な操作を実行して接続をテスト
    await client.db("admin").command({ ping: 1 });
    return true;
  } catch (error) {
    console.error("MongoDB接続テストに失敗しました:", error);
    return false;
  }
}
