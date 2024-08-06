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
                <div class="login-form">
                    <div class="one">
                        <input type="password" class="form-control" placeholder="기존 비밀번호" v-model="user_pw" />
                        <label for="floatingPassword"></label>
                        <div class="eyes" @click="oneyes('one')">
                        </div>
                    </div>
                    <div class="two">
                        <input type="password" class="form-control" placeholder="새 비밀번호" v-model="user_npw" />
                        <label for="fa floatingPassword"></label>
                        <div class="eyes" @click="oneyes('two')">
                        </div>
                    </div>
                    <div class="three">
                        <input type="password" class="form-control" placeholder="비밀번호 확인" v-model="user_pw_ck" />
                        <label for="fa floatingPassword"></label>
                        <div class="eyes" @click="oneyes('three')">
                        </div>
                    </div>
                    <div>
                        <button type="button" class="btn" @click="onSubmitForm">비밀번호 변경</button>
                    </div>
                </div>
            </div>
        </div>

    </body>
</template>

<script>
//230709
import axios from 'axios';

export default {
    data() {
        return {
            user_pw: '',
            user_npw: '',
            user_pw_ck: '',
            user_no: ''
        };
    },
    computed: {
        user() {
            return this.$store.state.user.user;
        }
    },
    mounted() {
        this.confetti = window.confetti;
        
        if (!this.getLoginCheck()) {
            this.alert('로그인해주세요');
            this.$router.push({ path: '/login' });
        }
    },
    methods: {
        alert(text) {
            this.$alert(text)
        },
        goTo(page) {
            window.location.href = `http://localhost:8001/${page}`
        },
        onSubmitForm() {
            if (this.user_pw === "" || this.user_npw === "" || this.user_pw_ck === "") {
                this.alert("모든 항목을 입력해주세요");
            } else if (this.user_npw !== this.user_pw_ck) {
                this.alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            } else {
                axios
                    .post(`http://localhost:4000/auth/pass_process/${this.user}`, {

                        user_pw: this.user_pw,
                        user_npw: this.user_npw,
                        user_pw_ck: this.user_pw_ck
                    })
                    .then((res) => {
                        if (res.data.message === 'pass_update') {
                            this.alert("수정이 완료되었습니다");
                            this.$router.push({ path: '/setting' });
                        } else if (res.data.message === 'pw_ck') {
                            this.alert("비밀번호가 틀립니다.");
                        } else {
                            this.alert("알 수 없는 오류가 발생했습니다.");
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        this.alert("수정에 실패했습니다.");
                    });
            }
        },
        // 키 아이콘
        oneyes(field) {
            const passwordInput = document.querySelector(`.${field} input`);
            const eyeIcon = document.querySelector(`.${field} .eyes img`);
            let isMouseDown = false;

            eyeIcon.addEventListener('mousedown', () => {
                passwordInput.type = 'text';
                isMouseDown = true;
            });

            document.addEventListener('mouseup', () => {
                passwordInput.type = 'password';
                isMouseDown = false;
            });

            passwordInput.addEventListener('blur', () => {
                passwordInput.type = 'password';
                isMouseDown = false;
            });

            passwordInput.addEventListener('focus', () => {
                if (isMouseDown) {
                    passwordInput.type = 'text';
                }
            });
        },
        getLoginCheck() {
            return this.$loginCheck(this.user);
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



/* -----------------------로그인 버튼---------------------- */

.login-box {
    display: block;
}

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


.login-form {
    width: 400px;
    height: 500px;
    margin: 8% auto;
    border-radius: 30px;
}

.login-form .form-control {
    height: 48px;
    width: 240px;
    font-size: 16px;
    display: inline;
    margin-left: 20%;
    margin-bottom: 10px;
    border: solid 1.5px rgb(230, 230, 230);
    text-align: center;
    border-radius: 8px;
    position: relative;
    top: 90px;
}

input:focus {
    outline: 2px solid #86A8E7
}

.login-form .one input,
.login-form .two input,
.login-form .three input {
    position: relative;
    display: flex;
    float: left;
    font-family: 'Pretendard-Regular';

}

.form-control input {
    position: relative;
    left: 0;
    top: 0;
    resize: none;
    -moz-appearance: textfield;
    -webkit-appearance: textfield;
}

.one .eyes {
    display: inline-block;
    position: relative;
    height: 40px;
    top: 90px;
    width: 30px;
    padding: 10px 8px 0px 8px;
    font-size: 20px;
    cursor: pointer;
    color: #a1a1a1;
    /* border: solid 1px rgb(225, 44, 44); */
}

.two .eyes {
    display: inline-block;
    position: relative;
    height: 40px;
    top: 100px;
    width: 30px;
    padding: 10px 8px 0px 8px;
    font-size: 20px;
    cursor: pointer;
    color: #a1a1a1;
    /* border: solid 1px rgb(225, 156, 44); */
}

.three .eyes {
    display: inline-block;
    position: relative;
    height: 40px;
    top: 110px;
    width: 30px;
    padding: 10px 8px 0px 8px;
    font-size: 20px;
    cursor: pointer;
    color: #a1a1a1;
    /* border: solid 1px rgb(107, 225, 44); */
}

.login-form .btn {
    font-family: 'Pretendard-Regular';
    height: 48px;
    width: 242px;
    font-size: 16px;
    display: inline;
    margin-left: 20%;
    margin-bottom: 40px;
    border: solid 2px #86A8E7;
    border-radius: 8px;
    background-color: #86A8E7;
    position: relative;
    top: 110px;
    color: white;
}

.login-form .btn:hover {
    cursor: pointer;
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
        margin: 120px 0px -180px 0px;
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