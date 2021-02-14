<template>
    <button 
        class="are-you-sure" 
        :class="{ 'making-sure': makingSure }"
        @mousedown="start"
        @mouseup="cancel"
    >
        <slot></slot>
    </button>
</template>

<script>
export default {
    name:"AreYouSure",
    data() {
        return {
            timeout: null,
            makingSure: false,
        }
    },
    methods: {
        timeoutClear() {
            clearTimeout(this.timeout);
            this.timeout = null;
        },
        start() {
            this.makingSure = true;
            this.timeout = setTimeout(() => {
                
                this.timeoutClear();
                this.makingSure = false;
                this.$emit('done');
                
            }, 3000)
        },
        cancel() {
            if(this.makingSure) {

                this.makingSure = false;
                this.timeoutClear();
                this.$emit('cancelled')

            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../style/variables.scss';

.are-you-sure {
    position: relative;

    &::after {
        content: '';
        position: absolute;
        top:0;
        left:0;
        height:100%;
        width:0%;
        background:rgba($accent, 0.6);
        opacity: 0;
    }

    &.making-sure {

        &::after {
            opacity: 1;
            animation: 3s widen linear;
        }
    }

    &.error {
        background:rgba(red, 0.4);
    }
}

@keyframes widen {
    0% {
        width: 0%;
    }
    100% {
        width: 100%;
    }
}

</style>