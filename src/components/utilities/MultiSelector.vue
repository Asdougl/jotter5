<template>
    <div class="multi-selector">
        <ul class="options">
            <li
                v-for="opt in options"
                :key="optVal(opt)"
                :ref="optVal(opt)"
                @click="setValue(optVal(opt))"
            >
                {{optType(opt) == 'value' ? opt : opt.name}}
            </li>
        </ul>
        <div class="current" :style="currPos"></div>
    </div>
</template>

<script>
export default {
    name: "MultiSelector",
    props: {
        value: [String, Number, Boolean],
        options: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            currPos: {
                width:0,
                left:0,
            }
        }
    },
    mounted() {
        const ref = this.$refs[this.value];
        if(ref) {
            this.currPos.width = ref[0].offsetWidth + 'px';
            this.currPos.left = ref[0].offsetLeft + 'px';
        }
    },
    methods: {
        optType(opt) {
            if(typeof opt === 'object') {
                if(opt.icon !== undefined) {
                    return 'icon'
                } else {
                    return 'obj'
                }
            } else {
                return 'value'
            }
        },
        optVal(opt) {
            const type = this.optType(opt);
            if(type == 'value') return opt;
            return opt.value;
        },
        setValue(value) {
            const ref = this.$refs[value];
            if(ref) {
                console.log(ref);
                this.currPos.width = ref[0].offsetWidth + 'px';
                this.currPos.left = ref[0].offsetLeft + 'px';
            } else {
                console.log("None");
            }
            this.$emit('input', value);
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../style/variables';

.multi-selector {
    position: relative;

    ul.options {
        list-style: none;
        padding:0;margin:0;

        display: flex;

        li {
            z-index:1;
            padding:0.2em 0.4em;
            cursor: pointer;
        }
    }

    .current {
        position: absolute;
        top:0;
        height:100%;
        background: $input-secondary;
        z-index:0;
        transition: all 0.2s;
    }

}

</style>