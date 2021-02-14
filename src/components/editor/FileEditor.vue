<template>
    <div class="editor">
        <div class="title-container">
            <button class="save" v-if="unsaved" @click="saveunsaved">
                <fa-icon icon="save" fixed-width></fa-icon>
            </button>
            <button  v-else 
                class="bookmark" 
                :class="{ active: file.bookmarked }"
                @click="bookmark"
            >
                <fa-icon :icon="icon" :style="{ color: file.iconColor }" fixed-width></fa-icon>
            </button>
            <input class="title" placeholder="Title..." :value="file.name" @input="editTitle">
            <button v-if="!unsaved" class="meta" @click="setView('meta')">
                <fa-icon :icon="['fal','info-circle']" fixed-width></fa-icon>
            </button>
        </div>
        <div class="body-container">
            <div v-if="!loading" class="editor-body" contenteditable="true" @input="storeBody" v-html="body">
            </div>
            <div v-else>
                Loading...
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
export default {
    name: "FileEditor",
    props: {
        file: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            body: '',
            storedBody: '',
            loading: false,
            unsaved: true,
        }
    },
    mounted() {
        if(!this.file.unsaved) {
            this.unsaved = false;
            this.getBody();
        }
    },
    computed: {
        icon() {
            const style = ['fal', this.file.icon || 'bookmark'];
            if(this.file.bookmarked) style[0] = 'fas';
            return style;
        }
    },
    methods: {
        ...mapMutations(['updateTitle', 'updateBookmarked', 'createFile', 'openEditor', 'closeEditor', 'updateEdited', 'setView']),
        ...mapActions(['fetchFileBody', 'updateFile']),
        async getBody() {
            
            this.loading = true;

            const { status, data } = await window.ipcRenderer.invoke('fetch-file', this.file.id);

            if(status == 'success') {
                this.body = data;
            } else {
                console.log(data);
            }

            this.loading = false;

        },
        storeBody(e) {
            this.storedBody = e.target.innerHTML;
            if(!this.unsaved) {
                this.saveBody();
                this.updateEdited(this.file.id);
            }
        },
        saveBody() {
            window.ipcRenderer.invoke('write-file', this.file.id, this.storedBody).catch((err) => console.error(err))
        },
        editTitle(e) {
            const newtitle = e.target.value;
            if(!this.unsaved) {
                this.updateTitle({ fileId: this.file.id, title: newtitle });
                this.updateFile();
            } else {
                this.file.name = newtitle;
            }
        },
        bookmark() {
            this.updateBookmarked({ fileId: this.file.id, bookmarked: !this.file.bookmarked })
            this.updateFile();
        },
        saveunsaved() {
            if(this.unsaved && this.file.name) {
                this.createFile({ id: this.file.id, name: this.file.name, folder: this.file.folder });
                this.updateFile();
                this.saveBody();
                this.unsaved = false;
                this.closeEditor(this.file.id);
                this.openEditor(this.file.id);
                // Note: Vue will reuse this component because the key is the same
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../style/variables.scss';

.editor {
    height:100%;
    position: relative;
    max-width: 1080px;
    width:100%;

    display: grid;
    grid-template-rows: auto 1fr;

    .title-container {
        width:100%;
        display: flex;
        border-bottom:1px solid $input-primary;
        gap:0.4rem;
        padding:0.4rem 0.6rem;

        .bookmark {
            background:none;
            opacity: 0.2;

            &:hover {
                opacity: 0.8;
                background:rgba($accent, 0.6);
            }

            &.hidden {
                display: none;
            }

            &.active {
                opacity: 1;
                color:$accent;
            }
        }

        input.title {
            font-size:1.4rem;
            font-family: inherit;
            background:none;
            border:none;
            color:inherit;
            padding:0.2em 0.6em;
            width:100%;
            font-family: 'Fira Code';

            &:focus {
                outline: none;
            }
        }

        .meta {

            &.active {
                color:$accent;
            }
        }

    }

    .body-container {
        height:100%;
        overflow-y:scroll;
        font-family: 'Fira Code';

        &.hidden {
            display:none;
        }

        .editor-body {
            padding:0.1rem 0rem 40vh 0.5rem;

            &:focus {
                outline: none;
            }
        }
    }

    }
</style>