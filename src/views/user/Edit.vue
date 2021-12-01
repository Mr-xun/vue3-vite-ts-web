<template>
    <el-dialog
        v-model="isVisible"
        title="新增"
        :width="width"
        top="50px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >
        <el-form
            ref="form"
            :model="editForm"
            :inline="true"
            :rules="rules"
            label-position="right"
            label-width="100px"
        >
            <el-form-item label="用户名" prop="username">
                <el-input v-model="editForm.username" :style="{ width: itemWidth }" clearable></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="editForm.password" :style="{ width: itemWidth }" clearable></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="warning" plain :loading="loading" @click="isVisible = false">取消</el-button>
                <el-button type="primary" plain :loading="loading" @click="submit">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script lang="ts">
import { ElMessage } from 'element-plus'
import { defineComponent, ref, reactive, onMounted, computed, unref, SetupContext } from 'vue'
import ITableRenderList from './interface'

interface IForm extends ITableRenderList {
    password: string
}


//设置弹窗宽度
const setDialogWidth = () => {
    const screenWidth = ref<number>(0) //窗口大小
    const initWidth = () => {
        screenWidth.value = document.body.clientWidth;
        if (screenWidth.value < 991) {
            return '90%';
        } else if (screenWidth.value < 1400) {
            return '50%';
        } else {
            return '800px';
        }
    }
    const width = ref<string>(initWidth()); //弹窗宽度
    onMounted(() => {
        window.onresize = () => {
            return (() => {
                width.value = initWidth();
            })();
        };
    })
    return {
        width
    }
}
//init表单
const initEditForm = (): IForm => {
    return {
        username: '',
        password: ''
    };
}

export default defineComponent({
    name: 'UserEdit',
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: ''
        }
    },

    emits: {
        "success": null,
        "close": null
    },
    setup(props, context) {
        const form = ref<any>(null)
        let loading = ref<boolean>(false)
        let editForm = ref<IForm>(initEditForm())
        const itemWidth = ref<string>('170px')
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
        const isVisible = computed({
            get: () => props.visible,
            set: () => {
                context.emit('close')
                reset()
            }
        })

        //设置表单内容
        const setEditForm = (val: IForm) => {
            editForm.value = { ...val };
        }
        //提交
        const submit = () => {
            unref(form).validate(async (valid: boolean) => {
                if (valid) {
                    isVisible.value = false
                    context.emit('success')
                    ElMessage.success('操作成功')
                } else {
                    return false
                }
            })
        }
        //重置表单
        const reset = () => {
            unref(form).clearValidate()
            unref(form).resetFields()
            editForm.value = initEditForm()
        }
        return {
            form,
            rules,
            itemWidth,
            isVisible,
            editForm,
            loading,
            submit,
            setEditForm,
            ...setDialogWidth(),
        }
    }
})
</script>