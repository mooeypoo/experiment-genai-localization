import { createRouter, createWebHashHistory } from 'vue-router'
import PostView from '../views/PostView.vue'
import UsersView from '../views/UsersView.vue'
import UserProfileView from '../views/UserProfileView.vue'

const routes = [
  { path: '/', redirect: '/post/post-1' },
  { path: '/post/:id', name: 'post', component: PostView },
  { path: '/users', name: 'users', component: UsersView },
  { path: '/users/:id', name: 'user-profile', component: UserProfileView },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
