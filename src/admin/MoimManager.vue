<template>
    <div class="admin-body">
        <div class="title">
            <div class="titledot">
                <img src="../assets/icon_dot.png">
            </div>
            <h3>크루 관리</h3>
        </div>
        <hr class="tophr">
        <div class="admin-content">
            <div class="moim-list">
                <table>
                    <caption>
                        <div class="sub-title">
                            <div class="amdin-search">
                                <input v-model="keyword" type="text" placeholder="크루 이름 검색" @keyup.enter="searchList()">
                            </div>
                            <div class="button-area">
                                <button class="excel-btn btn" @click="getExcel">엑셀다운</button>
                                <button class="delete-btn btn" @click="deleteMoim()">삭제</button>
                                <div class="dropdown-menu">
                                    <button class="dropdown btn" @click="toggleDropdown()">▼ {{ sortCase }}</button>
                                    <div class="dropdown-content" v-show="showDropdown">
                                        <a class="dropdown-item" href="#" @click="sortList(1)">최신순</a>
                                        <a class="dropdown-item" href="#" @click="sortList(2)">오래된순</a>
                                        <a class="dropdown-item" href="#" @click="sortList(3)">인원순</a>
                                        <a class="dropdown-item" href="#" @click="sortList(4)">인기순</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </caption>
                    <thead>
                        <th><input type="checkbox" v-model="check" @click="checkAll()"></th>
                        <th>번호</th>
                        <th>크루명</th>
                        <th>태그</th>
                        <th>좋아요</th>
                        <th>크루 인원</th>
                        <th>크루 리더</th>
                        <th>지역구</th>
                        <th>크루 개설일</th>
                    </thead>
                    <td colspan="9" v-if="moimList.length == 0">
                        <p>검색 결과가 없습니다.</p>
                    </td>
                    <tbody v-for="(moim, index) in moimList" :key="index">
                        <td><input type="checkbox" :value="moim.MOIM_NO" v-model="checkList"></td>
                        <td>{{ (page - 1) * pageCnt + index + 1 }}</td>
                        <td class="goto" @click="goToDetail(moim.MOIM_NO)">{{ moim.MOIM_TITLE }}</td>
                        <td>{{ moim.CATEGORY_NM }}</td>
                        <td>{{ moim.LIKE_CNT }}</td>
                        <td>{{ moim.MOIM_CNT }}/{{ moim.MOIM_MAX }}</td>
                        <td>{{ moim.user_nick }}</td>
                        <td>{{ moim.MOIM_ADR }}</td>
                        <td>{{ getFormatDateTime(moim.MOIM_SDD) }}</td>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="page">
            <button class="page-btn" @click="changePage(page - 1)">
                ◀
            </button>
            <div class="page-cnt" v-for="i in totalPage" :key="i">
                <p v-if="i == page" class="page-current">{{ page }}</p>
                <p v-else class="page-other" @click="changePage(i)">{{ i }}</p>
            </div>
            <button class="page-btn" @click="changePage(page + 1)">
                ▶
            </button>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';
import * as XLSX from 'xlsx';

