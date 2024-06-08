import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MainLayout from '@/components/layout/MainLayout.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView
        },
        {
          path: 'courses/:id',
          name: 'course',
          component: () => import('../views/CourseView.vue'),
        },
        {
          path: 'courses/:id/topics/:topicId/new-level',
          name: 'newLevel',
          component: () => import('../views/NewLevel.vue')
        },
        {
          path: 'courses/:id/topics/:topicId/levels/lesson',
          name: 'newLesson',
          component: () => import('../views/NewLesson.vue')
        }, {
           path: 'courses/:id/topics/:topicId/levels/quiz',
           name: "quiz",
           component: () => import("../views/QuizView.vue")
        },
        {
          path: 'courses/:id/topics/:topicId/levels/create-quiz',
          name: "createQuiz",
          component: () => import("../views/CreateQuizView.vue")
        }, 
        {
          path: 'courses/:id/topics/:topicId/levels/code',
          name: "code",
          component: () => import('../views/CodeView.vue')
        },
        {
          path: 'profile/:id',
          name: "profile",
          component: () => import("../views/ProfileView.vue")
        }
      ]
    },
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    }
  ]
})

export default router
