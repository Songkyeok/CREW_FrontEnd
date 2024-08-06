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

                <!-- 게시물 AllPosts--------------------------------------- -->
                <div class="AllPosts">
                    <div>
                        <div class="writer-member">
                            <div style="display: flex; align-items: center; margin: 0 0 15px 0;">
                                <img :src="getUserImage(userInfo)" class="profile-img" style="width: 30px; ">
                                <p style="">{{ userInfo.user_nick }}</p>
                            </div>
                        </div>
                        <hr class="guide-hr1">
                        <textarea ref="textArea" @input="resize" class="resize-vertical overflow-y-hidden min-h-[48px]"
                            v-model="postC.board_con" placeholder="게시글 내용을 작성해주세요 (200자 이내)" />
                        <div class="notice-create-btn">
                            <!-- 모달 버튼 클릭 시 모달을 열도록 바인딩 -->
                            <div>
                                <img @click="showCalculation" class="commenico-0" src="../assets/icon_calculation-on.png">
                                <!-- 모달창 -->
                                <div v-if="n1" class="modal-bg">
                                    <div class="modal-content">
                                        <span class="n1-close" @click="closeModal"><img src="../assets/icon_x.png"></span>

                                        <div class="n1-container">
                                            <div class="n1-box">
                                                <div class="n1">
                                                    <img src="../assets/icon_n1-off.png" alt="로고" class="n1-image">
                                                    <p class="dutch">더치페이</p>
                                                </div>
                                                <p>지출 내용</p>
                                                <input type="text" class="input-field" name="today" placeholder="회식">
                                                <p>지출 금액</p>
                                                <input type="number" class="cash-input" v-model="num1">
                                                <p>참여 인원</p>
                                                <input type="number" class="person-count" v-model="num2">

                                                <div class="result"><span>인당</span> {{ result }} 원</div>
                                            </div>
                                            <button class="calculate-button" @click="onClickDivide">정산하기</button>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div @click="showModal = true">
                                <img class="commenico-1" src="../assets/icon_calender-time-on.png">
                            </div>

                            <label for="input-file">
                                <img class="commenico-1" src="../assets/icon_image-on.png">
                            </label>
                            <input class="input" type="file" id="input-file" @change="uploadPostFiles($event.target.files)"
                                multiple style="display: none;">
                            <span v-for="(name, i) in selectedFileNames" :key="i" class="commenico-2">
                                {{ name }},
                            </span>
                            <div class="insert-button">
                                <p :class="{ 'text-red-500': postC.board_con.length > 200 }">{{ postC.board_con.length
                                }}/200</p>
                                <button @click="createPost()" class="informbtn">작성하기</button>
                            </div>
                            <br>
                        </div>

                        <!-- 모달 내용 -->
                        <div class="modal-calendar" v-show="showModal" style="z-index: 1000; ">
                            <div class="modal-content">
                                <span class="close" @click="showModal = false">&times;</span>
                                <span class="ch-post">일정 선택</span>
                                <button @click="showModal = false" class="postCalBtn">확인</button>
                                <hr class="guide-hr">
                                <div v-if="getCalendar">
                                    <div class="calendar" v-for="(cal, i) in calendarList" :key="i">
                                        <div v-if="cal.CAL_STATUS === 0">
                                            <div class="cal-text">
                                                <label class="radio-container">
                                                    <input type="radio" :id="'radio' + i" :name="'radio-group'"
                                                        v-model="postC.cal_no" :value="cal.CAL_NO" class="radio-input"
                                                        @click="toggleRadio(cal)">
                                                    <span class="radio-checkmark"></span>
                                                    {{ cal.CAL_NM }}
                                                </label>
                                                <div class="cal-date">
                                                    <img class="calimg" src="../assets/icon_calender-time-off.png"
                                                        style="width: 22px;">
                                                    {{ getFormatDateTime(cal.CAL_SDD) }} ~ {{ getFormatDateTime(cal.CAL_EDD)
                                                    }}
                                                </div>
                                            </div>
                                            <hr class="guide-hr1">
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                    <hr class="guide-hr">
                    <div class="writer-member" v-if="postList.length == 0">
                        아직 작성된 게시글이 없습니다
                    </div>

                    <div class="writer-member" v-for="(post, postIndex) in postList" :key="postIndex">
                        <div class="writer-member-form">
                            <img :src="getUserImg(post.USER_NO)" class="profile-img" style="float: left;">
                            <p>{{ getUserNick(post.USER_NO) }}</p>
                            <p class="date">{{ getFormatDateTimePlus(post.BOARD_SDD) }}</p>

                            <div class="ico">
                                <div class="container">
                                    <!-- 이미지를 클릭하면 toggleModal 메서드를 호출하도록 수정합니다. -->
                                    <img src="../assets/icon_set-memu.png" @click="toggleModal(post.BOARD_NO)" />
                                    <!-- localShowModal 변수를 사용하여 각각의 컴포넌트가 독립적으로 모달 창을 제어합니다. -->
                                    <div v-if="localShowModal == post.BOARD_NO" class="modal">
                                        <div class="modal-sel">
                                            <div v-if="post.USER_NO == user" @click="goToPostUpdate(post.BOARD_NO)"
                                                class="modal-select">
                                                <img src="../assets/icon_set-pen.png">
                                                <p>수정</p>
                                            </div>
                                            <div v-if="post.USER_NO == user" class="modal-select"
                                                @click="confirmPostDelete(post.BOARD_NO)">
                                                <img src="../assets/icon_set-delete.png">
                                                <p>삭제</p>
                                            </div>
                                            <div v-else class="modal-select" @click="reportPost(post)">
                                                <img src="../assets/icon-park-solid_report.png">
                                                <p>신고</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div @click="togglePostPin(post.BOARD_NO)" class="togglePostPinnone">
                                    <img v-if="post.BOARD_PIN == 1" src="../assets/icon_pin-on.png">
                                    <img v-else src="../assets/icon_pin-off.png">
                                </div>
                            </div>
                        </div>
                        <br>
                        <hr class="guide-hr1" v-if="post.CAL_NO">

                        <div class="writer-form" v-if="post.CAL_NO">
                            <div class="subtitle">제목</div>
                            <span v-for="calendar in calendarList" :key="calendar.CAL_NO">
                                <div v-if="post.CAL_NO === calendar.CAL_NO">
                                    {{ calendar.CAL_NM }}
                                </div>
                            </span>
                            <div class="subtitle">일정</div>
                            <span v-for="calendar in calendarList" :key="calendar.CAL_NO">
                                <div class="enddate" v-if="post.CAL_NO === calendar.CAL_NO">{{
                                    getFormatDateTime(calendar.CAL_EDD) }} 까지</div>
                            </span>
                            <div class="subtitle">참여 멤버</div>
                            <span class="members" v-for="join in calendarJoinList" :key="join.cal_no">
                                <span v-if="post.CAL_NO === join.cal_no" class="profile-wrapper">
                                    <img :src="join.user_img ? require(`../../../node-back/uploads/uploadProfile/${join.user_img}`)
                                        : require('../assets/profile.png')" class="profile-img-multi"
                                        :style="{ top: index * 33 + 'px' }">
                                </span>
                            </span>
                        </div>
                        <hr class="guide-hr1">

                        <p class="writer-text" style="margin-bottom: 20px;" v-html="post.BOARD_CON"></p>

                        <div class="img-box-container">
                            <div class="img-bx">
                                <div class="img-box" v-for="(postImg, imgIndex) in post.postImgList" :key="imgIndex">
                                    <img v-if="postImg.BOARD_IMG"
                                        :src="require(`../../../node-back/uploads/uploadBoard/${postImg.BOARD_IMG}`)"
                                        class="img-box-image" />
                                    <img v-else src="require('../assets/profile.png')" class="img-box-image" />
                                </div>
                            </div>
                        </div>
                        <hr class="guide-hr1">

                        <div class="writer-sns">
                            <div class="writer-like" @click="togglePostLike(post.BOARD_NO, checkPostLike(post.BOARD_NO))">
                                <img v-if="checkPostLike(post.BOARD_NO)" src="../assets/icon_like-on-L.png">
                                <img v-else src="../assets/icon_like-off-L.png">
                            </div>좋아요
                            <label @click="showComment(post.BOARD_NO), getPostCmtList(post.BOARD_NO)"
                                style="cursor: pointer;">
                                <img class="commenico" src="../assets/icon_comment.png"> 댓글 {{ post.CMT_CNT }}
                            </label>
                        </div>

                        <div v-if="showCommentDiv == post.BOARD_NO">
                            <div class="cmt-form" v-for="(postCmt, i) in postCmtList" :key="i">
                                <img :src="getUserImg(postCmt.USER_NO)" class="cmt-profile">
                                <div class="cmt-content">
                                    <p class="cmt-info">
                                        <span style="font-weight: bold; "> {{ getUserNick(postCmt.USER_NO) }} </span>
                                        <span class="cmt-info-time"> {{ getElapsedTime(postCmt.BOARD_CMT_SDD) }} </span>
                                    </p>
                                    <p class="cmt-con">{{ postCmt.BOARD_CMT_CON }}</p>
                                </div>

                                <button v-if="postCmt.USER_NO === user || boss" type="button" class="remove-button"
                                    @click="confirmCmtDelete(postCmt.BOARD_CMT_NO)">
                                    <img src="../assets/icon_miu.png" class="miu-icon">
                                </button>
                            </div>

                            <!-- 댓글창 -->
                            <div class="writer-comment">
                                <img :src="getUserImage(userInfo)" class="profile-img-input">
                                <input type="text" class="comment-control" v-model="postCC.board_cmt_con"
                                    @input="checkCharLimit" placeholder="50자 이내로 입력해주세요" />
                                <img @click="confirmCreatePostCmt(post.BOARD_NO)" class="sendimg"
                                    src="../assets/icon_send.png" style="width: 35px;">
                            </div>
                        </div>

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
            //계산
            num1: 20000,
            num2: 2,
            result: "0",
            //------------------------------------
            n1: false,
            //-------------------------------------------------------
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
            active: 'moimpost',
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
            this.getPostList();
            this.getPostLikeList();
            this.getPostPin();
            this.getCalendar();
            this.getCalendarJoinInfo();
            this.getUserInfo();
            this.getMoimember();
            this.bossCheck();
            this.moimJoinCheck();
            this.getBoss();
            this.getInformPin();
        }
    },
    async created() {
    },
    methods: {

        //계산
        onClickDivide() {
            const resultFloat = parseFloat(this.num1) / parseFloat(this.num2);
            this.result = Math.round(resultFloat);
        },
        //------------계산모달
        showCalculation() {
            this.n1 = true;
        },
        closeModal() {
            this.n1 = false;
            this.result = 0;
        },
        //-----------------------------------------------
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
        //----------------------------------------------------------------크루 게시물        
        async uploadPostFiles(files) {
            if (!files || files.length === 0) {
                return; // 파일 미선택 시 반환
            }
            const formData = new FormData();
            for (const file of files) {
                formData.append('imgs', file);
                try {
                    const response = await axios.post('http://localhost:4000/moim/upload_imgs', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    if (response.data.message === 'success') {
                        this.selectedFileNames.push(file.name);
                        this.postC.board_img.push(file.name);
                    } else {
                        this.alert('DB 에러');
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        },
        async createPost() {
            this.postC.board_con = this.postC.board_con.replace(/\n/g, '<br>');
            if (this.postC.board_con.length > 200) {
                this.$alert('글자수를 초과했습니다.');
                return;
            }
            try {

                const result = await this.$swal.fire({
                    html: `<p style="font-family: 'Pretendard-Regular'; 
                    font-size:22px; margin-top:24px">
                    등록하시겠습니까?
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
                        url: 'http://localhost:4000/moim/post_write',
                        method: 'POST',
                        data: {
                            board_con: this.postC.board_con,
                            cal_no: this.postC.cal_no,
                            user_no: this.user,
                            moim_no: moim_no,
                            board_img: this.postC.board_img,
                        }
                    })
                        .then((response) => {
                            if (response.data.message === 'success') {
                                this.$swal.fire({
                                    html: `<p style="font-family: 'Pretendard-Regular'; 
                                    font-size:22px; margin-top:24px">
                                    등록이 완료되었습니다.
                                    </p>`,
                                    confirmButtonText: `<p style="font-family: 'Pretendard-Regular';">확인</p>`,
                                    confirmButtonColor: '#86a8e7',
                                }).then(() => {
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
                }
            } catch (error) {
                console.error('Promise 처리 중 에러', error);
            }
        },

        async getPostList() {
            const moim_no = this.$route.params.moim_no;
            try {
                const response = await axios.get(`http://localhost:4000/moim/post_list/${moim_no}`);
                this.postList = response.data;
                this.getCalendar();
                this.getPostLikeList();

                // postList의 각 항목별로 getPostImgList 호출하는 비동기 작업을 모아둠
                const getPostImgPromises = this.postList.map(post => this.getPostImgList(post.BOARD_NO));

                // 모든 비동기 작업이 완료될 때까지 기다림
                await Promise.all(getPostImgPromises);

            } catch (error) {
                console.error(error);
            }
        },
        async getPostImgList(board_no) {
            try {
                const response = await axios.get(`http://localhost:4000/moim/post_img_list/${board_no}`);
                // 각 post에 대한 이미지 목록을 해당 post에 저장
                const postIndex = this.postList.findIndex(post => post.BOARD_NO === board_no);
                if (postIndex !== -1) {
                    this.postList[postIndex].postImgList = response.data;
                }
            } catch (error) {
                console.error(error);
            }
        },

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
        confirmPostDelete(board_no) {
            this.toggleModal(board_no)
            this.$swal({
                html: `<p style="font-family: 'Pretendard-Regular'; 
                font-size:22px; margin-top:24px">
                정말 삭제하시겠습니까?
                </p>`,
                confirmButtonText: `<p style="font-family: 'Pretendard-Regular';">확인</p>`,
                confirmButtonColor: '#86a8e7',
                showCancelButton: true,
                cancelButtonText: `<p style="font-family: 'Pretendard-Regular';">취소</p>`,
            }).then((result) => {
                console.log("확인눌렀엉")
                if (result.isConfirmed) {
                    console.log("result.isConfirmed ==>", result.isConfirmed)
                    this.deletePost(board_no);
                    this.alert('삭제되었습니다!');
                }
            });
        },
        async deletePost(board_no) {
            console.log("this.board_no", this.board_no);
            console.log("board_no", board_no);
            try {
                await axios.get(`http://localhost:4000/moim/post_delete/${board_no}`);
            } catch (error) {
                console.error(error);
            }
        },
        goToPostUpdate(board_no) {
            const moim_no = this.$route.params.moim_no;
            window.location.href = `http://localhost:8001/MoimBoardUpdate/${moim_no}/${board_no}`;
        },
        async togglePostPin(board_no) {
            try {
                await axios({
                    url: 'http://localhost:4000/moim/post_pin',
                    method: 'POST',
                    data: {
                        board_no: board_no,
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
        async getPostPin() {
            try {
                const moim_no = this.$route.params.moim_no;
                const response = await axios.get(`http://localhost:4000/moim/post_pin_get/${moim_no}`);
                this.postPin = response.data[0];
            } catch (error) {
                console.error(error);
            }
        },
        async confirmCreatePostCmt(board_no) {
            const result = await this.$swal.fire({
                html: `<p style="font-family: 'Pretendard-Regular'; 
                font-size:22px; margin-top:24px">
                등록하시겠습니까?
                </p>`,
                confirmButtonText: `<p style="font-family: 'Pretendard-Regular';">확인</p>`,
                confirmButtonColor: '#86a8e7',
                showCancelButton: true,
                cancelButtonText: `<p style="font-family: 'Pretendard-Regular';">취소</p>`,
                reverseButtons: true,
            })
            if (result.isConfirmed) {
                this.createPostCmt(board_no);
                location.reload();
            }
        },
        async createPostCmt(board_no) {
            try {
                await axios({
                    url: 'http://localhost:4000/moim/post_cmt_write',
                    method: 'POST',
                    data: {
                        board_cmt_con: this.postCC.board_cmt_con,
                        board_no: board_no,
                        user_no: this.user,
                    }
                })
                    .then((response) => {
                        if (response.data.message === 'success') {
                            this.postCC.board_cmt_con = '';
                            const result = this.$swal.fire({
                                html: `<p style="font-family: 'Pretendard-Regular'; 
                                font-size:22px; margin-top:24px">
                                등록이 완료되었습니다.
                                </p>`,
                                confirmButtonColor: '#86a8e7',
                                confirmButtonText: `<p style="font-family: 'Pretendard-Regular';">확인</p>`
                            })
                            if (result) {
                                history.back();
                            }

                        } else {
                            this.$alert('등록 실패');
                        }
                    })
                    .catch((error) => {
                        console.error('등록 에러', error);
                        this.$alert('등록 중 오류가 발생했습니다',);
                    });
            } catch (error) {
                console.error('Promise 처리 중 에러', error);
            }
        },
        async getPostCmtList(board_no) {
            try {
                const response = await axios.get(`http://localhost:4000/moim/post_cmt_list/${board_no}`)
                this.postCmtList = response.data;
                console.log(this.postCmtList)
            } catch (error) {
                console.error(error);
            }
        },
        async confirmCmtDelete(board_cmt_no) {

            await this.$swal.fire({
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
                    this.deletePostCmt(board_cmt_no);
                    window.location.reload();
                }
            });
        },
        async deletePostCmt(board_cmt_no) {
            try {
                await axios.get(`http://localhost:4000/moim/post_cmt_delete/${board_cmt_no}`);
            } catch (error) {
                console.error(error);
            }
        },
        showComment(board_no) {
            if (this.showCommentDiv == board_no) {
                this.showCommentDiv = null;
            }
            else {
                this.showCommentDiv = board_no;
            }
        },
        checkCharLimit() {
            if (this.postCC.board_cmt_con.length > 100) {
                this.postCC.board_cmt_con = this.postCC.board_cmt_con.slice(0, 100);
            }
        },
        checkPostLike(board_no) {
            let postLiked = false;
            this.postLikeList.forEach((postLike) => {
                // 좋아요 눌렀으면 true 아니면 false 반환
                if (postLike.BOARD_NO == board_no) {
                    postLiked = true;
                }
            })
            return postLiked;
        },
        togglePostLike(board_no, postLiked) {
            let action = ''
            console.log("이거왜이래" + board_no, postLiked)

            if (postLiked) {
                action = 'post_dislike'
            }
            else action = 'post_like'

            try {
                axios({
                    url: `http://localhost:4000/moim/${action}`,
                    method: "POST",
                    data: {
                        board_no: board_no,
                        user_no: this.user
                    }
                })
                    .then((res) => {
                        if (res.data.message == 'complete') {
                            this.getPostLikeList()
                        }
                    })
            } catch (error) {
                console.error(error);
            }
        },
        async getPostLikeList() {
            try {
                const response = await axios.get(`http://localhost:4000/moim/post_like_list/${this.user}`);
                this.postLikeList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async reportPost(post) {
            this.toggleModal(post.BOARD_NO);

            const { value: text } = await this.$swal.fire({
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
                        user_no: post.USER_NO,
                        moim_no: this.moim_no,
                        board_no: post.BOARD_NO,
                        black_con: text,
                    }
                })
                    .then((res) => {
                        if (res.data.message == 'complete') {
                            this.alert("신고 완료되었습니다.")
                        }
                    })
            }
        },

        alert(text) {
            return this.$alert(text);
        },

        //---------------------------------------------------------------- 크루 일정
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
                });
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
                                location.reload();
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


        // ---------------------------------------------------------------탈퇴 수정해야함

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

/* ---------------------------------------------------AllPosts 게시물*/
.AllPosts {
    /* display: inline-block; */
    height: 100%;
    margin-bottom: 50px;
    /* border: 1px solid rgb(255, 0, 179); */
}

/* -----------계산 */
.n1 {
    display: flex;
    margin-bottom: 10px;
    align-items: center;
}

.n1-image {
    width: 20px;
    height: auto;
    margin-right: 6px;
}

/* 컨테이너 */
.n1-container {
    width: 300px;
    max-width: 100%;
    border-radius: 8px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    /* margin: auto; */
    background-color: #f2f2f2;
}

.n1-box {
    width: 100%;
    padding: 0px 20px;
    margin: 0px;
}

.n1-container p {
    color: #86a8e7;
}

.n1 .dutch {
    color: #797979;
}

/* 입력 필드들 */
.n1-container input {
    text-align: center;
    border: none;
    border-radius: 4px;
    padding: 10px;
    width: 100%;
    margin: 4px 0;
    /* border: 1px solid rgb(255, 0, 179); */
}

.n1-container input:focus {
    outline: none;
}

/* 경계 상자 */
.result span {
    font-size: 12px;
}

.result {
    width: 100%;
    text-align: center;
    font-size: 20px;
    color: #7F7FD5;
    margin-top: 16px;
}

/* 계산 버튼 */
.calculate-button {
    background-color: #86a8e7;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 12px 16px;
    font-size: 14px;
    cursor: pointer;
    width: 100%;
    margin-top: 20px;
}

/* ---------------------------------------------모달 스타일 */
.modal-bg {
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
    /* text-align: center; */
    background-color: #fff;
    padding: 30px;
    border-radius: 5px;
}

.modal-content p {
    margin: 8px 0;
}

.n1-close img {
    width: 20px;
    margin: 0px 0 20px 0;
    float: right;
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

.commenico-0 {
    width: 20px;
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
    margin-left: 10px;
    width: 25px;
    float: left;
    margin: 5px 5px 5px 0;
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

/* -------------------------------------------댓글창 */
.cmt-form {
    margin-top: 8px;
    padding: 8px 16px 4px 0px;
    display: flex;
    background-color: #F9F9F9;
}

.cmt-profile {
    width: 35px;
    height: 35px;
    min-width: 35px;
    object-fit: cover;
    overflow: hidden;
    border-radius: 50%;
    margin: auto 20px;
}

.cmt-info {
    display: flexbox;
    font-size: 14px;
    height: 20px;
}

.cmt-content {
    vertical-align: center;
    height: 48px;
    display: grid;
    width: 100%;
    position: relative;
}

.cmt-con {
    font-size: 16px;
}

.cmt-info-time {
    position: absolute;
    right: 0;
    color: gray;
}

/* ---------------------------------------------------------댓글창 */

.writer-comment {
    position: relative;
    width: 100%;
    height: 56px;
    background-color: #F9F9F9;
    border-radius: 4px;
    padding: 0px 20px 25px 0;
    margin: 16px 0px 10px 0;
    /* border: 1px solid rgb(255, 0, 179); */
}

.profile-img-input {
    position: absolute;
    height: 35px;
    width: 35px;
    object-fit: cover;
    overflow: hidden;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 50%;
    margin-right: 20px;
}

.writer-comment .comment-control {
    position: absolute;
    width: 80%;
    height: 40px;
    border-radius: 4px;
    padding: 10px;
    margin: auto 20px;
    top: 50%;
    left: 50px;
    transform: translateY(-50%);
    border: 1px solid #E1E7F0;
}

.comment-control:focus {
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

.writer-comment .sendimg:hover {
    filter: brightness(95%);
    transition-duration: 0.6s;
}

.modal-calendar {

    /* position: fixed; */
    margin: 16px auto;
    /* width: 710px; */
    background-color: #F9F9F9;
    padding: 20px;
    border-radius: 16px;
    border: 2px solid #E1E7F0;
}

.calendar-input-title {
    padding: 0 0 40px;
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

.calendar-select-inpput {
    padding: 2px;
    margin-left: 8px;
    border-radius: 4px;
    border: 1px solid #86A8E7;
}

.calendar-select-inpput:focus {
    outline: none;
}

.cal-date {
    margin-left: 30px;
    position: absolute;
    right: 0;
    font-size: 15px;
    display: flex;
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

/* ---------------------------------------------------작성자 폼 */
.writer-member-form {
    width: 100%;
    position: relative;
    display: inline-block;
    vertical-align: middle;
    align-items: center;
    /* border: 1px solid #fe1010; */
}

.ico .pin-img {
    position: absolute;
    display: flex;
    right: 0;
}

.ico img {
    float: right;
    width: 24px;
    margin-left: 20px;
}

.writer-member-form p {
    padding-top: 4px;
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

.remove-button {
    border: none;
    padding: 20px 10px 20px 20px;
    background-color: transparent;
    cursor: pointer;
}

.miu-icon {
    width: 20px;
    height: 20px;
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

.notice-create-btn {
    padding: 10px;
}

.notice-create-btn button {
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
    /* -moz-border-radius: 20px; */
    border-radius: 20px;
    color: #ffffff;
    background-color: #86A8E7;
    padding: 10px 16px;
}

.rounded-point {
    /* -moz-border-radius: 20px; */
    padding: 10px;
    color: #2b2b2b;
    border-radius: 50px;
    padding: 10px 16px;
    border: 1.5px solid #91EAE4;
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
    position: relative;
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
    background-color: #F9F9F9;
    border-radius: 20px;
    height: 200px;
    display: flex;
    margin-bottom: 15px;
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
    display: flex;
    align-items: center;
}

.dropdown-select {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
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

/* ---------------------------------------------------공지사항 */
.Guidelines {
    /* height: 100%; */
    margin-bottom: 50px;
    /* border: 1px solid rgb(255, 0, 179); */
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

.ch-post {
    font-weight: bold;
    padding: 20px 0 0 10px;
    /* border: 1.5px solid #ff0000; */
}

.close {
    cursor: pointer;
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

.guide-list {
    position: relative;
    padding: 0px 0;
    /* border: 1px solid #ff0000; */
}

.guide-list-form {
    display: inline-block;
    width: 100%;
    vertical-align: middle;
    /* border: 1px solid #0004ff; */
}

.guide-list h4 {
    padding: 20px 0 0 0;
}

.guide-text {
    width: 100%;
    margin-bottom: 30px;
}

.writer-like {
    float: left;
}

.commenico {
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

.guidehr {
    width: 100%;
    margin: 30px 0px 30px 0;
    border: 1px solid #E1E7F0;
}

.cal-hr {
    margin: 50px 0px 30px 0;
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
    padding: 10px;
    border-radius: 16px;
    border: 1px solid #E1E7F0;
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
    margin: 0 10px 0 0;
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

    .modal-calendar {
        position: fixed;
        margin: 16px auto;
        width: auto;
        background-color: #F9F9F9;
        padding: 20px;
        border-radius: 16px;
        border: 2px solid #E1E7F0;
    }

    .togglePostPinnone {
        display: none;
    }

}
</style>  




