<template>
    <div>
        
        <el-button type="primary" @click="addCount">addCount</el-button>
        <div v-for="count in num" :key="count">count+{{ count  }}</div>
    </div>
</template>
<script lang ="ts">
import { defineComponent,computed } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store/index'

export default defineComponent({
    setup() {
        const store = useStore(key)
        const addCount = () => {
            store.commit('increment')
        }
        const num = computed(()=>store.state.count)
        return {
            num,
            addCount
        }
    }
})
</script>