import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import mixins from './mixins'
import { createRouter, createWebHistory } from 'vue-router'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import DefaultLayout from './layouts/DefaultLayout.vue'
import AdminLayout from './layouts/AdminLayout.vue'
import MoimLayout from './layouts/MoimLayout.vue'


import Main from './views/Main'
import Login from './views/Login'
import Join from './views/Join'
import UserDelete from './views/UserDelete'
import Pass from './views/Pass'

import Find from './views/Find'
import MyMoim from './views/MyMoim'
import SearchList from './views/SearchList'
import Myprofile from './views/Myprofile'
import Setting from './views/Setting'
import Faq from './views/Faq'
import LikeMoim from './views/LikeMoim'
import MBTI from './views/MBTI'

import MoimJoin from './views/MoimJoin'
import MoimApply from './views/MoimApply'
import MoimApplyList from './views/MoimApplyList'
import MoimCreate from './views/MoimCreate'
import MoimUpdate from './views/MoimUpdate'



import MoimDetail from './moimDetail/MoimDetail'
import MoimPost from './moimDetail/Post'
import MoimCal from './moimDetail/Calender'
import MoimInform from './moimDetail/Inform'
import MoimChall from './moimDetail/Challenge'
import MoimChallDetail from './moimDetail/ChallDetail'

import MoimBoardUpdate from './moimDetail/BoardUpdate'
import MoimInformUpdate from './moimDetail/InformUpdate'



import MoimMember from './views/MoimMember'
import MoimMission from './moimDetail/Mission'

import AdminMain from './admin/AdminMain'
import UserManager from './admin/UserManager'
import MoimManager from './admin/MoimManager'
import ReportManager from './admin/ReportManager'


const routes = [
    {
        path: '/',
        name: 'DefaultLayout',
        component: DefaultLayout,
        children: [
            {
                path: '/',
                component: Main,
            },
            {
                path: '/mymoim',
                component: MyMoim,
            },
            {
                path: '/setting',
                component: Setting,
            },
            {
                path: '/myprofile',
                component: Myprofile,
            },
            {
                path: '/searchlist/:keyword',
                component: SearchList
            },
            {
                path: '/MoimCreate',
                component: MoimCreate
            },
            {
                path: '/MoimJoin/:moim_no',
                component: MoimJoin
            },
            {
                path: '/MoimMember/:moim_no',
                component: MoimMember
            },
            {
                path: '/MoimMission/:moim_no',
                component: MoimMission
            },
            {
                path: '/likemoim',
                component: LikeMoim
            },
            {
                path: '/moimapply/:moim_no/:user_no',
                component: MoimApply
            },
            {
                path: '/moimapplylist/:moim_no',
                component: MoimApplyList
            },
            {
                path: '/faq',
                component: Faq
            },
            {
                path: '/MoimBoardUpdate/:moim_no/:board_no',
                component: MoimBoardUpdate
            },
            {
                path: '/MoimInformUpdate/:moim_no/:inform_no',
                component: MoimInformUpdate
            },
            {
                path: '/MoimUpdate/:moim_no',
                component: MoimUpdate
            },
            {
                path: '/MoimChallDetail/:moim_no/:chall_no',
                component: MoimChallDetail
            },
            {
                path: '/mbti',
                component: MBTI
            }
        ],
    },
    {
        path: '/',
        component: MoimLayout,
        children: [
            {
                path: '/MoimDetail/:moim_no',
                component: MoimDetail
            },
            {
                path: '/MoimPost/:moim_no',
                component: MoimPost
            },
            {
                path: '/MoimCal/:moim_no',
                component: MoimCal
            },
            {
                path: '/MoimInform/:moim_no',
                component: MoimInform
            },
            {
                path: '/MoimChall/:moim_no',
                component: MoimChall
            }
        ]
    },
    {
        path: '/',
        children: [
            {
                path: '/login',
                component: Login,
            },
            {
                path: '/join',
                component: Join,
            }, 
            {
                path: '/find',
                component: Find, 
            },
            {
                path: '/UserDelete',
                component: UserDelete
            },
            {
                path: '/Pass',
                component: Pass
            }
        ]
    },
    {
        path: '/admin/',
        name: 'AdminLayout',
        component: AdminLayout,
        children: [
            {
                path: '',
                component: AdminMain,
            },
            {
                path: 'usermanager',
                component: UserManager,
            },
            {
                path: 'moimmanager',
                component: MoimManager,
            },
            {
                path: 'reportmanager',
                component: ReportManager,
            },
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

window.Kakao.init("48996758ce9c261ddea4b8c69ea5e8a9");

const app = createApp(App)
app.use(router);
app.mixin(mixins);
app.use(store);
app.use(VueSweetalert2);
app.mount('#app')