<template>
    <div>
        <div class="title">
            <div class="titledot">
                <img src="../assets/icon_dot.png">
            </div>
            <h3 @click="goToDetail()">{{ moimDetail.MOIM_TITLE }} : 도전과제</h3>
        </div>

        <hr class="tophr">

        <div class="Achieve-form">
            <div class="form-top">
                <img v-if="moimDetail.MOIM_GRADE" :src="require(`../assets/Badges/${setGrade(moimDetail.MOIM_GRADE)}`)" alt="." />
                <div class="top-text">
                    <h2>현재 우리 크루의 등급은<span> "{{ setGradeKR(moimDetail.MOIM_GRADE) }}" </span>입니다.</h2>
                    <p v-if="moimDetail.MOIM_GRADE == 9">최고 등급에 도달하셨습니다. 축하드립니다!</p>
                    <p v-else>다음 등급은 {{ setGradeKR(moimDetail.MOIM_GRADE + 1) }} 입니다.</p>
                </div>
            </div>

            <div class="caed-form">
                <div class="form" v-for="mission in missionList" :key="mission">
                    <div class="form-left">
                        <h4>{{ mission.MSN_TITLE }}</h4>
                        <div class="bar">
                            <div>진행도</div>
                            <div class="gauge-bar">
                                <div class="progress-container">
                                    <div class="progress"
                                        :style="{ width: getPercent(mission.MSN_CNT, mission.MSN_GOLL) + '%' }"></div>
                                </div>
                            </div>
                            <p class="gauge-percent">{{ getPercent(mission.MSN_CNT, mission.MSN_GOLL) }}%</p>
                        </div>
                    </div>

                    <div class="form-right">
                        <div class="ing">{{ mission.MSN_CNT }}/{{ mission.MSN_GOLL }}<br>
                            <p>진행</p>
                        </div>
                        <div class="finish" v-if="mission.MSN_STATUS == 1">
                            <img src="../assets/Badges/badges-finish.png" />
                            달성 완료!
                        </div>
                        <div class="finish" v-else>
                            <img src="../assets/Badges/badges-unfinish.png" />
                            <span>미완료</span>
                        </div>
                    </div>
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
            moim_no: this.$route.params.moim_no,
            moimDetail: {},
            missionList: {},
        };
    },
    computed: {
        user() {
            return this.$store.state.user.user;
        },
    },
    mounted() {
        this.getMoimDetail();
        this.getMMS();
    },
    methods: {
        goToDetail() {  //크루 디테일 홈으로 이동
            window.location.href = `http://localhost:8001/moimdetail/${this.moim_no}`;
        },
        async getMoimDetail() { //크루 정보 불러오기
            try {
                const response = await axios.get(`http://localhost:4000/moim/moim_detail/${this.moim_no}`);
                this.moimDetail = response.data[0];
                // console.log("this.moimDetail ==>", this.moimDetail)
            } catch (error) {
                console.error(error);
            }
        },
        async getMMS() {
            try {
                const response = await axios.get(`http://localhost:4000/moim/get_moim_mission/${this.moim_no}`);
                this.missionList = response.data;
                // console.log("this.missionList", this.missionList);
            } catch (error) {
                console.error(error);
            }
        },
        getPercent(cnt, goll) {
            return cnt / goll * 100;
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
        },
        setGradeKR(grade){
            if (grade == 0){
                return '언랭'
            } if (grade == 1) {
                return '브론즈3'
            } if (grade == 2) {
                return '브론즈2'
            } if (grade == 3) {
                return '브론즈1'
            } if (grade == 4) {
                return '실버3'
            } if (grade == 5) {
                return '실버2'
            } if (grade == 6) {
                return '실버1'
            } if (grade == 7) {
                return '골드3'
            } if (grade == 8) {
                return '골드2'
            } if (grade == 9) {
                return '골드1'
            } 
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
    color: #2b2b2b;
    /* 드래그 방지 코드 */
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-family: 'Pretendard-Regular';
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

.tophr {
    margin: 30px 30px 0px 0;
    border: 2px solid #E1E7F0;
}

/* --------------------------------------------------- */

.Achieve-form {
    display: flow-root;
    margin: 30px 30px 20px 0px;
    height: 100%;
}

.form-top {
    display: flex;
    padding: 0 20px 30px;
    /* border: 1px solid red; */
}

.top-text span {
    color: #7F7FD5;
}

.form-top img {
    width: 60px;
    height: 100%;
    min-width: 60px;
}

.form-top .top-text {
    margin: auto 30px;
}

.form-top .top-text p {
    margin-top: 6px;
}

/* ---------------------------------- */
.caed-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0 30px 0;
    /* border: 1px solid red; */
}

.form {
    position: relative;
    width: calc(49% - 10px);
    /* 2개씩 정렬되도록 너비 조정 */
    height: 90px;
    display: flex;
    padding: 20px;
    border-radius: 10px;
    background-color: #f3f5f8;
    margin: 0 0 30px 0;
    /* border: 1px solid rgb(111, 0, 255); */
    box-sizing: border-box;
}

.form-left {
    margin: auto 0;
}

/* ------------------------------------------------진행도 바 */
.bar {
    display: flex;
    margin-top: 10px;
    /* border: 1px solid red; */
}

.gauge-bar {
    height: 15px;
    overflow: hidden;
    width: 200px;
    margin: 2px 8px 0 8px;
    border-radius: 10px;
    background-color: #cbdbf8;
    /* 배경색 */
}

.progress-container {
    height: 100%;
    width: 100%;
    background-color: transparent;
    border-radius: 10px;
    overflow: hidden;
}

.progress {
    height: 100%;
    width: 0;
    background-color: #86A8E7;
    border-radius: 10px;
    transition: width 0.3s ease-in-out;
}

.gauge-percent {
    padding-top: 1px;
    font-size: 12px;
    color: gray;
}

/* ------------------------------------------------ */
.form-right {
    position: absolute;
    display: flex;
    padding-right: 20px;
    right: 0;
}

.form-right .ing {
    color: #86A8E7;
    margin: 10px 30px;
    padding: 0;
    text-align: center;
    /* border: 1px solid red; */
    min-width: 60px;
}

.ing p {
    color: #2b2b2b;
    font-size: 14px;
    margin-top: 4px;
}

.finish {
    color: #7F7FD5;
    min-width: 70px;
    text-align: center;
}

.finish span {
    color: #C8C8C8;
}

.finish img {
    display: grid;
    margin: 0 auto;
    width: 40px;
}

/* --------------------------------------------------- */

@media screen and (max-width: 1340px) {
    .form {
        width: 100%;
    }

}

/* --------------------------------------------------- */

@media screen and (max-width: 600px) {
    .form {
        height: 120px;
        position: relative;
        display: grid;
        border-radius: 10px;
        background-color: #f3f5f8;
        /* border: 1px solid red; */
    }

    .bar {

        display: grid;
    }

    .gauge-bar {
        width: 100%;
        margin: 10px 0;
    }

    .gauge-percent,
    .finish img {
        display: none;
    }

    .form-right {
        /* position: absolute; */
    }

    .ing {
        position: absolute;
        display: flex;
        width: 90px;
        bottom: -78px;
        right: -16px;
        text-align: right;
        /* border: 1px solid red; */
    }

    .ing p {
        margin: 1px 0 0 8px;
    }

    .finish {
        position: absolute;
        top: 16px;
        left: -64px;
    }
}
</style>