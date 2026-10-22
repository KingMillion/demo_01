<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import TitleBar from "@/components/TitleBar.vue";
import { findUser } from "@/db";
import { setUser } from "@/store/auth";
import { enlargeWindow } from "@/window";

const router = useRouter();
const loading = ref(false);
const formRef = ref();

const form = reactive({
  username: "admin",
  password: "123456",
});

const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

async function handleLogin() {
  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    loading.value = true;
    try {
      const user = await findUser(form.username, form.password);
      if (!user) {
        ElMessage.error("用户名或密码错误");
        return;
      }
      setUser(user);
      // 放大窗口后再跳转到 index
      await enlargeWindow(1200, 800);
      await router.replace("/index");
      ElMessage.success(`欢迎回来，${user.nickname || user.username}`);
    } catch (e) {
      ElMessage.error("登录失败：" + e);
    } finally {
      loading.value = false;
    }
  });
}
</script>

<template>
  <div class="login-page">
    <TitleBar :show-maximize="false" title="登录" />

    <div class="login-body">
      <div class="brand">
        <div class="logo">D1</div>
        <h2>demo_01</h2>
        <p class="sub">桌面应用登录</p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            size="large"
            placeholder="用户名 (admin)"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            size="large"
            placeholder="密码 (123456)"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="tip">默认账号：admin / 123456</div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(160deg, #eef3fb 0%, #ffffff 60%);
}
.login-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 36px 40px;
}
.brand {
  text-align: center;
  margin-bottom: 28px;
}
.logo {
  width: 64px;
  height: 64px;
  margin: 0 auto 12px;
  border-radius: 16px;
  background: linear-gradient(135deg, #409eff, #66b1ff);
  color: #fff;
  font-weight: 700;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 18px rgba(64, 158, 255, 0.4);
}
.brand h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}
.sub {
  margin: 4px 0 0;
  font-size: 13px;
  color: #909399;
}
.login-form {
  width: 100%;
  max-width: 320px;
}
.login-btn {
  width: 100%;
}
.tip {
  margin-top: 18px;
  font-size: 12px;
  color: #a0a4ab;
}
</style>
