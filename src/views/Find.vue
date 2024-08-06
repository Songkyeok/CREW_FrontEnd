Find.vue 
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
                    <div class="form-control">
                        <button class="tab" @click="FindTab('id')">ID 찾기</button>
                        <button class="tab" @click="FindTab('password')">비밀번호 찾기</button>
                    </div>

                    <div v-if="IdTab" class="IdTab" @click="expanded = !expanded" :class="{ active: expanded }">
                        <Transition name="display" mode="out-in">
                            <div>
                                <hr class="hr-line">
                                <h4>ID를 잊으셨나요? <br>전화번호를 입력해주세요.</h4>
                                <div class="phone-number-container">
                                    <input type="tel" v-model="user_tel" placeholder="전화번호" class="form-control sa" />
                                </div>
                                <!-- <hr class="hr-line">  -->
                                <button class="idfindbtn" type="submit" @click="findID">ID 찾기</button>
                                <div v-if="response_id_check" class="response">
                                    <p class="idp">아이디는 {{ search_user_id }}입니다. </p>
                                </div>
                            </div>
                        </Transition>
                    </div>


                    <div v-if="PasswordTab" class="PasswordTab">
                        <hr class="hr-line">
                        <h4>PASSWORD를 잊으셨나요?<br>아래의 정보를 입력해주세요.</h4>
                        <input type="id" v-model="user_id" placeholder="ID" class="form-control sa" />
                        <!-- <hr> -->
                        <div class="phone-number-container">
                            <input type="tel" v-model="user_phone_number" placeholder="전화번호" class="form-control sa" />
                            <button class="getcode" type="submit" @click="sendAuthCode">인증번호
                                받기</button>
                        </div>
                        <div class="phone-number-container">
                            <input type="text" v-model="inputAuthCode" class="form-control sa" placeholder="인증번호 입력" />
                            <button class="get-code" @click="checkAuthCode">인증번호
                                확인</button>
                        </div>
                        <!-- <hr> -->
                        <button class="idfindbtn" @click="resetPassword" type="submit">PASSWORD 재설정</button>
                        <div v-if="response_pw_check" class="response">
                            <p>임시 비밀번호는 {{ tempPassword }} 입니다.<br>
                                로그인 후 꼭 변경해주세요.</p>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </body>
</template>
<script>


import axios from "axios";

