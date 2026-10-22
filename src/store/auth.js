import { reactive } from "vue";

/** 极简全局登录态（内存级，窗口未被销毁，仅尺寸变化） */
export const auth = reactive({
  user: null, // { id, username, nickname }
});

export function setUser(user) {
  auth.user = user;
}

export function clearUser() {
  auth.user = null;
}

export function isLogin() {
  return !!auth.user;
}