export default {
    data() {
        return {
            moimList: [],
            keyword: '',
            page: 1,
            pageCnt: 10,
            totalPage: 1,
            checkList: [],
            check: false,
            sortCase: "최신순",
            showDropdown: false,
        };
    },
    computed: {
        moim() {
            return this.$store.state.moim.moim;
        },
    },
    mounted() {
        this.getMoimList(1);
    },
    methods: {

        toggleDropdown() {
            this.showDropdown = !this.showDropdown;
        },
        sortList(sortNum) {
            this.showDropdown = !this.showDropdown;

            if (sortNum == 1) {
                this.sortCase = "최신순"
            }
            else if (sortNum == 2) {
                this.sortCase = "오래된순"
            }
            else if (sortNum == 3) {
                this.sortCase = "인원순"
            }
            else if (sortNum == 4) {
                this.sortCase = "인기순"
            }
            this.getMoimList(sortNum);
        },
        sortNumList() {
            if (this.sortCase == '최신순')
                return 1;
            else if (this.sortCase == '오래된순')
                return 2;
            else if (this.sortCase == '인원순')
                return 3;
            else if (this.sortCase == '인기순')
                return 4;
        },
        getExcel() {
            const wb = XLSX.utils.book_new();
            const wsData = [];
            const headers = Object.keys(this.moimList[0]);
            wsData.push(headers);

            this.moimList.forEach((user) => {
                const row = headers.map((header) => user[header]);
                wsData.push(row);
            });

            const ws = XLSX.utils.aoa_to_sheet(wsData);

            XLSX.utils.book_append_sheet(wb, ws, 'moimList');
            XLSX.writeFile(wb, 'moimList.xlsx');
        },
        searchList() {
            this.page = 1;
            this.getMoimList();
        },
        async getMoimList(sortNum) {
            let keyword = this.keyword
            if (keyword == '') {
                keyword = ' '
            }
            try {
                await axios({
                    url: `http://localhost:4000/admin/admin_total_moim_page/${keyword}/${sortNum}`,
                    method: 'POST',
                })
                    .then(res => {
                        this.totalPage = res.data.page;
                    })
                const response = await axios.get(`http://localhost:4000/admin/admin_moim_list/${sortNum}/${keyword}/${this.page}`);
                this.moimList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        changePage(page) {
            if (page <= 0 || page > this.totalPage) {
                return
            }
            this.page = page;
            this.getMoimList();

            // 체크 초기화
            this.checkList = [];
            this.check = false
        },
        checkAll() {
            // 전체 선택 안 했을 때
            if (!this.check) {
                this.moimList.forEach(moim => {
                    // 중복값 체크해서 개별 체크로 넣은 값은 무시하고 배열 삽입
                    if (!this.checkList.includes(moim.MOIM_NO)) {
                        this.checkList.push(moim.MOIM_NO)
                    }
                })
            }
            else {
                this.checkList = [];
            }
            console.log(this.checkList)
        },
        deleteMoim() {
            if (this.checkList.length == 0) {
                this.alert('삭제할 크루를 선택해주세요.');
                return
            }
            this.$swal({
                title: `<p style="font-family: 'Pretendard-Regular'">
                    선택한 크루를 정말 삭제하시겠습니까?
                </p>`,
                showCancelButton: true,
                confirmButtonText: '삭제',
                confirmButtonColor: '#86a8e7',
                cancelButtonText: `취소`,
            }).then((result) => {
                if (result.isConfirmed) {
                    axios({
                        url: 'http://localhost:4000/admin/admin_moim_delete',
                        method: 'POST',
                        data: {
                            moimList: this.checkList
                        }
                    })
                        .then(res => {
                            if (res.data.message == 'complete') {
                                this.alert('삭제 완료되었습니다.');

                                this.getMoimList();
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
        goToDetail(moim_no) {
            window.location.href = `http://localhost:8001/moimdetail/${moim_no}`;
        },
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
    -webkit-moim-select: none;
    -moz-moim-select: none;
    -ms-moim-select: none;
    moim-select: none;
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



.dropdown {
    /* border: 2px solid blue; */
    margin-right: 20px;
    padding: 4px 9px;
    word-wrap: nowrap;
    word-break: keep-all;
    width: 90px;
    height: 32px;
}

.dropdown .btn {
    font-size: 14px;
    padding: 4px 12px;
    margin: auto;
    border-radius: 4px;
    cursor: pointer;
    background-color: #E1E7F0;
    border: none;
}

.dropdown-menu li {
    text-decoration: none;
    position: relative;
}

.dropdown-content {
    position: absolute;
    margin-top: 4px;
}

.dropdown:hover .dropdown-content {
    display: block;
}

.dropdown-item {
    background-color: white;
    padding: 8px 20px;
    font-size: 14px;
    color: #282828;
    text-decoration: none;
    display: block;
    white-space: nowrap;
    cursor: pointer;
    transition: background-color 0.3s ease;
    border: 1px solid #E1E7F0;
}

.dropdown-item:hover {
    background-color: #f8f9fa;
}

.dropdown-menu .active {
    color: #fff;
}




/* -----------------테이블----------------- */



.moim-list {
    /* overflow: scroll; */
    margin: 20px 0;
}

.moim-list caption {
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

.moim-list th {
    text-align: center;
    padding: 12px;
    border-radius: 4px;
    /* border: 2px violet solid; */
}

.moim-list input[type=checkbox] {
    width: 20px;
}

.moim-list td {
    text-align: center;
    padding: 8px;
    min-width: 30px;
    /* border: 2px blue solid; */
}

.th {
    background-color: #d3d3d3;
}

.goto:hover {
    cursor: pointer;
    color: #86A8E7;
    font-style: italic;
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