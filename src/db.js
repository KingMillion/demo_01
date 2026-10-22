import Database from "@tauri-apps/plugin-sql";

/**
 * 独立、可移植的 SQLite 前端封装（基于 @tauri-apps/plugin-sql 2.x）
 *
 * 移植方式：把本文件与 src-tauri/src/db.rs 一起拷贝到新项目即可复用。
 * DB_URL 必须与 Rust 端 db.rs 中的 DB_URL 保持一致。
 *
 * 简单调用示例：
 *   import { select, execute, findUser } from "@/db";
 *   const rows = await select("SELECT * FROM users");
 *   await execute("INSERT INTO users (username,password,nickname) VALUES (?,?,?)", ["a","b","c"]);
 */

// 与 src-tauri/src/db.rs 中 DB_URL 保持一致
export const DB_URL = "sqlite:app.db";

let _db = null;

/** 获取（单例）数据库连接，首次调用时自动建立 */
export async function db() {
  if (!_db) _db = await Database.load(DB_URL);
  return _db;
}

/** 查询多行 */
export async function select(sql, args = []) {
  return (await db()).select(sql, args);
}

/** 查询单行，无结果返回 null */
export async function selectOne(sql, args = []) {
  const rows = await select(sql, args);
  return rows && rows.length ? rows[0] : null;
}

/** 执行写操作（INSERT/UPDATE/DELETE），返回 { rowsAffected, lastInsertId } */
export async function execute(sql, args = []) {
  return (await db()).execute(sql, args);
}

/** 关闭连接 */
export async function close() {
  if (_db) {
    await _db.close();
    _db = null;
  }
}

// ===== 业务封装：用户登录 =====
/** 按用户名+密码查询用户，命中返回 {id,username,nickname}，否则 null */
export async function findUser(username, password) {
  return selectOne(
    "SELECT id, username, nickname FROM users WHERE username = ? AND password = ? LIMIT 1",
    [username, password],
  );
}
