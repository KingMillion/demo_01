import { createRouter, createWebHashHistory } from "vue-router";
import { isLogin } from "@/store/auth";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
    meta: { public: true },
  },
  {
    path: "/index",
    name: "index",
    component: () => import("@/views/Index.vue"),
  },
  { path: "/", redirect: "/login" },
  { path: "/:pathMatch(.*)*", redirect: "/login" },
];

const router = createRouter({
  // 桌面应用使用 hash 模式，避免自定义协议下深链/刷新丢失
  history: createWebHashHistory(),
  routes,
});

// 全局前置守卫：未登录只允许访问 /login
router.beforeEach((to) => {
  if (!to.meta.public && !isLogin()) {
    return { name: "login" };
  }
  // 已登录还想去登录页，直接进主页
  if (to.name === "login" && isLogin()) {
    return { name: "index" };
  }
  return true;
});

export default router;
