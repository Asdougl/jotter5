<template>
    <div>
        <h4>J5 Configuration</h4>
        <ul class="settings">
            <li class="option">
                <div class="title">Theme</div>
                <div class="value">
                    <multi-selector
                        v-model="theme"
                        :options="[
                            { name: 'Dark', value: 'dark' },
                            { name: 'Light', value: 'light' },
                            { name: 'Vibrant', value: 'vibrant' }
                        ]"
                    ></multi-selector>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

import MultiSelector from '../utilities/MultiSelector'

export default {
    name: "PageConfig",
    components: {
        MultiSelector
    },
    data() {
        return {
            accentColours: [
                '#90ee90',
                '#91d7ee',
                '#eea891',
                '#ee91ee',
                '#d3d3d3',
                '#91eeee',
                '#eeee91',
                '#d791ee',
                '#a891ee',
                '#eebf91',
                '#ee9191',
            ],
        }
    },
    computed: {
        ...mapState({ themeValue: 'theme' }),
        theme: {
            get() {
                return this.themeValue;
            },
            set(value) {
                this.setTheme(value);
            }
        }
    },
    methods: {
        ...mapMutations(['setTheme'])
    }
}
</script>

<style lang="scss" scoped>

</style>