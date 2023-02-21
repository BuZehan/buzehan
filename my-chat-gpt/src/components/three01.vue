<template>
    <div ref="threeWrapper" id="threeWrapper">

    </div>
</template>
<script>
import Three from '@/utils/three'
import { nextTick } from 'process'
import { ref } from 'vue'
export default {
    name: "Three01",
    setup() {
        const threeWrapper = ref(null)
        nextTick(() => {
            const three = new Three(threeWrapper)
            three.Init()
            console.log('Three :', three)
        })


        return {
            threeWrapper
        }
    }
}
</script>
<style lang="less" scoped>
    #threeWrapper{
        z-index: -1;
    }
</style>