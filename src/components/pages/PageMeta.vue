<template>
    <section id="meta" v-if="file">
        <div class="title">{{file.name}}</div>
        <ul class="meta-nav">
            <li 
                :class="{ active: tab == 'info' }"
                @click="tab = 'info'"
            >Info</li>
            <li
                :class="{ active: tab == 'icon' }"
                @click="tab = 'icon'"
            >Icon</li>
            <li
                :class="{ active: tab == 'actions' }"
                @click="tab = 'actions'"
            >Actions</li>
        </ul>
        <ul class="meta-section info" v-show="tab == 'info'">
            <li>
                <div>id</div><div class="id">{{file.id}}</div>
            </li>
            <li>
                <div>name</div><div>{{file.name}}</div>
            </li>
            <li>
                <div>folder</div><div>{{getFolder(file.parent) ? getFolder(file.parent).name : 'Home'}}</div>
            </li>
            <li>
                <div>created</div><div>{{createdAt}}</div>
            </li>
            <li>
                <div>edited</div><div>{{editedAt}}</div>
            </li>
            <li>
                <div>icon</div><div><fa-icon :icon="file.icon || 'bookmark'" :style="{ color: file.iconColor }"></fa-icon> {{file.icon || 'bookmark'}}</div>
            </li>
            <li>
                <div>bookmarked</div><div>{{file.bookmarked ? 'Yes' : 'No'}}</div>
            </li>
        </ul>
        <ul class="meta-section icon" v-show="tab == 'icon'">
            <li class="action"
                v-for="icon in icons"
                :key="icon.name"
            >
                <div :class="{ active: file.icon == icon.name }">{{icon.title}}</div>
                <div class="icon-color-picker">
                    <div class="icon-color"
                        v-for="colour in colours"
                        :key="colour"
                        :style="{ color: colour != 'accent' ? colour : '' }"
                        @click="setIcon(icon.name, colour)"
                        :class="{ active: file.icon == icon.name && file.iconColor == colour }"
                    >
                        <fa-icon 
                            :icon="[file.icon == icon.name && file.iconColor == colour ? 'fas' : 'fal',icon.name]" 
                            fixed-width
                        ></fa-icon>
                    </div>
                    
                </div>
            </li>
        </ul>
        <ul class="meta-section actions" v-show="tab == 'actions'">
            <li>
                Delete File
                <are-you-sure @done="removeFile(file.id)">Delete</are-you-sure>
            </li>
        </ul>
    </section>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import moment from 'moment'
import AreYouSure from '../utilities/AreYouSure'
export default {
    name: 'PageMeta',
    components: {
        AreYouSure,
    },
    data() {
        return {
            tab: 'info',
            icons: [
                { title: 'Bookmark', name: 'bookmark' },
                { title: 'Tag', name: 'tag' },
                { title: 'Note', name: 'sticky-note' },
                { title: 'Code', name: 'code' },
                { title: 'Idea', name: 'lightbulb' },
                { title: 'Book', name: 'book' },
                { title: 'Books', name: 'books' },
                { title: 'Chapter', name: 'book-open' },
                { title: 'Pinned', name: 'thumbtack' },
                { title: 'List', name: 'list-ul' },
                { title: 'Objective', name: 'check-circle' },
                { title: 'Certified', name: 'certificate' },
                { title: 'Reminder', name: 'bell' },
                { title: 'Mail', name: 'envelope' },
                { title: 'Calendar', name: 'calendar' },
                { title: 'Landmark', name: 'landmark' },
                { title: 'Mountains', name: 'mountains' },
                { title: 'Location', name: 'map-marked' },
                { title: 'Travel', name: 'plane-departure' },
                { title: 'Food', name: 'utensils-alt' },
                { title: 'Shopping', name: 'shopping-basket' },
                { title: 'Computer', name: 'computer-classic' },
                { title: 'Data', name: 'database' },
                { title: 'Scientific', name: 'flask' },
                { title: 'Earthly', name: 'planet-moon' },
                { title: 'Space', name: 'planet-ringed' },
                { title: 'Revolutionary', name: 'fist-raised' },
                { title: 'Secretive', name: 'user-secret' },
                { title: 'Aquatic', name: 'fish' },
                { title: 'Radioactive', name: 'radiation' },
                { title: 'Wizardous', name: 'hat-wizard' },
                { title: 'No Moon', name: 'space-station-moon' },
                { title: 'Yikes', name: 'dumpster-fire' },
                { title: 'Caw', name: 'crow' },
            ],
            colours: [
                'accent',
                'var(--textColor)',
                '#e08415',
                '#f08080',
                '#cd5c5c',
                '#ffff00',
                '#9acd32',
                '#228b22',
                '#1e90ff',
                '#20b2aa',
                '#9370db',
                '#cd853f'
            ]
        }
    },
    mounted() {
        if(!this.file) this.setView('explorer');
    },
    computed: {
        ...mapGetters({ file: 'getActiveEditorFile', getFolder: 'getFolderById' }),
        createdAt() {
            return moment(this.file.created).format('DD/MM/YY hh:mm a')
        },
        editedAt() {
            return moment(this.file.edited).format('DD/MM/YY hh:mm a')
        }
    },
    methods: {
        ...mapMutations(['updateIcon', 'setView']),
        ...mapActions(['updateFile', 'removeFile']),
        setIcon(icon, colour) {
            this.updateIcon({ fileId: this.file.id, icon, colour });
            this.updateFile();
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../style/variables.scss';

#meta {

    padding:0.4rem;
    display: grid;
    grid-template-rows: auto auto 1fr;
    height:100%;
    width:100%;
    max-width: 720px;
    margin:0 auto;
    
    .title {
        // File's Title
        font-size:1.4rem;
        font-style: italic;
        opacity: 0.8;
        padding:0.4rem 0.6rem;
    }

    ul.meta-nav {
        // Navigation of meta
        list-style: none;
        margin:0;
        padding:0;

        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap:0.4rem;
        padding:0.4rem;

        li {
            width:100%;
            text-align: center;
            padding:0.2rem 0rem;
            margin:0rem 0.2rem;
            cursor: pointer;
            background:$input-primary;
            border-style: inset;
            border:none;
            border-radius: $curve;

            &:hover {
                background:rgba($accent, 0.2);
            }

            &.active {
                background:rgba($accent, 0.6);
            }
        }
    }

    ul.meta-section {
        // All Section
        list-style: none;
        margin:0;
        padding:0;

        padding:0.4rem;
        overflow-y:auto;

        li {
            display: grid;
            grid-template-columns: 1fr 2fr;
            margin-bottom:0.4rem;

            &.action {
                cursor: pointer;
                &:hover {
                    background:$input-secondary;
                }

                .active {
                    color:$accent;
                    font-weight: 600;
                }

                .icon-color-picker {
                    display: flex;
                    padding:0;

                    .icon-color {
                        color:$accent;
                        height:100%;
                        display: flex;
                        align-items: center;
                        padding:0em 0.1em;
                        
                        &:hover {
                            background: $input-primary;
                        }

                        &.active {
                            background: $input-secondary;
                        }
                    }
                }
            }

            

            > * {
                padding:0.2rem;
            }
        }
    }

    .id {
        font-size:0.8em;
    }

}
</style>