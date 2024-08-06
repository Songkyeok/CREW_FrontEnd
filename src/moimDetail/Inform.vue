<template>
    <body>

        <div class="title">
            <div class="titledot">
                <img src="../assets/icon_dot.png">
            </div>
            <h3>{{ moimDetail.MOIM_TITLE }} </h3>
        </div>
        <div class="cate-nav">
            <ul class="cate">
                <li @click="setActive('moimdetail')" :class="{ 'active': active === 'moimdetail' }">홈</li>
                <li v-if="getLoginCheck(user) && userJoin" @click="setActive('moimpost')"
                    :class="{ 'active': active === 'moimpost' }">게시물</li>
                <li v-if="getLoginCheck(user) && userJoin" @click="setActive('moimcal')"
                    :class="{ 'active': active === 'moimcal' }">일정</li>
                    <li @click="setActive('moimchall')"
                    :class="{ 'active': active === 'moimchall' }">챌린지</li>
                <li v-if="getLoginCheck(user) && userJoin" @click="setActive('moiminform')"
                    :class="{ 'active': active === 'moiminform' }">공지사항</li>
            </ul>
        </div>

        <hr class="tophr">

        <div class="box">
            <!-- 왼쪽 탭--------------------------------------- -->
            <div class="left">
                <!-- 공지사항 Guidelines--------------------------------------- -->
                <div class="Guidelines">

                    <!-- 공지사항 글쓰기 -->
                    <div v-if="moimDetail.USER_NO == user">
                        <div class="writer-member">
                            <div style="display: flex; align-items: center; margin: 0 0 15px 0;">
                                <img :src="getUserImage(userInfo)" class="profile-img" style="width: 30px; ">
                                <p style="">{{ userInfo.user_nick }}</p>
                            </div>
                        </div>
                        <hr class="guide-hr1">
                        <input class="moim-input" placeholder="제목을 입력해주세요" v-model="informC.inform_title">
                        <hr class="guide-hr1">
                        <textarea ref="textArea" @input="resize" class="resize-vertical overflow-y-hidden min-h-[48px]"
                            v-model="informC.inform_con" placeholder="공지사항 내용을 작성해주세요 (200자 이내)"></textarea>
                        <div class="notice-create-btn">
                            <div class="insert-button">
                                <p :class="{ 'text-red-500': informC.inform_con.length > 200 }">{{
                                    informC.inform_con.length
                                }}/200</p>
                                <button @click="createInform()" class="informbtn">작성하기</button>
                            </div>
                        </div>
                    </div>
                    <hr class="guide-hr">
                    <!-- 공지사항 리스트 -->
                    <div class="guide-form" v-if="informList.length == 0">
                        아직 작성된 공지사항이 없습니다.
                    </div>
                    <div class="guide-form" v-for="(inform, i) in informList" :key="i">

                        <img :src="getUserImage(bossInfo)" alt="이미지" class="profile-img" style="width: 30px; float: left;">
                        <p>{{ bossInfo.USER_NICK || '이름없음' }}</p>
                        <p class="date"> {{ getFormatDateTimePlus(inform.INFORM_SDD) }}</p>
                        <div class="ico" v-if="boss">
                            <div class="container">
                                <!-- 이미지를 클릭하면 toggleModal 메서드를 호출하도록 수정합니다. -->
                                <img src="../assets/icon_set-memu.png" @click="toggleModal(inform.INFORM_NO)" />
                                <!-- localShowModal 변수를 사용하여 각각의 컴포넌트가 독립적으로 모달 창을 제어합니다. -->
                                <div v-if="localShowModal == inform.INFORM_NO" class="modal">
                                    <div class="modal-sel">
                                        <div @click="goToInformUpdate(inform.INFORM_NO)" class="modal-select">
                                            <img src="../assets/icon_set-pen.png">
                                            <p>수정</p>
                                        </div>
                                        <div class="modal-select" @click="confirmDelete(inform.INFORM_NO)">
                                            <img src="../assets/icon_set-delete.png">
                                            <p>삭제</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div @click="togglepin(inform.INFORM_NO)">
                                <img v-if="inform.INFORM_PIN == 1" src="../assets/icon_pin-on.png">
                                <img v-else src="../assets/icon_pin-off.png">
                            </div>
                        </div>

                        <h4>{{ inform.INFORM_TITLE }}</h4>
                        <hr class="guide-hr1">
                        <p class="guide-text" v-html="inform.INFORM_CON"></p>
                        <hr class="guide-hr">

                    </div>
                </div>
            </div>

            <!-- 오른쪽 탭--------------------------------------- -->
            <div class="right">
                <form class="form">
                    <div class="master">
                        <div class="master-top">
                            <h5>방장</h5>
                            <p class="moim-member-more" @click="goToMember()">더보기＞</p>
                        </div>
                        <div class="master-text" style="display: flex; align-items: center; margin: 0 0 15px 0;">
                            <img :src="getUserImage(bossInfo)" alt="이미지" class="profile-img" style="width: 30px;">
                            <p>{{ bossInfo.USER_NICK || '이름없음' }}</p>
                        </div>
                    </div>

                    <div class="member">
                        <div class="member-title">
                            <h5>참여 멤버</h5>
                        </div>
                        <div class="member-text" v-for="(user, index) in userList" :key="index"
                            style="display: flex; align-items: center; margin: 0 0 15px 0;">
                            <img :src="getUserImage(user)" class="profile-img" style="width: 30px; cursor: pointer;"
                                @click="openMemberModal(user)">
                            <p @click="openMemberModal(user)" style="cursor: pointer;">{{ user.USER_NICK }}</p>
                        </div>
                    </div>
                </form>


                <!-- 프로필 모달 -->
                <div v-if="showMemberModal" class="custom-modal">
                    <div class="custom-modal-content">
                        <img :src="(selectedMember.user_img || selectedMember.USER_IMG) ?
                            (selectedMember.user_img ? require(`../../../node-back/uploads/uploadProfile/${selectedMember.user_img}`)
                                : require(`../../../node-back/uploads/uploadProfile/${selectedMember.USER_IMG}`))
                            : require('../assets/profile.png')" class="custom-profile-img-modal">
                        <div class="custom-member-nickname">
                            {{ (selectedMember.USER_NICK || selectedMember.user_nick) ? (selectedMember.USER_NICK ?
                                selectedMember.USER_NICK : selectedMember.user_nick) : '이름없음' }}
                        </div>

                        <hr class="guide-hr1">

                        <button @click="closeMemberModal" class="custom-close-button">닫기</button>
                    </div>
                </div>

                <form v-if="informPin" class="form-inform">
                    <div class="master">
                        <div class="master-top">
                            <h5>공지사항</h5>
                            <p v-if="$loginCheck(user) && userJoin" class="moim-member-more"
                                @click="setActive('Guidelines')">자세히보기＞</p>
                        </div>
                    </div>
                    <div class="member">
                        <div class="infrom-title">
                            {{ informPin.INFORM_TITLE }}
                        </div>
                        <br>
                        <div class="infrom-con" v-html="informPin.INFORM_CON">
                        </div>
                    </div>
                </form>

                <div class="creatediv" v-if="!userJoin">
                    <button type="button" class="col-xs-1 createbtn">크루 가입하기</button>
                </div>
                <div class="withdraw" v-if="boss">
                    <button type="button" class="col-xs-1 createbtn" @click="goToMoimUpdate()"
                        style="width: 140px; color: #86a8e7">크루 수정하기</button>
                </div>
                <div class="withdraw" v-if="userJoin && !boss">
                    <button type="button">탈퇴하기</button>
                </div>
            </div>
        </div>
    </body>
