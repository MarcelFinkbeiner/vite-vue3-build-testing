import { reactive } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import NestedVideos from '@/pages/NestedVideos.vue';

const routes = [
  {
    path: '/home',
    name: 'home',
    component: NestedVideos,
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/home',
    exact: true,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    const position = {};
    if (to.hash) {
      position.selector = to.hash;
      if (document.querySelector(to.hash)) return position;
    }
    return false;
  },
});

router.beforeEach((to, from, next) => {
  return next();
});

router.afterEach((to, from, next) => {});

export default router;
export const globalState = reactive({ from: {}, to: {} });
