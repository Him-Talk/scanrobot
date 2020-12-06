<template>
    <Frame>
    <renderHead slot="header"></renderHead>
    <el-main>
        <el-form ref="form" :Inline="true" class="demo-form-inline">
            <el-form-item :label="节点"></el-form-item>
        </el-form>
        <el-table></el-table>
    </el-main>
    </Frame>
</template>
<script>
    import Frame from '@/components/frame/mainFrame.vue'
    import renderHead from '@/components/header/renderHead.vue'
    export default {
        data () {
            return {}
        },
        components: {Frame, renderHead},
        methods: {

        },
        mounted() {

        }
    }
</script>