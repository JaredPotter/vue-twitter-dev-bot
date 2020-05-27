/* eslint-disable no-unused-vars */
import Vue from 'vue'
import Vuex from 'vuex'

// import { auth } from './firebaseInit';

Vue.use(Vuex)


export default new Vuex.Store({
    state: {
        user: null
    },

    getters: {
        auth(state) {
            return state.user
        }
    },

    mutations: {
        setUser(state, user) {
            state.user = JSON.parse(JSON.stringify(user)); 
        },        
    },
    actions: {
        login({ commit }, user) {
            // return auth.signInWithEmailAndPassword(username, password)
            //     .then((response) => {
                    
            //         commit('setUser', response.user);
            //         return;
            //     })
            //     .catch((error) => {
            //         commit('setError', error);
            //         commit('setUser', null);
            //     });
            commit('setUser', user);
        },
        logout({ commit }) {
            // return auth.signOut()
            //   .then(() => {
            //       commit('setUser', null);
            //     return;
            //   });
            commit('setUser', null);
        },
    }    
})