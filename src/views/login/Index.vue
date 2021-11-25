<template>
    <div class="login-page">
        <div class="form-container">
            <el-form
                ref="ruleForm"
                :model="loginForm"
                status-icon
                :rules="rules"
                label-width="70px"
                class="login-form"
            >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="loginForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="loginForm.password" type="password" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <!-- <div class="login-tip">
                <el-checkbox v-model="checkedPwd" checked class="remember">记住密码</el-checkbox>
                <span class="forget-pwd" @click="resetPwd">忘记密码？</span>
            </div>-->
            <div class="login-btn">
                <el-button
                    :loading="loginLoading"
                    type="primary"
                    style="width:100%; margin-bottom:30px;"
                    @click="handleLogin"
                >登录</el-button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, unref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store/index'
interface ILoginForm {
    username: string,
    password: string
}
export default defineComponent({
    name: 'Login',
    setup() {
        const store = useStore()
        const router = useRouter()
        const loginLoading = ref<boolean>(false)
        const loginForm = reactive<ILoginForm>({
            username: '',
            password: ''
        })
        const rules = reactive({
            username: [{
                required: true,
                message: '请输入用户名',
                trigger: 'blur'
            }],
            password: {
                required: true,
                message: '请输入密码',
                trigger: 'blur'
            }
        })
        const ruleForm = ref<any>(null)
        const handleLogin = () => {
            unref(ruleForm).validate(async (valid: boolean) => {
                if (valid) {
                    let status = await store.dispatch('user/login', loginForm)
                    if (status) router.push({ path: '/home' })
                } else {
                    return false
                }
            })
        }
        const resetPwd = () => { }
        return {
            loginLoading,
            ruleForm,
            loginForm,
            rules,
            handleLogin
        }
    }
})
</script>
<style lang="scss" scoped>
.login-page {
    .form-container {
        width: 428px;
        top: 50%;
        left: 50%;
        position: absolute;
        transform: translate(-50%, -50%);
        overflow: hidden;
        background: #fff;
        border-radius: 0 0 12px 12px;
        text-align: center;
    }
    .login-form {
        width: 288px;
        margin: 0 auto;
        padding-bottom: 10px;
        position: relative;
    }
    .login-tip {
        clear: both;
        height: 16px;
        line-height: 16px;
        width: 288px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .forget-pwd {
            font-stretch: normal;
            letter-spacing: 0;
            color: #1a2935;
            text-decoration: none;
            font-size: 12px;
            cursor: pointer;
        }
    }
    .login-btn {
        width: 268px;
        height: 40px;
        background-color: #0371d1;
        border-radius: 16px;
        margin: auto;
        text-align: center;
        line-height: 40px;
        color: #fff;
        font-size: 14px;
        letter-spacing: 0;
        overflow: hidden;
        cursor: pointer;
    }
}
</style>