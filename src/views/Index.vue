<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import TitleBar from "@/components/TitleBar.vue";
import { auth, clearUser } from "@/store/auth";
import { shrinkWindow } from "@/window";
import { select } from "@/db";

const router = useRouter();
const active = ref("home");
const users = ref([]);
const tableLoading = ref(false);

const menus = [
  { index: "home", label: "首页概览" },
  { index: "users", label: "用户管理" },
  { index: "settings", label: "系统设置" },
  { index: "about", label: "关于" },
];

async function loadUsers() {
  tableLoading.value = true;
  try {
    users.value = await select("SELECT id, username, nickname FROM users ORDER BY id");
  } catch (e) {
    ElMessage.error("读取用户失败：" + e);
  } finally {
    tableLoading.value = false;
  }
}

onMounted(() => {
  loadUsers();
});

async function handleLogout() {
  try {
    await ElMessageBox.confirm("确定退出登录吗？", "提示", {
      type: "warning",
      confirmButtonText: "退出",
      cancelButtonText: "取消",
    });
  } catch (_) {
    return;
  }
  clearUser();
  await shrinkWindow(420, 560);
  await router.replace("/login");
}
</script>

<template>
  <div class="index-page">
    <TitleBar title="demo_01" />

    <div class="layout">
      <!-- 左侧菜单 -->
      <aside class="sidebar">
        <div class="side-head">
          <span class="logo-mini">D1</span>
          <span class="app-name">demo_01</span>
        </div>
        <el-menu
          :default-active="active"
          class="side-menu"
          background-color="#2b303b"
          text-color="#c9d1d9"
          active-text-color="#ffffff"
          @select="(i) => (active = i)"
        >
          <el-menu-item v-for="m in menus" :key="m.index" :index="m.index">
            <span>{{ m.label }}</span>
          </el-menu-item>
        </el-menu>
        <div class="side-foot">
          <el-button text class="logout-btn" @click="handleLogout">
            退出登录
          </el-button>
        </div>
      </aside>

      <!-- 右侧内容 -->
      <section class="content">
        <header class="content-head">
          <h3 class="page-title">{{ menus.find((m) => m.index === active)?.label }}</h3>
          <div class="user-info">
            <el-avatar :size="28" style="background: #409eff">
              {{ (auth.user?.nickname || auth.user?.username || "U").charAt(0) }}
            </el-avatar>
            <span>{{ auth.user?.nickname || auth.user?.username }}</span>
          </div>
        </header>

        <div class="content-body">
          <el-card v-if="active === 'home'" shadow="never" class="hero">
            <p>欢迎使用基于 <b>Tauri 2 + Vue 3 + Element Plus + SQLite</b> 的桌面应用模板。</p>
            <p>左侧菜单符合桌面端布局风格，窗口四角为圆角。</p>
          </el-card>

          <el-card v-else-if="active === 'users'" shadow="never">
            <template #header>
              <div class="card-head">
                <span>用户列表（来自本地 SQLite）</span>
                <el-button size="small" @click="loadUsers">刷新</el-button>
              </div>
            </template>
            <el-table v-loading="tableLoading" :data="users" stripe style="width: 100%">
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="username" label="用户名" />
              <el-table-column prop="nickname" label="昵称" />
            </el-table>
          </el-card>

          <el-card v-else-if="active === 'settings'" shadow="never">
            <p>系统设置示例内容。</p>
          </el-card>

          <el-card v-else shadow="never">
            <p>关于：demo_01 v0.1.0</p>
          </el-card>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.index-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
}
.layout {
  flex: 1;
  display: flex;
  min-height: 0;
}
.sidebar {
  width: 210px;
  flex: 0 0 210px;
  background: #2b303b;
  display: flex;
  flex-direction: column;
  color: #c9d1d9;
}
.side-head {
  height: 56px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.logo-mini {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: linear-gradient(135deg, #409eff, #66b1ff);
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.app-name {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
}
.side-menu {
  flex: 1;
  border-right: none;
}
.side-foot {
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  text-align: center;
}
.logout-btn {
  color: #ffb4b4;
}
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #f5f7fa;
}
.content-head {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
}
.page-title {
  margin: 0;
  font-size: 16px;
  color: #303133;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}
.content-body {
  flex: 1;
  padding: 18px;
  overflow: auto;
}
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.hero p {
  line-height: 1.9;
  color: #606266;
}
</style>
