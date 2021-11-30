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
                    <el-button type="primary" plain class="filter-item" @click="batchDelete">删除</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-container">
            <el-table
                ref="table"
                v-loading="tableData.loading"
                :data="tableData.data"
                border
                fit
                :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
                stripe
                style="width: 100%;"
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
import { defineComponent, onMounted, reactive } from 'vue'
import Pagination from "@/components/Pagination/index.vue"

import api from '@/api'
interface IQueryParams {
    username: string
}
interface ITableRenderData {
    username: string
}

//加载数据
const fetchData = async (table: ITableRender<ITableRenderData>, query: IQueryParams) => {
    table.loading = true;
    let params: ITableQuery = {
        pageNum: table.page,
        pageSize: table.limit,
        ...query
    }
    let result = await api.user_list(params)
    table.loading = false;
    table.data = result.data.rows;
    table.total = result.data.total;

}
//渲染操作
const renderHandle = (table: ITableRender<ITableRenderData>, query: IQueryParams) => {
    onMounted(() => search())
    //查询
    const search = () => {
        table.page = 1;
        fetchData(table, query)
    }
    //批量删除
    const batchDelete = async () => {
        let result = await api.user_delete(['619c8bc861de99d52bac2931', '619c8bee61de99d52bac2933']);
        if (result.code == 200) {
            fetchData(table, query)
        }
    }
    //分页
    const paginationChange = () => fetchData(table, query)
    return {
        search,
        batchDelete,
        paginationChange
    }
}

export default defineComponent({
    name: 'User',
    components: { Pagination },
    setup() {
        const queryParams = reactive<IQueryParams>({
            username: ''
        })
        const tableData = reactive<ITableRender<ITableRenderData>>({
            loading: false,
            data: [],
            total: 0,
            page: 1,
            limit: 10
        })
        return {
            queryParams,
            tableData,
            ...renderHandle(tableData, queryParams)
        }
    }
})

</script>