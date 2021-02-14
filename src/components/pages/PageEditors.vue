<template>
    <section id="editors" class="tab" style="">
        <ul class="editor-tabs" v-show="activeFiles.length > 1">
            <!-- Editor Tab Names Here -->
            <li
                v-for="file in activeFiles"
                :key="file.id"
                :class="{ active: activeEditor == file.id }"
                
            >
                <span class="tab-title" @click="openEditor(file.id)">{{file.name || '* Untitled'}}</span>
                <span class="tab-close" @click="closeEditor(file.id)">×</span>
            </li>
        </ul>
        <div class="editors" v-if="activeFiles.length">
            <file-editor
                v-for="file in activeFiles"
                :key="file.id"
                :file="file"
                v-show="activeEditor == file.id"
            ></file-editor>
        </div>
    </section>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import FileEditor from '../editor/FileEditor';
export default {
    name:"PageEditors",
    components: {
        FileEditor,
    },
    mounted() {
        if(this.activeFiles.length == 0) {
            this.setView('explorer')
        }
    },
    computed: {
        ...mapState(['activeFiles', 'activeEditor']),
        ...mapGetters(['getFileById']),
    },
    methods: {
        ...mapMutations(['openEditor', 'closeEditor', 'setView'])
    }
}
</script>

<style lang="scss" scoped>
@import '../../style/variables';

#editors {
    display: grid;
    grid-template-rows: auto 1fr;
    height:100%;
    width:100%;

    ul.editor-tabs {
        list-style: none;
        padding:0;
        margin:0;

        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));

        // For only showing when > 1 editor
        &.active {
            display:grid;
        }

        li {
            padding:0.2rem 0rem;
            text-align: center;
            margin-right:0.1rem;
            opacity: 0.6;
            background:$input-primary;
            cursor: pointer;

            position: relative;
            font-size:0.8rem;

            display: grid;
            grid-template-columns: 1fr auto;

            &:hover {
                background:$input-secondary;
            }

            &.active {
                opacity: 1;
                background:none;

                .tab-close {
                    display:flex;
                }
            }

            .tab-title {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .tab-close {
                padding:0em 0.4em;
                display: none;
                align-items: center;
                justify-content: center;

                &:hover {
                    background:$input-secondary;
                }
            }

            &.unsaved {
                font-style: italic;
            }
        }
    }

    .editors {
        overflow:hidden;
        display: flex;
        justify-content: center;
    }
}

</style>