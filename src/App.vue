<template>
  <div id="app" :class="`theme-${theme}`" :style="accentStyle">
    <site-title-bar></site-title-bar>
    <!-- <router-view v-if="fetched"></router-view>
    <div v-else>
      Fetching...
    </div> -->
    <page-editors v-if="view == 'editor'"></page-editors>
    <page-meta v-else-if="view == 'meta'"></page-meta>
    <page-config v-else-if="view == 'config'"></page-config>
    <page-explorer v-else></page-explorer>
  </div>
</template>

<script>
import SiteTitleBar from './components/SiteTitleBar'
import { mapActions, mapState, mapMutations } from 'vuex'

// Routes
import PageExplorer from './components/pages/PageExplorer'
import PageEditors from './components/pages/PageEditors'
import PageMeta from './components/pages/PageMeta'
import PageConfig from './components/pages/PageConfig'

export default {
  name: 'App',
  components: {
    SiteTitleBar,
    PageExplorer,
    PageEditors,
    PageMeta,
    PageConfig,
  },
  mounted() {
    this.fetchLookup();

    window.ipcRenderer.on('window-blur', () => this.setWindowFocus(false))
    window.ipcRenderer.on('window-focus', () => this.setWindowFocus(true))

  },
  computed: {
    ...mapState(['fetched', 'view', 'theme', 'accent']),
    accentStyle() {
      return {
        '--accent-color': this.accent,
      }
    }
  },
  methods: {
    ...mapMutations(['setWindowFocus']),
    ...mapActions(['fetchLookup'])
  }
}
</script>

<style lang="scss">
@import './style/style.scss';
@import './style/themes.scss';

#app {
  height:100vh;
  overflow-y: hidden;
  display: grid;
  grid-template-rows: 30px calc(100vh - 30px);
  background:$background;
  color:$text;
}
</style>
