<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { appWindow } from "@/window";

const props = defineProps({
  // 登录小窗口不显示最大化按钮
  showMaximize: { type: Boolean, default: true },
  title: { type: String, default: "demo_01" },
});

const isMaximized = ref(false);
const w = appWindow();

async function refreshMax() {
  try {
    isMaximized.value = await w.isMaximized();
  } catch (_) {}
}

async function toggleMax() {
  if (await w.isMaximized()) await w.unmaximize();
  else await w.maximize();
  await refreshMax();
}

function minimize() {
  w.minimize();
}
function closeWin() {
  w.close();
}

let unlisten = null;
onMounted(async () => {
  await refreshMax();
  // 监听窗口尺寸变化以同步最大化状态（用于双击拖拽区触发的最大化）
  try {
    unlisten = await w.listen("tauri://resize", refreshMax);
  } catch (_) {}
});
onBeforeUnmount(() => unlisten && unlisten());
</script>

<template>
  <div class="title-bar" data-tauri-drag-region>
    <div class="tb-title" data-tauri-drag-region>
      <span class="tb-dot" data-tauri-drag-region></span>
      <span data-tauri-drag-region>{{ title }}</span>
    </div>
    <div class="tb-controls">
      <button class="tb-btn" title="最小化" @click="minimize">
        <svg width="10" height="10" viewBox="0 0 10 10"><line x1="1" y1="5" x2="9" y2="5" stroke="currentColor" stroke-width="1.2"/></svg>
      </button>
      <button v-if="showMaximize" class="tb-btn" title="最大化/还原" @click="toggleMax">
        <svg v-if="!isMaximized" width="10" height="10" viewBox="0 0 10 10"><rect x="1.5" y="1.5" width="7" height="7" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>
        <svg v-else width="10" height="10" viewBox="0 0 10 10"><rect x="1" y="3" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M3 3 V1 H9 V7 H7" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>
      </button>
      <button class="tb-btn tb-close" title="关闭" @click="closeWin">
        <svg width="10" height="10" viewBox="0 0 10 10"><line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" stroke-width="1.2"/><line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" stroke-width="1.2"/></svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.title-bar {
  height: 38px;
  flex: 0 0 38px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  user-select: none;
  -webkit-user-select: none;
}
.tb-title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 14px;
  font-size: 13px;
  color: #303133;
  height: 100%;
  flex: 1;
}
.tb-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff, #66b1ff);
}
.tb-controls {
  display: flex;
  height: 100%;
}
.tb-btn {
  width: 44px;
  height: 100%;
  border: none;
  background: transparent;
  color: #606266;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0;
  box-shadow: none;
  transition: background 0.15s;
}
.tb-btn:hover {
  background: rgba(0, 0, 0, 0.06);
}
.tb-close:hover {
  background: #e81123;
  color: #fff;
}
</style>
