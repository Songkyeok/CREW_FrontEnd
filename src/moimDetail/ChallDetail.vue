<template>
    <div>
        <!-- 제목 -->
        <div class="title">
            <div class="titledot">
                <img src="../assets/icon_dot.png" />
                <h3 @click="goToDetail()">{{ moimDetail.MOIM_TITLE }} : {{ challDetail.CHALL_TITLE }}</h3>
            </div>
        </div>

        <hr class="tophr">
        <div class="box">
            <!-- 왼쪽 탭--------------------------------------- -->
            <div class="left">
                <div class="writer-member">
                    <div class="main-content">
                        <h4>✨ 챌린지를 소개합니다</h4>
                        <h5 class="content-text" v-html="challDetail.CHALL_CON"></h5>
                    </div>
                    <div class="writer-main">
                        <div v-for="(chall, i) in challList" :key="i" class="cmt-form">
                            <div v-if="i === 0 || isNewDate(chall.CHALL_D_EDD, challList[i - 1].CHALL_D_EDD)"
                                class="date-divider-top">
                                <p class="date-text-top">{{ getFormatDateTime(chall.CHALL_D_EDD) }}</p>
                            </div>

                            <div class="cmt-content" v-if="chall.USER_NO != user">
                                <div style="display: flex; position: relative;">
                                    <img :src="getUserImg(chall.USER_NO)" class="cmt-profile">
                                    <div class="not-img">
                                        <div class="cmt-info">
                                            {{ getUserNick(chall.USER_NO) }}
                                        </div>

                                        <div class="cmt-con">
                                            <img v-if="chall.CHALL_D_IMG"
                                                :src="require(`../../../node-back/uploads/uploadChallDetail/${chall.CHALL_D_IMG}`)"
                                                alt="챌린지" :width="100">
                                            <br v-if="chall.CHALL_D_IMG">
                                            <span>{{ chall.CHALL_D_CON }}</span>
                                        </div>
                                    </div>
                                    <div class="cmt-info-time">
                                        <span> {{ getFormatTime(chall.CHALL_D_EDD) }} </span>
                                    </div>
                                </div>
                            </div>

                            <div class="my-cmt-content" v-else>
                                <div style="display: flex; position: relative; justify-content: end;">
                                    <div class="my-cmt-info-time">
                                        <span> {{ getFormatTime(chall.CHALL_D_EDD) }} </span>
                                    </div>

                                    <div class="not-img">
                                        <div class="my-cmt-info">
                                            <span>{{ getUserNick(chall.USER_NO) }}</span>
                                        </div>

                                        <div class="cmt-con">
                                            <img v-if="chall.CHALL_D_IMG"
                                                :src="require(`../../../node-back/uploads/uploadChallDetail/${chall.CHALL_D_IMG}`)"
                                                alt="챌린지" :width="100">
                                            <br v-if="chall.CHALL_D_IMG">
                                            <span>{{ chall.CHALL_D_CON }}</span>
                                        </div>
                                    </div>
                                    <img :src="getUserImg(chall.USER_NO)" class="cmt-profile">

                                </div>
                            </div>

                        </div>
                        <div v-if="challList.length === 0" class="cmt-form2">
                            등록된 인증이 없습니다
                        </div>
                    </div>

                    <!-- 댓글 -->
                    <div class="writer-comment">
                        <img :src="getUserImg(user)" class="profile-img-input"
                            style="width: 35px; height: 35px; margin-top:5px">

                        <input type="file" id="input-file" class="input" accept="image/png,image/jpeg"
                            @change="uploadChallFile($event.target.files)" style="display: none;">

                        <div class="comment-content">
                            <input type="text" class="comment-control" v-model="challC.chall_d_con" @input="checkCharLimit"
                                placeholder="50자 이내로 입력해주세요" :disabled="challDetail.CHALL_STATUS === 1" />

                            <label for="input-file">
                                <img class="commenico-1" src="../assets/icon_image-on.png" for="input-file">
                            </label>

                            <img @click="createChall()" class="sendimg" src="../assets/icon_send.png" style="width: 35px;">
                        </div>

                    </div>

                </div>

            </div>
            <!-- 오른쪽 탭--------------------------------------- -->
            <div class="right">
                <h4>▶ 멤버별 달성률</h4>

                <form class="form">
                    <div class="member">
                        <div class="member-title"></div>
                        <div class="member-text" v-for="(user, index) in userList" :key="index"
                            style="display: flex; align-items: center; margin: 0 0 20px 0;">
                            <img :src="getUserImage(user)" class="profile-img" style="width: 30px; cursor: pointer;"
                                @click="openMemberModal(user)">
                            <div>
                                <p>{{ user.USER_NICK }}</p>
                                <div class="gauge-bar">
                                    <div class="progress-container">
                                        <div class="progress" :style="{ width: getChallEddLenght(user.USER_NO) + '%' }">
                                        </div>
                                    </div>
                                    <p class="gauge-percent">{{ getChallEddLenght(user.USER_NO) }}%</p>
                                </div>
                            </div>
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
                        <p>인증 날짜</p>
                        <p v-if="!getChallDEDD(selectedMember.USER_NO)" class="challEDD">인증 내역이 없습니다</p>
                        <p v-else v-html="getChallDEDD(selectedMember.USER_NO)" class="challEDD"></p>
                        <button @click="closeMemberModal" class="custom-close-button">닫기</button>
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
            challC: {
                chall_d_con: '',
                chall_d_img: '',
                chall_no: '',
                moim_no: '',
            },
            challList: [],
            moimDetail: {},
            users: {},
            challDetail: {},
            moim_no: this.$route.params.moim_no,
            chall_no: this.$route.params.chall_no,
            userList: [],
            userJoin: false,
            boss: false,
            bossInfo: {},
            userInfo: {},
            showMemberModal: false,
            challCheck: '',
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
        this.moimJoinCheck()
        if (!this.getLoginCheck()) {
            this.alert('로그인해주세요');
            this.$router.push({ path: '/login' });
        }
        else {
            this.getMoimDetail();
            this.getMoimember();
            this.getChallDetail();
            this.getChallList();
        }
    },
    methods: {

        alert(text) {
            return this.$alert(text)
        },
        getLoginCheck() {
            return this.$loginCheck(this.user);
        },
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
                            this.challC.chall_d_img = name;
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
        async getChallCheck() {
            try {
                const response = await axios.get(`http://localhost:4000/moim/chall_check/${this.user}/${this.chall_no}`)
                this.challCheck = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async createChall() {
            this.challC.chall_d_con = this.challC.chall_d_con.replace(/\n/g, '<br>');
            if (this.challDetail.CHALL_STATUS === 1) {
                this.$alert('이미 종료된 챌린지 입니다');
                return;
            } else if (!this.challC.chall_d_con) {
                this.$alert('내용을 입력해주세요.');
                return;
            } else if (this.challC.chall_d_con.length > 50) {
                this.$alert('글자수를 초과했습니다.');
                return;
            }

            try {
                await this.getChallCheck();

                if (this.challCheck === 0) {
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
                        await axios({
                            url: 'http://localhost:4000/moim/chall_d_create',
                            method: 'POST',
                            data: {
                                chall_d_con: this.challC.chall_d_con,
                                chall_d_img: this.challC.chall_d_img,
                                chall_no: this.chall_no,
                                user_no: this.user,
                            }
                        })
                            .then((response) => {
                                if (response.data.message === 'success') {
                                    this.$alert('등록이 완료되었습니다')
                                    this.getChallList();
                                } else {
                                    this.$alert('등록 실패');
                                }
                            })
                            .catch((error) => {
                                console.error('등록 에러', error);
                                this.$alert('등록 중 오류가 발생했습니다');
                            });
                    } else {
                        this.$alert('취소되었습니다');
                    }
                } else if (this.challCheck === 1) {
                    this.$alert('이미 오늘 인증이 완료되었습니다.');
                }
            } catch (error) {
                console.error('Promise 처리 중 에러', error);
            }
        },
        checkCharLimit() {
            if (this.challC.chall_d_con.length > 50) {
                this.challC.chall_d_con = this.challC.chall_d_con.slice(0, 50);
            }
        },
        async getChallList() {
            try {
                const response = await axios.get(`http://localhost:4000/moim/chall_d_list/${this.chall_no}`);
                this.challList = response.data;

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
        getChallEddLenght(userNo) {
            const userChalls = this.challList.filter(chall => chall.USER_NO === userNo);
            const numCompleted = userChalls.length;

            const startDate = new Date(this.challDetail.CHALL_SDD);
            const endDate = new Date(this.challDetail.CHALL_EDD);

            const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

            // console.log(totalDays)
            const result = (numCompleted / totalDays) * 100;
            return Math.round(result);
        },
        getConMaxWidth(chall) {
            const maxWidthPercent = 70;
            const contentWidth = (chall.CHALL_D_CON.length * 8);
            const imageWidth = chall.CHALL_D_IMG ? 100 : 0;

            const maxWidth = Math.min(maxWidthPercent, contentWidth + imageWidth) + "%";
            return maxWidth;
        },
        getChallDEDD(userNo) {
            const userChalls = this.challList.filter(chall => chall.USER_NO === userNo);
            return userChalls.map(chall => this.getFormatDateTime(chall.CHALL_D_EDD)).join('<br>');
        },
        getFormatDateTime(dateTime) { //믹스인 데이터타임 가져오기
            return this.$formatDateTime(dateTime);
        },
        getFormatTime(dateTime) { //믹스인 데이터타임 가져오기
            return this.$formatTime(dateTime);
        },
        getElapsedTime(dateTime) {
            return this.$elapsedTime(dateTime);
        },
        isNewDate(currentDate, previousDate) {
            return new Date(currentDate).toDateString() !== new Date(previousDate).toDateString();
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
        async getChallDetail() { // 챌린지 정보 불러오기
            try {
                const response = await axios.get(`http://localhost:4000/moim/chall_detail/${this.chall_no}`);
                this.challDetail = response.data[0];
                console.log(this.challDetail)
                this.moimJoinCheck();
            } catch (error) {
                console.error(error);
            }
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
                        this.getChallList();
                    } else {
                        this.$alert('크루 참가자만 접근 가능합니다');
                        this.$router.push({ path: `/moimchall/${this.moim_no}` });
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
                    this.$alert("접속 오류");
                });
        },
        getBoss() {
            this.userList.forEach(user => {
                if (user.USER_NO == this.moimDetail.USER_NO) {
                    this.bossInfo = user;
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
    margin: 0 30px 30px 0;
    float: left;
    /* border: 1px solid #282fff; */
}

.date-divider-top {
    display: flex;
    justify-content: center;
    align-items: center;
}

.date-text-top {
    font-size: 12px;
    color: gray;
    margin: 10px 0;
}


.left,
.right {
    float: left;
}

.right {
    min-width: 280px;
}

.cmt-profile {
    width: 35px;
    height: 35px;
    min-width: 35px;
    object-fit: cover;
    overflow: hidden;
    border-radius: 50%;
    margin: 10px;
}


.cmt-form {
    display: flex;
    flex-direction: column;
    margin: 20px;
    padding: 16px 16px 0px 0px;
    background-color: #F9F9F9;
}

.cmt-form2 {
    display: flex;
    flex-direction: column;
    margin: 20px;
    padding: 0;
    text-align: center;
    background-color: #F9F9F9;
}

.cmt-content {
    display: flex;
    width: 100%;
    position: flex;
    align-items: center;
    /* 가운데 정렬 */
    margin-left: 10px;
}

.not-img {
    display: block;
}

.cmt-info {
    font-size: 14px;
    margin-bottom: 5px;
    /* border: 2px solid #FF4747; */
}

.comment {
    background-color: #86A8E7;
    border: #2b2b2b 2px solid;
}

.cmt-img {
    width: 100px;
}

.cmt-con {
    font-size: 14px;
    border-radius: 10px;
    background-color: #E1E7F0;
    padding: 8px;
    display: inline-block;
}

.cmt-con img {
    border-radius: 8px;
}

.cmt-info-time {
    margin-left: 5px;
}

.cmt-info-time span {
    color: gray;
    font-size: 11px;
    width: 60px;
    position: absolute;
    bottom: 2%;
}

.my-cmt-content {
    /* display: flex; */
    /* justify-content: space-between; */
    width: 100%;
    /* align-items: center; */
    /* 가운데 정렬 */
    margin-left: 10px;
}

.my-cmt-info {
    font-size: 14px;
    margin-bottom: 5px;
    display: flex;
}

.my-cmt-info span {
    margin-left: auto;
    justify-content: end;
}

.my-cmt-info-time {
    position: relative;
}

.my-cmt-info-time span {
    color: gray;
    font-size: 11px;
    width: 60px;
    position: absolute;
    bottom: 2%;
    left: -50px;
}


.writer-main {
    height: auto;
    background-color: #F9F9F9;
    border-radius: 16px;
    padding: 5px;
    margin: 0 0px 10px 0;
}


.writer-comment {
    height: 60px;
    background-color: #F9F9F9;
    border-radius: 4px;
    padding: 10px 0 0 10px;
    display: flex;
    /* border: #ef4444 solid 2px; */

    margin-bottom: 80px;
}


.profile-img-input {
    height: 35px;
    min-width: 35px;
    object-fit: cover;
    overflow: hidden;
    border-radius: 50%;
    vertical-align: middle;
    margin: auto 5px;
}

.commenico-1 {
    margin-left: 4px;
    padding: 0;
    width: 24px;
    cursor: pointer;
    vertical-align: middle;
}

.comment-content {
    display: flexbox;
    width: 100%;
}

.comment-control {
    min-width: 75%;
    height: 40px;
    border-radius: 4px;
    padding: 10px;
    border: 1px solid #E1E7F0;
    vertical-align: middle;
}

.comment-control:focus {
    outline: 1px solid #86a8e7;
}

.sendimg {
    margin: 0;
    cursor: pointer;
    vertical-align: middle;
    margin-left: 8px;
}

.sendimg:hover {
    filter: brightness(90%);
    transition-duration: 0.4s;
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
    border-radius: 14px;
    padding: 20px;
    margin-top: 16px;
    /* border: 1px solid red; */
}

.right .form-inform {
    position: relative;
    background-color: #F9F9F9;
    border-radius: 16px;
    padding: 10px 20px 30px 30px;
    margin: 20px 0;
    border:
        1px solid red;
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
    min-width: 30px;
    height: 30px;
    object-fit: cover;
    overflow: hidden;
    border-radius: 50%;
    position: relative;
    z-index: 1;
}

.member-text p {
    font-size: 14px;
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


.moim-input {
    padding: 10px 0 0;
    border: none;
    outline: none;
    background: transparent;
    background-color: transparent;
    width: 700px;
    font-size: 20px;
}

.guide-hr1 {
    margin: 20px 0px;
    border: 1px solid #F9F9F9;
}

.guide-hr {
    margin: 30px 0px 30px 0;
    border: 1px solid #E1E7F0;
}

iter-member {
    float: left;
    width: 100%;
}

.writer-member p {
    float: left;
    margin-left: 10px;
}

.content-text {
    margin: 10px 10px 10px 25px;
    font-size: 13px;
    font-weight: normal;
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

.challEDD {
    border-radius: 4px;
    font-size: 12px;
    color: gray;
    margin: 8px 0 9px 0;
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

.gauge-bar {
    height: 15px;
    background-color: #cbdbf8;
    /* 배경색 */
    border-radius: 10px;
    overflow: hidden;
    margin-top: 5px;
    width: 150px;
    display: flex;
}

.progress-container {
    height: 100%;
    width: 100%;
    background-color: transparent;
    border-radius: 10px;
    overflow: hidden;
}

.progress {
    height: 100%;
    width: 0;
    background-color: #86A8E7;
    border-radius: 10px;
    transition: width 0.3s ease-in-out;
}

.gauge-percent {
    position: absolute;
    right: 0;
    /* left: 80%; */
    margin-right: 20px;
    font-size: 12px;
    color: gray;
}


@media (max-width: 992px) {

    .box {
        margin: 0;
        display: block;
    }

    .left {
        margin: 0;
        /* min-width: 300px; */
    }

    .right {
        width: 75%;
        margin-left: 120px;
    }

}
</style>
  