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

export default {
    components: {
        Select,
    },

    data() {
        return {
            storage: {
                autoComplete: false,
            },
            checkBoxList: [
                {
                    label: '自动选择当期公会战',
                    value: 'autoComplete',
                    onChange: (val) => {
                        this.storage.autoComplete = !this.storage.autoComplete
                        chrome.storage.sync.set(
                            { autoComplete: this.storage.autoComplete },
                            () => {}
                        )
                    },
                },
            ],
            checkedList: [''],
        }
    },
    created() {
        chrome.storage.sync.get(Object.keys(this.storage), ({ autoComplete }) => {
            this.storage.autoComplete = autoComplete
            this.init()
        })
    },
    methods: {
        init() {
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
