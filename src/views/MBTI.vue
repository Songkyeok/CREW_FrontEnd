<template>
    <div class="container">
        <div class="q-wrap">
            <div id="qCon" class="fade-in-4">
                <div v-if="!showResult" class="test">
                    <div class="testing">{{ this.currentIndex + 1 }} / 10</div>
                    <div class="progress">
                        <div class="progress-bar" :style="progressStyle()"></div>
                    </div>
                    <div class="box">
                        <div class="question" v-html="currentQuestion.content.question"></div>
                    </div>
                    <div class="options">
                        <button v-for="option in currentQuestion.content.options" :key="option.id"
                            @click="selectOption(option)" class="op save"
                            :class="{ checked: selectedOptions[currentQuestion.id] === option.id }">
                            {{ option.title }}
                        </button>
                    </div>
                </div>

                <div v-else id="rCon" class="fade-in-4">
                    <div id="capture_area" style="padding: 10px;">
                        <h4 class="result-title" v-html="result.content.type"></h4>
                        <img class="result-img" :src="require(`../assets/${result.content.imgsrc}`)" alt=".">
                        <p class="result-hashtag" v-html="result.content.hashtag"> </p>
                        <p class="result" v-html="result.content.desc"></p>


                    </div>
                    <button class="results_btn" @click="saveImage()">결과 이미지 저장하기</button>


                    <div class="partner-box">
                        <div class="partner">
                            <div class="text">
                                <h4>최고의 파트너</h4>
                                <p v-html="getPartner(result.partner)"></p>
                            </div>
                            <div class="partnerimg">
                                <img class="result-img" :src="require(`../assets/${getPartnerImg(result.partner)}`)"
                                    alt=".">
                            </div>
                        </div>
                    </div>
                    <div class="store-box">
                        <div class="partner">
                            <div class="text">
                                <h4 @click="getMoim(result.content.hobby)" style=" cursor: pointer;">추천 크루 보기(Click!)
                                </h4>
                                <p class="moim-text">{{ moim.MOIM_TITLE }}</p>
                                <p class="moim-parti" v-if="moim.CATEGORY_NM" style="font-weight: bold;"> # {{
                                    moim.CATEGORY_NM }}</p>
                            </div>
                            <div v-if="moim.MOIM_IMG">
                                <div class="partnerimg">
                                    <img :src="require(`../../../node-back/uploads/uploadMoim/${moim.MOIM_IMG}`)"
                                        alt="크루 이미지" class="moim-img" @click="goToDetail(moim.MOIM_NO)">
                                </div>

                            </div>
                            <div v-else>
                                <div class="partnerimg">
                                    <img src="../assets/mbti/loading.gif" alt="크루 이미지" class="moim-img">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button class="op save" @click="mbtiInsert(result.content.mbti)">등록하기</button>
                        <button class="op save" @click="goToReset()">다시 테스트하기</button>
                    </div>


                </div>

            </div>
        </div>
    </div>
</template>
  
<script>

import axios from 'axios';
import html2canvas from 'html2canvas'
import { questions, scores, results } from '../mbtidata';

const resop = ['e', 'i', 'f', 't', 'p', 'j'];
const resarr = ['efp', 'ifp', 'itp', 'etj', 'ifj', 'etp', 'itj', 'efj'];

