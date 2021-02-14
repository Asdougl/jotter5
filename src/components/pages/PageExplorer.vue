<template>
    <section section="explorer" id="explorer" class="tab">
        <div class="current-path">
            <div class="path-items">
                <div class="item"
                    @click="setActiveFolder(null)" 
                >Home</div>
                <div class="item"
                    v-for="item in getPath"
                    :key="item.id"
                    @click="setActiveFolder(item)"
                >
                    {{item.name}}
                </div>
            </div>
            <div class="path-edit" v-if="activeFolder != null" @click="editfolder = !editfolder">
                <fa-icon :icon="[editfolder ? 'fas' : 'fal', 'cog']" fixed-width></fa-icon>
            </div>
            <div class="path-config" v-if="activeFolder && editfolder">
                <div class="name">
                    <input type="text" v-model="editfoldername">
                    <button @click="saveFolder">
                        <fa-icon icon="save" fixed-width></fa-icon>
                    </button>
                </div>
                <are-you-sure @done="deleteActive">
                    Delete
                </are-you-sure>
            </div>
        </div>
        <div class="actions">
            <div class="new-actions">
                <button class="new-file" @click="openEditor()">
                    New File
                </button>
                <button class="new-folder" @click="toggleNewFolder" :class="{ active: newfolder }">
                    New Folder
                </button>
                <button class="search" @click="toggleSearch" :class="{ active: searching }">
                    Search
                </button>
            </div>
            <div class="new-folder-field" v-show="newfolder">
                <input type="text" placeholder="Folder Name..." v-model="newfoldername">
                <button @click="newFolder">Save</button>
            </div>
            <div class="search-field" v-show="searching">
                <input type="text" placeholder="Search..." v-model="searchQuery">
                <button @click="searchBookmarked = !searchBookmarked">
                    <fa-icon :icon="[ searchBookmarked ? 'fas' : 'fal', 'bookmark' ]"></fa-icon>
                </button>
            </div>
        </div>
        <div class="folders-files">
            <ul class="folders" v-if="!searching">
                <li
                    v-for="folder of getActiveFolder"
                    :key="folder.id"
                    @click="setActiveFolder(folder)"
                >
                    <div class="icon">
                        <fa-icon :icon="['fal', 'folder']" fixed-width></fa-icon>
                    </div>
                    <span>{{folder.name}}</span>
                </li>
            </ul>
            <ul class="files">
                <li 
                    class="file" 
                    v-for="file of (!searching ? getActiveFiles : getQueriesFiles)" 
                    :key="file.id"
                    
                >
                    <div class="icon" :class="{active: file.bookmarked}">
                        <fa-icon 
                            :icon="[file.bookmarked ? 'fas' : 'fal', file.icon || 'bookmark']" 
                            :style="{ color: file.iconColor }"
                            @click="updateBookmarked({ fileId: file.id, bookmarked: !file.bookmarked })" 
                            fixed-width
                        ></fa-icon>
                    </div>
                    <div @click="openEditor(file.id)">{{file.name}}</div>
                    <div class="actions">
                        <div class="icon">
                            <fa-icon :icon="['fal', 'info-circle']" @click="openInMeta(file.id)" fixed-width></fa-icon>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import AreYouSure from '../utilities/AreYouSure'

