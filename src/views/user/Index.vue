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
                    <el-button type="primary" plain class="filter-item">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-container">
            <el-table
                ref="table"
                v-loading="loading"
                :data="list"
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
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
interface IQueryParams {
    username: string
}
export default defineComponent({
    name: 'User',
    setup() {
        const queryParams = reactive<IQueryParams>({
            username: ''
        })
        const loading = ref(false)
        const list = reactive([])
        return {
            queryParams,
            list,
            loading
        }
    }
})
</script>