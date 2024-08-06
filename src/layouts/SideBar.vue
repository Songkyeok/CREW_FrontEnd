<template>
    <div>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <div class="main-sidebar">
            <div class="logo" @click="goTo('')" @mouseover="triggerConfetti">
                <div class="logo-crew">
                    CREW
                </div>
            </div>
            <div class="logo-mini" @click="goTo('')">
                <img src="../assets/icon_logo.png">
            </div>
            <div class="search-bar" @click="search()">
                <input v-model="keyword" type="text" @keyup.enter="searchKeyword(keyword)">
                <button class="search-button" type="submit" @click="searchKeyword(keyword)"><img
                        src="../assets/icon_search-on.png" alt="search"></button>
            </div>
            <div class="hide-search-icon">
                <label for="select-search">
                    <div v-if="select == 'search'" @click="searchMini()" class=" nav-li active">
                        <img src="../assets/icon_search-on.png" alt="search">
                    </div>
                    <div v-else-if="select != 'search'" @click="searchMini()" class="nav-li">
                        <img src="../assets/icon_search-off.png" alt="search">
                    </div>
                </label>
            </div>

            <div class="nav-bar">
                <ul class="top-nav">
                    <li v-if="select == ''" class="nav-li active" @click="goTo('')">
                        <img src="../assets/icon_home-on.png">
                        <p>홈</p>
                    </li>
                    <li v-if="select != ''" class="nav-li" @click="goTo('')">
                        <img src="../assets/icon_home-off.png">
                        <p>홈</p>
                    </li>
                    <label for="select-notice">
                        <img v-if="newNotice" class="notice-new-dot" src="../assets/icon_dot.png">
                        <li v-if="select == 'notice'" class="nav-li active" @click="notice()">
                            <img src="../assets/icon_bell-on.png">
                            <p>알림</p>
                        </li>
                        <li v-if="select != 'notice'" class="nav-li" @click="notice()">
                            <img src="../assets/icon_bell-off.png">
                            <p>알림</p>
                        </li>
                    </label>
                    <label for="" v-if="getLoginCheck()">
                        <li v-if="select == 'mymoim'" class="nav-li active" @click="goTo('mymoim')">
                            <img src="../assets/icon_people-on.png">
                            <p>내 크루</p>
                        </li>
                        <li v-if="select != 'mymoim'" class="nav-li" @click="goTo('mymoim')">
                            <img src="../assets/icon_people-off.png">
                            <p>내 크루</p>
                        </li>
                        <li v-if="select == 'moimCreate'" class="nav-li active" @click="goTo('moimCreate')">
                            <img src="../assets/icon_plus-on.png">
                            <p>크루 만들기</p>
                        </li>
                        <li v-if="select != 'moimCreate'" class="nav-li" @click="goTo('moimCreate')">
                            <img src="../assets/icon_plus-off.png">
                            <p>크루 만들기</p>
                        </li>
                    </label>
                </ul>
                <ul class="bottom-nav">
                    <li v-if="admin" class="nav-li" @click="goTo('admin')">
                        <img src="../assets/icon_management-off.png">
                        <p>관리자</p>
                    </li>
                    <li v-if="select == '/myprofile'" class="nav-li active" @click="goTo('myprofile')">
                        <img src="../assets/icon_profile-circle-off.png">
                        <p>프로필</p>
                    </li>
                    <li v-if="select != '/myprofile'" class="nav-li" @click="goTo('myprofile')">
                        <img src="../assets/icon_profile-circle-off.png">
                        <p>프로필</p>
                    </li>
                    <li v-if="select == '/setting'" class="nav-li active" @click="goTo('setting')">
                        <img src="../assets/icon_settings-on.png">
                        <p>설정</p>
                    </li>
                    <li v-if="select != '/setting'" class="nav-li" @click="goTo('setting')">
                        <img src="../assets/icon_settings-off.png">
                        <p>설정</p>
                    </li>
                    <li v-if="getLoginCheck()" class="nav-li" @click="logout()">
                        <img src="../assets/icon_sign-out.png">
                        <p>로그아웃</p>
                    </li>
                    <li v-else class="nav-li" @click="goTo('login')">
                        <img src="../assets/icon_login.png">
                        <p>로그인</p>
                    </li>
                </ul>
            </div>
        </div>
        <input type="checkbox" id="select-notice" v-model="select">
        <input type="checkbox" id="select-search" v-model="select">

        <div class="search-tab">
            <div class="search-body">
                <h3>검색</h3>
                <div class="search-list">
                    <h4>최근 검색어</h4>
                    <hr>
                    <div v-if="!getLoginCheck()">
                        <p class="nothing">로그인 후 이용 가능합니다. </p>
                    </div>
                    <div v-else-if="mySearchList.length == 0">
                        <p class="nothing">최근 검색어가 없습니다.</p>
                    </div>
                    <div class="my-search-list" v-else v-for="myKeyword in mySearchList" :key="myKeyword">
                        <p class="search-kw" @click="searchKeyword(myKeyword.SEARCH_KW)">{{ myKeyword.SEARCH_KW }}</p>
                        <p class="search-ssd" @click="searchKeyword(myKeyword.SEARCH_KW)">{{
                            getElapsedTime(myKeyword.SEARCH_SSD) }}</p>
                        <img class="delete" @click="deleteKeyword(myKeyword.SEARCH_NO)" src="../assets/icon_x.png">
                    </div>
                </div>
                <div class="search-list">
                    <h4>인기 검색어</h4>
                    <hr>
                    <div class="hot-search-list" v-for="(hotKeyword, index) in hotSearchList" :key="index">
                        <h5 class="search-lank">{{ index + 1 }}</h5>
                        <p class="search-kw" @click="searchKeyword(hotKeyword.search_kw)">{{ hotKeyword.search_kw }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="search-bar-mini">
            <div class="search-body">
                <h3>검색</h3>
                <div class="search-input-mini">
                    <input v-model="keyword" type="text" @keyup.enter="searchKeyword(keyword)">
                    <button class="search-button" type="submit" @click="searchKeyword(keyword)"><img
                            src="../assets/icon_search-on.png" alt="search"></button>
                </div>
                <div class="search-list">
                    <h4>최근 검색어</h4>
                    <hr>
                    <div v-if="!getLoginCheck()">
                        <p class="nothing">로그인 후 이용 가능합니다. </p>
                    </div>
                    <div v-else-if="mySearchList.length == 0">
                        <p class="nothing">최근 검색어가 없습니다.</p>
                    </div>
                    <div class="my-search-list" v-else v-for="myKeyword in mySearchList" :key="myKeyword">
                        <p class="search-kw" @click="searchKeyword(myKeyword.SEARCH_KW)">{{ myKeyword.SEARCH_KW }}</p>
                        <p class="search-ssd" @click="searchKeyword(myKeyword.SEARCH_KW)">{{
                            getElapsedTime(myKeyword.SEARCH_SSD) }}</p>
                        <img class="delete" @click="deleteKeyword(myKeyword.SEARCH_NO)" src="../assets/icon_x.png">
                    </div>
                </div>
                <div class="search-list">
                    <h4>인기 검색어</h4>
                    <hr>
                    <div class="hot-search-list" v-for="(hotKeyword, index) in hotSearchList" :key="index">
                        <h5 class="search-lank">{{ index + 1 }}</h5>
                        <p class="search-kw" @click="searchKeyword(hotKeyword.search_kw)">{{ hotKeyword.search_kw }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="notice-bar">
            <div class="notice-body">
                <h3>알림</h3>
                <div v-if="getLoginCheck()">
                    <div v-if="noticeList.length == 0">
                        <p class="nothing">확인할 알림이 없습니다.</p>
                    </div>
                    <div class="notice-list" v-for="notice in noticeList" :key="notice">
                        <img class="notice-new" v-if="!notice.NOTICE_EDD" src="../assets/icon_plus-on.png" alt="새 알림">

                        <div style="display: flex;">
                            <!-- 알림 이미지 -->
                            <div class="notice-img">
                                <img v-if="notice.BOARD_CON && notice.USER_IMG"
                                    :src="require(`../../../node-back/uploads/uploadProfile/${notice.USER_IMG}`)" alt="크루">
                                <img v-else-if="notice.MOIM_IMG"
                                    :src="require(`../../../node-back/uploads/uploadMoim/${notice.MOIM_IMG}`)" alt="크루">
                                <img v-else src="../assets/icon_information.png" alt=".">
                            </div>
                            <p class="notice-content" @click="goToURL(notice)"
                                v-html="setNotice(notice).replace(/\n/g, '<br>')"></p>
                        </div>
                        <p class="notice-time">{{ getElapsedTime(notice.NOTICE_SDD) }}</p>
                    </div>
                </div>
                <div v-else>
                    <p class="nothing">로그인 후 이용 가능합니다.</p>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>

import axios from 'axios';

export default {
    data() {
        return {
            keyword: '',
            noticeList: [],
            mySearchList: [],
            hotSearchList: [],
            admin: false,
            newNotice: false,
            confetti: null
        }
    },
    mounted() {
        this.confetti = window.confetti;
    },
    watch: {
        '$route'() {
            this.getNotice();
        }
    },
    computed: {
        select() {
            return this.$store.state.select.select;
        },
        user() {
            return this.$store.state.user.user;
        }
    },
    created() {
        this.getNotice();
        // this.getMySearch();
        // this.getHotSearch();
        this.adminCheck();
    },
    methods: {
        search() {
            if (document.getElementById("select-search").checked) {
                document.getElementById("select-search").checked = false;
            }
            else {

                this.getMySearch();
                this.getHotSearch();
                document.getElementById("select-search").checked = true;
            }
            this.$store.commit("select", { select: 'search' })

        },
        searchMini() {
            if (!document.getElementById("select-search").checked) {
                this.getMySearch();
                this.getHotSearch();
            }
            this.$store.commit("select", { select: 'search' })
        },
        async searchKeyword(keyword) {
            this.$store.commit("select", { select: ' ' })
            if (!keyword) {
                return;
            }

            let user_no = this.user;

            if (!this.getLoginCheck()) {
                user_no = null
            }
            try {
                await axios({
                    url: "http://localhost:4000/auth/search",
                    method: "POST",
                    data: {
                        user: user_no,
                        keyword: keyword
                    }
                })
                    .then(res => {
                        if (res.data.message == 'complete') {
                            window.location.href = `http://localhost:8001/searchList/${keyword}`
                            this.keyword = '';
                            this.getMySearch();
                            this.getHotSearch();
                        }
                    })
            } catch (error) {
                console.error(error);
            }
        },
        async deleteKeyword(search_no) {
            try {
                await axios({
                    url: "http://localhost:4000/auth/search_delete",
                    method: "POST",
                    data: {
                        search_no: search_no
                    }
                })
                    .then(res => {
                        if (res.data.message == 'complete') {
                            this.getMySearch();
                        }
                    })
            } catch (error) {
                console.error(error);
            }
        },
        goTo(page) {
            if (!page) {
                window.location.href = `http://localhost:8001`
            }
            this.$store.commit("select", { select: page })
            this.$router.push(`/${page}`)
        },
        goToURL(notice) {
            if (!notice.NOTICE_EDD) {
                axios({
                    url: `http://localhost:4000/auth/notice_check`,
                    method: `POST`,
                    data: {
                        notice_no: notice.NOTICE_NO
                    }
                })
                    .then(() => {
                        if (notice.NOTICE_URL)
                            window.location.href = notice.NOTICE_URL;
                        else
                            location.reload();
                    })
            }
            else if (notice.NOTICE_URL) {
                window.location.href = notice.NOTICE_URL;
            }
        },
        notice() {
            this.$store.commit("select", { select: 'notice' })
        },
        async getMySearch() {
            if (!this.getLoginCheck()) {
                return;
            }
            try {
                const response = await axios.get(`http://localhost:4000/auth/search_mine_get/${this.user}`);

                this.mySearchList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async getHotSearch() {
            try {
                const response = await axios.get(`http://localhost:4000/auth/search_hot_get`);

                this.hotSearchList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async getNotice() {
            if (!this.getLoginCheck()) {
                return;
            }
            try {
                const response = await axios.get(`http://localhost:4000/auth/notice_get/${this.user}`);

                this.noticeList = response.data;
                this.checkNewNotice();
            } catch (error) {
                console.error(error);
            }
        },
        getElapsedTime(dateTime) {
            return this.$elapsedTime(dateTime);
        },
        getLoginCheck() {
            return this.$loginCheck(this.user);
        },
        logout() {
            this.$store.commit("user", { user: '' })
            this.$swal({
                position: 'top',
                title: `<p style="font-family: 'Pretendard-Regular'">로그아웃되었습니다.

                </p>`,
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                location.reload();
            })
        },
        async adminCheck() {
            if ((this.user == '' || this.user == undefined)) {
                return false;
            }
            try {
                await axios({
                    url: "http://localhost:4000/admin/admin_check",
                    method: "POST",
                    data: {
                        user: this.user,
                    }
                })
                    .then(res => {
                        if (res.data.message == 'available') {
                            this.admin = true;
                        }
                    })
            } catch (error) {
                console.error(error);
                return false;
            }
        },
        setNotice(notice) {
            let notice_con = ''
            if (notice.NOTICE_CON == 301) {
                notice_con = `크루 <strong>${notice.MOIM_TITLE}</strong>에 새로운 가입 신청이 있습니다.`
            }
            else if (notice.NOTICE_CON == 101) {
                notice_con = `<strong>${notice.MOIM_TITLE}</strong> 
                가입 신청이 수락되었습니다. 
                지금 크루에서 인사해보세요!`
            }
            else if (notice.NOTICE_CON == 102) {
                notice_con = `<strong>${notice.MOIM_TITLE}</strong>
                가입 신청이 거부되었습니다.`
            }
            else if (notice.NOTICE_CON == 201) {
                notice_con = `<strong>${notice.MOIM_TITLE}</strong>
                크루에서 강제 퇴장당하셨습니다.`
            }
            else if (notice.NOTICE_CON == 202) {
                notice_con = `<strong>${notice.MOIM_TITLE}</strong>
                크루에 새 공지사항이 올라왔어요.`
            }
            else if (notice.NOTICE_CON == 203) {
                notice_con = `<strong>${notice.MOIM_TITLE}</strong>
                크루에 <strong>${notice.USER_NICK}</strong>님이 새 게시글을 올렸어요.`
            }
            else if (notice.NOTICE_CON == 204) {
                notice_con = `<strong>${notice.USER_NICK}</strong>님이 내 게시글에 댓글을 달았습니다.`
            }
            else if (notice.NOTICE_CON == 205) {
                notice_con = `<strong>${notice.USER_NICK}</strong>님이 내 게시글에 좋아요를 눌렀습니다.`
            }
            else if (notice.NOTICE_CON == 401) {
                notice_con = `신고가 접수되어 경고가 누적되었습니다.
                <strong>3회 이상 누적될 시 별다른 안내 없이 계정이 삭제 조치되오니 이용에 유의하시기 바랍니다.</strong>`
            }

            return notice_con;
        },
        checkNewNotice() {
            this.noticeList.forEach(notice => {
                if (notice.NOTICE_EDD == null) {
                    this.newNotice = true;
                    return
                }
            });
        },
        
        triggerConfetti() {
            if (this.confetti) {
                this.confetti({
                    particleCount: 100,
                    spread: 30,
                    origin: { x: 0.06, y: 0.1 } // 폭죽이 나타나는 위치 조정
                });
            }
        }
    }
}
</script>

<style scoped>
* {
    padding: 0px;
    margin: 0px;
}

@font-face {
    font-family: 'Pretendard-Regular';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
}

@font-face {
    font-family: 'GeekbleMalang2WOFF2';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2302_01@1.0/GeekbleMalang2WOFF2.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
}

.main-sidebar {
    /* 드래그 방지 코드 */
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    top: 0px;
    width: 240px;
    height: 100%;
    position: fixed;
    background-color: white;
    border-right: solid 1px #E2E2E2;
    float: left;
    z-index: 100;
}

.logo {
    display: flex;
    font-family: 'GeekbleMalang2WOFF2';
    font-size: 40px;
    cursor: pointer;
    padding: 15px;
    width: fit-content;
    margin: 15px auto;
}

.logo-mini {
    display: none;
}
.logo-crew {
    color: #2b2b2b;
}
/* ----------------------검색바------------------------------- */

#select-search {
    display: none;
}

.search-bar {
    display: flex;
    width: 10rem;
    border-radius: 200px;
    outline: #E1E7F0 solid 3px;
    position: relative;
    margin: 12px auto;
    margin-bottom: 24px;
    padding-left: 20px;
}

.search-bar:focus-within {
    outline: #86A8E7 solid 3px;
}

.search-icon,
.hide-search-icon {
    display: none;
}

.search-button {
    border: none;
    height: 32px;
    width: 40px;
    position: relative;
    background: none;
    cursor: pointer;
}

.search-button img {
    position: relative;
    max-width: 16px;
    margin-right: 10px;
}

.search-bar-mini {
    display: none;
}

input[type='text'] {
    width: 100%;
    outline: none;
    background-color: rgb(255, 255, 255);
    font-family: 'Pretendard-Regular';
    border: none;
    color: gray;
    margin-right: 8px;
    font-size: 14px;
}

.search-list {
    height: 230px;
}

/* -------------------------------------------------- */

.nav-li {
    border-radius: 5px;
    list-style: none;
    padding: 10px 16px;
    margin: 10px;
    font-size: 16px;
    cursor: pointer;
    font-family: 'Pretendard-Regular';
    vertical-align: middle;
    display: flex;
}

.nav-li p {
    margin: auto 12px;
}

.active p {
    color: #86A8E7;
}

.nav-li img {
    max-width: 24px;
}

.nav-li:hover {
    background-color: #f2f2f2;
}

.nav-li:hover img {
    transform: scale(1.1);
    transition-duration: 0.3s;
}

.notice-new-dot {
    position: absolute;
    width: 16px;
    height: 16px;
    margin-left: 40px;
    /* margin-left: 16px;
    margin-top: 4px; */
}

/* ----------------------하단 카테고리---------------------------- */
.bottom-nav {
    position: absolute;
    width: 100%;
    bottom: 16px;
}

.search-tab {
    display: block;
    font-family: 'Pretendard-Regular';
    position: fixed;
    top: 0px;
    width: 500px;
    height: 100%;
    background-color: #f9f9f9;
    z-index: 10;
    border-radius: 20px;
    box-shadow: 0px 5px 12px #9c9c9c;
}

.search-body {
    padding: 10px 20px 30px 240px;
}

.search-body h3 {
    font-size: 24px;
    margin: 20px 0px;
}

.search-bar-mini {
    display: none;
}

.search-input-mini {
    display: flex;
    border-radius: 200px;
    outline: #E1E7F0 solid 3px;
    background-color: white;
    position: relative;
    margin: 12px auto;
    margin-bottom: 24px;
    padding-left: 20px;
}

.search-input-mini:focus-within {
    outline: #86A8E7 solid 3px;
}

.search-list h4 {
    margin: 8px 0px;
}

.search-list hr {
    border: solid 1.5px #E1E7F0;
}

#select-search:not(:checked)~.search-tab {
    transform: translate(-280px, 0);
    transition-duration: 0.5s;
}

#select-search:checked~.search-tab {
    display: block;
    transform: translate(20px, 0);
    transition-duration: 0.5s;
}


.my-search-list {
    position: relative;
    display: flex;
    margin: 2px auto;
    padding: 5px 0px 5px 7px;
    justify-content: space-between;

}

.delete {
    margin: 0 3px;
    visibility: hidden;
    max-width: 16px;
}

.my-search-list:hover {
    background-color: #f0f0f0;
    cursor: pointer;
}

.my-search-list:hover .delete {
    visibility: visible;
}

.search-kw {
    font-size: 14px;
    width: 68%;
    color: black;
}

.my-search-list:hover .search-kw {
    color: #86A8E7;
}

.search-ssd {
    font-size: 11px;
    color: #aaaaaa;
    padding-top: 2px;
}

.hot-search-list {
    position: relative;
    display: flex;
    margin: 2px auto;
    padding: 5px 0px 5px 7px;
}

.hot-search-list:hover .search-kw {
    color: #86A8E7;
}

.hot-search-list:hover {
    background-color: #f0f0f0;
    cursor: pointer;
}

.search-lank {
    width: 20px;
}


/* ----------------------알림 사이드바---------------------------- */

#select-notice {
    display: none;
}

.notice-bar {

    /* 드래그 방지 코드 */
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    font-family: 'Pretendard-Regular';
    position: fixed;
    overflow-y: auto;
    top: 0px;
    width: 500px;
    height: 100%;
    background-color: #f9f9f9;
    z-index: 10;
    border-radius: 20px;
    box-shadow: 0px 5px 12px #9c9c9c;

    /* 스크롤바 제거 코드 */
    -ms-overflow-style: none;
    scrollbar-width: none;
}

*::-webkit-scrollbar {
    display: none;
    /* 크롬, 사파리, 오페라, 엣지 */
}

#select-notice:not(:checked)~.notice-bar {
    transform: translate(-320px, 0);
    transition-duration: 0.5s;
}

#select-notice:checked~.notice-bar {
    display: block;
    transform: translate(20px, 0);
    transition-duration: 0.5s;
}

