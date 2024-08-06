<template>
    <body>
        <div class="line"></div>
        <div class="main-contain">
            <!-- 로고 -->
            <div class="logo-contain">
                <div class="logo-box" @click="goTo('')">
                    <div class="logo" @click="goTo('')" @mouseover="triggerConfetti">
                        CREW
                    </div>
                    <div class="title-text">
                        크루와의 만남, 더 특별한 하루
                    </div>
                </div>
            </div>

            <!-- 로그인 -->
            <div class="login-contain">
                <div class="login-box">
                    <h3>😥회원탈퇴 하시겠습니까?</h3>
                    <div v-if="loginTP === 0" class="locallogin">
                        <!-- <div v-if="loginTP" class="locallogin"> -->
                        <div class="hr-sect">
                            <h4>비밀번호 확인</h4>
                        </div>
                        <div class="login-input-container">
                            <div class="login-input-wrap input-password">
                                <p class="pw-text">비밀번호</p>
                                <input type="password" @keyup.enter="pw_check()" class="form-control"
                                    placeholder="비밀번호를 입력하세요" v-model="user_pw" />
                            </div>
                        </div>

                        <div class="option-button">
                            <p class="option-btn" @click="goTo('find')">아이디/비밀번호 찾기</p>
                        </div>
                    </div>

                    <div v-if="loginTP === 1 || loginTP === 2" class="sociallogin">
                        <!-- <div v-else class="sociallogin"> -->
                        <div class="hr-sect">
                            <h4>소셜로그인 탈퇴 확인</h4>
                        </div>
                        <div class="login-input-container">
                            <div class="login-input-wrap input-password">
                                <p class="pw-text">'회원탈퇴'을 입력하시면<br>탈퇴가 완료됩니다.</p>
                                <input type="text" v-model="withdrawalConfirmation" @keyup.enter="handleWithdrawal"
                                    placeholder="회원탈퇴" />
                            </div>
                        </div>
                    </div>

                    <div class="button">
                        <button class="login-btn" @click="handleConfirmation()">확인</button>
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
            loginTP: '', // 로그인 타입 확인
            withdrawalConfirmation: '', // 회원탈퇴 확인 입력값
            user_pw: '', // 비밀번호 입력 필드와 양방향 바인딩
            confetti: null
        }
    },
    computed: {
        user() {
            return this.$store.state.user.user;
        },
    },
    mounted() {
        this.getLoginTP();
        this.confetti = window.confetti;
    },
    methods: {
        // 로그인 타입을 가져오는 로직
        getLoginTP() {
            axios({
                url: `http://localhost:4000/auth/user_social_tp/${this.user}`,
                method: "GET"
            })
                .then(res => {
                    // console.log(res.data[0]);
                    const loginType = parseInt(res.data[0].user_social_tp);

                    if (loginType == 0) {
                        this.loginTP = 0;
                    } else if (loginType == 1 || loginType == 2) {
                        this.loginTP = 1;
                    } else {
                        this.loginTP = 2;
                    }
                    console.log("loginTP:", this.loginTP);
                })
                .catch(err => {
                    console.log(err);
                });
        },
        handleConfirmation() {
            if (this.loginTP === 0) {
                this.pw_check();
            } else if (this.loginTP === 1 || this.loginTP === 2) {
                if (this.withdrawalConfirmation === '회원탈퇴') {
                    this.soaialBB();
                } else {
                    this.alert('입력 메세지가 일치하지 않습니다.');
                }
            }
        },
        // 비밀번호 확인 및 회원 삭제
        async pw_check() {
            try {
                const response = await axios.post(`http://localhost:4000/auth/pw_check/${this.user}`, {
                    user_pw: this.user_pw
                });
                console.log(response.data);
                if (response.data.message === '회원탈퇴') {
                    this.alert("회원탈퇴 되었습니다.");
                    this.$store.commit("user", { user: '' })
                    window.location.href = "http://localhost:8001/";

                } else {
                    this.alert("비밀번호가 일치하지 않습니다.");
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 소셜로그인 탈퇴 확인 함수
        async soaialBB() {
            try {
                const response = await axios.post(`http://localhost:4000/auth/delete_user_bb/${this.user}`, {
                    user_social_tp: this.loginTP
                });

                if (response.data.message === '회원탈퇴') {
                    // 유저 정보 초기화 등
                    this.alert("회원탈퇴 되었습니다.");
                    this.unlinkApp();
                    this.$store.commit("user", { user: '' })
                    window.location.href = "http://localhost:8001/";
                } else {
                    this.alert("메세지가 일치하지 않습니다.");
                }
            } catch (error) {
                console.log(error);
            }
        },

        goTo(page) {
            window.location.href = `http://localhost:8001/${page}`
        },
        unlinkApp() {
            window.Kakao.API.request({
                url: '/v1/user/unlink',
            })
                .then(function (res) {
                    console.log(res)
                })
                .catch(function (err) {
                    this.alert('fail: ' + JSON.stringify(err));
                });
        },
        
        alert(text) {
            this.$alert(text)
        },
        triggerConfetti() {
            if (this.confetti) {
                this.confetti({
                    particleCount: 100,
                    spread: 50,
                    origin: { x: 0.25, y: 0.6 } // 폭죽이 나타나는 위치 조정
                });
            }
        }
    },
};

</script>

<style scoped>
@font-face {
    font-family: 'GeekbleMalang2WOFF2';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2302_01@1.0/GeekbleMalang2WOFF2.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'Pretendard-Regular';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    color: #2b2b2b;
    /* 드래그 방지 코드 */
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-family: 'Pretendard-Regular';
}

/* 화면 전체 */
.main-contain {
    position: fixed;
    height: 100%;
    width: 100%;
    font-family: 'Pretendard-Regular';
}

.line {
    border-left: 1px solid #D9D9D9;
    height: 70%;
    left: 50%;
    position: absolute;
    top: 15%;
}

/* -----------------------로고---------------------- */

@keyframes load-ani {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
        transform: translate(0, 0px);
        animation-play-state: running;
    }
}

.logo-contain {
    width: 50%;
    height: 100%;
    /* background-color: aqua; */
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.logo-box {
    cursor: pointer;
    animation: load-ani 1s 0.2s backwards;
}

.logo {
    display: flex;
    font-family: 'GeekbleMalang2WOFF2';
    font-size: 100px;
    cursor: pointer;
    padding: 15px;
    width: fit-content;
    margin: auto;
}

.logo-the {
    color: #86A8E7;
    font-family: 'GeekbleMalang2WOFF2';
}

.logo-moim {
    color: #2b2b2b;
    font-family: 'GeekbleMalang2WOFF2';
}

.logo-plus img {
    max-width: 80px;
    vertical-align: middle;
}

.logo:hover .logo-plus {
    transform: scale(1) rotate(360deg);
    transition-duration: 0.6s;
    margin: 0 -6px 0px -2px;
}

.logo:not(:hover) .logo-plus {
    transform: scale(0);
    transition-duration: 0.6s;
    margin: 0 -40px;
}

.logo:hover .logo-moim {
    transform: translate(3px, 0);
    transition-duration: 0.6s;
}

.logo:not(:hover) .logo-moim {
    transform: translate(0px, 0);
    transition-duration: 0.6s;
}

.title-text {
    max-width: fit-content;
    margin: -12px auto;
    display: flex;
}

.title-text p {
    margin: 2px;
}

/* -----------------------로그인---------------------- */

.login-contain {
    width: 50%;
    height: 100%;
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: load-ani 1s 0.2s backwards;
}

.login-box {
    width: 50%;
    height: 70%;
    display: flex;
    padding: 0px 40px;
    flex-direction: column;
    justify-content: center;
    /* border: 1px solid #ff0000; */
}

h3 {
    margin-bottom: 30px;
    text-align: center;
}

/* -라인- */
.hr-sect::before,
.hr-sect::after {
    content: "";
    flex-grow: 1;
    font-size: 0px;
    line-height: 0px;
    border: 1px solid #E1E7F0;
}

.hr-sect h4 {
    margin: 0px 8px;
}

.login-input-container .pw-text {
    color: #86A8E7;
    margin: 0px 0px 8px 0px;
    font-size: 14px;
}

.soaiallogin .pw-text {
    color: #86A8E7;
    margin: 0px 0px 8px 0px;
    font-size: 14px;
}

.soaiallogin input {
    padding-bottom: 15px;
    font-size: 20px;
    /* border: 1px solid #ff00ff; */
}

.login-input-container {
    padding-bottom: 15px;
    font-size: 20px;
    /* border: 1px solid #ff00ff; */
}

input::placeholder {
    color: #B0B0B0;
}

.input-password {
    margin-top: 10px;
}

.input-password {
    margin-top: 10px;
}

.soaiallogin input {
    margin-top: 10px;
}

.hr-sect {
    display: flex;
    align-items: center;
    margin: 20px 0;
    /* border: 1px solid #00ff91; */
}

.login-input-container .login-input-wrap input {
    background: none;
    border: none;
    line-height: 25px;
    width: 100%;
    height: 40px;
    padding: 0px 0px 5px 0px;
    font-family: 'Pretendard-Regular';
    font-size: 16px;
    padding: 0px 0 0 10px;
    border-bottom: solid 1px #D9D9D9;
}


.login-input-wrap input:focus {
    outline: none;
    border-bottom: solid 1px #86A8E7;
}

.soaiallogin input:focus {
    outline: none;
    border: none;
    border-bottom: solid 1px #86A8E7;
}

/* -----------------------id/pw찾기---------------------- */
.option-button {
    font-size: 16px;
    margin: 6px 0px 20px 0px;
    display: flex;
    justify-content: space-between;
    color: #9c9c9c;
    font-size: 14px;
}

.option-btn:hover {
    cursor: pointer;
    color: #86A8E7;
}

/* -----------------------확인 버튼---------------------- */
.button {
    margin: 0px 0 20px;
    text-align: center;
}

.login-btn {
    font-family: 'Pretendard-Regular';
    padding: 12px 10px;
    font-size: 20px;
    border: none;
    border-radius: 10px;
    color: white;
    background-color: #9DB3FF;
    width: 100%;
}

.login-btn:hover {
    cursor: pointer;
    background-color: #7592f8;
    transition: all 0.5s;
}

.login-btn:active {
    background-color: #4964c5;
}

.social-title {
    margin: 16px 0px;
}

.social-button:hover {
    cursor: pointer;
}

.social-button button {
    font-family: 'Pretendard-Regular';
    padding: 10px 0px;
    border: none;
    border-radius: 10px;
    width: 100%;
    font-weight: bold;
    margin: 8px auto;
    display: flex;
    justify-content: center;
    cursor: pointer;
}

.social-button img {
    width: 30px;
    margin: auto 5px;
}

.kakao-btn:hover,
.naver-btn:hover {
    filter: brightness(95%);
}

.social-button p {
    font-size: 18px;
    padding: auto;
    margin: auto 0;
}

.kakao-btn {
    color: #3A1D1D;
    background-color: #FEE500;
    vertical-align: middle;
    padding: auto 0px;
}

.social-button .naver-btn {
    background-color: #03C75A;
    margin-top: 12px;
}

.naver-btn p {
    color: white;
}

@media (max-width: 992px) {
    .line {
        display: none;
    }

    .main-contain {
        position: fixed;
        height: 100%;
        width: 100%;
        font-family: 'Pretendard-Regular';
        margin: 20% auto;
        /* border: 1px solid #ff0000; */
    }

    .logo-contain {
        width: 100%;
        height: auto;
        position: relative;
        margin: 0px 0px 40px 0px;
    }

    .logo {
        scale: 0.7;
        margin: -22px auto 0px;
    }

    .title-text {
        margin: -22px auto 0px;
    }

    .login-contain {
        width: 100%;
        height: auto;
        position: relative;
    }

    .login-box {
        width: 56%;
    }

}
</style>