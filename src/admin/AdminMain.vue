<template>
    <div class="admin-body">
        <div class="title">
            <div class="titledot">
                <img src="../assets/icon_dot.png">
            </div>
            <h3>관리 메인</h3>
        </div>
        <hr class="tophr">
        <div class="admin-main-content">
            <div class="admin-left-content">
                <div class="cate-chart">
                    <h3 class="chart-title">카테고리 별 크루 수</h3>
                    <canvas ref="barChart" />
                </div>
            </div>
            <div class="admin-right-area">
                <div class="admin-right-content">
                    <div class="moim-ranking">
                        <h3>💕 주간 좋아요 증가 TOP 5 </h3>
                        <div class="moim-top" v-for="(like, index) in likeRank" :key="index">
                            <p class="rank-moim" @click="goToDetail(like.moim_no)">
                                {{ like.moim_title }}
                            </p>
                            <p class="rank-moim">
                                {{ like.WEEK_LIKE_CNT }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="admin-right-content">
                    <div class="moim-ranking">
                        <h3>✔️ 주간 클릭 수 TOP 5 </h3>
                        <div class="moim-top" v-for="(click, index) in clickRank" :key="index">
                            <p class="rank-moim"  @click="goToDetail(click.moim_no)">
                                {{ click.moim_title }}
                            </p>
                            <p class="rank-moim">
                                {{ click.WEEK_CLICK_CNT }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
  
<script>
import { Chart, registerables } from 'chart.js'
import axios from 'axios'
Chart.register(...registerables)

export default {
    data: () => ({
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: ' 크루 수',
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        },
        likeRank: [],
        clickRank: [],
    }),
    mounted() {
        this.getMoimList()
    },
    methods: {
        createChart() {
            new Chart(this.$refs.barChart, {
                type: 'bar',
                data: this.data,
                options: this.options
            })
        },
        async getMoimList() {
            try {
                // 카테고리 목록 가져오기
                const cate = await axios.get(`http://localhost:4000/admin/admin_cate_list`);
                cate.data.forEach(cate => {
                    this.data.labels.push(cate.CATEGORY_NM)
                })

                // 카테고리별 목록 개수 가져오기
                const moimCnt = await axios.get(`http://localhost:4000/admin/admin_moim_cnt`);
                moimCnt.data.forEach(cnt => {
                    this.data.datasets[0].data.push(cnt.CATE_CNT)
                })

                // 크루 좋아요 상위 순위 가져오기
                const likeRank = await axios.get(`http://localhost:4000/admin/admin_moim_like_week`);
                this.likeRank = likeRank.data;

                // 크루 클릭 상위 순위 가져오기
                const clickRank = await axios.get(`http://localhost:4000/admin/admin_moim_click_week`);
                this.clickRank = clickRank.data;

            } catch (error) {
                console.error(error);
            } finally {
                this.createChart()

            }
        },
        goToDetail(moim_no) {
            window.location.href = `http://localhost:8001/moimdetail/${moim_no}`;
        },
    }
}
</script>

<style scoped>
/* ---------------------------------------------------기본css */

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
    /* 드래그 방지 코드 */
    -webkit-moim-select: none;
    -moz-moim-select: none;
    -ms-moim-select: none;
    font-family: 'Pretendard-Regular';

    /* 스크롤바 제거 코드 */
    -ms-overflow-style: none;
    /* 인터넷 익스플로러 */
    scrollbar-width: none;
    /* 파이어폭스 */
}

*::-webkit-scrollbar {
    display: none;
    /* 크롬, 사파리, 오페라, 엣지 */
}

.admin-body {
    padding-left: 1.875rem;
}

/* ---------------------------------------------------title */

.title {
    margin: 1.875rem 0 0 0;
    width: 100%;
}

.titledot img {
    width: 1.5rem;
    float: left;
    margin-right: .25rem;
}

.tophr {
    margin: 1.875rem 1.875rem .625rem 0;
    border: .125rem solid #E1E7F0;
}

.admin-main-content {
    margin-right: 30px;
    display: flex;
    justify-content: space-between;
}

/* --------------------------------------------------- */

.admin-left-content {
    width: 1000px;
}

.chart-title {
    margin: 20px 0;
}

.cate-chart {
    min-width: 300px;
}

/* --------------------------------------------------- */

.admin-right-area {
    display: block;
}

.admin-right-content {
    margin: 16px;
    background-color: #f9f9f9;
    border-radius: 20px;
    padding: 20px;
    height: max-content;
}

.moim-ranking {
    min-width: 320px;
    display: inline-flexbox;
}

.moim-ranking img {
    width: 24px;
    vertical-align: middle;
}


.moim-ranking h3 {
    font-size: 20px;
    margin: 14px 0;
    vertical-align: middle;
}

.moim-top {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
}

.moim-top p {
    cursor: pointer;
    margin: 4px 0;
    height: 24px;
}

.rank-moim {
    padding: 0px 5px;
}

.rank-moim:hover {
    color:#86A8E7;
    font-style: italic;
}

@media screen and (max-width: 1080px) {

    .cate-chart {
        /* width: 320px; */
    }

}
</style>