<template>
    <div class="setting">
        <div class="period-num">
            <span>公会战：</span>
            <Select :type="2" :bodyStyle="{ width: 'auto', fontSize: '15px' }"></Select>
        </div>
        <a-checkbox-group v-model="checkedList" :options="checkBoxList"></a-checkbox-group>
    </div>
</template>

<script>
import Select from './Select'

import { mapState } from 'vuex'

export default {
    components: {
        Select,
    },
    computed: {
        ...mapState({
            storage: (state) => state.storage,
        }),
    },
    watch: {
        storage: {
            handler: 'update',
            deep: true,
            immediate: true
        }
    },
    data() {
        return {
            checkBoxList: [
                {
                    label: '自动选择当期公会战',
                    value: 'autoComplete',
                    onChange: ({ target: { checked } }) => {
                        this.$store.commit('storage/setStorage', {
                            key: 'autoComplete',
                            value: checked,
                        })
                    },
                },
                {
                    label: '显示提示信息',
                    value: 'showTitleTip',
                    onChange: ({ target: { checked } }) => {
                        this.$store.commit('storage/setStorage', {
                            key: 'showTitleTip',
                            value: checked,
                        })
                    },
                },
            ],
            checkedList: [],
        }
    },
    methods: {
        update() {
            this.checkedList = []
            for (const key in this.storage) {
                this.storage[key] && this.checkedList.push(key)
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.setting {
    font-size: 15px;
    height: 300px;
    .period-num {
        display: flex;
        align-items: center;
    }
    /deep/ .ant-checkbox-group label {
        font-size: 15px;
        display: block;
        margin-top: 12px;
    }
}
</style>