export default {
    name:"PageExplorer",
    components: {
        AreYouSure,
    },
    data() {
        return {
            newfolder: false,
            newfoldername: '',
            editfolder: false,
            editfoldername: '',
            searching: false,
        }
    },
    watch: {
        activeFolder() {
            this.editfolder = false;
            this.editfoldername = this.activeFolder ? this.activeFolder.name : '';
        }
    },
    computed: {
        ...mapState(['path', 'activeFolder', 'fileSearchQuery', 'fileSearchBookmarked']),
        ...mapGetters(['getActiveFolder', 'getActiveFiles', 'getPath', 'getQueriesFiles']),
        searchQuery: {
            get() {
                return this.fileSearchQuery;
            },
            set(value) {
                this.setSearchQuery(value)
            }
        },
        searchBookmarked: {
            get() {
                return this.fileSearchBookmarked;
            },
            set(value) {
                this.toggleSearchBookmarked(value);
            }
        }
    },
    methods: {
        ...mapMutations(['openEditor', 'setActiveFolder', 'createFolder', 'updateFolder', 'deleteFolder', 'updateBookmarked', 'setView', 'setSearchQuery', 'toggleSearchBookmarked']),
        ...mapActions(['updateFile']),
        newFolder() {
            if(this.newfoldername) {
                this.createFolder({
                    foldername: this.newfoldername,
                    parent: this.activeFolder ? this.activeFolder.id : null,
                })
                this.updateFile();
                this.newfoldername = '';
                this.newfolder = false;
            }
        },
        deleteActive() {
            const to = this.activeFolder.parent;
            this.deleteFolder(this.activeFolder.id);
            this.updateFile();
            this.setActiveFolder(to);
        },
        saveFolder() {
            if(this.editfoldername) {
                this.updateFolder({
                    folderId: this.activeFolder.id,
                    name: this.editfoldername
                })
                this.updateFile();
                this.editfolder = false;
            }
        },
        openInMeta(fileId) {
            this.openEditor(fileId);
            this.setView('meta');
        },
        toggleSearch() {
            this.newfolder = false;
            if(this.searching) {
                // Close searching
                this.searchQuery = '';
                this.searching = false;
            } else {
                this.searching = true;
            }
        },
        toggleNewFolder() {
            this.searching = false;
            this.newfolder = !this.newfolder;
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../style/variables.scss';

#explorer {
    display: grid;
    grid-template-rows: auto auto 1fr;
    height:100%;
    width:100%;
    max-width: 1920px;
    margin:0 auto;

    .current-path {

        margin:0.4em;
        border: 1px solid $input-primary;

        position: relative;

        border-radius: $curve;

        .path-items {
            display: flex;

            .item {
                padding:0.4em 0.6em;
                position: relative;
                cursor: pointer;

                border-radius: $curve;

                margin-right:1em;
                
                &:after {
                    content: '/';
                    position: absolute;
                    right:-0.8em;
                    opacity: 0.4;
                }

                &:hover {
                    background:$input-secondary;
                }

                &:last-child {
                    margin-right:0;
                    cursor: default;
                    opacity: 0.6;

                    &:after {
                        content: '';
                    }
                    &:hover {
                        background:none;
                    }
                }
                
            }
        }

        .path-edit {
            position: absolute;
            right:0;
            top:0;
            width:2rem;
            height:100%;

            display: flex;
            justify-content: center;
            align-items: center;

            opacity: 0.4;
            cursor: pointer;

            &:hover {
                opacity: 0.8;
            }
        }

        .path-config {

            display: grid;
            grid-template-columns: 1fr;

            .name {
                display: grid;
                grid-template-columns: 1fr auto;

                input {
                    background:none;
                    border:none;
                    font:inherit;
                    color:inherit;
                    padding:0.2em 0.4em;
                    border-bottom:1px solid $accent;

                    &::placeholder {
                        opacity: 0.4;
                        color:inherit;
                    }

                    &:focus {
                        outline:none;
                    }
                }
            }
        }
    }

    .actions {

        .new-actions {
            width:calc(100% - 0.8rem);
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap:0.2rem;
            margin:0.4em;
        }

        .new-folder-field, .search-field {
            margin:0em 0.4em;
            
            display: grid;
            grid-template-columns: 1fr auto;
            gap:0.2rem;

            &.active {
                display: grid;
            }

            input {
                flex-grow: 1;

                &::placeholder {
                    opacity: 0.4;
                    color:inherit;
                }

                &:focus {
                    outline:none;
                }
            }
            
        }
    }

    .folders-files {
        overflow-y:auto;

        ul.folders, ul.files {
            list-style: none;
            padding:0;
            margin:0;

            padding:0.2em 0.4em;
            margin-bottom:0.4em;

            li {
                cursor: pointer;
                display: grid;
                grid-template-columns: auto 1fr auto;

                border-radius: $curve;

                > * {
                    padding:0.4em 0.6em;
                }

                &:hover {
                    background:$input-secondary;
                }

                .icon {
                    opacity: 0.4;
                    display: flex;
                    align-items: center;
                    border-radius: $curve;

                    &.active {
                        opacity: 0.8;
                        color:$accent;

                        &:hover {
                            opacity: 0.4;
                        }
                    }

                    &:hover {
                        opacity: 0.8;
                        background:rgba($accent, 0.2);
                    }
                    
                }

                .actions {
                    display: flex;
                    align-items: center;
                    border-radius: $curve;

                    &:hover {
                        background:rgba($accent, 0.2);
                    }
                }
            }
        }
    }
}

</style>