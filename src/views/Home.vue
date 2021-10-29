<template>
    <div>
        <el-button type="primary" @click="testApi">testApi</el-button>
        <el-button type="primary" @click="addCount">addCount</el-button>
        <p>{{ JSON.stringify(result) }}</p>
        <div v-for="count in num" :key="count">count+{{ count }}</div>
    </div>
</template>
<script lang ="ts">
import { defineComponent, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store/index'
import api from "@/api"
export default defineComponent({
    setup() {
        const store = useStore(key)
        const addCount = () => {
            store.commit('increment')
        }
        const num = computed(() => store.state.count)
        let result = ref({})
        const testApi = async () => {
            result.value = await api.testApi()
            console.log(result)
        }
        return {
            num,
            result,
            addCount,
            testApi
        }
    }
})
</script>