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

            <!-- 회원가입 -->
            <div class="join-contain">
                <div class="join-box">
                    <div class=title>

                        <div class="hr-sect"><span>회원가입</span></div>
                    </div>

                    <div class="join" @submit.prevent="onSubmitForm">

                        <form id="sendForm">
                            <div class="email">
                                <input class="input2" type="email" v-model="user_id" placeholder="이메일" />
                                <button class="btn-check" type="button" @click="idCheck()">중복 확인</button>
                            </div>
                            <div>
                                <input type="password" v-model="user_pw" placeholder="비밀번호" />
                            </div>
                            <div>
                                <input type="password" v-model="user_pw_ck" placeholder="비밀번호 확인" />
                            </div>
                            <div class="join-btn">
                                <button width="100px" class="btn" type="submit">가입하기</button>
                            </div>
                        </form>
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
            user_pw: '',
            user_pw_ck: '',
            idCheckResult: false,
        };
    },
    mounted() {
        this.confetti = window.confetti;
    },
    methods: {
        onSubmitForm() {
            if (!this.validationCheck()) {
                return;
            }
            axios({
                url: 'http://localhost:4000/auth/join',
                method: 'POST',
                data: {
                    user_id: this.user_id,
                    user_pw: this.user_pw,
                },
            })
                .then(res => {
                    if (res.data.message == 'already_exist_id') {
                        this.alert("이미 존재하는 아이디입니다.")
                    }
                    else if (res.data.message == 'DB_error') {
                        this.alert("DB 에러 발생")
                    }
                    else {
                        this.alert('회원가입이 완료되었습니다!')
                        this.$router.push({ path: '/login' }); // 로그인 화면으로 이동
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        validationCheck() {
            if (!this.idCheckResult) {
                this.alert('이메일 중복 여부를 확인하세요.');
                return false;
            }
            if (this.user_pw == '') {
                this.alert('비밀번호를 입력하세요.');
                return false;
            }

            if (this.user_pw_ck !== this.user_pw) {
                this.alert('비밀번호가 일치하지 않습니다.');
                return false;
            }
            return true;

        },
        validatePhoneNumber() {
            this.user_tel = this.user_tel.replace(/\D/g, ''); // 숫자 이외의 문자 제거
        },
        goTo(page) {
            window.location.href = `http://localhost:8001/${page}`
        },
        //아이디 체크
        idCheck() {
            if (!this.user_id) {
                this.alert("이메일을 입력해주세요.")
                return;
            }

            if (!this.checkEmail()) {
                this.alert("이메일 형식에 맞게 기입하세요.")
                return;
            }

            axios({
                url: 'http://localhost:4000/auth/id_check',
                method: 'POST',
                data: {
                    user_id: this.user_id,
                },
            })
                .then((res) => {
                    if (res.data.message == 'available') {
                        this.idCheckResult = true;
                        this.alert("사용 가능한 이메일입니다.")
                    } else {
                        this.idCheckResult = false;
                        this.alert("이미 등록된 이메일입니다.")
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        checkEmail() {
            // eslint-disable-next-line
            var reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;

            return !(!reg_email.test(this.user_id));
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
    }
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
}

.main-contain {
    position: fixed;
    height: 100%;
    width: 100%;
}

.join-contain {
    width: 50%;
    height: 100%;
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: load-ani 1s 0.2s backwards;
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
    z-index: 100;
}

@keyframes load-ani {
    from {
        opacity: 0;
        transform: translate(0, -10px);
    }

    to {
        opacity: 1;
        transform: translate(0, 0px);
        animation-play-state: running;
    }
}

.logo-box {
    animation: load-ani 1s 0.2s backwards;
}

.logo {
    cursor: pointer;
    display: flex;
    font-family: 'GeekbleMalang2WOFF2';
    font-size: 100px;
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

/* -----------------------회원가입--------------------- */
.join-box {
    display: flex;
    width: 55%;
    height: 70%;
    justify-content: center;
    flex-direction: column;
}

.title {
    width: auto;
    height: auto;
    margin-bottom: 25px;
    /* font-weight: 800; */
    letter-spacing: 1px;
    line-height: 32px;
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


.btn {
    border: none;
    width: 100%;
    border-radius: 12px;
    background-color: #86A8E7;
    color: hwb(0 100% 0%);
    padding: 15px 0;
    /* font-weight: bold; */
    cursor: pointer;
    transition: .2s;
    font-family: 'Pretendard-Regular';
    align-items: center;
    font-size: 18px;

}

.btn-check {
    font-family: 'Pretendard-Regular';
    border: none;
    width: 30%;
    height: 70%;
    border-radius: 10px;
    padding: 13px 0;
    cursor: pointer;
    transition: .2s;
    word-break: keep-all;
    word-wrap: normal;
    font-size: 16px;
    vertical-align: middle;
}

.btn:hover {
    background-color: #86A8E7;
}

input {
    background: none;
    border: none;
    line-height: 25px;
    width: 100%;
    padding: 16px 0px 16px 0px;
    font-family: 'Pretendard-Regular';
    font-size: 16px;
    border-bottom: solid 1px #D9D9D9;
    /* font-weight: 700; */
}

input:active,
input:focus,
input:hover {
    outline: none;
    border-bottom-color: #86A8E7;

}

.input2 {
    width: 70%;
}

.email {
    display: flex;
    align-items: center;
}

.join-btn {
    margin-top: 25px;
    text-align: center;
}

@media (max-width: 992px) {
    .line {
        display: none;
    }

    .logo-contain {
        margin: auto;
        width: 100%;
        height: 15%;
        position: absolute;
        scale: 0.7;
        margin: 50px 0px -150px 0px;
    }

    .join-contain {
        width: 100%;
        position: relative;
        scale: 0.8;
    }

    .join-box {
        width: 58%;
    }

}
</style>