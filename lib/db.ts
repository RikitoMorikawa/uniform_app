import mongoose from "mongoose";

// MongoDB URI が設定されていることを確認
if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

const MONGODB_URI = process.env.MONGODB_URI;

// MongooseConnectionの型を定義
interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// グローバルに型を宣言
declare global {
  var mongoose: MongooseConnection | undefined;
}

// キャッシュまたは新しい接続変数を初期化
const cached: MongooseConnection = global.mongoose || { conn: null, promise: null };

// グローバル変数にキャッシュがなければ初期化
if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * MongoDB接続関数
 */
async function dbConnect(): Promise<typeof mongoose> {
  // すでに接続が確立されている場合はそれを返す
  if (cached.conn) {
    return cached.conn;
  }

  // 接続中でなければ新たに接続
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      // 最も重要: データベース名を明示的に指定
      dbName: "Uniform",
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("MongoDB接続成功 - データベース:", mongoose.connection.db?.databaseName);
      return mongoose;
    });
  }

  try {
    // 接続プロミスが解決するのを待つ
    cached.conn = await cached.promise;
  } catch (e) {
    // エラーが発生した場合、キャッシュをクリア
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