.notice-body {
    padding: 10px 0px 30px 220px;
}

.notice-body h3 {
    font-size: 24px;
    margin: 20px;
}

.notice-list {
    cursor: pointer;
    width: 100%;
    display: inline-flex;
    justify-content: space-between;
    padding: 10px 0px;
    position: relative;
    border-bottom: 1px solid #E2E2E2;
}

.notice-list:hover {
    background-color: #E2E2E2;
}

.notice-new {
    width: 15px;
    height: 15px;
    margin-left: 8px;
    position: absolute;
}

.notice-img {
    width: 24px;
    height: 24px;
    overflow: hidden;
    border-radius: 50%;
    margin: auto 0 auto 20px;

}

.notice-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.notice-content {
    font-size: 13px;
    width: 170px;
    word-break: keep-all;
    margin: 0;
    margin-left: 6px;
    /* border: #2b2b2b 2px solid; */
}

.notice-content:hover {
    /* color: #86A8E7; */
}

.notice-time {
    font-size: 11px;
    color: #aaaaaa;
    padding-right: 16px;
    padding-top: 1.5px;
}

.nothing {
    font-size: 14px;
    margin: 28px 20px;
}

@media (max-width: 992px) {

    .main-sidebar {
        width: 70px;
        transition: width 0.4s;
    }

    .logo {
        display: none;
    }

    .logo-mini {
        display: block;
        cursor: pointer;
    }

    .logo-mini img {
        width: 28px;
        margin: 40px auto;
        display: block;
    }

    .logo-mini img:hover {
        transform: scale(1.4);
        transition-duration: 0.5s;
    }

    .logo-mini img:not(:hover) {
        transform: scale(1);
        transition-duration: 0.5s;
    }

    .search-bar,
    #select-search:not(:checked)~.search-tab,
    #select-search:checked~.search-tab {
        display: none;
    }

    .search-bar-mini {
        display: block;
        font-family: 'Pretendard-Regular';
        position: fixed;
        top: 0px;
        left: -150px;
        width: 500px;
        height: 100%;
        background-color: #f9f9f9;
        z-index: 10;
        border-radius: 20px;
        box-shadow: 0px 5px 12px #9c9c9c;
    }

    #select-search:not(:checked)~.search-bar-mini {
        transform: translate(-490px, 0);
        transition-duration: 0.5s;
    }

    #select-search:checked~.search-bar-mini {
        display: block;
        transform: translate(0px, 0);
        transition-duration: 0.5s;
    }

    .search-icon,
    .hide-search-icon {
        display: block;
    }

    .search-icon img {
        width: 24px;
        margin: 24px auto;
        display: block;
    }

    .search-icon:hover {
        background-color: #f2f2f2;
    }

    .search-icon:hover img {
        transform: scale(1.1);
        transition-duration: 0.3s;
    }

    .nav-li {
        padding: 10px 10px;
    }

    .nav-li img {
        margin: auto;
    }

    .nav-li p {
        display: none;
    }

    .notice-bar,
    #select-notice:checked~.notice-bar {
        /* display: none; */
        margin-left: -170px;
    }

    #select-notice:not(:checked)~.notice-bar {
        margin-left: -170px;
    }
}
</style>