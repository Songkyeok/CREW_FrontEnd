import { createStore } from 'vuex'

import persistedstate from 'vuex-persistedstate';

const store = createStore({
    state() {
        return {
            select: '',
            user: '',
        }
    },
    mutations: {
        select(state, data){
            state.select = data;
        },
        user(state, data){
            state.user = data;
        }
    },
    plugins: [
        persistedstate({
            paths: ['select', 'user']
        })
    ]
});

export default store;