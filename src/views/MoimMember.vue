<template>
    <div>
        <!-- 제목 -->
        <div class="title">
            <div class="titledot">
                <img src="../assets/icon_dot.png" />
                <h3 @click="goToDetail()">{{ moimDetail.MOIM_TITLE }}</h3>
            </div>
        </div>
        <hr class="tophr">

        <!-- 검색 입력 필드 -->
        <div class="amdin-search">
            <input v-model="searchKeyword" type="text" placeholder="검색" />
            <div class="searchtext" v-if="searchKeyword && filteredUsers.length > 0">
                <mark><span>"{{ searchKeyword }}" 검색 결과</span></mark>
                <p class="h6"> 총 <strong>{{ filteredUsers.length }}</strong> 개</p>
            </div>
            <div class="searchtext" v-else-if="searchKeyword && filteredUsers.length === 0">
                <p style="background: #ddf5f4; padding: 8px; border-radius: 12px;margin-left: 10px;">검색 결과가 없습니다.</p>
            </div>
        </div>
        <div class="form">
            <div class="left">
                <!-- 유저 테이블 -->
                <table class="user-table">
                    <caption> </caption>

                    <thead>
                        <tr>
                            <th scope="col" v-if="boss">
                                <input type="checkbox" class="selected" v-model="check" @change="checkAll" />
                            </th>
                            <th scope="col">이미지</th>
                            <th scope="col">닉네임</th>
                            <th scope="col" v-if="boss">전화번호</th>
                            <th scope="col">성별</th>
                            <th scope="col">생일</th>
                            <th scope="col">신고</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(user, index) in filteredUsers" :key="index"
                            :class="{ 'selected': checkList.includes(user.USER_NO) }">
                            <td v-if="boss"><input type="checkbox" :value="user.USER_NO" v-model="checkList" /></td>
                            <td><img :height="50" :src="getUserImage(user)" alt="이미지"></td>
                            <td>{{ user.USER_NICK }}</td>
                            <td v-if="boss">{{ formatPhoneNumber(user.USER_TEL) }}</td>
                            <td>{{ formatGender(user.USER_GENDER) }}</td>
                            <td>{{ getFormatDateTime(user.USER_BIRTH) }}</td>
                            <td><button class="btn-report" @click="report(user.USER_NO)">신고</button></td>
                        </tr>
                    </tbody>

                </table>

            </div>

            <div class="right">

                <div class="btn" v-if="boss">
                    <!-- <div class="blank"></div> -->
                    <button class="btn-out" @click="exportSelectedMembers()">내보내기</button>
                </div>

                <div class="boss-info">
                    <h5>크루 리더</h5>
                    <div class="boss-info-content">
                        <img :height="50" :src="getUserImage(bossInfo)" alt="이미지">
                        <div class="boss-info-text">
                            <p>{{ bossInfo.USER_NICK }}
                                {{ formatGender(bossInfo.USER_GENDER) }}</p>
                            <p>{{ getFormatDateTime(bossInfo.USER_BIRTH) }}</p>
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
            moimDetail: {},
            users: {},
            check: false, // 전체 선택 상태
            checkList: [], // 체크된 항목 목록
            searchKeyword: '',
            selectedUser: null,
            moim_no: this.$route.params.moim_no,
            userList: [],
            boss: false,
            bossInfo: {}
        };
    },
    created() {
        this.checkList = []; // 초기화
    },
    computed: {
        user() {
            return this.$store.state.user.user;
        },
        
        filteredUsers() {
            const keyword = this.searchKeyword ? this.searchKeyword.toLowerCase() : '';

            return this.userList.filter(user => {
                const userNick = user.USER_NICK ? user.USER_NICK.toLowerCase() : '';
                const userId = user.USER_ID ? user.USER_ID.toLowerCase() : '';

                return (
                    userNick.includes(keyword) ||
                    userId.includes(keyword)
                );
            });
        }
        // filteredUsers() { // 검색 필터링 (대소문자 구분 없이)
        //     const keyword = this.searchKeyword.toLowerCase();
        //     return this.userList.filter(user => {
        //         return (
        //             user.USER_NICK.toLowerCase().includes(keyword) ||
        //             user.USER_ID.toLowerCase().includes(keyword)
        //         );
        //     });
        // }
    },
    mounted() {
        this.getMoimDetail();
        this.getMoimember();
        this.bossCheck();
    },
    methods: {
        getFormatDateTime(dateTime) { //믹스인 데이터타임 가져오기
            return this.$formatDateTime(dateTime);
        },
        selectUser(user) {
            this.selectedUser = user;
        },
        goToDetail() {  //크루 디테일 홈으로 이동
            window.location.href = `http://localhost:8001/moimdetail/${this.moim_no}`;
        },
        async getMoimDetail() { //크루 정보 불러오기
            try {
                const response = await axios.get(`http://localhost:4000/moim/moim_detail/${this.moim_no}`);
                this.moimDetail = response.data[0];
            } catch (error) {
                console.error(error);
            }
        },
        async getMoimember() { //크루 멤버 불러오기
            try {
                const response = await axios.get(`http://localhost:4000/moim/user_list/${this.moim_no}`);
                this.userList = response.data;
                this.getBoss();
            } catch (error) {
                console.error(error);
            }
        },
        getUserImage(user) { //프로필 이미지
            if (user.USER_IMG) {
                return require(`../../../node-back/uploads/uploadProfile/${user.USER_IMG}`);
            } else {
                return require('../assets/profile.png');
            }
        },
        checkAll() { //체크박스
            if (this.check) {
                this.checkList = this.userList.map(user => user.USER_NO);
            } else {
                this.checkList = [];
            }
        },
        formatPhoneNumber(phoneNumber) { // 전화번호 -
            if (phoneNumber && phoneNumber.length === 11) {
                return `${phoneNumber.substr(0, 3)}-${phoneNumber.substr(3, 4)}-${phoneNumber.substr(7)}`;
            } else if (phoneNumber && phoneNumber.length === 10) {
                return `${phoneNumber.substr(0, 3)}-${phoneNumber.substr(3, 3)}-${phoneNumber.substr(6)}`;
            }
            return phoneNumber;
        },
        exportSelectedMembers() { //내보내기
            if (this.checkList.length === 0) {
                this.alert("선택된 멤버가 없습니다.");
                return;
            }

            this.$swal.fire({
                html: `<p style="font-family: 'Pretendard-Regular'; 
                font-size:22px; margin-top:24px">
                    선택한 멤버를
                    내보내시겠습니까?
                </p>`,
                confirmButtonText: `<p style="font-family: 'Pretendard-Regular';">내보내기</p>`,
                confirmButtonColor: '#86a8e7',
                showCancelButton: true,
                cancelButtonText: `<p style="font-family: 'Pretendard-Regular';">취소</p>`,
                reverseButtons: true,
            }).then(result => {
                if (result.value) {
                    axios({
                        url: `http://localhost:4000/moim/SelectedMembersOut`,
                        method: "POST",
                        data: {
                            user_no: this.checkList
                        },
                    }).then(res => {
                        if (res.data.message === 'export_complete') {
                            this.alert("멤버가 내보내졌습니다.");
                            this.getMoimember();
                            this.checkList = []; // 선택된 항목 초기화

                        }
                    }).catch(() => {
                        this.alert("오류 발생");
                    });
                }
            });
        },
        async report(user_no) { //신고하기

            const { value: text } = await this.$swal({            
                input: 'textarea',
                html: `<p style="font-family: 'Pretendard-Regular'; 
                font-size:22px; margin-top:24px">
                신고 사유를 입력해주세요.
                </p>`,
                inputPlaceholder: '허위 신고의 경우 신고한 본인이 제재 당할 수도 있습니다.',
                confirmButtonText: `<p style="font-family: 'Pretendard-Regular';">신고</p>`,
                confirmButtonColor: '#86a8e7',
                showCancelButton: true,
                cancelButtonText: `<p style="font-family: 'Pretendard-Regular';">취소</p>`,
                reverseButtons: true,
            })

            if (text) {
                axios({
                    url: `http://localhost:4000/moim/member_report`,
                    method: 'POST',
                    data: {
                        user_no: user_no,
                        moim_no: this.moim_no,
                        black_con: text,
                    }
                })
                    .then ((res) => {
                        if (res.data.message == 'complete'){
                            this.alert("신고 완료되었습니다.")
                        }
                    })
            }
        },
        alert(text) { //믹스인
            return this.$alert(text);
        },
        $loginCheck(user) { //로그인 체크
            return !(user == '' || user == undefined);
        },
        bossCheck() { //보스 체크
            axios({
                url: "http://localhost:4000/auth/boss_check",
                method: "POST",
                data: {
                    moim_no: this.$route.params.moim_no,
                },
            })
                .then(res => {
                    if (this.user == res.data.message) {
                        this.boss = true;
                    }
                })
                .catch(() => {
                    this.alert("접속 오류");
                });
        },
        getBoss() {
            this.userList.forEach(user => {
                if (user.USER_NO == this.moimDetail.USER_NO) {
                    this.bossInfo = user;
                    this.userList.splice(user, 1)
                }
            })
        },
        formatGender(gender) {
            if (gender == 0) {
                return '여'
            }
            else if (gender == 1) {
                return '남'
            }
            else {
                return gender
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
    box-sizing: border-box;
    font-family: 'Pretendard-Regular';
    color: #2b2b2b;
    /* 드래그 방지 코드 */
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

/* ---------------------------------------------------title */

.title {
    margin: 30px 0 0 0;
    width: 100%;
}

.titledot img {
    width: 24px;
    height: 24px;
    float: left;
    margin-right: 4px;
}

.tophr {
    margin: 30px 30px 30px 0;
    border: 2px solid #E1E7F0;
}

/* --------------------------------------검색 */

.amdin-search {
    display: flex;
}

.amdin-search input {
    border: 2px solid #E1E7F0;
    height: 32px;
    margin: auto 5px;
    border-radius: 30px;
    padding: 16px;
    width: 320px;

}

.amdin-search input:focus {
    outline: none;
    border: solid 2px #86A8E7;
}

.searchtext {
    display: flex;
    width: 100%;
    /* border: 1px solid red; */
}

.searchtext mark {
    background: #ddf5f4;
    padding: 8px;
    margin-left: 10px;
    border-radius: 12px;
}

.amdin-search p {
    padding-top: 8px;
    margin-left: 20px;
    vertical-align: middle;
}

/* --------------------------------------전체 박스 */
.form {
    margin: 0px 30px 0 30px;
    display: flex;
    flex-direction: row;
    height: auto;
    /* border: 1px solid red; */
}

/* .left, .right { float: left; } */

/* --------------------------------------테이블 */

.left {
    width: 75%;
    height: 100%;
    float: left;
    
}

.left {
    margin-right: 30px;
}

.user-table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    margin-top: 20px;
    margin-bottom: 30px;

    
}

th,
td {
    padding: 4px 12px;
    text-align: center;
    border: 1.5px solid #E1E7F0;
}

th {
    font-size: 14px;
    background-color: #f3f5f8;
}

img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    overflow: hidden;
    border-radius: 50%;
    /* border: 1px solid red; */
}

/* --------------------------------------오른쪽 */

.right {
    flex-direction: row;
    float: left;
    width: 25%;
    height: 100%;
}

.btn {
    margin: 20px 0;
    flex-direction: row;
}

.btn button {
    width: 100%;
    height: 44px;
    border-radius: 10px;
    border: none;
    padding: 10px 30px;
}

.btn-out:hover {
    background-color: #E1E7F0;
}

.btn-report {
    border-radius: 10px;
    border: none;
    padding: 10px 20px;
    word-wrap: nowrap;
    word-break: keep-all;
}

.btn-report:hover {
    background-color: #fe9999;
}

/* .blank {
    width: 110px;
    height: 44px;
    background-color: #ffffff;
} */
/* --------------------------------------------------boss */

.boss-info {
    background-color: #F9F9F9;
    border-radius: 10px;
    width: 100%;
    padding: 20px;
}

.boss-info h5 {
    margin-bottom: 16px;
}

.boss-info img {
    min-width: 50px;
    margin-right: 20px;
}

.boss-info-content {
    display: flex;
}

.boss-info-text {
    font-size: 14px;
}

.boss-info-text p:nth-child(2) {
    margin-top: 8px;
}

@media screen and (max-width: 992px) {
    .amdin-search {
        display: grid;
    }

    .amdin-search input {
        position: relative;
        margin-bottom: 10px;
    }

    .searchtext {
        position: absolute;
        display: flex;
        width: 100%;
        left: 424px;
        /* top: 176px; */
    }

    .form {
        flex-direction: column-reverse;
    }

    .left,
    .right {
        width: 100%;
    }

    .left {
        overflow: hidden;
    }

    .right {
        display: flex;
        margin-top: 10px;
        flex-direction: column-reverse;
    }

    .btn {
        margin: 20px 0 0;
    }

}
</style>
  