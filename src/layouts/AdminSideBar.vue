<template>
    <div class="admin-side">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

        <div class="logo" @click="goHome()">
            <div class="logo-moim">
                CREW
            </div>
        </div>
        <div class="admin-side-content" @click="goTo('')">
            <i class="fa fa-home"></i>
            <p>메인</p>
        </div>
        <div class="admin-side-content" @click="goTo('usermanager')">
            <i class="fa fa-address-book"></i>
            <p>회원 관리</p>
        </div>
        <div class="admin-side-content" @click="goTo('moimmanager')">
            <i class="fa fa-users"></i>
            <p>크루 관리</p>
        </div>
        <div class="admin-side-content" @click="goTo('reportmanager')">
            <i class="fa fa-exclamation-circle"></i>
            <p>신고 관리</p>
        </div>
    </div>
</template>

<script>

import axios from "axios";

export default {
    data() {
        return {

        }
    },
    computed: {
        user() {
            return this.$store.state.user.user;
        }
    },
    created() {
        this.adminCheck(this.user);
    },
    methods: {
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
                        if (res.data.message != 'available') {
                            this.alert('관리자 외 접근 제한 페이지입니다.');
                            this.$router.push('/')
                        }
                    })
            } catch (error) {
                console.error(error);
                return false;
            }
        },
        alert(text) {
            this.$alert(text)
        },
        goTo(page) {
            this.$router.push({ path: `/admin/${page}` })
        },
        goHome() {
            this.$store.commit("select", { select: '' })
            window.location.href = `http://localhost:8001/`
        }
    }
}
</script>

<style scoped>
@font-face {
    /* 프리텐다드 */
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


* {
    margin: 0;
    padding: 0;
}

.logo {
    display: flex;
    font-family: 'GeekbleMalang2WOFF2';
    font-size: 26px;
    cursor: pointer;
    padding: 15px;
    width: fit-content;
    margin: 15px auto;
}

.logo-the {
    color: #86A8E7;
}

.logo-moim {
    color: white;
}


/* ---------------------------사이드바---------------------------- */

.admin-side {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    top: 0;
    z-index: 100;
    font-family: 'Pretendard-Regular';
    width: 150px;
    height: 100%;
    background-color: #2b2b2b;
    color: white;
    position: fixed;
}

.admin-side-content {
    display: flex;
    width: 100%;
    margin: 16px auto;
    height: 70px;
    cursor: pointer;
}

.admin-side-content i {
    margin: auto 16px;
    width: 16px;
}

.admin-side-content p {
    margin: auto -8px;
}

.admin-side-content:hover {
    background-color: #86A8E7;
}
</style>