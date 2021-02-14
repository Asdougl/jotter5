<template>
    <header :class="{blurred: !windowFocus}">
        <div class="button" @click="navigate">
            <fa-icon v-if="navigationIcon" :icon="['fal',`chevron-${navigationIcon}`]"></fa-icon>
        </div>
        <div class="title">
            {{title}}
        </div>
        <div class="actions">
            <button class="configuration" @click="setView('config')">
                <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 8.666c-1.838 0-3.333 1.496-3.333 3.334s1.495 3.333 3.333 3.333 3.333-1.495 3.333-3.333-1.495-3.334-3.333-3.334m0 7.667c-2.39 0-4.333-1.943-4.333-4.333s1.943-4.334 4.333-4.334 4.333 1.944 4.333 4.334c0 2.39-1.943 4.333-4.333 4.333m-1.193 6.667h2.386c.379-1.104.668-2.451 2.107-3.05 1.496-.617 2.666.196 3.635.672l1.686-1.688c-.508-1.047-1.266-2.199-.669-3.641.567-1.369 1.739-1.663 3.048-2.099v-2.388c-1.235-.421-2.471-.708-3.047-2.098-.572-1.38.057-2.395.669-3.643l-1.687-1.686c-1.117.547-2.221 1.257-3.642.668-1.374-.571-1.656-1.734-2.1-3.047h-2.386c-.424 1.231-.704 2.468-2.099 3.046-.365.153-.718.226-1.077.226-.843 0-1.539-.392-2.566-.893l-1.687 1.686c.574 1.175 1.251 2.237.669 3.643-.571 1.375-1.734 1.654-3.047 2.098v2.388c1.226.418 2.468.705 3.047 2.098.581 1.403-.075 2.432-.669 3.643l1.687 1.687c1.45-.725 2.355-1.204 3.642-.669 1.378.572 1.655 1.738 2.1 3.047m3.094 1h-3.803c-.681-1.918-.785-2.713-1.773-3.123-1.005-.419-1.731.132-3.466.952l-2.689-2.689c.873-1.837 1.367-2.465.953-3.465-.412-.991-1.192-1.087-3.123-1.773v-3.804c1.906-.678 2.712-.782 3.123-1.773.411-.991-.071-1.613-.953-3.466l2.689-2.688c1.741.828 2.466 1.365 3.465.953.992-.412 1.082-1.185 1.775-3.124h3.802c.682 1.918.788 2.714 1.774 3.123 1.001.416 1.709-.119 3.467-.952l2.687 2.688c-.878 1.847-1.361 2.477-.952 3.465.411.992 1.192 1.087 3.123 1.774v3.805c-1.906.677-2.713.782-3.124 1.773-.403.975.044 1.561.954 3.464l-2.688 2.689c-1.728-.82-2.467-1.37-3.456-.955-.988.41-1.08 1.146-1.785 3.126"/></svg>
            </button>
            <button class="window-minimise" @click="send('minimize')">
                <svg x="0px" y="0px" viewBox="0 0 10.2 1"><rect x="0" y="50%" width="10.2" height="1"></rect></svg>
            </button>
            <button class="window-maximise" @click="send('maximise')">
                <svg viewBox="0 0 10 10"><path d="M0,0v10h10V0H0z M9,9H1V1h8V9z"></path></svg>
            </button>
            <button class="window-close" @click="send('close-window')">
                <svg viewBox="0 0 10 10"><polygon points="10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2 5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1"></polygon></svg>
            </button>
        </div>
    </header>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
    name: "SiteTitleBar",
    computed: {
        ...mapState(['title', 'activeFiles', 'view', 'windowFocus']),
        navigationIcon() {
            if(this.view == 'explorer') {
                if(this.activeFiles.length) {
                    return 'right';
                } else {
                    return '';
                }
            } else {
                return 'left';
            }

        }
    },
    methods: {
        ...mapMutations(['setView']),
        navigate() {
            if(this.view == 'explorer' && this.activeFiles.length) {
                this.setView('editor');
            } else if(this.view == 'meta') {
                this.setView('editor');
            } else {
                this.setView('explorer');
            }
        },
        send(channel) {
            window.ipcRenderer.send(channel);
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';

header {
    width: 100vw;
    display: grid;
    grid-template-columns: 2.5em 1fr auto;
    height:30px;
    background:$card;
    font-size:0.9rem;
    user-select: none;

    -webkit-app-region: drag;

    &.blurred {
        opacity: 0.6;
    }

    .button {
        display: flex;
        justify-content: center;
        align-items: center;
        padding:0px 5px;
        cursor: pointer;
        -webkit-app-region: no-drag;
        border-radius: 0;

        &:hover {
            background:$card;
        }

        &:empty {
            cursor: default;
            &:hover {
                background:none;
            }
        }
    }

    .title {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding:0px 5px;
        opacity: 0.6;
    }

    .actions {
        display: flex;

        button {
            -webkit-app-region: no-drag;

            font-family: inherit;
            height:29px;
            width:45px;
            background:none;
            border:none;
            color:inherit;

            display: flex;
            justify-content: center;
            align-items: center;

            cursor: default;

            border-radius: 0;

            &:hover {
                background:$input-secondary;
            }

            &:focus {
                outline:none;
            }

            svg path, 
            svg rect, 
            svg polygon {
                fill: $text;
            }
            svg {
                width: 10px;
                height: 10px;
            }

            &.window-close {
                &:hover {
                    background:rgb(232, 17, 35);
                    svg polygon {
                        fill:#fff;
                    }
                }
            }
        }
    }
}

</style>