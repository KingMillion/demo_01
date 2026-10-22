import { getCurrentWindow } from "@tauri-apps/api/window";
import { LogicalSize } from "@tauri-apps/api/dpi";

/** 当前窗口实例 */
export function appWindow() {
  return getCurrentWindow();
}

/** 登录后放大窗口（桌面主界面尺寸） */
export async function enlargeWindow(width = 1200, height = 800) {
  const w = getCurrentWindow();
  try {
    if (await w.isMaximized()) await w.unmaximize();
  } catch (_) {}
  await w.setSize(new LogicalSize(width, height));
  await w.center();
}

/** 退出登录后恢复为登录小窗口 */
export async function shrinkWindow(width = 420, height = 560) {
  const w = getCurrentWindow();
  try {
    if (await w.isMaximized()) await w.unmaximize();
  } catch (_) {}
  await w.setSize(new LogicalSize(width, height));
  await w.center();
}
