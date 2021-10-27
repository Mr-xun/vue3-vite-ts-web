<template>
    <div>
        Home
        <el-button type="primary" @click="addCount"></el-button>
        <div v-for="item in 200" :key="item">home+{{ item + 1 }}</div>
    </div>
</template>
<script lang ="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store/index'

export default defineComponent({
    setup() {
        const store = useStore(key)
        const addCount = () => {
            store.commit('increment')
        }
        return {
            addCount
        }
    }
})
</script>