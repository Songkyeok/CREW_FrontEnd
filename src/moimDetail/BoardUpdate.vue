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
        <div class="box">
            <!-- 왼쪽 탭--------------------------------------- -->

            <div class="left">
                <div class="writer-member">
                    <form ref="postU" @submit.prevent="onSubmitForm">
                        <textarea ref="textArea" @input="resize" class="resize-vertical overflow-y-hidden min-h-[48px]"
                            v-model="postU.board_con" placeholder="게시글 내용을 작성해주세요 (200자 이내)" />
                        <div class="notice-create-btn">
                            <div @click="showModal = true">
                                <img class="commenico-1" src="../assets/icon_calender-time-on.png">
                            </div>

                            <div class="insert-button">
                                <p :class="{ 'text-red-500': postU.board_con.length > 200 }">{{ postU.board_con.length
                                }}/200</p>
                                <button type="submit" class="informbtn">수정하기</button>
                                <button type="button" class="informbtn" @click="goToPost()">취소</button>
                            </div>
                        </div>
                        <!-- 모달 내용 -->
                        <div class="modal-calendar" v-show="showModal" style="z-index: 1000; ">
                            <div class="modal-content">
                                <span class="close" @click="showModal = false">&times;</span>
                                <span class="ch-post">일정 선택</span>
                                <button @click="onConfirmClick" class="postCalBtn">확인</button>
                                <hr class="guide-hr">
                                <div v-if="getCalendar">
                                    <div class="calendar" v-for="(cal, i) in calendarList" :key="i">
                                        <div v-if="cal.CAL_STATUS === 0">
                                            <div class="cal-text">
                                                <label class="radio-container">
                                                    <input type="radio" :id="'radio' + i" :name="'radio-group'"
                                                        v-model="postU.cal_no" :value="cal.CAL_NO" class="radio-input"
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
                    </form>
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
                </form>

                <div v-if="informPin" class="form-inform">
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
            postU: {
                board_con: '',
                cal_no: '',
                board_no: this.$route.params.board_no,
            },
            moimDetail: {},
            users: {},
            postDetail: {},
            moim_no: this.$route.params.moim_no,
            board_no: this.$route.params.board_no,
            userList: [],
            userJoin: false,
            boss: false,
            bossInfo: {},
            userInfo: {},
            showModal: false,
            calendarList: [],
            showMemberModal: false,
        };
    },
    created() {

    },
    computed: {
        user() {
            return this.$store.state.user.user;
        },
    },
    mounted() {
        if (!this.getLoginCheck()) {
            this.alert('로그인해주세요');
            this.$router.push({ path: '/login' });
        }
        else {
            this.getMoimDetail();
            this.getMoimember();
            this.getPostDetail();
            this.getCalendar();
        }
    },
    methods: {
        getLoginCheck() {
            return this.$loginCheck(this.user);
        },
        goToPost() {
            this.$router.push({ path: `/moimpost/${this.moim_no}` })
        },
        openMemberModal(member) {
            this.selectedMember = member;
            this.showMemberModal = true;
        },
        closeMemberModal() {
            this.showMemberModal = false;
            this.selectedMember = {};
        },
        onConfirmClick(event) {
            event.preventDefault();
            this.showModal = false;
        },
        toggleRadio(cal) {
            this.calendarList.forEach(item => {
                if (item === cal) {
                    if (!item.selected) { // 선택되지 않은 경우에만 선택하도록 변경
                        item.selected = true;
                        this.postU.cal_no = cal.CAL_NO; // 선택된 cal_no를 postU.cal_no에 할당
                    } else {
                        item.selected = false; // 이미 선택된 경우 선택 초기화
                        this.postU.cal_no = null; // 선택된 cal_no를 초기화
                    }
                } else {
                    item.selected = false;
                }
            });
        },
        async getCalendar() {
            try {
                const response = await axios.get(`http://localhost:4000/moim/calendar_list/${this.moim_no}`);
                this.calendarList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        getFormatDateTime(dateTime) { //믹스인 데이터타임 가져오기
            return this.$formatDateTime(dateTime);
        },
        selectUser(user) {
            this.selectedUser = user;
        },
        resize() {
            this.$refs.textArea.style.height = "1px";
            this.$refs.textArea.style.height = this.$refs.textArea.scrollHeight + "px";
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
        async getPostDetail() { //게시물 정보 불러오기
            try {
                const response = await axios.get(`http://localhost:4000/moim/post_detail/${this.board_no}`);
                this.postDetail = response.data[0];
                if (this.postDetail.USER_NO != this.user) {
                    this.alert('접근권한이 없습니다');
                    this.$router.push({ path: '/' });
                } else {
                    this.postU.board_con = this.postDetail.BOARD_CON;
                    this.postU.cal_no = this.postDetail.CAL_NO;

                    if (this.postU.cal_no) {
                        const selectedCal = this.calendarList.find(cal => cal.CAL_NO === this.postU.cal_no);
                        if (selectedCal) {
                            selectedCal.selected = true;
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            }
        },
        async onSubmitForm() {
            this.postU.board_con = this.postU.board_con.replace(/\n/g, '<br>');
            try {
                await this.$swal.fire({
                    html: `<p style="font-family: 'Pretendard-Regular'; 
                font-size:22px; margin-top:24px">
                    수정하시겠습니까?
                </p>`,
                    confirmButtonText: `<p style="font-family: 'Pretendard-Regular';">확인</p>`,
                    confirmButtonColor: '#86a8e7',
                    showCancelButton: true,
                    cancelButtonText: `<p style="font-family: 'Pretendard-Regular';">취소</p>`,
                    reverseButtons: true,
                })
                    .then((result) => {
                        if (result.isConfirmed) {
                            axios({
                                url: 'http://localhost:4000/moim/post_update',
                                method: 'POST',
                                data: this.postU
                            })
                                .then((response) => {
                                    if (response.data.message === 'success') {
                                        this.alert('수정이 완료되었습니다');
                                        this.$router.push({ path: `/moimpost/${this.moim_no}` })
                                    } else {
                                        this.alert('수정 중 오류가 발생했습니다');
                                    }
                                })
                                .catch((error) => {
                                    console.error('수정 에러', error);
                                    this.alert('수정 중 오류가 발생했습니다');
                                });
                        } 
                    })


            } catch (error) {
                console.error('Promise 처리 중 에러', error);
            }
        },
        
        alert(text) {
            return this.$alert(text)
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
                    this.userList.splice(user, 1)
                }
            })
        },
        async getUserInfo() {
            if (!this.user) {
                console.log("로그인안함");
                return;
            }
            const response = await axios.get(`http://localhost:4000/auth/user_info/${this.user}`);
            this.userInfo = response.data[0];
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

.box {
    margin: 0 30px 0 270px;
    display: flex;
    height: auto;
    /* border: 1px solid red;  */
}

/* ---------------------------------------------------왼쪽 페이지 */
.left {
    width: 75%;
    height: 100%;
    margin: 0 30px 0 0;
    float: left;
    /* border: 1px solid #282fff; */
}


.left,
.right {
    float: left;
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

.profile-img {
    width: 30px;
    height: 30px;
    object-fit: cover;
    overflow: hidden;
    border-radius: 50%;
    position: relative;
    z-index: 1;
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

/*-----------------------------------------------------수정하기 */

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


.writer-member {
    float: left;
    width: 100%;
}

.writer-member p {
    float: left;
    margin-left: 10px;
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

textarea {
    position: relative;
    width: 100%;
    border: none;
    resize: none;
    background-color: #F9F9F9;
    padding: 10px;
    white-space: pre-line;
}

.guide-hr1 {
    margin: 20px 0px;
    border: 1px solid #F9F9F9;
}

.guide-hr {
    margin: 30px 0px 30px 0;
    border: 1px solid #E1E7F0;
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

/*--------------------------------------- 수정하기 모달*/
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

.modal-content .ch-post {
    font-weight: bold;
    padding: 20px 0 0 0;
    /* border: 1.5px solid #ff0000; */
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

@media screen and (max-width: 992px) {
    .box{
        margin: 0;
    }
    .right {
        display: none;
    }
}


@media screen and (max-width: 768px) {
    .left {
        width: 100%;
    }
    .right {
        display: none;
    }
}


</style>
  


