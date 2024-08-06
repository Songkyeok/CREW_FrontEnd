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
                <!-- 챌린지 Challenges--------------------------------------- -->
                <div class="moimchall" v-show="active === 'moimchall'">
                    <div v-if="moimDetail.USER_NO == user">
                        <div class="writer-member">
                            <div style="display: flex; align-items: center; margin: 0 0 15px 0;">
                                <img :src="getUserImage(userInfo)" class="profile-img" style="width: 30px; ">
                                <p style="">{{ userInfo.user_nick }}</p>
                            </div>
                        </div>
                        <hr class="guide-hr1">
                        <input class="moim-input" placeholder="챌린지 제목을 입력해주세요" v-model="challC.chall_title">
                        <hr class="guide-hr1">
                        <textarea ref="textArea" @input="resize" class="resize-vertical overflow-y-hidden min-h-[48px]"
                            v-model="challC.chall_con" placeholder="챌린지 내용을 작성해주세요 (500자 이내)" />

                        <div class="notice-create-btn">
                            <!-- 모달 버튼 클릭 시 모달을 열도록 바인딩 -->
                            <div @click="showModal = true">
                                <img class="commenico-1" src="../assets/icon_calender-time-on.png">
                            </div>
                            <label for="input-file2">
                                <img class="commenico-1" src="../assets/icon_image-on.png">
                            </label>
                            <input type="file" id="input-file2" class="input" accept="image/png,image/jpeg"
                                @change="uploadChallFile($event.target.files)" style="display: none;">
                            <span class="commenico-2">
                                {{ this.challC.chall_img }}
                            </span>
                            <div class="insert-button">
                                <p :class="{ 'text-red-500': challC.chall_con.length > 500 }">{{ challC.chall_con.length
                                }}/500</p>
                                <button @click="createChall()" class="informbtn">작성하기</button>
                            </div>
                            <hr class="guide-hr">
                            <br>
                        </div>

                        <div class="Schedules-modal-calendar" v-show="showModal">
                            <div class="modal-calendar">
                                <h3><span class="close" @click="showModal = false">&times;</span> 일정 등록</h3>
                                <hr class="guide-hr">
                                <h4 class="calendar-select">시작날짜 : <input class="calendar-select-inpput" type="date"
                                        v-model="challC.chall_sdd" :min="minStartDate"></h4>
                                <br>
                                <h4 class="calendar-select">종료날짜 : <input class="calendar-select-inpput" type="date"
                                        v-model="challC.chall_edd" :min="challC.chall_sdd"></h4>
                                <h4 class="calendar-select">인증횟수 :
                                    <div class="dropdown">
                                        <select class="dropdown-select" v-model="challC.chall_cnt">
                                            <option value="1">주 1회</option>
                                            <option value="2">주 2회</option>
                                            <option value="3">주 3회</option>
                                            <option value="4">주 4회</option>
                                            <option value="5">주 5회</option>
                                            <option value="6">주 6회</option>
                                            <option value="7">매일</option>
                                        </select>
                                    </div>
                                </h4>
                                <div class="calendar-create-btn">
                                    <button @click="onConfirmClick" class="calendarbtn">확인</button>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="chall-a" v-for="(chall, i) in challList" :key="i">
                        <div class="chall-content" @click="goToChallDetail(chall.CHALL_NO)">
                            <div class="img-box-chall">
                                <img v-if="chall.CHALL_IMG"
                                    :src="require(`../../../node-back/uploads/uploadChall/${chall.CHALL_IMG}`)"
                                    class="img-box-image" />
                            </div>
                            <div class="event-end-message" v-if="chall.CHALL_STATUS === 1">
                                <p>챌린지 종료</p>
                            </div>
                            <div class="chall-details">
                                <h2 class="chall-h2">{{ chall.CHALL_TITLE }}</h2>
                                <p class="chall-h5">
                                    챌린지 📅 {{ formatDateYo(chall.CHALL_SDD) }} · {{ formatDuration(chall.CHALL_SDD,
                                        chall.CHALL_EDD) }}
                                    ✔ 주 {{ chall.CHALL_CNT }}회
                                </p>
                                <div class="members-wrapper">
                                    <span class="members2" v-for="join in userList.slice(0, 10)" :key="join.USER_NO">
                                        <span class="profile-wrapper" style="margin-top: 10px;">
                                            <img :src="join.USER_IMG ? require(`../../../node-back/uploads/uploadProfile/${join.USER_IMG}`)
                                                : require('../assets/profile.png')" class="profile-img-multi"
                                                :style="{ top: index * 33 + 'px' }">
                                        </span>
                                    </span>
                                    <div class="member-count">
                                        <img class="commenico-3" src="../assets/icon_people-off.png">
                                        {{ userList.length }} / {{ moimDetail.MOIM_MAX }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p v-if="challList.length == 0" class="no-chall" style="text-align: center;">아직 챌린지가 없어요!</p>
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
            active: 'moimchall',
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



        this.getCalendar();
        this.getCalendarJoinInfo();
        this.getUserInfo();
        this.getInformPin();
        this.getMoimember();
        this.bossCheck();
        this.moimJoinCheck();
        this.getBoss();
        this.getChallList();

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

        getLoginCheck() {
            return this.$loginCheck(this.user);
        },
        //----------------------------------------------------------------크루 게시물       

        toggleRadio(cal) {
            this.calendarList.forEach(item => {
                if (item === cal) {
                    if (!item.selected) { // 선택되지 않은 경우에만 선택하도록 변경
                        item.selected = true;
                        this.postC.cal_no = cal.CAL_NO; // 선택된 cal_no를 postC.cal_no에 할당
                    } else {
                        item.selected = false; // 이미 선택된 경우 선택 초기화
                        this.postC.cal_no = null; // 선택된 cal_no를 초기화
                    }
                } else {
                    item.selected = false;
                }
            });
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
                                this.$swal.fire({
                                    html: `<p style="font-family: 'Pretendard-Regular'; 
                                font-size:22px; margin-top:24px">
                                등록이 완료되었습니다.
                                </p>`,
                                    confirmButtonColor: '#86a8e7',
                                    confirmButtonText: `<p style="font-family: 'Pretendard-Regular';">확인</p>`
                                })
                                    .then(() => {
                                        location.reload();
                                    })
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
        //----------------------------------------------------------------챌린지
        async uploadChallFile(file) {
            let name = "";

            if (file) {
                name = file[0].name;
            }
            else {
                return;     // 파일 미선택 시 반환
            }

            const formData = new FormData();
            formData.append('img', file[0]);

            try {
                axios({
                    url: `http://localhost:4000/moim/upload_img`,
                    method: 'POST',
                    headers: { 'Content-Type': 'multipart/form-data' },
                    data: formData
                })
                    .then((res) => {
                        if (res.data.message == 'success') {
                            this.challC.chall_img = name;
                            this.chall_d_img = name;
                        }
                        else {
                            this.alert("DB 에러");
                        }
                    })
                    .catch(e => {
                        console.log(e);
                    })
                return true;

            } catch (err) {
                console.log(err);
                return false;
            }

        },
        onConfirmClick(event) {
            event.preventDefault();
            this.showModal = false;
        },

        alert(text) {
            return this.$alert(text)
        },
        async createChall() {
            this.challC.chall_con = this.challC.chall_con.replace(/\n/g, '<br>');
            if (this.challC.chall_con.length > 500) {
                this.$alert('글자수를 초과했습니다.');
                return;
            }

            if (!this.challC.chall_title || !this.challC.chall_con || !this.challC.chall_sdd || !this.challC.chall_edd || !this.challC.chall_img || !this.challC.chall_cnt) {
                this.$alert('모든 항목을 입력해주세요.');
                return;
            }

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
                        url: 'http://localhost:4000/moim/chall_create',
                        method: 'POST',
                        data: {
                            chall_title: this.challC.chall_title,
                            chall_con: this.challC.chall_con,
                            chall_sdd: this.challC.chall_sdd,
                            chall_edd: this.challC.chall_edd,
                            chall_img: this.challC.chall_img,
                            chall_cnt: this.challC.chall_cnt,
                            moim_no: moim_no,
                        }
                    })
                        .then((response) => {
                            if (response.data.message === 'success') {
                                this.$alert('등록이 완료되었습니다');
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
        async getChallList() {
            try {
                const moim_no = this.$route.params.moim_no;
                const response = await axios.get(`http://localhost:4000/moim/chall_list/${moim_no}`);
                this.challList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        minStartDate() {
            const today = new Date();
            today.setDate(today.getDate() + 1);
            const minDate = today.toISOString().split('T')[0];
            return minDate;
        },
        formatDateYo(dateString) {
            const options = { month: 'numeric', day: 'numeric', weekday: 'short' };
            const date = new Date(dateString);
            return date.toLocaleDateString('ko-KR', options);
        },
        formatDuration(startDate, endDate) {
            const ONE_DAY = 24 * 60 * 60 * 1000;
            const start = new Date(startDate);
            const end = new Date(endDate);
            const duration = Math.round((end - start) / ONE_DAY);

            const weekLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

            if (duration <= 7) {
                return '1주간';
            } else if (duration <= 30) {
                const weeks = Math.ceil(duration / 7);
                return `${weekLabels[weeks - 1]}주간`;
            } else {
                return `${Math.ceil(duration / 7)}주간`;
            }
        },
        goToChallDetail(chall_no) {
            const moim_no = this.$route.params.moim_no;
            window.location.href = `http://localhost:8001/MoimChallDetail/${moim_no}/${chall_no}`;
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
.AllPosts {
    /* display: inline-block; */
    height: 100%;
    margin-bottom: 50px;
    /* border: 1px solid rgb(255, 0, 179); */
}

.writer-member {
    float: left;
    width: 100%;
}

.writer-member p {
    float: left;
}

.date {
    color: #C8C8C8;
    margin-left: 30px;
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

.writer-like img,
.commenico {
    transition: transform 0.3s ease;
}

.writer-like img:hover,
.commenico:hover {
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

/* .commenico-1, .commenico-2{ transition: transform 0.3s ease; }
.commenico-1:hover, .commenico-2:hover{ transform: scale(1.2); } */

.insert-button {
    float: right;
    display: flex;
}

.guide-insert-button {
    float: right;
    display: flex;
    /* margin-bottom: 10px; */
    /* border: 1px solid rgb(255, 0, 179); */
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

.modal-calendar {
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

.calendar-select-inpput {
    padding: 2px;
    margin-left: 8px;
    border-radius: 4px;
    border: 1px solid #86A8E7;
}

.calendar-select {
    padding: 0;
    margin: 0;
}

.calendar-select-inpput:focus {
    outline: none;
}

.calendar-select:nth-child(6) {
    display: flex;
    margin-top: 20px;
    /* border: 1px solid #fe1010; */
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

/* ---------------------------------------------------작성자 폼 */

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

.notice-create-btn {
    padding: 10px;
}

.notice-create-btn button {
    cursor: pointer;
}

.img-box-image {
    width: 100%;
    height: 100%;
    object-fit: cover;

    border-radius: 20px;
    position: relative;
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

.moim-input {
    padding: 3px 0 0;
    border: none;
    outline: none;
    background: transparent;
    background-color: transparent;
    width: 700px;
    font-size: 20px;
}


/* ---------------------------------------------------챌린지 */
.chall-content {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.chall-details {
    margin-left: 10px;
}

.chall-a {
    position: relative;
    background-color: #F9F9F9;
    border-radius: 20px;
    height: 200px;
    display: flex;
    margin-bottom: 15px;
}

.event-end-message {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 16px;

    z-index: 9999;
}

.event-end-message p {
    color: white;
    font-size: 18px;
    font-weight: bold;
}

.chall-h5 {
    margin-top: 10px;
    color: #797979;
}

.img-box-chall {
    width: 200px;
    height: 200px;
    overflow: hidden;
    padding: 15px;
    /* 이미지 여백 */
    box-sizing: border-box;
    /* 여백 포함 */
}

.img-box-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.dropdown {
    margin-left: 10px;
    align-items: center;
}

.dropdown-select {
    padding: 4px;
    width: 120px;
    border-radius: 4px;
    cursor: pointer;
    appearance: none;
    /* -webkit-appearance: none; */
    /* -moz-appearance: none; */
    background-color: #fff;
    border: 1px solid #86A8E7;
}

.dropdown-select:focus {
    outline: none;
    border-color: #86a8e7;
}

.dropdown-select::-ms-expand {
    display: none;
}

.dropdown-select::after {
    content: '\25BC';
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
}

.dropdown-select option {
    background-color: #fff;
    color: #333;
}

.dropdown-select option:hover {
    background-color: #f0f0f0;
}

.commenico-3 {
    width: 20px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
    cursor: pointer;
    margin-left: 10px;
    margin: 5px;
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

    .togglePostPinnone {
        display: none;
    }

}
</style>  