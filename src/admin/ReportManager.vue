<template>
    <div class="admin-body">
        <div class="title">
            <div class="titledot">
                <img src="../assets/icon_dot.png">
            </div>
            <h3>신고 관리</h3>
        </div>
        <hr class="tophr">
        <div class="admin-content">
            <div class="user-list">
                <table>
                    <caption>
                        <div class="sub-title">
                            <div class="amdin-search" style="visibility: hidden;">
                                <input v-model="keyword" type="text" placeholder="닉네임이나 ID 검색" @keyup.enter="searchList()">
                            </div>
                            <div class="button-area">
                                <button class="normal-btn btn" @click="reportProcess(1)">보류</button>
                                <button class="delete-btn btn" @click="reportProcess(2)">경고</button>
                            </div>
                        </div>
                    </caption>
                    <div id="table">
                        <thead>
                            <th><input type="checkbox" v-model="check" @click="checkAll()"></th>
                            <th>번호</th>
                            <th>신고 대상</th>
                            <th>신고 날짜</th>
                            <th>신고 게시글</th>
                            <th>신고 사유</th>
                        </thead>
                        <td colspan="9" v-if="reportList.length == 0">
                            <p>처리되지 않은 신고 내역이 없습니다.</p>
                        </td>
                        <tbody v-for="(report, index) in reportList" :key="index">
                            <td><input type="checkbox" :value="report.BLACK_NO" v-model="checkList"></td>
                            <td>{{ index + 1 }}</td>
                            <td>{{ report.USER_NICK }}</td>
                            <td>{{ getFormatDateTime(report.BLACK_SSD) }}</td>
                            <td class="goTo" @click="goTo(report.MOIM_NO)">{{ formatPost(report.BOARD_CON) }}</td>
                            <td><button class="btn normal-btn" @click="showReason(report)">확인</button></td>
                        </tbody>
                    </div>
                </table>
            </div>
        </div>

    </div>
