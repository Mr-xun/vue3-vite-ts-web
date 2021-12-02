<template>
    <el-dialog
        v-model="isVisible"
        :title="title"
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
            <el-form-item label="密码" prop="password" v-if="!editForm._id">
                <el-tooltip
                    class="item"
                    effect="dark"
                    :content="`默认密码为admin`"
                    placement="top-start"
                >
                    <el-input
                        v-model="editForm.password"
                        type="password"
                        :style="{ width: itemWidth }"
                        clearable
                        show-password
                    ></el-input>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="editForm.mobile" :style="{ width: itemWidth }" clearable></el-input>
            </el-form-item>
            <el-form-item label="角色">
                <el-radio-group v-model="editForm.role" :style="{ width: itemWidth }">
                    <el-radio :label="1">管理员</el-radio>
                    <el-radio :label="2">普通</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
                <el-upload
                    :style="{ width: itemWidth }"
                    class="avatar-uploader"
                    action="http://127.0.0.1:3000/upload/file"
                    :headers="uploadHeaders"
                    :limit="1"
                    :file-list="uploadFileList"
                    :show-file-list="true"
                    :on-success="uploadSuccess"
                    :before-upload="uploadBefore"
                    :on-error="uploadError"
                    :on-remove="uploadRemove"
                >
                    <img v-if="editForm.avatar" :src="editForm.avatar" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <plus />
                    </el-icon>
                </el-upload>
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
import api from '@/api'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons'
import { useStore } from '@/store/index'
import { defineComponent, ref, reactive, onMounted, computed, unref, Ref } from 'vue'
import { ISubmitForm } from '@/types/user'

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
const initEditForm = (): ISubmitForm => {
    return {
        username: '',
        password: 'admin',
        avatar: '',
        role: 1,
        mobile: ''
    };
}

//图片上传
const imageUplpad = (editForm: Ref<ISubmitForm>) => {
    const store = useStore()
    const token = computed(() => store.state.user.token)
    const uploadHeaders = reactive<any>({
        'Authorization': `Bearer ${token.value}`
    })
    const uploadError = (err: any, file: File, fileList: File[]) => {
        console.log(err, file, fileList)
    }
    const uploadRemove = () => {
        editForm.value.avatar = '';
    }
    const uploadSuccess = (res: IResponse) => {
        editForm.value.avatar = res.data.url;
    }
    const uploadBefore = (file: File) => {
        const isJPG = file.type === 'image/jpeg'
        const isGIF = file.type === 'image/gif';
        const isPNG = file.type === 'image/png';
        const isBMP = file.type === 'image/bmp';
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG && !isGIF && !isPNG && !isBMP) {
            ElMessage.error('上传图片必须是JPG/GIF/PNG/BMP 格式!');
        }
        if (!isLt2M) {
            ElMessage.error('上传头像大小不能超过 2MB!')
        }
        return (isJPG || isBMP || isGIF || isPNG) && isLt2M
    }
    return {
        uploadHeaders,
        uploadError,
        uploadRemove,
        uploadSuccess,
        uploadBefore
    }
}

export default defineComponent({
    name: 'UserEdit',
    components: { Plus },
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
        let editForm = ref<ISubmitForm>(initEditForm())
        let uploadFileList = ref<{ name: string, url: string }[]>([])

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
        const setEditForm = (val: ISubmitForm) => {
            editForm.value = { ...val };
            if (val.avatar) {
                uploadFileList.value = [{
                    name: val.avatar,
                    url: val.avatar,
                }]
            }
        }
        //提交
        const submit = () => {
            unref(form).validate(async (valid: boolean) => {
                if (valid) {
                    if (unref(editForm)._id) {
                        await api.user_update(unref(editForm))
                    } else {
                        await api.user_register(unref(editForm))
                    }
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
            uploadFileList.value = []
        }
        return {
            form,
            rules,
            itemWidth,
            isVisible,
            editForm,
            uploadFileList,
            loading,
            submit,
            setEditForm,
            ...setDialogWidth(),
            ...imageUplpad(editForm)
        }
    }
})
</script>
<style lang="scss">
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 128px;
    height: 128px;
    text-align: center;
}
.avatar-uploader-icon svg {
    margin-top: 49px; /* (128px - 28px) / 2 - 1px */
}
.avatar {
    width: 128px;
    height: 128px;
    display: block;
}
</style>