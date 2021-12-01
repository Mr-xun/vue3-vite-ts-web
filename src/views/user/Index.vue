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
                                <el-dropdown-item>新增用户</el-dropdown-item>
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
                <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
                <el-table-column
                    label="用户名"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="80px"
                    prop="username"
                ></el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    min-width="150px"
                    fixed="right"
                    class-name="small-padding fixed-width"
                >
                    <template v-slot:default="{ row }">
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
        </div>
    </div>
</template>
<script lang="ts">
import api from '@/api'
import { Delete, ArrowDown } from '@element-plus/icons'
import { ElMessage, ElMessageBox } from 'element-plus'
import Pagination from "@/components/Pagination/index.vue"

import { defineComponent, onMounted, reactive, ref, unref } from 'vue'


interface IQueryParams {
    username?: string
}
interface ITableRenderData {
    username: string
    _id?: string
}

//加载数据
const fetchData = async (table: ITableRender<ITableRenderData>, query: IQueryParams) => {
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
const pageHandle = (table: ITableRender<ITableRenderData>, query: IQueryParams) => {
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
    const selectChange = (selection: ITableRenderData[]) => {
        table.selection = selection
    }

    //单个删除table
    const singleDelete = async (row: ITableRenderData) => {
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
                    deleteIds.push(u._id)
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

export default defineComponent({
    name: 'User',
    components: { Pagination, Delete, ArrowDown },
    setup() {
        const queryParams = reactive<IQueryParams>({
            username: ''
        })
        const tableData = reactive<ITableRender<ITableRenderData>>({
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
            ...pageHandle(tableData, queryParams)
        }
    }
})

</script>