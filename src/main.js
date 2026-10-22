import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// 全局样式（透明窗口 + 圆角外框）
import "./styles/global.css";
// Element Plus 基础样式（组件由 unplugin 自动按需引入，此处保证 ElMessage 等程序式组件样式齐全）
import "element-plus/dist/index.css";

createApp(App).use(router).mount("#app");
