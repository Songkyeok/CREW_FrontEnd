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
                    <form ref="informU" @submit.prevent="onSubmitForm">
                        <input class="moim-input" placeholder="제목을 입력해주세요" v-model="informU.inform_title">
                        <hr class="guide-hr1">
                        <textarea ref="textArea" @input="resize" class="resize-vertical overflow-y-hidden min-h-[48px]"
                            v-model="informU.inform_con" placeholder="게시글 내용을 작성해주세요 (200자 이내)" />
                        <div class="insert-button">
                            <button type="submit" class="informbtn">수정하기</button>

                            <button type="button" class="informbtn" @click="goToPost()">취소</button>
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
            informDetail: {},
            informU: {
                inform_title: '',
                inform_con: '',
                inform_no: this.$route.params.inform_no,
            },
            moim_no: this.$route.params.moim_no,
            inform_no: this.$route.params.inform_no,
            userList: [],
            userJoin: false,
            boss: false,
            bossInfo: {},
            userInfo: {},
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
        this.getMoimDetail();
        this.getMoimember();
        this.getInformDetail();
    },
    methods: {

        goToPost() {
            const moim_no = this.$route.params.moim_no;
            window.location.href = `http://localhost:8001/MoimDetail/${moim_no}`;
        },
        openMemberModal(member) {
            this.selectedMember = member;
            this.showMemberModal = true;
        },
        closeMemberModal() {
            this.showMemberModal = false;
            this.selectedMember = {};
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
        async getInformDetail() { //공지사항 정보 불러오기
            try {
                const response = await axios.get(`http://localhost:4000/moim/inform_detail/${this.inform_no}`);
                this.informDetail = response.data[0];

                this.informU.inform_title = this.informDetail.INFORM_TITLE;
                this.informU.inform_con = this.informDetail.INFORM_CON;
            } catch (error) {
                console.error(error);
            }
        },

        async onSubmitForm() {
            this.informU.inform_con = this.informU.inform_con.replace(/\n/g, '<br>');
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
                                url: 'http://localhost:4000/moim/inform_update',
                                method: 'POST',
                                data: this.informU
                            })
                                .then((response) => {
                                    if (response.data.message === 'success') {
                                        this.$swal.fire({
                                            html: `<p style="font-family: 'Pretendard-Regular'; 
                                            font-size:22px; margin-top:24px">
                                            수정이 완료되었습니다.
                                            </p>`,
                                            confirmButtonColor: '#86a8e7',
                                            confirmButtonText: `<p style="font-family: 'Pretendard-Regular';">확인</p>`
                                        })
                                            .then(() => {
                                                location.href = `http://localhost:8001/moimdetail/${this.moim_no}`;
                                            });
                                    } else {
                                        this.alert('수정 중 오류가 발생했습니다.')
                                    }
                                })
                                .catch((error) => {
                                    console.error('수정 에러', error);
                                    this.alert('수정 중 오류가 발생했습니다.')

                                });
                        }
                    })


            } catch (error) {
                console.error('Promise 처리 중 에러', error);
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

.informbtn:nth-child(2) {
    margin-left: 10px;
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

.iter-member {
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
    margin-bottom: 10px;
    padding: 10px;
    white-space: pre-line;
    border-radius: 4px;
    background-color: #F9F9F9;
    border: 1px solid #E1E7F0;
}

textarea:focus {
    outline: none;
    border: 1px solid #86A8E7;
}
</style>
  