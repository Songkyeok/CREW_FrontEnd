<template>
    <body>
        <div class="title">
            <div class="titledot">
                <img src="../assets/icon_dot.png">
            </div>
            <h3>{{ moimDetail.MOIM_TITLE }}</h3>
        </div>

        <div class="cate-nav">
            <ul class="cate">
                <li @click="setActive('moimdetail')" :class="{ 'active': active === 'moimdetail' }">홈</li>
                <li v-if="$loginCheck(user) && userJoin" @click="setActive('moimpost')"
                    :class="{ 'active': active === 'moimpost' }">게시물</li>
                <li v-if="$loginCheck(user) && userJoin" @click="setActive('moimcal')"
                    :class="{ 'active': active === 'moimcal' }">일정</li>
                <li @click="setActive('moimchall')"
                    :class="{ 'active': active === 'moimchall' }">챌린지</li>
                <li v-if="$loginCheck(user) && userJoin" @click="setActive('moiminform')"
                    :class="{ 'active': active === 'moiminform' }">공지사항</li>
            </ul>

            <div class="cate-mission" v-if="moimDetail.MOIM_GRADE" @click="goToMission()">
                <img :src="require(`../assets/Badges/${setGrade(moimDetail.MOIM_GRADE)}`)" alt="." />
                <span>{{ setGradeEN(moimDetail.MOIM_GRADE) }}</span>
            </div>
            <div class="cate-mission" v-else @click="goToMission()">
                <span>𝖴𝗇𝖱𝖺𝗇𝗄</span>
            </div>
        </div>

        <hr class="tophr">

        <div class="box">
            <!-- 왼쪽 탭--------------------------------------- -->
            <div class="left">
                <!-- 홈 home--------------------------------------- -->
                <div class="home">
                    <div v-if="moimDetail.MOIM_IMG" class="moim-img">
                        <img :src="require(`../../../node-back/uploads/uploadMoim/` + `${moimDetail.MOIM_IMG}`)"
                            alt="크루 이미지">
                    </div>


                    <hr class="main-hr">

                    <div class="moim-introduce">
                        <h3 class="title-introduce">✨ 크루를 소개합니다</h3><br>
                        <p class="content-introduce" v-html="moimDetail.MOIM_CON"></p>
                    </div>

                    <hr class="main-hr">

                    <!-- 크루 추천 -->
                    <div class="moim-recommend">
                        <div class="flex-container">
                            <div><img src="../assets/emoji_eyes.png"
                                    style="width: 10%; vertical-align: top; margin-right: 6px;">크루 둘러보기</div>
                        </div>
                        <dv class="recommend-card">
                            <div class="left-card" v-for="(moim, index) in moimList.slice(0, 3)" :key="index">
                                <div class="imgbox">
                                    <div class="fakeimg"></div>
                                    <img :src="require(`../../../node-back/uploads/uploadMoim/${moim.MOIM_IMG}`)"
                                        alt="크루 이미지" @click="goToDetail(moim.MOIM_NO)" class="moim-img-main">
                                </div>
                                <div v-if="moim.MOIM_MAX > moim.MOIM_CNT" class="moim-parti">인원: {{ moim.MOIM_CNT }} / {{
                                    moim.MOIM_MAX }}
                                </div>
                                <div v-else class="moim-parti" style="color: #ff4747;">인원: {{ moim.MOIM_CNT }} / {{
                                    moim.MOIM_MAX }}</div>
                                <div class="like" @click="toggleLike(moim.MOIM_NO, checkLike(moim.MOIM_NO))">
                                    <img v-if="checkLike(moim.MOIM_NO)" src="../assets/icon_like-on.png">
                                    <img v-else src="../assets/icon_like-off.png">
                                </div>
                                <div class="text">
                                    <h5>#{{ moim.CATEGORY_NM }}</h5>
                                    <p>{{ moim.MOIM_INTRO }}</p>
                                    <h2 @click="goToDetail(moim.MOIM_NO)" style="cursor: pointer;">{{ moim.MOIM_TITLE }}
                                    </h2>
                                    <img src="../assets/emoji_sparkles.png">
                                </div>
                            </div>
                        </dv>
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
                    <button type="button" class="col-xs-1 createbtn" @click="goTo('moimjoin')">크루 가입하기</button>
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
            active: 'moimdetail',
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
    },
    async created() {
        this.getMoimDetail();
        this.getMoimList();
        this.getUserInfo();
        this.getInformPin();
        this.getMoimember();
        this.bossCheck();
        this.getBoss();
        if (this.getLoginCheck) {
            this.moimJoinCheck();
            this.getLikeList();
        }
    },
    methods: {
        goTo(page) {
            window.location.href = `http://localhost:8001/${page}/${this.moim_no}`;
        },
        goToMission() {
            const moim_no = this.$route.params.moim_no;
            window.location.href = `http://localhost:8001/MoimMission/${moim_no}`;
        },
        // ---------------------------------------------------------------
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
        $loginCheck(user) { //로그인 체크
            return !(user == '' || user == undefined);
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
        setGradeEN(grade) {
            if (grade == 1) {
                return '𝖡𝗋𝗈𝗇𝗓𝖾 𝖨𝖨𝖨'
            } if (grade == 2) {
                return '𝖡𝗋𝗈𝗇𝗓𝖾 𝖨𝖨'
            } if (grade == 3) {
                return '𝖡𝗋𝗈𝗇𝗓𝖾 𝖨'
            } if (grade == 4) {
                return '𝖲𝗂𝗅𝗏𝖾𝗋 𝖨𝖨𝖨'
            } if (grade == 5) {
                return '𝖲𝗂𝗅𝗏𝖾𝗋 𝖨𝖨'
            } if (grade == 6) {
                return '𝖲𝗂𝗅𝗏𝖾𝗋 𝖨'
            } if (grade == 7) {
                return '𝖦𝖮𝖫𝖣 𝖨𝖨𝖨'
            } if (grade == 8) {
                return '𝖦𝖮𝖫𝖣 𝖨𝖨'
            } if (grade == 9) {
                return '𝖦𝖮𝖫𝖣 𝖨'
            }
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
    position: relative;
    cursor: pointer;
    align-items: center;
    padding: 20px 0 0;

}

.cate-mission {
    position: absolute;
    top: 20px;
    right: 30px;
    padding: 8px 16px;
    border-radius: 8px;
    display: inline-flexbox;
    text-align: center;
    /* border: 2px solid #E1E7F0; */
    /* background-color: #E1E7F0; */
    /* background: linear-gradient( to right, #91EAE4, #86A8E7 ) */
}

.cate-mission img {
    width: 28px;
    vertical-align: middle;
    margin-right: 4px;
}

.cate-mission span {
    vertical-align: middle;
    /* color: white; */
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
    justify-content: flex-start;
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
    width: 32%;
    border: 1.5px solid #E1E7F0;
    background-color: white;
    border-radius: 16px;
    background-color: #ffffff;
    margin-right: 2%;
}
.left-card:last-child {
    margin: 0;
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

/* -------------------------------------------댓글창 */
.cmt-form {
    display: block;
    margin-top: 16px;
    padding: 16px 16px 16px 0px;
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
    font-size: 14px;
    margin-bottom: 8px;
}

.cmt-content {
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

.AllPosts-modal-calendar {
    position: fixed;
    transform: translate(0%, 8%);
    width: 700px;
    background-color: #F9F9F9;
    padding: 20px;
    border-radius: 16px;
    border: 2px solid #E1E7F0;
}

.Schedules-modal-calendar {
    position: fixed;
    left: 50%;
    top: 60%;
    width: 700px;
    background-color: #F9F9F9;
    padding: 20px;
    border-radius: 16px;
    border: 2px solid #E1E7F0;
}

.modal-calendar {
    position: fixed;
    left: 49%;
    top: 56.7%;
    width: 710px;
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

    .cate-mission {
        display: none;
    }

}
</style> 