</template>
  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            reportList: [],
            keyword: '',
            sort: '전체',
            checkList: [],
            check: false,
        };
    },
    computed: {
        user() {
            return this.$store.state.user.user;
        },
    },
    mounted() {
        this.getReportList();
    },
    methods: {
        searchList() {
            this.page = 1;
            this.getReportList();
        },
        async getReportList() {
            try {
                const response = await axios.get(`http://localhost:4000/admin/admin_report_list/${this.sort}`);
                this.reportList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        checkAll() {
            // 전체 선택 안 했을 때
            if (!this.check) {
                this.reportList.forEach(report => {
                    // 중복값 체크해서 개별 체크로 넣은 값은 무시하고 배열 삽입
                    if (!this.checkList.includes(report.BLACK_NO)) {
                        this.checkList.push(report.BLACK_NO)
                    }
                })
            }
            else {
                this.checkList = [];
            }
            console.log(this.checkList)
        },
        reportProcess(type) {
            if (this.checkList.length == 0) {
                this.alert('처리할 신고를 선택해주세요.');
                return
            }
            let text = '경고'
            if (type == 1) {
                text = '보류'
            }
            this.$swal({
                html: `<p style="font-family: 'Pretendard-Regular'; 
                font-size:22px; margin-top:24px">
                선택한 신고를 모두 ${text} 처리하시겠습니까?
                </p>`,
                confirmButtonColor: '#86a8e7',
                confirmButtonText: `<p style="font-family: 'Pretendard-Regular';">${text}</p>`,
                showCancelButton: true,
                cancelButtonText: `취소`,
            }).then((result) => {
                if (result.isConfirmed) {
                    axios({
                        url: 'http://localhost:4000/admin/admin_report_process',
                        method: 'POST',
                        data: {
                            reportList: this.checkList,
                            type: type
                        }
                    })
                        .then(res => {
                            if (res.data.message == 'complete') {
                                this.alert('처리 완료되었습니다.');

                                this.getReportList();
                                this.checkList = [];
                                this.check = false
                            }
                        })
                }
            })
        },
        alert(text) {
            this.$alert(text)
        },
        getFormatDateTime(datetime) {
            return this.$formatDateTime(datetime)
        },
        async showReason(report) {
            this.$swal({
                html: `<p style="font-family: 'Pretendard-Regular'; 
                font-size:22px; margin-top:24px">
                ${report.BLACK_CON}
                </p>`,
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonColor: '#86a8e7',
                confirmButtonText: `<p style="font-family: 'Pretendard-Regular';">보류</p>`,
                denyButtonText: `<p style="font-family: 'Pretendard-Regular';">경고</p>`,
                cancelButtonText: `<p style="font-family: 'Pretendard-Regular';">취소</p>`
            }).then((result) => {
                let type = 0;
                if (result.isConfirmed) {
                    type = 1;
                } else if (result.isDenied) {
                    type = 2;
                }
                else {
                    return;
                }
                this.reportOne(type, report.BLACK_NO);

            })
        },
        async reportOne(type, BLACK_NO) {
            await axios({
                url: 'http://localhost:4000/admin/admin_report_process',
                method: 'POST',
                data: {
                    reportList: BLACK_NO,
                    type: type
                }
            })
                .then(res => {
                    if (res.data.message == 'complete') {
                        this.alert('처리 완료되었습니다.');
                        this.getReportList();
                        this.checkList = [];
                        this.check = false
                    }
                })
        },
        formatPost(text){
            if (!text) {
                return
            }
            let num = text.indexOf('<br>');
            console.log(num)
            if (num == -1){
                return text;
            }
            else {
                return text.split('<br>', 1)[0] + '...';
            }
        },
        goTo(moim_no){
            this.$router.push({path: `/moimpost/${moim_no}`})
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
    box-sizing: border-box;
    color: #2b2b2b;
    /* 드래그 방지 코드 */
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-family: 'Pretendard-Regular';
}


.admin-body {
    padding-left: 30px;
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
    margin: 30px 30px 10px 0;
    border: 2px solid #E1E7F0;
}

/* --------------------------------------------------- */

.admin-content {}

.sub-title {
    margin: auto;
    display: flex;
    justify-content: space-between;
}

.amdin-search {
    display: inline-flexbox;
}

.amdin-search input {
    border: 2px solid #E1E7F0;
    height: 32px;
    margin: auto 5px;
    border-radius: 30px;
    padding: 10px;
    width: 320px;
}

.amdin-search input:focus {
    outline: none;
    border: 2px solid #E1E7F0;
}

.search-btn {
    border: none;
    background: none;
    margin: auto -30px;
    vertical-align: middle;
}

.search-btn img {
    vertical-align: middle;
    max-width: 20px;
}

.button-area {
    display: flex;
}

.goTo:hover {
    cursor: pointer;
    color: #86A8E7;
}

.btn {
    border: 2px solid #797979;
    background-color: white;
    width: 60px;
    padding: 2px 8px;
    border-radius: 4px;
    margin: 0 5px;
    cursor: pointer;
}

.btn:hover {
    background-color: #d3d3d3;
}

.excel-btn {
    color: #00ac03;
    width: 80px;
    border: 2px solid #00ac03;
}

.excel-btn:hover {
    color: white;
    background-color: #00ac03;
    border: 2px solid #00ac03;
}

.delete-btn {
    border: 2px solid #ff4747;
    background-color: #f9f9f9;
    color: #ff4747;
}

.delete-btn:hover {
    background-color: #ff4747;
    color: white;
}


.normal-btn {
    border: 2px solid #86A8E7;
    background-color: #f9f9f9;
    color: #86A8E7;
    min-height: 30px;
}

.normal-btn:hover {
    background-color: #86A8E7;
    color: white;
}

/* -----------------테이블----------------- */

.user-list {
    margin: 20px 0;
}

.user-list caption {
    margin-bottom: 20px;
}

table {
    border-collapse: collapse;
    border-spacing: 0;
    margin-top: 10px;
}

th,
td {
    padding: 10px 20px;
    text-align: center;
    border: 1.5px solid #E1E7F0;
}

th {
    font-size: 14px;
    background-color: #f3f5f8;
}

.user-list th {
    text-align: center;
    padding: 12px;
}

.user-list input[type=checkbox] {
    width: 20px;
}

.user-list td {
    text-align: center;
    padding: 8px;
    min-width: 30px;
    /* border: 2px blue solid; */
}

.th {
    background-color: #d3d3d3;
}

/* ---------------페이지--------------- */

.page {
    position: fixed;
    bottom: 30px;
    display: flex;
    left: 55%;
    transform: translateX(-50%);
}

.page-btn {
    margin: auto 10px;
    border: none;
    color: #86A8E7;
    background-color: white;
    padding: 2px 4px;
    border-radius: 4px;
    width: 30px;
    cursor: pointer;
}

.page-cnt p {
    border: 1px solid white;
    width: 24px;
    height: 24px;
    text-align: center;
    font-size: 18px;
    margin: 4px;
    border-radius: 50%;
    cursor: pointer;
}

.page-current {
    background-color: #86A8E7;
    color: white;
}

.page-other:hover {
    background-color: #d3d3d3;
}


@media screen and (max-width: 768px) {}
</style>