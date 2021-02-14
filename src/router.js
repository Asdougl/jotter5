import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Explorer from '@/components/pages/PageExplorer';
import Editor from '@/components/pages/PageEditors';
import Meta from '@/components/pages/PageMeta';

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Explorer',
            component: Explorer
        },
        {
            path: '/editor',
            name: 'Editor',
            component: Editor,
        },
        {
            path: '/meta',
            name: 'Meta',
            component: Meta,
        }
    ]
})