export default {
    data() {
        return {
            IdTab: true,
            PasswordTab: false,
            user_id: '',
            user_pw: '',
            user_tel: '',
            user_auth_code: '',
            user_auth_number: '',
            inputAuthCode: "",
            user_phone_number: "",
            foundIds: {},
            response_id_check: false,
            response_pw_check: false,
            tempPassword: "",
        };
    },
    mounted() {
        this.confetti = window.confetti;
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    methods: {
        FindTab(tabType) {
            if (tabType === 'id') {
                // 아이디찾기 탭을 보이게 하고 비밀번호 찾기 탭을 숨김
                this.IdTab = true;
                this.PasswordTab = false;
            } else if (tabType === 'password') {
                // 비밀번호 찾기 탭을 보이게 하고 아이디찾기 탭을 숨김
                this.IdTab = false;
                this.PasswordTab = true;
            }
        },
        sendAuthCode() {
            if (!this.user_phone_number || !this.user_id) {
                this.alert('아이디와 전화번호를 입력하세요');
                return;
            }
            axios
                .post("http://localhost:4000/auth/sendAuthCode", {
                    user_phone_number: this.user_phone_number,
                    user_id: this.user_id
                })
                .then((response) => {
                    console.log(response.data.message);

                    this.user_auth_number = response.data.user_auth_number;
                    this.user_id = response.data.user_id;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        checkAuthCode() {
            if (!this.user_phone_number || !this.inputAuthCode) {
                this.alert('인증번호를 입력하세요');
                return;
            }
            axios
                .post("http://localhost:4000/auth/checkAuthCode", {
                    user_phone_number: this.user_phone_number,
                    entered_auth_code: this.inputAuthCode,
                })
                .then((response) => {
                    if (response.data.message === "인증 성공") {
                        this.alert("인증 번호가 일치합니다.")
                    } else {
                        this.alert("인증 번호가 일치하지 않습니다.");
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        resetPassword() {
            if (!this.user_phone_number || !this.inputAuthCode) {
                this.alert('인증번호를 입력하세요');
                return;
            }
            axios
                .post("http://localhost:4000/auth/verifyAuthCode", {
                    user_phone_number: this.user_phone_number,
                    entered_auth_code: this.inputAuthCode,
                })
                .then((response) => {
                    if (response.status === 200) {
                        console.log(response.data.message);

                        const newTempPassword = Math.random().toString(36).slice(2);

                        this.tempPassword = newTempPassword;
                        this.response_pw_check = true;
                        axios
                            .post("http://localhost:4000/auth/resetPassword", {
                                user_phone_number: this.user_phone_number,
                                new_password: newTempPassword,
                            })
                            .then((response) => {
                                if (response.status === 200) {
                                    console.log(response.data.message);

                                    this.resetSuccess = true;
                                    this.user_pw = newTempPassword;
                                }
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        findID() {

            if (this.user_tel === '') {
                this.alert('전화번호를 입력해주세요');

            } else {
                axios.post('http://localhost:4000/auth/findIdss',
                    { user_tel: this.user_tel }
                ).then((res) => {
                    if (res.data.message === 'user_tel') {
                        this.search_user_id = res.data.user_id;
                        this.response_id_check = true;
                    } else {
                        this.alert('알 수 없는 오류가 발생했습니다.');
                    }
                })
                    .catch((error) => {
                        console.log(error);
                        this.alert('등록된 전화번호가 없습니다.');
                    });
            }
        },
        goTo(page) {
            window.location.href = `http://localhost:8001/${page}`
        },
        alert(text) {
            this.$alert(text)
        },
        watch: {
            expanded() {
                this.IdTab = !this.IdTab
                this.PasswordTab = !this.PasswordTab
            }
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
    color: #2b2b2b;
    /* 드래그 방지 코드 */
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-family: 'Pretendard-Regular';
}

.main-contain {
    position: fixed;
    height: 100%;
    width: 100%;
}

.line {
    border-left: 1px solid #D9D9D9;
    height: 70%;
    left: 50%;
    position: absolute;
    top: 130px;
}

/* -----------------------로고---------------------- */

.logo-contain {
    width: 50%;
    height: 100%;
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    /* background-color: aqua; */
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
    /* background-color: #CCCCCC; */
}

.login-box {
    width: 50%;
    height: 70%;
    display: flex;
    padding: 0px 40px;
    flex-direction: column;
    justify-content: center;
    /* border: 1px solid rgb(81, 0, 255); */
}

/* -----------------ID PW---------------------- */
.form-control .tab {
    font-weight: bold;
}

.login-box button {
    font-family: 'Pretendard-Regular';
    padding: 12px 10px;
    font-size: 16px;
    border: none;
    color: #000000;
    /* 검은색으로 설정 */
    background-color: transparent;
    width: 50%;
}

.login-box button:nth-child(1) {
    border-right: 1px solid #E1E7F0;
}

.login-box .tab:nth-child(1):hover {
    cursor: pointer;
    color: #7592f8;
    /* 마우스 커서를 대면 글자색이 #7592f8로 바뀜 */
}

.login-box .tab:nth-child(2):hover {
    cursor: pointer;
    color: #7592f8;
    /* 마우스 커서를 대면 글자색이 #7592f8로 바뀜 */
}

.hr-line {
    border: 1px solid #E1E7F0;
}

/* ---------------------------------------------------------------------------  */

.login-contain h4 {
    font-size: 14px;
    color: #86A8E7;
    margin: 20px 0px 10px;
    line-height: 24px;
}


.phone-number-container {
    display: flex;
    align-items: center;
}

input::placeholder {
    color: #B0B0B0;
}

/* -------------------------------------전화번호 입력란 */
.form-control {
    background-color: transparent;
    /* 배경색을 투명하게 설정 */
    border: none;
    /* 테두리 제거 */
    line-height: 25px;
    width: 100%;
    /* padding: 0px 0px 5px 0px; */
    font-family: 'Pretendard-Regular';
    font-size: 16px;
    /* border: 1px solid rgb(0, 255, 13); */
}

.phone-number-container input {
    padding: 10px;
}

.sa {
    border-bottom: solid 1px #D9D9D9;
}

.form-control:focus {
    outline: none;
    border: none;
    border-bottom: solid 1px #86A8E7;
}

/* -------------------------------------------------찾기 버튼 */

.idp {
    margin: 10px auto;
    text-align: center;
    color: #86A8E7;
}

.IdTab .idfindbtn,
.PasswordTab .idfindbtn {
    font-family: 'Pretendard-Regular';
    padding: 12px 10px;
    font-size: 16px;
    border: none;
    border-radius: 10px;
    color: white;
    background-color: #9DB3FF;
    width: 100%;
    cursor: pointer;
    margin-top: 30px;
    /* transition: all 0.5s; */
}

.IdTab .idfindbtn:hover,
.PasswordTab .idfindbtn:hover {
    background-color: #7592f8;
    transition: all 0.5s;
}

/* ---------------------------------------------PasswordTab */

.PasswordTab input {
    padding: 10px;
}

/* -----------------전화번호,인증번호 버튼------------------- */

.phone-number-container .getcode,
.phone-number-container .get-code {
    color: #9DB3FF;
    font-size: 14px;
    cursor: pointer;
}

.phone-number-container .getcode:hover,
.phone-number-container .get-code:hover {
    color: #7592f8;
    transition: all 0.5s;
}

/* 탭 전환 효과 */

.tester-create {
    background-color: #ffffff;
    border: 1px solid #7B6FCC;
    border-radius: 10px;
    height: 0px;
    align-items: center;
    margin-bottom: 6px;
    overflow: hidden;
    transition: all 0.3s ease;
    padding-top: 12px;


}

.active {
    display: flex;
    align-items: center;
    padding-top: 0;
    height: 370px;
    width: 100%;
}

.display-enter-active,
.display-leave-active {
    transition: opacity 0.3s ease;
    /* 0.3초 동안 투명도 변화 */
}

.display-enter-from,
.display-leave-to {
    opacity: 0;
    /* 등장하기 시작, 퇴장의 마지막은 투명도 0 */
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
        margin: 30% auto;
    }

    .logo-contain {
        width: 100%;
        height: auto;
        position: relative;
        margin: -100px 0px 20px 0px;
        /* border: 1px solid #ff0000; */
    }

    .logo {
        scale: 0.7;
        margin: -80px auto 0px;
    }

    .title-text {
        margin: -22px auto 0px;
    }

    .login-contain {
        width: 100%;
        height: auto;
        padding: 40px 0;
        position: relative;
        /* border: 1px solid #ff0000; */
    }

    .login-box {
        width: 56%;
        margin-top: -30px;
    }

}
</style>