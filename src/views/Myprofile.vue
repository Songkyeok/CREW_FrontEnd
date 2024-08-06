<template>
    <body>
        <div class="title">
            <div class="titledot">
                <div>
                    <img src="../assets/icon_dot.png">
                </div>
            </div>
            <h3>프로필</h3>
        </div>
        <hr class="tophr">
        <div class="box">
            <div class="left">
                <div class="profile-box">
                    <img :src="getUserImage(loginUser)">
                </div>
                <div class="user-info">
                    <div class="list">
                        <p>닉네임</p>
                        <p class="form-control">{{ loginUser.user_nick }}</p>
                    
                        <p>이메일</p>
                        <p class="form-control">{{ loginUser.user_id }}</p>
                    
                        <p>전화번호</p>
                        <p class="form-control">{{ loginUser.user_tel }}</p>
                    
                        <p>성별</p>
                        <p class="form-control" v-if="loginUser.user_gender == 1">Male</p>
                        <p class="form-control" v-else>Female</p>
                    
                        <p>생년월일</p>
                        <p class="form-control"> {{ getFormatDateTime(loginUser.user_birth) }}</p>
                    
                        <p>활동지역</p>
                        <div style="display: flex;">
                            <p class="form-control" style="margin-right: 4px;">{{ userZone.user_adr1 }}</p>
                            <p class="form-control">{{ userZone.user_adr2 }}</p>
                        </div>

                        <p>성향</p>
                        <div style="display: flex;">
                            <p class="form-control" style="margin-right: 4px;"  v-if="loginUser.user_mbti">{{ loginUser.user_mbti }}</p>
                            <button class="mbti-button" @click="goTo('MBTI')" v-else>테스트하러 가기</button>
                        </div>
                    </div>
                    <span class="user-info-edit-profile" @click="goTo('setting')">프로필 수정</span>
                </div>
            </div>
            
            <hr class="hr-midd">

            <div class="right">
                <span class="edit-profile" @click="goTo('faq')">FAQ > 자주 묻는 질문</span>

                <div class="my-category">
                    <p class="my-moim-title">내 관심사</p>
                    <p  class="my-moim-hobby-no" v-if="userHobby.length === 0">관심사를 설정해주세요</p>
                    <ul class="hobby-list" v-for="hobby in userHobby" :key="hobby">
                        <li class="user-hobby">{{ hobby.category_nm }}</li>
                    </ul>
                </div>
                <div class="my-moim">
                    <div class="my-moim-title-area">
                        <p class="my-moim-title">최근 좋아요</p>
                        <p class="my-moim-plus" @click="goTo('likemoim')">더보기 ></p>
                    </div>

                    <div class="my-moim-card">
                        <div class="left-card" v-for="moim in LikeMoim" :key="moim">
                            <div class="imgbox" @click="goToDetail(moim.MOIM_NO)">
                                <div class="fakeimg">
                                    <img :src="require(`../../../node-back/uploads/uploadMoim/${moim.MOIM_IMG}`)"
                                        class="moim-img">
                                </div>
                            </div>

                            <div class="text">
                                <h5>#{{ moim.CATEGORY_NM }}</h5>
                                <p>{{ moim.MOIM_INTRO }}</p>
                                <h2 @click="goToDetail(moim.MOIM_NO)">{{ moim.MOIM_TITLE }}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </body>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            userHobby: [],
            loginUser: {},
            editable: false,
            LikeMoim: [],
            zoneName: [],
            userZone: []
        }
    },
    computed: {
        user() {
            return this.$store.state.user.user;
        }
    },
    mounted() {
        if (!this.getLoginCheck()) {
            this.alert('로그인해주세요');
            this.$router.push({ path: '/login' });
        }
        else {
            this.getUser()
            this.getUserHobby()
            this.getLikeMoim();
            this.getUserZone();
        }
    },
    created() {
    },
    methods: {
        goTo(page) {
            this.$store.commit("select", { select: page })
            this.$router.push(`/${page}`)
        },
        getLoginCheck() {
            return this.$loginCheck(this.user);
        },
        async getUser() {
            try {
                const response = await axios.get(`http://localhost:4000/auth/user_info/${this.user}`);
                this.loginUser = response.data[0];
            } catch (error) {
                console.error(error);
            }
        },
        async getUserHobby() {
            try {
                const response = await axios.get(`http://localhost:4000/auth/user_hobby/${this.user}`);
                this.userHobby = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async getUserZone() {
            try {
                const response = await axios.get(`http://localhost:4000/auth/user_zone/${this.user}`);
                this.userZone = response.data[0];
            } catch (error) {
                console.error(error);
            }
        },
        getFormatDateTime(datetime) {
            return this.$formatDateTime(datetime);
        },
        getUserImage(user) { //프로필 이미지
            if (user.user_img) {
                return require(`../../../node-back/uploads/uploadProfile/${user.user_img}`);
            } else {
                return require('../assets/profile.png');
            }
        },
        async getLikeMoim() { //좋아요한 크루 가져오기
            try {
                const response = await axios.get(`http://localhost:4000/moim/like_moim/${this.user}`);
                this.LikeMoim = response.data;
                this.LikeMoim = this.LikeMoim.slice(0, 3);
            } catch (error) {
                console.error(error);
            }
        },
        goToDetail(moim_no) {
            window.location.href = `http://localhost:8001/moimdetail/${moim_no}`;
        },
        alert(text) {
            this.$alert(text)
        },
        setGrade(grade) {
            if (grade == 1) {
                return 'bronze3.png'
            } if (grade == 2) {
                return 'bronze2.png'
            } if (grade == 3) {
                return 'bronze1.png'
            } if (grade == 4) {
                return 'silver3.png'
            } if (grade == 5) {
                return 'silver2.png'
            } if (grade == 6) {
                return 'silver1.png'
            } if (grade == 7) {
                return 'gold3.png'
            } if (grade == 8) {
                return 'gold2.png'
            } if (grade == 9) {
                return 'gold1.png'
            }
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

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Pretendard-Regular';
    color: #2b2b2b;
    /* 드래그 방지 코드 */
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    /* 스크롤바 제거 코드 */
    -ms-overflow-style: none;
    scrollbar-width: none;
}

* ::-webkit-scrollbar {
    display: none;
    /* 크롬, 사파리, 오페라, 엣지 */
}

.title {
    margin: 30px 0 0 0;
    width: 100%;
}

.titledot img {
    width: 24px;
    float: left;
    margin-right: 4px;
}

.tophr {
    margin: 10px 30px 20px 0;
    border: 2px solid #E1E7F0;
}

.box {
    display: flex;
    height: 600px;
    /* border: 3px solid rgb(0, 0, 0);  */
    margin-right: 30px;
}

.left {
    width: 360px;
}

.profile-box {
    display: flex;
    justify-content: center;
    max-width: 170px;
    height: 170px;
    margin: 40px auto 0;
    border-radius: 50%;
    overflow: hidden;
}

.profile-box img{
    object-fit: cover;
    width: 100%;
    height: 100%;
}

.user-info { margin-top: 20px; }

.list {
    color: #797979;
    padding: 20px;
    border: 2px solid rgb(238, 238, 238);
    border-radius: 15px;
    font-size: 10px;
}
.user-info .list .form-control{
    margin-bottom: 16px;
}
.list p { margin: 0px 0px 4px;}

.form-control {
    color: #2b2b2b;
    font-size: 14px;
    font-weight: bold;
}

.mbti-button{
    padding: 6px 8px;
    border: none;
    border-radius: 4px;
    background-color: #E1E7F0;
}
.mbti-button:hover{ filter: brightness(95%); cursor: pointer; }

.user-info-edit-profile {
    display: flex;
    padding: 14px 10px 0px;
    justify-content: end;
    font-size: 16px;
    color: #86A8E7;
    cursor: pointer;
}
.edit-profile {
    display: flex;
    padding: 0 12px 20px;
    justify-content: end;
    font-size: 16px;
    color: #86A8E7;
    cursor: pointer;
}

.right {
    width: 100%;
    height: auto;
    padding: 0px 10px 0px 10px;
    /* border: 1px solid red; */
}

.my-moim {
    padding: 0px 20px 10px 20px;
    width: 100%;
    border-radius: 15px;
    border: 2px solid rgb(238, 238, 238);
}

.my-moim-card {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.my-moim-title-area {
    display: flex;
    justify-content: space-between;
    padding: 10px 0 4px;
}

.my-moim-title {
    padding: 20px 15px;
    font-size: 20px;
    font-weight: bold;
}
.my-moim-hobby-no{
    margin: 1% auto 0;
    text-align: center;
    font-size: 14px;
    color: #797979;
}
.my-moim-plus {
    cursor: pointer;
    padding: 20px 0;
    color: #86A8E7;
}

.my-category {
    min-height: 182px;
    border-radius: 15px;
    width: 100%;
    padding: 10px 20px 10px 20px;
    margin-bottom: 10px;
    border: 2px solid rgb(238, 238, 238);
}

.left-card {
    min-height: 266px;
    position: relative;
    float: left;
    width: 30%;
    background-color: white;
    border-radius: 16px;
    border: 1.5px solid #E1E7F0;
}

.moim-img:hover {
    transform: scale(1.1);
    transition-duration: 0.3s;
}

.moim-img:not(:hover) {
    transform: scale(1);
    transition-duration: 0.3s;
}

.imgbox {
    position: relative;
    width: 100%;
    height: 160px;
    border-radius: 16px 16px 0 0;
    overflow: hidden;
    cursor: pointer;
}

.moim-img:hover {
    transform: scale(1.1);
    transition-duration: 0.3s;
}

.moim-img:not(:hover) {
    transform: scale(1);
    transition-duration: 0.3s;
}

.badge {
    position: absolute;
    z-index: 1;
    max-width: 32px;
    bottom: 8px;
    right: 7px;
}

.fakeimg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url(../assets/image-loading.png);
    border-radius: 16px 16px 0 0;
}

.moim-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}


.left-card .text { padding: 16px 16px 10px 16px; }

.text p {
    color: #797979;
    font-weight: bold;
    margin: 6px 0 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.text h2 {
    font-weight: 900;
    margin: 0px 0 6px;
    font-size: 18px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.text h2:hover { color: #86a8e7; }

.text img {
    width: 30px;
    height: auto;
}

li {
    padding: 6px 14px;
    width: auto;
    text-align: center;
    margin: 0px 10px 10px 0px;
    font-size: 16px;
    font-weight: bold;
    list-style: none;
    color: #7cadfa;
    border: 2px solid #7cadfa;
    border-radius: 15px;
    
}

.hobby-list { display: inline-flex;}

.hr-midd{
    display: none;
}

@media (max-width: 992px) {
    .left-card {
    position: relative;
    float: left;
    width: 48%;
    background-color: white;
    border-radius: 16px;
    border: 1.5px solid #E1E7F0;
}
.left-card:nth-last-child(1){ display: none;}
    
    .text h2 { margin-top: 6px; }
}

@media (max-width: 768px) {
    .hr-midd{
        display: block;
        width: 80%; 
        margin: 20px auto; 
        border: 1px solid #E1E7F0; 
    }
    .text p { display: none;}
    .box {
        margin-left: 100px;
        display: block;
    }

    .left {
        width: 80%;
        margin: auto;
    }

    .right {
        width: 85%;
        margin: auto;
        padding-bottom: 40px;
    }

    .my-moim {
        display: block;
    }

    .my-moim-card {
        display: block;
        width: 100%;
        margin-bottom: 0px;
    }
    .left-card {
        display: none;
    }

    .my-category {
    min-height: 140px;
    border-radius: 15px;
    width: 100%;
    padding: 10px 20px 10px 20px;

}
}
</style>

