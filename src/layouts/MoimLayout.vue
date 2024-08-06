<template>
    <div class="layout">
        <div class="hidden-sidebar"></div>
        <SideBar></SideBar>
        <div class="moim-detail">
            <!-- <div class="title">
                <div class="titledot">
                    <img src="../assets/icon_dot.png">
                </div>
                <h3>{{ moimDetail.MOIM_TITLE }} </h3>
            </div> -->

            <!-- <div class="cate-nav">
                <ul class="cate">
                    <li @click="setActive('moimdetail')" :class="{ 'active': active === 'moimdetail' }">홈</li>
                    <li v-if="$loginCheck(user) && userJoin" @click="setActive('moimpost')"
                        :class="{ 'active': active === 'moimpost' }">게시물</li>
                    <li v-if="$loginCheck(user) && userJoin" @click="setActive('moimcal')"
                        :class="{ 'active': active === 'moimcal' }">일정</li>
                    <li v-if="$loginCheck(user) && userJoin" @click="setActive('Challenges')"
                        :class="{ 'active': active === 'Challenges' }">챌린지</li>
                    <li v-if="$loginCheck(user) && userJoin" @click="setActive('Guidelines')"
                        :class="{ 'active': active === 'Guidelines' }">공지사항</li>
                </ul>
            </div>

            <hr class="tophr"> -->
            <router-view></router-view>
        </div>
    </div>
</template>

<script>

import axios from 'axios';
import SideBar from './SideBar'

export default {
    components: {
        SideBar
    },
    data() {
        return {
            moimDetail: {},
            userJoin: false,
            active: '',
            moim_no: this.$route.params.moim_no,

        }
    },
    async created() {
        // this.getMoimDetail();
        // this.moimJoinCheck();
    },
    computed: {
        user() {
            return this.$store.state.user.user;
        },
    },
    methods: {
        // 크루디테일정보불러오기
        async getMoimDetail() {
            try {
                const moim_no = this.$route.params.moim_no;
                const response = await axios.get(`http://localhost:4000/moim/moim_detail/${moim_no}`);
                this.moimDetail = response.data[0];
            } catch (error) {
                console.error(error);
            }
        },
        
        setActive(category) {
            this.active = category;
            this.$router.push({ path: `/${this.active}/${this.moim_no}` })
        },
        setActiveTab(tabName) {
            this.activeTab = tabName;
        },

        moimJoinCheck() { // 크루 가입 체크
            axios({
                url: "http://localhost:4000/moim/moim_j_check",
                method: "POST",
                data: {
                    moim_no: this.$route.params.moim_no,
                    user_no: this.user
                },
            })
                .then(res => {
                    if (this.user == res.data.message) {
                        this.userJoin = true;
                    }
                })
                .catch(() => {
                    this.$swal("접속 오류");
                });
        },
    }
}
</script>

<style scoped>
.hidden-sidebar {
    width: 240px;
    height: 700px;
    float: left;
    margin-right: 30px;
}

@font-face {
    /* 프리텐다드 */
    font-family: 'Pretendard-Regular';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Pretendard-Regular';
    /* 드래그 방지 코드 */
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}


/* ---------------------------------------------------title */

.title {
    margin: 30px 0 0 0;
    width: 100%;
}

.titledot img {
    width: 24px;
    float: left;
    margin-right: 4px;
}

/* ---------------------------------------------------카테네비 */
.cate-nav {
    /* cursor: pointer; */
    align-items: center;
    padding: 20px 0 0;
}

.cate {
    list-style: none;
    display: flex;
}

.cate li {
    padding: 10px 0px;
    text-align: center;
    cursor: pointer;
    /* border: 1px solid rgb(235, 237, 248); */
}

.cate li:not(:last-child)::after {
    content: '';
    display: inline-block;
    width: 24px;
    height: 24px;
    margin: 0px 20px;
    vertical-align: middle;
    background-image: url('../assets/line.png');
    background-size: contain;
}

.cate li:nth-last-child(6) {
    margin-left: 20px;
}

.cate li.active {
    color: #86a8e7;
    font-weight: 600;
}

.tophr {
    margin: 10px 30px 20px 0;
    border: 2px solid #E1E7F0;
}

@media (max-width: 992px) {
    .hidden-sidebar {
        width: 70px;
    }
}
</style>