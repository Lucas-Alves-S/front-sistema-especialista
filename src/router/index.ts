import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ExpertView from '../views/ExpertView.vue'
import AddQuestionView from '../views/AddQuestionView.vue'
import AddSolutionView from '../views/AddSolutionView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/expert',
      name: 'expert',
      component: ExpertView
    },
    {
      path: '/add-question',
      name: 'add-question',
      component: AddQuestionView
    },
    {
      path: '/add-solution',
      name: 'add-solution',
      component: AddSolutionView
    }
  ]
})

export default router
