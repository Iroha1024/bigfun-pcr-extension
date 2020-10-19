<template>
    <div class="select" @mousewheel="scrollList($event)" :style="bodyStyle">
        <a-icon v-if="type == 1" type="up" style="margin-bottom: 15px" />
        <div class="wrapper" :style="`height: ${wrapperHeight}px;`">
            <div
                class="option"
                :class="{ 'option--hover': currentId == item.id }"
                v-for="item of battleList"
                :key="item.id"
                @mouseenter="mouseenter(item.id)"
                @mouseleave="mouseleave"
                @click="click(item.id)"
            >
                <a-icon v-if="type == 2" type="left" style="margin-right: 30px" />
                <span>{{ item.name }}</span>
                <a-icon v-if="type == 2" type="right" style="margin-left: 30px" />
            </div>
        </div>
        <a-icon v-if="type == 1" type="down" style="margin-top: 15px" />
    </div>
</template>

<script>
import { mapState } from 'vuex'
import clonedeep from 'lodash.clonedeep'

export default {
    props: {
        type: Number,
        bodyStyle: {
            type: Object,
            default: () => ({
                width: '300px',
            }),
        },
    },
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
            if (this.type == 1) {
                const len = this.battleList.length
                if (len < 3) {
                    return 40 * len
                } else {
                    return 120
                }
            } else {
                return 40
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
        mouseleave() {
            this.currentId = -999
        },
        click(id) {
            this.$store.commit('guild/setCurrentBattleId', id)
        },
    },
}
</script>

<style lang="scss" scoped>
.select {
    font-size: 25px;
    text-align: center;
    i {
        font-size: inherit;
    }
    .wrapper {
        overflow: hidden;
        .option {
            line-height: 40px;
            color: #ccc;
            font-family: STKaiti;
            i {
                color: #000;
            }
        }
        .option--hover {
            span {
                cursor: pointer;
                color: #000;
                border-radius: 5px;
            }
        }
    }
}
</style>
