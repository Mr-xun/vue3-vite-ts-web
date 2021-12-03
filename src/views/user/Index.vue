<template>
    <div class="user-page">
        <div class="filter-container">
            <el-form :inline="true" :model="queryParams">
                <el-form-item label="用户名">
                    <el-input
                        v-model="queryParams.username"
                        clearable
                        placeholder="用户名"
                        class="filter-item search-item"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" plain class="filter-item" @click="search">查询</el-button>
                    <el-button type="warning" plain class="filter-item" @click="reset">重置</el-button>
                    <el-dropdown trigger="click" class="filter-item">
                        <el-button>
                            更多操作
                            <el-icon class="el-icon--right">
                                <arrow-down />
                            </el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="add">新增用户</el-dropdown-item>
                                <el-dropdown-item @click="batchDelete">批量删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-container">
            <el-table
                ref="tableRef"
                v-loading="tableData.loading"
                :data="tableData.data"
                :border="true"
                fit
                :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
                stripe
                style="width: 100%;"
                @selection-change="selectChange"
            >
                <el-table-column type="selection" align="center" width="40px" />
                <el-table-column
                    label="用户ID"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="80px"
                    prop="user_id"
                ></el-table-column>
                <el-table-column
                    label="用户名"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="80px"
                    prop="username"
                ></el-table-column>
                <el-table-column
                    label="头像"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="80px"
                    prop="avatar"
                >
                    <template #default="{ row }">
                        <el-avatar v-if="row.avatar"  :size="40" :src="row.avatar"></el-avatar>
                    </template>
                </el-table-column>
                <el-table-column
                    label="手机号"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="80px"
                    prop="mobile"
                ></el-table-column>
                <el-table-column
                    label="角色"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="80px"
                    prop="role"
                >
                    <template #default="{ row }">{{ row.role == 1 ? '管理员' : "普通用户" }}</template>
                </el-table-column>
                <el-table-column
                    label="创建时间"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="160px"
                    prop="create_time"
                ></el-table-column>
                <el-table-column
                    label="更新时间"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="160px"
                    prop="update_time"
                ></el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    min-width="150px"
                    fixed="right"
                    class-name="small-padding fixed-width"
                >
                    <template v-slot:default="{ row }">
                        <el-icon class="table-operation" color="#2db7f5" @click="edit(row)">
                            <edit />
                        </el-icon>
                        <el-icon class="table-operation" color="#f50" @click="singleDelete(row)">
                            <delete />
                        </el-icon>
                    </template>
                </el-table-column>
            </el-table>
            <pagination
                v-show="tableData.total > 0"
                :total="tableData.total"
                v-model:page="tableData.page"
                v-model:limit="tableData.limit"
                @pagination="paginationChange"
            />
            <user-edit
                ref="editRef"
                :visible="dialog.visible"
                :title="dialog.title"
                @success="editSuccess"
                @close="dialog.visible = false"
            />
        </div>
    </div>
</template>
<script lang="ts">
import api from '@/api'
import { Delete, ArrowDown, Edit } from '@element-plus/icons'
import { ElMessage, ElMessageBox } from 'element-plus'
import Pagination from "@/components/Pagination/index.vue"
import UserEdit from "./Edit.vue"
import { defineComponent, onMounted, reactive, ref, unref } from 'vue'
import { ITableRenderList } from '@/types/user'

interface IQueryParams {
    username?: string
}

//加载数据
const fetchData = async (table: ITableRender<ITableRenderList>, query: IQueryParams) => {
    table.loading = true;
    let params: ITableQuery = {
        pageNum: table.page,
        pageSize: table.limit,
        ...query
    }
    let { data } = await api.user_list(params)
    table.loading = false;
    table.data = data.rows;
    table.total = data.total;
}

//清除选择
const clearSelections = (dom: any) => {
    unref(dom).clearSelection()
}
//页面操作
const pageHandle = (table: ITableRender<ITableRenderList>, query: IQueryParams) => {
    const tableRef = ref<any>(null)
    onMounted(() => search())
    //查询
    const search = () => {
        table.page = 1;
        fetchData(table, query)
    }
    //重置
    const reset = () => {
        table.page = 1;
        query.username = ''
        fetchData(table, query)
    }
    //多选
    const selectChange = (selection: ITableRenderList[]) => {
        table.selection = selection
    }

    //单个删除table
    const singleDelete = async (row: ITableRenderList) => {
        clearSelections(tableRef)
        unref(tableRef).toggleRowSelection(row, true)
        batchDelete()
    }
    //批量删除
    const batchDelete = () => {
        if (!table.selection?.length) {
            ElMessage.warning('请选择需要操作的数据')
            return
        }
        ElMessageBox.confirm(
            '选中数据将被永久删除, 是否继续？',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(async () => {
                const deleteIds: any[] = [];
                table.selection?.forEach(u => {
                    deleteIds.push(u.user_id)
                })
                sureDelete(deleteIds)
            })
            .catch(() => {
                clearSelections(tableRef)
            })

    }

    //确认删除
    const sureDelete = async (deleteIds: string[]) => {
        await api.user_delete(deleteIds);
        ElMessage.success('删除成功')
        fetchData(table, query)
    }
    //分页
    const paginationChange = () => fetchData(table, query)
    return {
        tableRef,
        search,
        reset,
        selectChange,
        singleDelete,
        batchDelete,
        paginationChange
    }
}

//新增修改
const editHandle = (table: ITableRender<ITableRenderList>, query: IQueryParams) => {
    const editRef = ref<any>(null)
    const dialog = reactive<IEditDialog>({
        visible: false,
        title: '新增'
    })
    //新增
    const add = () => {
        dialog.visible = true
        dialog.title = '新增'
    }

    //编辑
    const edit = (row: ITableRenderList) => {
        dialog.visible = true
        dialog.title = '编辑'
        unref(editRef).setEditForm(row)
    }
    const editSuccess = () => fetchData(table, query)
    return {
        add,
        edit,
        editRef,
        dialog,
        editSuccess,
    }
}

export default defineComponent({
    name: 'User',
    components: { Pagination, Delete, Edit, ArrowDown, UserEdit },
    setup() {
        const queryParams = reactive<IQueryParams>({
            username: ''
        })
        const tableData = reactive<ITableRender<ITableRenderList>>({
            loading: false,
            data: [],
            selection: [],
            total: 0,
            page: 1,
            limit: 10
        })

        return {
            queryParams,
            tableData,
            ...pageHandle(tableData, queryParams),
            ...editHandle(tableData, queryParams)
        }
    }
})

</script>