</template>
    
<script>
import axios from 'axios';


export default {
    components: {
    },
    data() {
        return {
            moim_no: this.$route.params.moim_no,

            moimUser: { //탈퇴
                user_nick: "예시",
            },
            // ---------------------------------------------------------------
            moimList: [],
            moimDetail: {},
            postC: {
                board_con: '',
                board_img: [],
                cal_no: '',
            },
            postList: [],
            postImgList: [],
            postCC: {
                board_cmt_con: '',
                board_no: '',
            },
            postCmtList: [],
            postLikeList: [],
            calendarC: {
                cal_nm: '',
                cal_sdd: '',
                cal_edd: '',
            },
            calendarList: [],
            calendarJoinList: [],
            calendarDetail: {},
            challC: {
                chall_title: '',
                chall_con: '',
                chall_sdd: '',
                chall_edd: '',
                chall_img: '',
                moim_no: '',
            },
            informC: {
                inform_title: '',
                inform_con: '',
                moim_no: '',
            },
            informList: [],
            informPin: {},
            userList: [],
            userJoin: false,
            boss: false,
            bossInfo: {},
            userInfo: {},
            moimJoinResult: 0,
            myLikeList: [],
            // ---------------------------------------------------------------
            showCommentDiv: false,
            selectedFileNames: [],
            showMemberModal: false,
            selectedMember: {},
            // ---------------------------------------------------------------
            active: 'moiminform',
            showModal: false,
            localShowModal: false,
            liked: false,
            commen: false,
            pnis: false,
            // ---------------------------------------------------------------캘린더부분
            // weekNames: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
            weekNames: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            // weekNames: ["월", "화", "수", "목", "금", "토", "일"],
            rootYear: 1904,
            rootDayOfWeekIndex: 4, // 2000년 1월 1일은 토요일
            currentYear: new Date().getFullYear(),
            currentMonth: new Date().getMonth() + 1,
            currentDay: new Date().getDate(),
            currentMonthStartWeekIndex: null,
            currentCalendarMatrix: [],
            endOfDay: null,
            memoDatas: [],
        }
    },
    computed: {
        user() {
            return this.$store.state.user.user;
        },
    },
    mounted() {
        this.init(); //캘린더
        this.getMoimDetail();

        if (!this.getLoginCheck()) {
            this.$alert('크루 참가자만 접근 가능합니다');
            this.$router.push({ path: `/moimdetail/${this.moim_no}` });
        } else {
            this.getInformList();
            this.getUserInfo();
            this.getInformPin();
            this.getInformList();
            this.getMoimember();
            this.bossCheck();
            this.moimJoinCheck();
            this.getBoss();
        }
    },
    methods: {
        getFormatDateTime(date) {
            return this.$formatDateTime(date)
        },
        getFormatDateTimePlus(date) {
            return this.$formatDateTimePlus(date)
        },
        getElapsedTime(dateTime) {
            return this.$elapsedTime(dateTime);
        },
        // ---------------------------------------------------------------캘린더부분
        init: function () {
            this.currentMonthStartWeekIndex = this.getStartWeek(this.currentYear, this.currentMonth);
            this.endOfDay = this.getEndOfDay(this.currentYear, this.currentMonth);
            this.initCalendar();
        },
        initCalendar: function () {
            this.currentCalendarMatrix = [];
            let day = 1;
            for (let i = 0; i < 6; i++) {
                let calendarRow = [];
                for (let j = 0; j < 7; j++) {
                    if (i == 0 && j < this.currentMonthStartWeekIndex) {
                        calendarRow.push("");
                    }
                    else if (day <= this.endOfDay) {
                        calendarRow.push(day);
                        day++;
                    }
                    else {
                        calendarRow.push("");
                    }
                }
                this.currentCalendarMatrix.push(calendarRow);
            }
        },
        getEndOfDay: function (year, month) {
            switch (month) {
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                    return 31;
                // break;
                case 4:
                case 6:
                case 9:
                case 11:
                    return 30;
                // break;
                case 2:
                    if ((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) {
                        return 29;
                    }
                    else {
                        return 28;
                    }
                // break;
                default:
                    console.log("unknown month " + month);
                    return 0;
                // break;
            }
        },
        getStartWeek: function (targetYear, targetMonth) {
            let year = this.rootYear;
            let month = 1;
            let sumOfDay = this.rootDayOfWeekIndex;
            // eslint-disable-next-line
            while (true) {
                if (targetYear > year) {
                    for (let i = 0; i < 12; i++) {
                        sumOfDay += this.getEndOfDay(year, month + i);
                    }
                    year++;
                }
                else if (targetYear == year) {
                    if (targetMonth > month) {
                        sumOfDay += this.getEndOfDay(year, month);
                        month++;
                    }
                    else if (targetMonth == month) {
                        return (sumOfDay) % 7;
                    }
                }
            }
        },
        onClickPrev: function (month) {
            month--;
            if (month <= 0) {
                this.currentMonth = 12;
                this.currentYear -= 1;
            }
            else {
                this.currentMonth -= 1;
            }
            this.init();
        },
        onClickNext: function (month) {
            month++;
            if (month > 12) {
                this.currentMonth = 1;
                this.currentYear += 1;
            }
            else {
                this.currentMonth += 1;
            }
            this.init();
        },
        isToday: function (year, month, day) {
            let date = new Date();
            return year == date.getFullYear() && month == date.getMonth() + 1 && day == date.getDate();
        },
        // ---------------------------------------------------------------모달        
        toggleModal(inform_no) {
            if (this.localShowModal == inform_no) {
                this.localShowModal = null;
            }
            else {
                this.localShowModal = inform_no;
            }
        },
        async togglepin(inform_no) {
            try {
                await axios({
                    url: 'http://localhost:4000/moim/inform_pin',
                    method: 'POST',
                    data: {
                        inform_no: inform_no,
                        moim_no: this.$route.params.moim_no
                    }
                })
                this.$alert('고정되었습니다');
                setTimeout(() => {
                    window.location.reload();
                }, 1000)
            } catch (error) {
                console.error(error);
            }
        },
        openMemberModal(member) {
            this.selectedMember = member;
            this.showMemberModal = true;
        },
        closeMemberModal() {
            this.showMemberModal = false;
            this.selectedMember = {};
        },
        // ---------------------------------------------------------------크루 디테일 정보 불러오기
        async getMoimDetail() {
            try {
                const moim_no = this.$route.params.moim_no;
                const response = await axios.get(`http://localhost:4000/moim/moim_detail/${moim_no}`);
                this.moimDetail = response.data[0];
            } catch (error) {
                console.error(error);
            }
        },
        // --------------------------------------------------------------- 크루 추천

        getLoginCheck() {
            return this.$loginCheck(this.user);
        },

        //----------------------------------------------------------------크루 공지사항
        async createInform() {
            this.informC.inform_con = this.informC.inform_con.replace(/\n/g, '<br>');
            try {
                const result = await this.$swal.fire({
                    html: `<p style="font-family: 'Pretendard-Regular'; 
                    font-size:22px; margin-top:24px">
                    등록하시겠습니까
                    </p>`,
                    confirmButtonText: `<p style="font-family: 'Pretendard-Regular';">확인</p>`,
                    confirmButtonColor: '#86a8e7',
                    showCancelButton: true,
                    cancelButtonText: `<p style="font-family: 'Pretendard-Regular';">취소</p>`,
                    reverseButtons: true,
                })
                if (result.isConfirmed) {
                    let moim_no = this.$route.params.moim_no
                    await axios({
                        url: 'http://localhost:4000/moim/inform_create',
                        method: 'POST',
                        data: {
                            inform_title: this.informC.inform_title,
                            inform_con: this.informC.inform_con,
                            moim_no: moim_no
                        }
                    })
                        .then((response) => {
                            if (response.data.message === 'success') {
                                this.$alert('등록이 완료되었습니다')
                                location.href = `http://localhost:8001/moimdetail/${moim_no}`
                            } else {
                                this.$alert('등록 중 오류가 발생했습니다')
                            }
                        })
                        .catch((error) => {
                            console.error('등록 에러', error);
                            this.$alert('등록 중 오류가 발생했습니다')

                        });
                }
            } catch (error) {
                console.error('Promise 처리 중 에러', error);
            }
        },

        async getInformList() {
            try {
                const moim_no = this.$route.params.moim_no;
                const response = await axios.get(`http://localhost:4000/moim/inform_list/${moim_no}`);
                this.informList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        goToInformUpdate(inform_no) {
            const moim_no = this.$route.params.moim_no;
            window.location.href = `http://localhost:8001/MoimInformUpdate/${moim_no}/${inform_no}`;
        },
        confirmDelete(inform_no) {
            this.$swal.fire({
                html: `<p style="font-family: 'Pretendard-Regular'; 
                font-size:22px; margin-top:24px">
                정말 삭제하시겠습니까?
                </p>`,
                confirmButtonText: `<p style="font-family: 'Pretendard-Regular';">확인</p>`,
                confirmButtonColor: '#86a8e7',
                showCancelButton: true,
                cancelButtonText: `<p style="font-family: 'Pretendard-Regular';">취소</p>`,
                reverseButtons: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    this.deleteInform(inform_no);
                    this.$swal.fire({
                        html: `<p style="font-family: 'Pretendard-Regular'; 
                        font-size:22px; margin-top:24px">
                        삭제되었습니다!
                        </p>`,
                        confirmButtonColor: '#86a8e7',
                        confirmButtonText: `<p style="font-family: 'Pretendard-Regular';">확인</p>`
                    })
                        .then(() => {
                            location.reload();
                        });
                }
            });
        },
        async deleteInform(inform_no) {
            try {
                await axios.get(`http://localhost:4000/moim/inform_delete/${inform_no}`);
            } catch (error) {
                console.error(error);
            }
        },
        async getInformPin() {
            try {
                const moim_no = this.$route.params.moim_no;
                const response = await axios.get(`http://localhost:4000/moim/inform_pin_get/${moim_no}`);
                this.informPin = response.data[0];
            } catch (error) {
                console.error(error);
            }
        },
        // ---------------------------------------------------------------탈퇴 수정해야함

        // ---------------------------------------------------------------기타
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
        setActive(category) {
            this.active = category;
            this.$router.push({ path: `/${this.active}/${this.moim_no}` })
        },
        setActiveTab(tabName) {
            this.activeTab = tabName;
        },
        togglecomment() {
            this.commen = !this.commen;
        },
        goToLogin() {
            this.$router.push({ path: '/login' });
        },
        goToMember() {
            const moim_no = this.$route.params.moim_no;
            window.location.href = `http://localhost:8001/MoimMember/${moim_no}`
        },
        resize() {
            this.$refs.textArea.style.height = "1px";
            this.$refs.textArea.style.height = this.$refs.textArea.scrollHeight + "px";
        },
        moimJoinCheck() { // 크루 가입 체크
            axios({
                url: "http://localhost:4000/moim/moim_j_check",
                method: "POST",
                data: {
                    moim_no: this.$route.params.moim_no,
                    user_no: this.user
                },
            })
                .then(res => {
                    if (this.user == res.data.message) {
                        this.userJoin = true;
                    }
                    else {
                        this.$alert('크루 참가자만 접근 가능합니다');
                        this.$router.push({ path: `/moimdetail/${this.moim_no}` });
                    }
                })
                .catch(() => {
                    this.$alert("접속 오류");
                });
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
        getUserImage(user) { //프로필 이미지
            if (user) {
                if (user.USER_IMG) {
                    return require(`../../../node-back/uploads/uploadProfile/${user.USER_IMG}`);
                } else if (user.user_img) {
                    return require(`../../../node-back/uploads/uploadProfile/${user.user_img}`);
                }
            }
            return require('../assets/profile.png');
        },
        async getUserInfo() {
            if (!this.user) {
                console.log("로그인안함");
                return;
            }
            const response = await axios.get(`http://localhost:4000/auth/user_info/${this.user}`);
            this.userInfo = response.data[0];
        },
        async getMoimember() {
            try {
                const moim_no = this.$route.params.moim_no;
                const response = await axios.get(`http://localhost:4000/moim/user_list/${moim_no}`);
                this.userList = response.data;
                this.getBoss();
            } catch (error) {
                console.error(error);
            }
        },
        getUserNick(userNo) {
            const user = this.userList.find(user => user.USER_NO === userNo);
            return user ? user.USER_NICK : '이름없음';
        },
        getUserImg(userNo) {
            const user = this.userList.find(user => user.USER_NO === userNo);
            if (user) {
                if (user.USER_IMG) {
                    return require(`../../../node-back/uploads/uploadProfile/${user.USER_IMG}`);
                } else if (user.user_img) {
                    return require(`../../../node-back/uploads/uploadProfile/${user.user_img}`);
                }
            }
            return require('../assets/profile.png');
        },
        goToMoimUpdate() {
            const moim_no = this.$route.params.moim_no;
            window.location.href = `http://localhost:8001/MoimUpdate/${moim_no}`
        }
    },

}
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
    float: left;
    margin-right: 4px;
}

/* ---------------------------------------------------카테네비 */
.cate-nav {
    cursor: pointer;
    align-items: center;
    padding: 20px 0 0;
}

.cate {
    list-style: none;
    display: flex;
    padding-left: 10px;
}

.cate li {
    padding: 10px 0px;
    text-align: center;
    cursor: pointer;
    /* border: 1px solid rgb(235, 237, 248); */
}

.cate li:not(:last-child)::after {
    content: '';
    display: inline-block;
    width: 24px;
    height: 24px;
    margin: 0px 20px;
    vertical-align: middle;
    background-image: url('../assets/line.png');
    background-size: contain;
}

.cate li:nth-last-child(5) {
    margin-left: 20px;
}

.cate li.active {
    color: #86a8e7;
    font-weight: 600;
}

.tophr {
    margin: 10px 30px 20px 0;
    border: 2px solid #E1E7F0;
}

/* ---------------------------------------------------공통 box  */
.box {
    margin: 0 30px 0 270px;
    display: flex;
    height: auto;
    /* border: 1px solid red;  */
}

.left,
.right {
    float: left;
}

/* ---------------------------------------------------왼쪽 페이지 */
.left {
    width: 75%;
    height: 100%;
    margin: 0 30px 0 0;
    float: left;
    /* border: 1px solid #282fff; */
}

/* ---------------------------------------------------홈 Home */
.mini-right {
    display: none;
}

.moim-img {
    width: 100%;
    height: 210px;
    border-radius: 20px;
    background-color: rgb(167, 52, 169);
    overflow: hidden;
}

.moim-img-main {
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.moim-img-main:hover {
    transform: scale(1.1);
    transition-duration: 0.3s;
}

.moim-img-main:not(:hover) {
    transform: scale(1);
    transition-duration: 0.3s;
}

.moim-img>img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.moim-more {
    color: #C8C8C8;
    font-size: 14px;
    padding-bottom: 1px;
    cursor: pointer;
}

.moim-recommend {
    width: 100%;
    height: auto;
    /* background-color: rgb(238, 252, 80); */
}

.flex-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
    margin-bottom: 20px;
    /* border: 1.5px solid #e100e5; */
}

.recommend-card {
    display: flex;
    justify-content: space-between;
}

.imgbox {
    position: relative;
    width: 100%;
    height: 160px;
    border-radius: 16px 16px 0 0;
    overflow: hidden;
}

.moim-parti {
    position: absolute;
    top: 175px;
    right: 8px;
    font-size: small;
    color: #7F7FD5;
}

.left-card {
    position: relative;
    float: left;
    width: 30%;
    border: 1.5px solid #E1E7F0;
    background-color: white;
    border-radius: 16px;
    background-color: #ffffff;
}

.fakeimg {
    display: contents;
    background: url(../assets/image-loading.png);
    overflow: hidden;
    object-fit: cover;
    width: 100%;
    height: 140px;
    padding: 20px;
    border-radius: 16px 16px 0 0;
}

.fakeimg img {
    position: relative;
    display: inline-block;
    object-fit: cover;
    overflow: hidden;
    width: 100%;
    height: 140px;
    border-radius: 16px 16px 0 0;
}

.like {
    position: absolute;
    top: 4px;
    right: 4px;
    cursor: pointer;
}

.like img {
    width: 40px;
}

.left-card .text {
    padding: 0px 16px 10px 16px;
}

.text h5 {
    margin: 10px 0;
}

.text p {
    color: #797979;
    font-weight: bold;
    font-size: 16px;
}

.text h2 {
    font-weight: 900;
    margin: 8px 0 8px;
    font-size: 18px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.text img {
    width: 30px;
    height: auto;
}

/* ---------------------------------------------------AllPosts 게시물*/
.writer-member {
    float: left;
    width: 100%;
}

.writer-member p {
    float: left;
    margin: 4px 0 0 10px;
}

.date {
    color: #C8C8C8;
    margin-left: 30px;
}

.ico img {
    width: 24px;
    float: right;
    margin-left: 20px;
}

h4 {
    padding: 50px 0 0;
}

.main-hr {
    margin: 30px 0px 20px 0;
    border: 1px solid #E1E7F0;
}

.writer-form {
    display: inline-block;
    margin: 0px 0px 0 0;
    width: 100%;
    height: 100px;
    /* border: 1px solid red; */
}

.writer-member .writer-form .subtitle {
    float: left;
    width: 80px;
}

.writer-member .writer-form .subtitle:nth-child(3) {
    margin: 10px 0 10px;
}

.writer-member .writer-form .subtitle:nth-child(5) {
    padding-top: 8px;
    /* border: 1px solid red; */
}

.members {
    width: 800px;
}

.writer-member .writer-form :nth-child(2) {
    margin-top: 20px;
}

.writer-member .writer-form .enddate {
    color: #FF4747;
    margin: 10px 0 10px;
}

.writer-text {
    width: 100%;
    margin-bottom: 60px;
}

.writer-sns img {
    width: 20px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
    cursor: pointer;
}

.writer-sns .writer-like {
    float: left;
    margin-left: 10px;
}

.writer-like img {
    transition: transform 0.3s ease;
}

.writer-like img:hover {
    transform: scale(1.2);
}

.writer-sns .commenico {
    margin-left: 10px;
}

.commenico-1 {
    width: 20px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
    cursor: pointer;
    margin-left: 10px;
    width: 25px;
    float: left;
    margin: 5px;
}

.commenico-2 {
    display: inline-block;
    vertical-align: middle;
    margin: 8px 2px 0 0;
}

.insert-button {
    float: right;
    display: flex;
}

.text-red-500 {
    color: #ef4444;
}

.insert-button p {
    margin: auto 8px;
}

.insert-button button {
    margin: auto;

}

.writer-comment {
    position: relative;
    width: 100%;
    height: 56px;
    background-color: #F9F9F9;
    border-radius: 4px;
    padding: 4px 20px;
    margin: 16px 0px 0px 0;
    padding-right: 25px;
}

.writer-comment .comment-control {
    width: 90%;
    /* 가로 영역 전체 사용 */
    height: 48px;
    border-radius: 4px;
    padding: 0px 10px;
    margin-left: 50px;
}

.comment-control :focus {
    outline: solid 1px #86A8E7;
}

.writer-comment .profileimg {
    position: absolute;
    bottom: 16px;
    left: 20px;
}

.writer-comment p {
    position: absolute;
    bottom: 18px;
    left: 60px;
    /* border: 1px solid red; */
}

.writer-comment .sendimg {
    position: absolute;
    bottom: 12px;
    right: 20px;
    cursor: pointer;
}

.modal-calendar {
    position: fixed;
    left: 50%;
    transform: translate(-50%, -30%);
    width: 700px;
    background-color: #F9F9F9;
    padding: 20px;
    border-radius: 16px;
    border: 1px solid #E1E7F0;
    /* box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); */
}

.calendar-input-title {
    padding: 0 0 20px;
    border: none;
    outline: none;
    background: transparent;
    background-color: transparent;
    width: 300px;
    font-size: 17px;
}

.calendar-select {
    padding: 0;
    margin: 0;
}

.cal-date {
    position: absolute;
    left: 410px;
    /* 조정이 필요한 위치 값 */
    font-size: 15px;
    display: flex;
    align-items: center;
}

.calimg {
    width: 18px;
    margin-right: 10px;
}

.calimg-text {
    display: flex;
    align-items: center;
    font-size: 13px;
    margin-bottom: 10px;
}

.profile-wrapper {
    width: auto;
    height: 32px;
    position: relative;
    display: inline-block;
    margin-right: 16px;
    /* border: 1px solid #fe1010; */
}

.profile-img-multi {
    width: 32px;
    height: 32px;
    object-fit: cover;
    overflow: hidden;
    border-radius: 50%;
    position: absolute;
    z-index: 1;
    top: 0;
    border: 1px solid #E1E7F0;
}

.profile-img {
    width: 30px;
    height: 30px;
    object-fit: cover;
    overflow: hidden;
    border-radius: 50%;
    position: relative;
    z-index: 1;

}

.profile-img-input {
    width: 30px;
    height: 30px;
    object-fit: cover;
    overflow: hidden;
    border-radius: 50%;
    position: absolute;
    z-index: 1;
    left: 20px;
    /* 왼쪽 여백 추가 */
    top: 50%;
    /* 중앙 정렬 */
    transform: translateY(-50%);
    /* 중앙 정렬 */
}

.remove-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 10px;
    border: none;
    background-color: transparent;
    cursor: pointer;
}

.miu-icon {
    width: 20px;
    height: 20px;
}

.cmt-content {
    margin-left: 130px;
    padding-top: 5px;
}

.cmt-info {
    font-size: 13px;
    margin-bottom: 15px;
}

.cmt-con {
    position: absolute;
    top: 50%;
    left: 60px;
}

.custom-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.custom-modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.custom-profile-img-modal {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
}

.custom-member-nickname {
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 20px;
}

.custom-close-button {
    background-color: #f0f0f0;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
}

/* ---------------------------------------------------게시물이미지 */

.img-box-container {
    width: 100%;
    display: inline-block;
    /* border: solid 1px rgb(255, 0, 0); */
    overflow: hidden;
    margin-bottom: 20px;
}

.img-bx {
    display: flex;
    gap: 10px;
    /* justify-content: space-between; */
    flex-wrap: wrap;
}

.img-box {
    display: flow-root;

    width: 160px;
    max-width: 160px;
    height: 160px;
    max-height: 160px;
    overflow: hidden;
    /* border: solid 1px rgb(21, 0, 255); */
}

.img-box-image {
    width: 100%;
    height: 100%;
    object-fit: cover;

    border-radius: 20px;
    position: relative;
}

/* ---------------------------------------------------일정 */

.calendar h3 {
    text-align: center;
    margin: 0 auto 30px;
}

.calendar h3 a {
    text-decoration: none;
    font-size: 14px;
    color: #86a8e7;
    margin: 0 8px;
}

.table {
    width: 100%;
}

.rounded {
    -moz-border-radius: 20px;
    border-radius: 20px;
    border: 1px solid #86A8E7;
    padding: 10px 16px;
}

.rounded-point {
    -moz-border-radius: 20px;
    border-radius: 20px;
    background-color: #86A8E7;
    padding: 10px 16px;
    color: #ffffff;
}

.day {
    text-align: center;
    width: 100px;
    height: 60px;
    /* border: 1px solid red; */
}

.weekNames {
    text-align: center;
    font-weight: bold;
    color: #b1c7ef;
    padding: 20px;
    /* border: 1px solid rgb(255, 166, 0); */
}

.calendar-create {
    float: right;
    color: #86a8e7;
    font-style: bold;
}

.calendar-hr {
    margin: 30px 0px 30px 0;
    border: 1px solid #E1E7F0;
}

.calendarbtn {
    background: #ffffff;
    width: auto;
    height: 32px;
    padding: 5px 20px 6px;
    float: right;
    font-size: .8em;
    text-align: center;
    vertical-align: text-top;
    color: #2b2b2b;
    border-radius: 30px;
    border: 1.5px solid #E1E7F0;
}

.cal-more {
    font-size: 12px;
    cursor: pointer;
    text-align: right;
}


.cal-text {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.radio-container {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.radio-input {
    display: none;
}

.radio-checkmark {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid #86a8e7;
    ;
    border-radius: 50%;
    margin-right: 10px;
    transition: border-color 0.3s;
}

.radio-input:checked+.radio-checkmark {
    background-color: #86a8e7;
    ;
    border-color: #ccdcf5;
    ;
}

/* ---------------------------------------------------챌린지 */


/* ---------------------------------------------------공지사항 */
.notice-create-btn {
    padding: 10px;
}

.notice-create-btn button {
    cursor: pointer;
}

.informbtn {
    background: #ffffff;
    width: auto;
    height: 32px;
    padding: 5px 20px 6px;
    margin: 0 0 10px 0;
    font-size: .8em;
    text-align: center;
    vertical-align: text-top;
    color: #2b2b2b;
    border-radius: 30px;
    border: 1.5px solid #E1E7F0;
}

.modal-content .ch-post {
    font-weight: bold;
    padding: 20px 0 0 0;
    /* border: 1.5px solid #ff0000; */
}

.postCalBtn {
    background: #ffffff;
    width: auto;
    height: 32px;
    padding: 5px 20px 6px;
    font-size: .8em;
    text-align: center;
    color: #2b2b2b;
    border-radius: 30px;
    float: right;
    border: 1.5px solid #E1E7F0;
    margin-left: auto;
}

textarea {
    position: relative;
    width: 100%;
    border: none;
    resize: none;
    background-color: #F9F9F9;
    padding: 10px;
    white-space: pre-line;
    border-radius: 4px;
}

textarea:focus {
    outline: solid 1px #86A8E7;
}

.notice-create {
    border: 1px solid red;
}

.moim-input {
    padding: 3px 0 0;
    border: none;
    outline: none;
    background: transparent;
    background-color: transparent;
    width: 700px;
    font-size: 20px;
}

.guide-form {
    width: 100%;
}

.guide-form p {
    float: left;
    margin-left: 10px;
}

.guide-text {
    width: 100%;
    margin-bottom: 40px;
}

.guide-sns {
    /* float: right; */
    height: 24px;
    display: inline-block;
    vertical-align: middle;
    /* border: 1px solid red; */
}

.guide-sns div {
    float: left;
}

.guide-sns img {
    float: left;
    width: 20px;
    margin-right: 10px;
    cursor: pointer;
}

.guide-sns .writer-like {
    float: left;
}

.guide-sns .commenico {
    margin-left: 10px;
}

.guide-hr1 {
    margin: 20px 0px;
    border: 1px solid #F9F9F9;
}

.guide-hr {
    margin: 30px 0px 30px 0;
    border: 1px solid #E1E7F0;
}

/* ---------------------------------------------------모달 */
.container {
    position: relative;
}

.container img {
    cursor: pointer;
}

.modal {
    position: absolute;
    top: 40px;
    right: 0px;
    background-color: #F9F9F9;
    padding: 20px;
    border-radius: 16px;
    border: 1px solid #E1E7F0;
    /* box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); */
    z-index: 9999;
}

.modal-select {
    height: 30px;
    margin: 10px 10px;
    cursor: pointer;
    /* border: 1px solid #ff0000; */
}

.modal-select img {
    float: left;
    display: inline-block;
    vertical-align: middle;
    margin: 0;
}


/* ---------------------------------------------------채팅 */


/* ---------------------------------------------------오른쪽 고정페이지 */
.right {
    float: left;
    width: 25%;
    height: 100%;
}

.right .form {
    position: relative;
    background-color: #F9F9F9;
    border-radius: 16px;
    padding: 10px 20px 30px 30px;
}

.right .form-inform {
    position: relative;
    background-color: #F9F9F9;
    border-radius: 16px;
    padding: 10px 20px 30px 30px;
    margin: 20px 0;
}

h5 {
    margin: 20px 0;
}

.infrom-title {
    color: #FF4747;
    font-size: 14px;

}

.infrom-con {
    font-size: 14px;
}

.master .master-text img,
.member .member-text img {
    float: left;
    margin-right: 10px;
}

.master-top {
    display: flex;
}

.master-top h5 {
    float: left;
    width: 80%;
    /* border: 1px solid red; */
}

.moim-member-more {
    position: absolute;
    right: 0;
    font-size: 12px;
    margin: 20px 20px 0 0;
    text-align: right;
    float: right;
    cursor: pointer;
    /* border: 1px solid red */
}

.member {
    clear: both;

}

/* ---------------------------------------------------탈퇴하기버튼 */

.withdraw button {
    color: #FF4747;
    height: 48px;
    width: 100px;
    float: right;
    display: inline;
    font-size: 16px;
    border: none;
    background: none;
}


.withdraw button:hover {
    cursor: pointer;
}

/* ---------------------------------------------------가입하기버튼 */
[class|="col"] {
    background: #ffffff;
    width: auto;
    height: 32px;
    float: left;
    padding: 5px 20px 6px;
    margin: 0 8px 10px 0;
    font-size: .8em;
    text-align: center;
    vertical-align: text-top;
    color: #2b2b2b;
    border-radius: 30px;
    border: 1.5px solid #E1E7F0;
}

.creatediv {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 10px;
    margin: 5px 0;
}

.creatediv button:hover {
    cursor: pointer;
}

.createbtn {
    width: 100%;
    font-size: medium;
    background-color: #86a8e7;
    color: white;
    height: 40px;
}

/* --------------------------------------------------- */
@media screen and (max-width: 992px) {
    .box {
        margin: 0 30px 0 100px;
        display: flex;
        height: auto;
    }

    .left {
        width: 100%;
        margin: 0;
    }

    .writer-comment .comment-control {
        width: 80%;
        height: 48px;
        right: 60px;
        margin-left: 30px;
        border-radius: 4px;
        padding: 0px 10px;
    }

    .writer-comment .profileimg {
        bottom: 16px;
    }

    .writer-comment p {
        display: none;
    }

    .right {
        display: none;
    }

}

/* --------------------------------------------------- */
@media screen and (max-width: 992px) {
    .box {
        margin: 0 30px 0 100px;
        display: flex;
        height: auto;
    }

    .left {
        width: 100%;
        margin: 0 0 30px 0;
    }

    .writer-comment .comment-control {
        width: 80%;
        height: 48px;
        right: 60px;
        margin-left: 30px;
        border-radius: 4px;
        padding: 0px 10px;
    }

    .writer-comment .profileimg {
        bottom: 16px;
    }

    .writer-comment p {
        display: none;
    }

    .right {
        display: none;
    }

    .mini-right {
        display: block;

    }

    .creatediv {
        display: flex;
        justify-content: space-between;
        margin: 0;
        margin-bottom: -20px;
    }

    .creatediv button {
        width: 200px;
    }

    .withdraw {
        /* display: none; */
    }

}

@media screen and (max-width: 768px) {
    .left {
        margin: 0 0px 0 0;
        padding: 20px 0;
    }

    .writer-comment .comment-control {
        width: 75%;
        height: 48px;
        right: 60px;
        margin-left: 30px;
        border-radius: 4px;
        padding: 0px 10px;
    }

    .cate li {
        margin-right: 6%;
    }

    .cate li:not(:last-child)::after {
        display: none;
    }

    .cate li:nth-last-child(6) {
        margin-left: 0px;
    }

    /* ---------------------------------------------------일정 */

    .table {
        padding: 0;
    }

    .rounded {
        padding: 8px 12px;
    }

    .day {
        width: 100px;
        height: 50px;
        font-size: small;
    }

    .weekNames {
        font-size: small;
        padding: 10px;
        height: 50px;
        width: 100px;
    }

}
</style>  