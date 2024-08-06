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
                    <div class="hr-sect"><span>로그인</span></div>
                    <div class="login-input-container">
                        <div class="login-input-wrap input-id">
                            <p>아이디</p>
                            <input type="id" @keyup.enter="login()" class="form-control" placeholder="아이디를 입력하세요"
                                v-model="user_id" />
                        </div>
                        <div class="login-input-wrap input-password">
                            <p>비밀번호</p>
                            <input type="password" @keyup.enter="login()" class="form-control" placeholder="비밀번호를 입력하세요"
                                v-model="user_pw" />
                        </div>
                    </div>

                    <div class="option-button">
                        <p class="option-btn" @click="goTo('find')">아이디/비밀번호 찾기</p>
                        <p class="option-btn" @click="goTo('join')">회원가입</p>
                    </div>
                    <div class="button">
                        <button class="login-btn" @click="login">로그인</button>
                    </div>
                    <div class="hr-sect social-title"><span>간편 로그인</span></div>
                    <div class="social-button">
                        <label @click="kakaoLogin">
                            <button class="kakao-btn"><img src="../assets/SNS_kakaotalk.png">
                                <p>카카오 로그인</p>
                            </button>
                        </label>

                        <!-- <label @click="naverlogin">
                            <button @click="NaverLogin" class="naver-btn" id="naverIdLogin" ><img src="../assets/SNS_Naver.png">
                                <div id="naverIdLogin"></div>
                                <p>네이버 로그인</p>
                            </button>
                        </label> -->

                        <!-- <div id="naverIdLogin"  style="display: none;></div> -->

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
            user_id: '',
            naver_id: '',
            user_pw: '',
            naverLogin: [],
            user_no: '',
            confetti: null
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
    },
    mounted() {
        this.confetti = window.confetti;
    },
    methods: {
        alert(text) {
            this.$alert(text)
        },
        goTo(page) {
            window.location.href = `http://localhost:8001/${page}`
        },
        login() {
            axios({
                url: "http://localhost:4000/auth/login",
                method: "POST",
                data: {
                    user_id: this.user_id,
                    user_pw: this.user_pw
                },
            })
                .then(res => {
                    if (res.data.message == 'undefined_id') {
                        this.alert("존재하지 않는 아이디입니다.")
                    }
                    else if (res.data.message == 'incorrect_pw') {
                        this.alert("비밀번호가 일치하지 않습니다.")
                    }
                    else {
                        this.$store.commit("user", { user: res.data.message })
                        this.user_no = res.data.message;
                        this.$swal({
                            position: 'top',
                            title: `<p style="font-family: 'Pretendard-Regular'">로그인 성공

                            </p>`,
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500
                        }).then(() => {
                            this.profileCheck();
                        })
                    }
                })
                .catch(err => {
                    console.log(err);
                })


        },
        NaverLogin() {
            const naverIdLogin = document.querySelector("#naverIdLogin");
            if (naverIdLogin) {
                naverIdLogin.click();
            }
        },
        naverlogin() {

            console.log("로그인 함수 실행됨");
            // 네이버 로그인 상태를 확인한 후 회원 정보 저장
            this.naverLogin.getLoginStatus((status) => {
                if (status) {
                    console.log(status);
                    var email = this.naverLogin.user.getEmail();
                    if (email === undefined || email === null) {
                        alert("이메일은 필수임");
                        this.naverLogin.reprompt();

                        return;
                    }

                    // 회원 정보 저장
                    axios({
                        url: "http://localhost:4000/auth/naverlogin",
                        method: "POST",
                        data: {
                            naverlogin: this.naverLogin.user,
                        },
                    })
                        .then(res => {
                            this.$store.commit("user", {
                                user: res.data.message,
                                // email: this.naver_email,
                                //  nickname: this.naver_nick
                            });

                        }).then(() => {
                            window.location.href = "http://localhost:8001";
                        })

                        .catch(err => {
                            console.log(err);
                        });
                } else {
                    console.log("callback 처리 실패");
                }
            });
        },

        kakaoLogin() {
            window.Kakao.Auth.login({
                scope: "profile_nickname, account_email",
                success: this.getKakaoAccount,
            });
        },
        getKakaoAccount() {
            window.Kakao.API.request({
                url: "/v2/user/me",
                success: (res) => {
                    const kakao_account = res.kakao_account;
                    const email = kakao_account.email; //카카오 이메일
                    const nickname = kakao_account.profile.nickname;
                    // this.user_id = email

                    axios({
                        url: "http://localhost:4000/auth/kakaoLoginProcess",
                        method: "POST",
                        data: {
                            user_id: email,
                            user_nick: nickname
                        },
                    }).then(res => {
                        this.$store.commit("user", { user: res.data.message })
                        this.user_no = res.data.message;
                        this.$swal({
                            position: 'top',
                            title: `<p style="font-family: 'Pretendard-Regular'">로그인 성공

                            </p>`,
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500
                        }).then(() => {
                            this.profileCheck();
                        })

                    })
                        .catch(err => {
                            console.log(err);
                        })
                },
                fail: (error) => {
                    // this.$router.push("/errorPage");
                    console.log(error);
                },
            });
        },
        async profileCheck() {
            await axios({
                url: "http://localhost:4000/auth/profile_check",
                method: `POST`,
                data: {
                    user_no: this.user_no
                }
            })
                .then((res) => {
                    if (res.data.message == 'none') {
                        this.$swal({
                            html: `<p style="font-family: 'Pretendard-Regular'">
                            아직 전화번호를 등록하지 않으셨습니다.<br>
                            등록하러 이동하시겠습니까?
                            </p>`,
                            confirmButtonColor: '#86a8e7',
                            confirmButtonText: `<p style="font-family: 'Pretendard-Regular';">확인</p>`,
                            showCancelButton: true,
                            cancelButtonText: `취소`,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.href = "http://localhost:8001/setting";
                            }
                            else {
                                window.location.href = "http://localhost:8001";
                            }
                        })
                    }
                    else {
                        window.location.href = "http://localhost:8001";
                    }
                })
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
.line {
    border-left: 1px solid #D9D9D9;
    height: 70%;
    left: 50%;
    position: absolute;
    top: 130px;
}

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

body {
    margin: 0;
    font-family: 'Pretendard-Regular';

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.main-contain {
    position: fixed;
    height: 100%;
    width: 100%;
}


/* -----------------------로고---------------------- */


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

@keyframes load-ani {
    from {
        opacity: 0;
        /* transform: translate(0, -20px); */
    }

    to {
        opacity: 1;
        transform: translate(0, 0px);
        animation-play-state: running;
    }
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
}

.logo-moim {
    color: #2b2b2b;
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
    /* background-color: blue; */
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: load-ani 1s 0.2s backwards;
}

.hr-sect::before,
.hr-sect::after {
    content: "";
    flex-grow: 1;
    background: #D9D9D9;
    height: 1px;
    font-size: 0px;
    line-height: 0px;
}

.hr-sect {
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 0.35);
    font-size: 20px;
}

.hr-sect span {
    padding: 10px;
}

.login-input-container p {
    color: #86A8E7;
    margin: 0px 0px 5px 0px;
}

.login-input-container p {
    font-size: 20px;
}

.login-box {
    width: 47%;
    height: 70%;
    display: flex;
    padding: 0px 50px 0px 50px;
    /* background-color: blueviolet; */
    flex-direction: column;
    justify-content: center;
}

input::placeholder {
    color: #B0B0B0;
}

.login-input-container {
    padding-bottom: 15px;
    font-size: 20px;
}

.input-password {
    margin-top: 20px;
}

.input-id {
    margin-top: 10px;
}

.login-input-container .login-input-wrap input {
    background: none;
    border: none;
    line-height: 25px;
    width: 100%;
    padding: 0px 0px 5px 0px;
    font-family: 'Pretendard-Regular';
    font-size: 16px;
    border-bottom: solid 1px #D9D9D9;
}

.login-input-wrap input:focus {
    outline: none;
    border-bottom: solid 1px #86A8E7;

}

/* -----------------------회원가입---------------------- */
.option-button {
    font-size: 16px;
    margin: 10px 0px 20px 0px;
    display: flex;
    justify-content: space-between;
    color: #9c9c9c;
    font-size: 14px;
}

.option-btn:hover {
    cursor: pointer;
    color: #86A8E7;
}


/* -----------------------로그인 버튼---------------------- */
.button {
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
    margin: 12px 0px;
}

.social-button:hover {
    cursor: pointer;
}

.social-button button {
    font-family: 'Pretendard-Regular';
    padding: 12px 10px;
    border: none;
    border-radius: 10px;
    width: 100%;
    font-weight: bold;
    margin: 6px auto;
    display: flex;
    justify-content: center;
    cursor: pointer;
}

.social-button img {
    width: 28px;
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

.naver-btn {
    color: white;
    background-color: #1ec800;
}

@media (max-width: 992px) {
    .line {
        display: none;
    }

    .logo-contain {
        width: 100%;
        height: 15%;
        position: relative;
        scale: 0.7;
        margin: 50px 0px -100px 0px;
    }

    .login-contain {
        width: 100%;
        position: relative;
        scale: 0.8;
    }

    .login-box {
        width: 58%;
    }

}
</style>