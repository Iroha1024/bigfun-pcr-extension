<template>
    <div class="select" @mousewheel="scrollList($event)">
        <a-icon type="up" style="padding-bottom: 15px" />
        <div class="wrapper" :style="`height: ${wrapperHeight}px;`">
            <div
                class="option"
                :class="{ 'option--hover': currentId == item.id }"
                v-for="item of battleList"
                :key="item.id"
                @mouseenter="mouseenter(item.id)"
                @click="click(item.id)"
            >
                {{ item.name }}
            </div>
        </div>
        <a-icon type="down" style="padding-top: 15px" />
    </div>
</template>

<script>
import { mapState } from 'vuex'
import clonedeep from 'lodash.clonedeep'

export default {
    data() {
        return {
            battleList: [],
            currentId: 0,
        }
    },
    computed: {
        ...mapState({
            guild: (state) => state.guild,
        }),
        wrapperHeight() {
            const len = this.battleList.length
            if (len < 3) {
                return 40 * len
            } else {
                return 120
            }
        },
    },
    created() {
        this.battleList = clonedeep(this.guild.battleList)
    },
    methods: {
        scrollList(event) {
            //向下滑动
            if (event.wheelDelta < 0) {
                const item = this.battleList.shift()
                this.battleList.push(item)
            } else {
                const item = this.battleList.pop()
                this.battleList.unshift(item)
            }
        },
        mouseenter(id) {
            this.currentId = id
        },
        click(id) {
            this.$store.commit('guild/setCurrentBattleId', id)
        },
    },
}
</script>

<style lang="scss" scoped>
.select {
    width: 300px;
    text-align: center;
    i {
        font-size: 20px;
    }
    .wrapper {
        overflow: hidden;
        .option {
            font-size: 25px;
            line-height: 40px;
            color: #ccc;
            font-family: STKaiti;
        }
        .option--hover {
            cursor: pointer;
            font-size: 30px;
            color: #000;
            border-radius: 5px;
        }
    }
}
</style>