export default {
    name: 'Questionnaire',
    data() {
        return {
            questions,
            currentIndex: 0,
            selectedOptions: {},
            showResult: false,
            result: {},
            moim: {},
        };
    },
    computed: {
        currentQuestion() {
            return this.questions[this.currentIndex];
        },
        user() {
            return this.$store.state.user.user;
        },
    },
    mounted() {
        if (!this.getLoginCheck()) {
            this.$alert('로그인해주세요');
            this.$router.push({ path: '/login' });
        }
    },
    methods: {
        saveImage() {
                html2canvas(document.getElementById("capture_area"))
                    .then((canvas) => {
                        var el = document.createElement("a");
                        el.href = canvas.toDataURL("image/jpeg");
                        el.download = '크루 성격유형.jpg'; // 다운로드 할 파일명 설정
                        el.click();
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            },
        getLoginCheck() {
            return this.$loginCheck(this.user);
        },
        getPartner(partnerId) {
            const partnerResult = results.find(result => result.id === partnerId);
            return partnerResult ? partnerResult.content.type : "";
        },
        getPartnerImg(partnerId) {
            const partnerResult = results.find(result => result.id === partnerId);
            return partnerResult ? partnerResult.content.imgsrc : "";
        },
        progressStyle() {
            const progress = ((this.currentIndex + 1) / this.questions.length) * 100;
            return `width: ${progress}%;`;
        },
        selectOption(option) {
            this.selectedOptions[this.currentQuestion.id] = option.id;

            if (this.currentIndex < this.questions.length - 1) {
                this.currentIndex++;
            } else {
                this.calculateResult();
            }
        },
        calculateResult() {
            const selections = this.selectedOptions || {};
            const totalScore = this.doCalc(selections);
            const resultId = this.findResultId(totalScore);
            this.result = results.find((result) => result.id === resultId);
            this.showResult = true;
        },
        doCalc(selections) {
            const totalScore = Object.entries(selections)
                .map(([key, value]) => scores[key][value])
                .reduce((acc, cur) => {
                    const newCalculator = {};
                    Object.keys(acc).forEach((key) => {
                        newCalculator[key] = acc[key] + cur[key];
                    });
                    return newCalculator;
                });
            return totalScore;
        },
        findResultId(scores) {
            const restype = [];
            let gettype = '';

            for (let i = 0; i < 3; i++) {
                restype[i] = scores[(i + 1) * 2 - 1] > scores[(i + 1) * 2] ? resop[i * 2] : resop[i * 2 + 1];
                gettype += restype[i];
            }

            const getId = resarr.indexOf(gettype) + 1;
            return getId;
        },
        async mbtiInsert(mbti) {
            await axios({
                url: 'http://localhost:4000/auth/mbti',
                method: 'POST',
                data: {
                    user_mbti: mbti,
                    user_no: this.user
                }
            })
                .then((response) => {
                    if (response.data.message === 'success') {
                        this.$swal.fire({
                            html: `<p style="font-family: 'Pretendard-Regular'; 
                            font-size:22px; margin-top:24px">
                            등록이 완료되었습니다
                            </p>`,
                            confirmButtonColor: '#86a8e7',
                            confirmButtonText: `<p style="font-family: 'Pretendard-Regular';">확인</p>`
                        })
                            .then(() => {
                                location.href = `http://localhost:8001/myprofile`
                            })

                    } else {
                        this.$alert('등록 실패');
                    }
                })
                .catch((error) => {
                    console.error('등록 에러', error);
                    this.$alert('등록 중 오류가 발생했습니다');
                });
        },
        async getMoim(cate) {
            try {
                const response = await axios.get(`http://localhost:4000/auth/mbti_suggest/${cate}`)
                this.moim = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        goToDetail(moim_no) {
            axios({
                url: `http://localhost:4000/admin/click`,
                method: 'POST',
                data: {
                    moim_no: moim_no
                }
            })
            window.location.href = `http://localhost:8001/moimdetail/${moim_no}`;
        },
        goToReset() {
            window.location.reload();
        }
    },
};
</script>

<style scoped>
/* ---------------------------------------------------기본css */
@font-face {
    /* 긱블말랑이 */
    font-family: 'GeekbleMalang2WOFF2';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2302_01@1.0/GeekbleMalang2WOFF2.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
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
    font-family: 'Pretendard-Regular';
    color: #2b2b2b;
}

/* --------------------------------------------------- */
.container {
    display: flex;
    /* flex-direction: column; */
    /* align-items: center; */
    /* justify-content: center; */
    /* height: 100vh; */
    /* margin: auto 0; */
    justify-content: center;
    align-items: center;
    /* border: 1px solid red; */
}

.q-wrap {
    animation: fade-in 1s;
    -webkit-animation: fade-in 1s;
    width: 85%;
    max-width: 480px;
    text-align: center;
    font-weight: 700;
    font-family: 'Pretendard-Regular';
    /* border: 1px solid rgb(0, 255, 94); */
}

.test {
    margin-top: 18%;
    /* height: 100vh; */
    width: 100%;
    max-width: 480px;
    display: inline-block;
    /* border: 1px solid rgb(51, 0, 255); */
}

.testing {
    padding-bottom: 2rem;
}

.box {
    height: 360px;
    display: flex;
    align-items: center;
    justify-content: center;

}

.question {
    text-align: center;
    font-size: 1.8rem;
    margin: auto 0;
    line-height: 160%;
}

.progress {
    width: 100%;
    height: 20px;
    background-color: #e7ebf2;
    border-radius: 10px;
    margin-bottom: 15px;
    position: relative;
}

.progress-bar {
    width: 0;
    height: 100%;
    background-color: #86A8E7;
    /* 변경 가능한 프로그레스 바의 색상 */
    border-radius: 10px;
    transition: width 0.3s ease;
}

.options {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.op {
    margin: auto;
    width: 100%;
    margin-bottom: 20px;
    text-align: center;
    font-size: 16px;
    padding: 16px 0px;
    cursor: pointer;
    border-radius: 30px;
    border: 1px solid #E1E7F0;
    background-color: #ffffff;
    box-shadow: 0px 4px 10px rgba(66, 89, 125, 0.2);
    transition: background-color 0.2s ease;
}

.op.checked {
    border-color: #86A8E7;
    background-color: #e1ebff;
}

/*--------------------------------------------------------result*/

.result-title {
    font-size: 30px;
    color: #7F7FD5;
    margin: 60px 0 40px;
    line-height: 140%;
}

.result-img {
    width: 50%;
}



.fade-in-4 .result {
    line-height: 160%;
    font-weight: 100;
    margin: 40px 0 0;
}

.result-hashtag {
    font-size: 20px;
}

/* -------------------------------------------------------partner */

.partner-box {
    display: inline-block;
    width: 100%;
    border-radius: 10px;
    margin: 50px 0 10px;
    padding: 20px;
    background-color: #F9F9F9;
    box-sizing: border-box;
}

.partner {
    display: flex;
    align-items: center;
    justify-content: center;
}

.partner .text {
    height: 200px;
    width: 200px;
    margin-right: 20px;
}

.partner .text h4 {
    font-size: 20px;
    margin: 10px 0 20px;
    color: #86A8E7;
}

.partner .text p {
    font-weight: 100;
    align-items: center;
    text-align: center;
}

.partnerimg img {
    width: 200px;
}

/* -----------------------------------------------------BTN */
.save:hover {
    background-color: #86A8E7;
    color: #ffffff;
    font-weight: bold;
}

.again:hover {
    background-color: #F9F9F9;
    color: #86A8E7;
    font-weight: bold;
}

.again {
    margin: 10px 0 100px;
}

/* -----------------------------------------------------추천 */
.moim-img {
    border-radius: 20px;
    width: 200px;
    height: 200px;

    cursor: pointer;
}

.moim-text {
    cursor: pointer;
    font-weight: 100px;
    align-items: center;
    text-align: center;
}

.moim-parti {
    top: 175px;
    right: 8px;
    font-size: small;
    color: #7F7FD5;
    margin: 10px;
}


.store-box {
    display: inline-block;
    width: 100%;
    border-radius: 10px;
    margin: 10px 0 60px;
    padding: 20px;
    background-color: #F9F9F9;
    box-sizing: border-box;
}

.formore:hover {
    cursor: pointer;
    background-color: #f5efeb;
}
.results_btn {
    margin-top: 20px;
    padding: 10px;
    font-size: 18px;
    border: none;
    border-radius: 40px;
    color: white;
    width: 100%;
    cursor: pointer;
    background-color: #7592f8;
    transition: all 0.5s;
}
</style>