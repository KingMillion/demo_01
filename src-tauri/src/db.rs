//! 独立、可移植的 SQLite 模块（基于最新稳定版 tauri-plugin-sql 2.x）
//!
//! 复用方式（移植到其他项目）:
//! 1. 把本文件复制到 `src-tauri/src/` 下；
//! 2. 在 `Cargo.toml` 添加: `tauri-plugin-sql = { version = "2", features = ["sqlite"] }`；
//! 3. 在 `lib.rs` 里 `mod db;` 并注册插件: `.plugin(db::sql_plugin())`；
//! 4. 在 `capabilities/default.json` 添加权限 `"sql:default"`, `"sql:allow-load"`,
//!    `"sql:allow-select"`, `"sql:allow-execute"`；
//! 5. 前端引入 `src/db.js` 同名封装即可简单调用。
//!
//! 只需修改下面的 [DB_URL] 与 [migrations] 即可适配你自己的库结构。

use tauri_plugin_sql::{Builder, Migration, MigrationKind};

/// 数据库文件名（相对应用数据目录）。移植时改成你自己的文件名即可。
pub const DB_URL: &str = "sqlite:app.db";

/// 数据库迁移脚本：建表 + 种子数据。移植时按需增删。
fn migrations() -> Vec<Migration> {
    vec![
        Migration {
            version: 1,
            description: "create_users_table",
            sql: r#"
                CREATE TABLE IF NOT EXISTS users (
                    id       INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL,
                    nickname TEXT
                );
            "#,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "seed_default_users",
            sql: r#"
                INSERT OR IGNORE INTO users (username, password, nickname)
                    VALUES ('admin', '123456', '管理员');
                INSERT OR IGNORE INTO users (username, password, nickname)
                    VALUES ('user', '123456', '普通用户');
            "#,
            kind: MigrationKind::Up,
        },
    ]
}

/// 构建并返回配置好迁移的 SQL 插件。
/// 在 `lib.rs` 中一行注册：`.plugin(db::sql_plugin())`。
pub fn sql_plugin<R: tauri::Runtime>(
) -> tauri::plugin::TauriPlugin<R, Option<tauri_plugin_sql::PluginConfig>> {
    Builder::default()
        .add_migrations(DB_URL, migrations())
        .build()
}
