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


                <!-- 캘린더 Schedules--------------------------------------- -->
                <div class="Schedules">
                    <div class="calendar">
                        <h3>
                            <a href="#" v-on:click="onClickPrev(currentMonth)">◀</a>
                            {{ currentYear }}년 {{ currentMonth }}월
                            <a href="#" v-on:click="onClickNext(currentMonth)">▶</a>
                        </h3>
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <td class="weekNames" v-for="(weekName, index) in weekNames" v-bind:key="index">
                                        {{ weekName }}
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, index) in currentCalendarMatrix" :key="index">
                                    <td v-for="(day, index2) in row" :key="index2" class="day">
                                        <span v-if="isToday(currentYear, currentMonth, day)" class="rounded">
                                            {{ day }}
                                        </span>
                                        <span v-else-if="pointDay(currentYear, currentMonth, day)" class="rounded-point">
                                            {{ day }}
                                        </span>
                                        <span v-else>
                                            {{ day }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p class="calendar-create" @click="showModal = true">+ 일정 등록하기</p>
                    <br>

                    <div class="Schedules-modal-calendar" v-show="showModal" style="z-index: 1000;">
                        <div class="modal-content">
                            <h3><span class="close" @click="showModal = false">&times;</span> 일정 등록</h3>
                            <hr class="guide-hr">
                            <input v-model="calendarC.cal_nm" class="calendar-input-title"
                                placeholder="일정 제목을 입력하세요 (10자이내)">
                            <h4 class="calendar-select">시작날짜 : <input class="calendar-select-inpput" type="date"
                                    v-model="calendarC.cal_sdd"></h4> <br>
                            <h4 class="calendar-select">종료날짜 : <input class="calendar-select-inpput" type="date"
                                    v-model="calendarC.cal_edd" :min="calendarC.cal_sdd"></h4>
                            <div class="calendar-create-btn">
                                <button @click="createCalendarCheck()" class="calendarbtn">작성하기</button>
                            </div>
                        </div>
                    </div>

                    <hr class="calendar-hr">
                    <div>
                        <div style="display: flex; align-items: center;">
                            <h3>일정 목록</h3>
                        </div>
                        <hr class="guide-hr1">
                        <div class="calendar" v-for="(cal, i) in calendarList" :key="i">
                            <div class="cal-text">
                                <h4 class="calendar-select" style="color: #7F7FD5;">{{ cal.CAL_NM }} </h4>
                            </div>
                            <button @click="calendarJoin(cal.CAL_NO)" class="calendarbtn cal-more">참여하기</button>
                            <div class="calimg-text">
                                <img class="calimg" src="../assets/icon_calender-time-off.png">
                                {{ getFormatDateTime(cal.CAL_SDD) }} ~ {{ getFormatDateTime(cal.CAL_EDD) }}
                            </div>

                            <div class="calimg-text">
                                <img class="calimg" src="../assets/icon_people-off.png">
                                <div v-for="(join, index) in calendarJoinList" :key="join.cal_no">
                                    <!-- `cal` 객체가 존재하는지 확인 -->
                                    <div v-if="cal && cal.CAL_NO === join.cal_no">
                                        <!-- `join.user_nick`이 문자열인지 확인하고 기본값 설정 -->
                                        {{ typeof join.user_nick === 'string' && join.user_nick.length ? join.user_nick : '이름없음' }}
                                        <!-- `index`가 `user_nick.length`보다 작은지 확인 -->
                                        <span v-if="typeof join.user_nick === 'string' && index < join.user_nick.length - 1">&nbsp;</span>
                                    </div>
                                </div>

                            </div>

                                <hr class="cal-hr">
                        </div>
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
                        <div class="member-text" v-for="(user, index) in userList.slice(1)" :key="index"
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

                <form v-if="informPin.length <= 0">
                    등록된 공지사항이 없습니다.
                </form>
                <form v-else class="form-inform">
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
                    <!-- <button type="button" @click="Withdrawalmoim(moimUser.moimUser_no)">탈퇴하기</button> -->
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
    name: 'Calendar',
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
                chall_cnt: '',
                moim_no: '',
            },
            challList: [],
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
            active: 'moimcal',
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
        }
        else {
            this.getCalendar();
            this.getCalendarJoinInfo();
            this.getUserInfo();
            this.getInformPin();
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
        alert(text) {
            return this.$alert(text)
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
                this.alert('고정되었습니다')
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
        // ---------------------------------------------------------------크루 추천
        async getMoimList() {
            const moim_no = this.$route.params.moim_no;
            try {
                const response = await axios.get(`http://localhost:4000/moim/moim_suggest/${moim_no}`)
                this.moimList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        checkLike(moim_no) {
            let liked = false;
            this.myLikeList.forEach((myLike) => {
                // 좋아요 눌렀으면 true 아니면 false 반환
                if (myLike.MOIM_NO == moim_no) {
                    liked = true;
                }
            })
            return liked;
        },
        toggleLike(moim_no, liked) {
            if (!this.getLoginCheck) {
                this.alert("찜 기능은 로그인 후 이용 가능합니다.")
                return;
            }
            let action = ''

            if (liked) {
                action = 'dislike'
            }
            else action = 'like'

            try {
                axios({
                    url: `http://localhost:4000/moim/${action}`,
                    method: "POST",
                    data: {
                        user_no: this.user,
                        moim_no: moim_no
                    }
                })
                    .then((res) => {
                        if (res.data.message == 'complete') {
                            this.getLikeList();
                        }
                    })
            } catch (error) {
                console.error(error);
            }
        },
        async getLikeList() {
            if (!this.getLoginCheck()) {
                return;
            }
            try {
                const response = await axios.get(`http://localhost:4000/auth/like_list/${this.user}`);
                this.myLikeList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        getLoginCheck() {
            return this.$loginCheck(this.user);
        },
        //----------------------------------------------------------------크루 일정
        createCalendarCheck() {
            if (!this.calendarC.cal_nm || !this.calendarC.cal_sdd || !this.calendarC.cal_edd) {
                this.$alert("입력 항목을 모두 작성해주세요");
            } else {
                this.createCalendar();
            }
        },
        async createCalendar() {
            try {
                const result = await this.$swal.fire({
                    html: `<p style="font-family: 'Pretendard-Regular'; 
                    font-size:22px; margin-top:24px">
                    등록하시겠습니까?
                    </p>`,
                    confirmButtonText: `<p style="font-family: 'Pretendard-Regular';">등록</p>`,
                    confirmButtonColor: '#86a8e7',
                    showCancelButton: true,
                    cancelButtonText: `<p style="font-family: 'Pretendard-Regular';">취소</p>`,
                    reverseButtons: true,
                })
                if (result.isConfirmed) {
                    let moim_no = this.$route.params.moim_no
                    await axios({
                        url: 'http://localhost:4000/moim/calendar_create',
                        method: 'POST',
                        data: {
                            cal_nm: this.calendarC.cal_nm,
                            cal_sdd: this.calendarC.cal_sdd,
                            cal_edd: this.calendarC.cal_edd,
                            moim_no: moim_no
                        }
                    })
                        .then((response) => {
                            if (response.data.message === 'success') {
                                this.$alert('등록이 완료되었습니다');
                                location.href = `http://localhost:8001/moimdetail/${moim_no}`
                            } else {
                                this.$alert('등록 실패');
                            }
                        })
                        .catch((error) => {
                            console.error('등록 에러', error);
                            this.$alert('등록 중 오류가 발생했습니다',);
                        });
                } else {
                    this.$alert('취소되었습니다');
                }
            } catch (error) {
                console.error('Promise 처리 중 에러', error);
            }
        },
        async getCalendar() {
            try {
                const moim_no = this.$route.params.moim_no;
                const response = await axios.get(`http://localhost:4000/moim/calendar_list/${moim_no}`);
                this.calendarList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        pointDay(year, month, day) {
            const targetDate = new Date(year, month - 1, day); // year와 month는 1씩 빼줘서 인덱스에 맞춤
            for (const cal of this.calendarList) {
                const calDate = new Date(cal.CAL_EDD);
                if (this.isSameDay(targetDate, calDate)) {
                    return cal.CAL_NM;
                }
            }
            return false;
        },
        isSameDay(date1, date2) {
            return (
                date1.getFullYear() === date2.getFullYear() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getDate() === date2.getDate()
            );
        },
        async calendarJoin(cal_no) {
            const moim_no = this.$route.params.moim_no;

            try {
                const response = await axios({
                    url: 'http://localhost:4000/moim/calendar_join',
                    method: 'POST',
                    data: {
                        cal_no: cal_no,
                        user_no: this.user,
                        moim_no: moim_no
                    }
                });
                if (response.data.error === 'joined') {
                    this.$alert('이미 참여되었습니다');
                } else {
                    this.$alert('참여 완료');
                    window.location.reload();
                }
            } catch (error) {
                if (error.response.data.error === 'joined') {
                    this.$alert('이미 참여되었습니다');
                } else {
                    this.$alert('에러가 발생했습니다');
                }
            }
        },
        async getCalendarJoinInfo() {
            const moim_no = this.$route.params.moim_no;
            try {
                const response = await axios.get(`http://localhost:4000/moim/calendar_j_info/${moim_no}`);
                this.calendarJoinList = response.data;
            } catch (error) {
                console.error(error);
            }
        },

        //----------------------------------------------------------------크루 공지사항

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
                    } else {
                        this.$alert('크루 참가자만 접근 가능합니다');
                        this.$router.push({ path: `/moimdetail/${this.moim_no}` });
                    }
                })
                .catch(() => {
                    this.alert("접속 오류");
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
    color: #2b2b2b;
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

/* ---------------------------------------------------공통 box */
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

h4 {
    padding: 50px 0 0;
}

.Schedules-modal-calendar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.modal-content {
    position: fixed;
    top: 36%;
    width: 50%;
    min-width: 360px;
    margin: 0 8%;
    display: inline-block;
    background-color: #F9F9F9;
    padding: 20px;
    border-radius: 16px;
    border: 2px solid #E1E7F0;
}

.calendar-input-title {
    padding: 10px;
    margin-bottom: 30px;
    border: none;
    outline: none;
    background: transparent;
    background-color: transparent;
    width: 300px;
    font-size: 17px;
    /* border: 2px solid #0066ff; */
}

.calendar-select {
    padding: 0;
    margin: 0;
}

.calendar-select-inpput {
    padding: 2px;
    margin-left: 8px;
    border-radius: 4px;
    border: 1px solid #86A8E7;
}

.calendar-select-inpput:focus {
    outline: none;
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

.profile-img {
    width: 30px;
    height: 30px;
    object-fit: cover;
    overflow: hidden;
    border-radius: 50%;
    position: relative;
    z-index: 1;
    margin-right: 10px;
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
    color: #ffffff;
    background-color: #86A8E7;
    border: 2px solid #86A8E7;
    padding: 10px 16px;
}

.rounded-point {
    /* -moz-border-radius: 20px; */
    padding: 10px;
    color: #2b2b2b;
    border-radius: 50px;
    padding: 10px 16px;
    border: 2px solid #91EAE4;
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
    margin-top: 10px;
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

textarea {
    position: relative;
    width: 100%;
    border: none;
    resize: none;
    background-color: #F9F9F9;
    padding: 10px;
    white-space: pre-line;
    border-radius: 4px;
    border: 1px solid #E1E7F0;
}

textarea:focus {
    outline: solid 1px #86A8E7;
}

/* ---------------------------------------------------챌린지 */
.close {
    cursor: pointer;
}

.guide-hr1 {
    margin: 20px 0px;
    border: 1px solid #F9F9F9;
}

.guide-hr {
    margin: 30px 0px 30px 0;
    border: 1px solid #E1E7F0;
}

.cal-hr {
    margin: 30px 0px;
    border: 1px solid #E1E7F0;
}

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

    .right {
        display: none;
    }

}

/* --------------------------------------------------- */
@media screen and (max-width: 992px) {
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