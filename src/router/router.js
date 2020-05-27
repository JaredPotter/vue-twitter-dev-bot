import Vue from 'vue'
import Router from 'vue-router'
import auth from './middleware/auth'
import store from '../store'

import Home from '../components/Home';
import Login from '../components/Login';

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/login',
            name: 'login',
            component: Login
        },

        {
            path: '/',
            name: 'home',
            component: Home,
            meta: {
                middleware: [
                    auth
                ]
            }            
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (!to.meta.middleware) {
        return next()
    }
    const middleware = to.meta.middleware

    const context = {
        to,
        from,
        next,
        store
    }
    return middleware[0]({
        ...context
    })
})



export default router;