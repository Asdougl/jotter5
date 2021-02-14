import Vuex from 'vuex'
import Vue from 'vue'

// import router from '../router'
import moment from 'moment'
import { v4 as uuidv4 } from "uuid";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        fetched: false,
        theme: 'dark',
        accent: '#6a5acd',
        title: 'J5 Editor',
        files: [],
        folders: [],
        activeFolder: null,
        activeFiles: [],
        activeEditor: null,
        view: 'explorer',
        fileSearchQuery: '',
        fileSearchBookmarked: false,
        windowFocus: true
    },
    getters: {
        getActiveFolder: (state) => {
            const folders = state.folders.filter(folder => folder.parent == (state.activeFolder ? state.activeFolder.id : null))
            return folders.sort((a, b) => {
                if (a.name > b.name) {
                    return 1;
                }
                if (a.name < b.name) {
                    return -1;
                }
                return 0;
            })
        },
        getActiveFiles: (state) => {
            const files = state.files.filter(file => file.folder == (state.activeFolder ? state.activeFolder.id : null))
            return files.sort((a, b) => {
                const ma = moment(a.edited), mb = moment(b.edited);
                if (ma.isBefore(mb)) {
                    return 1;
                }
                if (ma.isAfter(mb)) {
                    return -1;
                }
                return 0;
            })
        },
        getQueriesFiles: (state, getters) => {
            const files = state.files.filter(file => {

                if(state.fileSearchBookmarked === true && file.bookmarked !== true) return false;

                if(state.activeFolder != null) {
                    let parent = file.folder;
                    while (parent != state.activeFolder.id && parent != null) {
                        parent = getters.getFolderById(parent).parent;
                    }
                    if(parent == null) return false;
                }

                return file.name.toLowerCase().includes(state.fileSearchQuery);

            })
            return files.sort((a, b) => {
                const ma = moment(a.edited), mb = moment(b.edited);
                if (ma.isBefore(mb)) {
                    return 1;
                }
                if (ma.isAfter(mb)) {
                    return -1;
                }
                return 0;
            })
        },
        getPath: (state) => {
            const activeFolder = state.folders.find(folder => folder.id == (state.activeFolder ? state.activeFolder.id : null));

            if(activeFolder) {

                let path = [activeFolder];

                if(activeFolder.parent != null) {

                    let foundNull = false;
                    while (!foundNull) {
                        const parent = state.folders.find(folder => folder.id == path[0].parent);
                        
                        if(parent) {

                            path = [parent, ...path];

                            if(parent.parent == null) foundNull = true;

                        } else {
                            foundNull = true;
                        }
                        
                    }
                }
                
                return path;

            } else {
                return [];
            }
        },
        getFileById: (state) => (fileId) => {
            return state.files.find(file => file.id == fileId)
        },
        getActiveEditorFile: (state) => {
            return state.files.find(file => file.id == state.activeEditor);
        },
        getFolderById: (state) => (folderId) => {
            return state.folders.find(folder => folder.id == folderId) 
        },
    },
    mutations: {
        setFetched(state) {
            state.fetched = true;
        },
        setTheme(state, theme) {
            state.theme = theme;
        },
        setTitle(state, title) {
            state.title = title;
        },
        setFiles(state, files) {
            state.files = files;
        },
        setFolders(state, folders) {
            state.folders = folders;
        },
        setActiveFolder(state, folder) {
            state.activeFolder = folder;
        },
        openEditor(state, fileid) {
            if(fileid) {
                const foundActive = state.activeFiles.find(f => f.id == fileid);
                if (!foundActive) {
                    const file = state.files.find(f => f.id == fileid);
                    if(file) state.activeFiles.push(file);
                }
                state.activeEditor = fileid;
            } else {
                const newId = uuidv4();
                state.activeFiles.push({ 
                    id: newId, 
                    unsaved: true, 
                    folder: state.activeFolder ? state.activeFolder.id : null
                })
                state.activeEditor = newId;
            }
            state.view = 'editor';
        },
        closeEditor(state, fileid) {
            const existing = state.activeFiles.findIndex(f => f.id == fileid);
            if(existing != -1) {
                state.activeFiles.splice(existing, 1);
            }
            if (state.activeEditor == fileid) {
                if(state.activeFiles.length) {
                    state.activeEditor = state.activeFiles[state.activeFiles.length - 1].id;
                } else {
                    state.activeEditor = null;
                    state.view = 'editor'
                }
            }
        },
        createFile(state, { id, name, folder }) {
            const file = {
                id,
                name,
                folder,
                created: moment().format(),
                edited: moment().format(),
                bookmarked: false,
                icon: 'bookmark'
            };
            state.files.push(file);
        },
        updateTitle(state, { fileId, title }) {
            const existing = state.files.find(f => f.id == fileId);
            if(existing) {
                existing.name = title;
                existing.edited = moment().format();
            }
        },
        updateBookmarked(state, { fileId, bookmarked }) {
            const existing = state.files.find(f => f.id == fileId);
            if (existing) {
                existing.bookmarked = bookmarked;
                // existing.edited = moment().format();
            }
        },
        updateIcon(state, { fileId, icon, colour }) {
            const existing = state.files.find(f => f.id == fileId);
            if (existing) {
                existing.icon = icon || 'bookmark';
                existing.iconColor = colour || 'accent';
                // existing.edited = moment().format();
            }
        },
        updateEdited(state, fileId) {
            const existing = state.files.find(f => f.id == fileId);
            if (existing) {
                existing.edited = moment().format();
            }
        },
        deleteFile(state, fileId) {
            const fileIndex = state.files.findIndex(f => f.id == fileId);
            if (fileIndex != -1) {
                state.files.splice(fileIndex, 1);
            }
        },
        createFolder(state, { foldername, parent }) {
            state.folders.push({
                id: uuidv4(),
                name: foldername,
                parent: parent
            })
        },
        updateFolder(state, { folderId, name }) {
            const folder = state.folders.find(f => f.id == folderId);
            if(folder) {
                folder.name = name;
            }
        },
        deleteFolder(state, folderId) {
            const folderIndex = state.folders.findIndex(f => f.id == folderId)
            if (folderIndex != -1) {
                state.folders.splice(folderIndex, 1);
            }
        },
        setView(state, view) {
            state.view = view;
        },
        setSearchQuery(state, query) {
            state.fileSearchQuery = query.toLowerCase();
        },
        toggleSearchBookmarked(state, bookmarked) {
            state.fileSearchBookmarked = bookmarked !== undefined ? bookmarked : !state.fileSearchBookmarked;
        },
        setWindowFocus(state, focused) {
            state.windowFocus = focused;
        }
    },
    actions: {
        fetchLookup: async ({ commit }) => {

            const { status, data } = await window.ipcRenderer.invoke('fetch-lookup')

            if(status == 'success') {
                const { files, folders } = JSON.parse(data);
                commit('setFiles', files);
                commit('setFolders', folders);
                commit('setFetched');
            } else {
                console.log(data);
            }

        },
        updateFile: async ({ state }) => {

            const lookupraw = JSON.stringify({ files: state.files, folders: state.folders });

            const { status } = await window.ipcRenderer.invoke('write-lookup', lookupraw)

            if(status == 'success') {
                console.log("Save Success");
            }

        },
        removeFile: async ({ commit, dispatch }, fileId) => {

            const { status } = await window.ipcRenderer.invoke('delete-file', fileId);

            if(status == 'success') {
                console.log("Delete successful");
                commit('deleteFile', fileId)
                dispatch('updateFile');
                commit('closeEditor', fileId);
            } else {
                console.log("Delete errored out...");
            }

        },
    }
})