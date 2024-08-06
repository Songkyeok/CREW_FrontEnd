<template>
    <body>
        <div class="title">
            <div class="titledot">
                <img src="../assets/icon_dot.png">
            </div>
            <h3>크루 만들기</h3>
        </div>
        <form ref="moimForm" @submit.prevent="onSubmitForm">
            <hr class="tophr">

            <div class="title-input">
                <input v-model="moimForm.moim_title" class="moim-input-title" placeholder="크루 이름을 입력하세요">
                <div v-if="!moimForm.moim_title && isFormSubmitted" class="invalid-message">크루 이름을 입력해주세요.</div>
            </div>

            <div class="box">
                <!-- 왼쪽 탭----------------------------------------->
                <div class="left">
                    <input type="file" id="input-file" class="form-control" accept="image/png,image/jpeg"
                        @change="uploadFile($event.target.files)" style="display: none;">
                    <div class="moim-img">
                        <div class="img_box">
                            <label for="input-file" v-if="!moim_img">
                                <h3 class="img-font">+ 크루 메인 사진 추가하기</h3>
                            </label>
                            <label for="input-file" v-if="moim_img">
                                <img class="img_preview" :src="require(`../../../node-back/uploads/${moim_img}`)" alt="..."
                                    style="width: 100%;">
                            </label>
                        </div>
                    </div>
                    <div v-if="!moimForm.moim_img && isFormSubmitted" class="invalid-message">크루 메인 이미지를 선택해주세요.</div>
                    <hr class="AllPosts-hr">

                    <div class="moim-introduce">
                        <h3 class="sub-font">📜 크루을 소개해주세요</h3>
                        <div>
                            <input class="moim-input" v-model="moimForm.moim_intro" placeholder="크루 소개말을 입력하세요(10자이내)">
                            <div v-if="!moimForm.moim_intro && isFormSubmitted" class="invalid-message">크루 소개말을 입력해주세요.
                            </div>
                        </div>
                        <textarea v-model="moimForm.moim_con" placeholder="크루 소개를 자세히 입력해주세요"></textarea>
                        <div v-if="!moimForm.moim_con && isFormSubmitted" class="invalid-message">크루 소개를 입력해주세요.</div>
                    </div>

                    <hr class="AllPosts-hr">
                    <h3 class="sub-font moim-cate">🏷️ 크루 분류</h3>
                    <div class="cate-nav">
                        <ul class="cate">
                            <li class="col-xs-1" :class="{ 'active': active === 'art' }"
                                @click="setActive('art'), getCateList(100)">✨ 예술</li>
                            <li class="col-xs-1" :class="{ 'active': active === 'reading' }"
                                @click="setActive('reading'), getCateList(200)">🍴 푸드</li>
                            <li class="col-xs-1" :class="{ 'active': active === 'exercise' }"
                                @click="setActive('exercise'), getCateList(300)">💪 운동</li>
                            <li class="col-xs-1" :class="{ 'active': active === 'travel' }"
                                @click="setActive('travel'), getCateList(400)">🛩️ 여행</li>
                            <li class="col-xs-1" :class="{ 'active': active === 'etc' }"
                                @click="setActive('etc'), getCateList(500)">💭 기타</li>
                        </ul>
                        <ul v-if="active" class="cate">
                            <div v-for="(cate, i) in cateList" :key="i">
                                <li class="col-xs-1 sub-cate" :class="{ 'active': activeCategory === cate.CATEGORY_NM }"
                                    @click="setActiveCate(cate.CATEGORY_NM)">{{ cate.CATEGORY_NM }}</li>
                            </div>
                        </ul>
                        <div v-if="!activeCategory && isFormSubmitted" class="invalid-message">크루 분류를 선택해주세요.</div>
                    </div>

                    <hr class="AllPosts-hr">
                    <div class="moim-question">
                        <h3 class="sub-font" style=" padding: 0 0 20px 0;">❔ 크루 가입 질문을 적어주세요</h3>
                        <div v-for="index in questionCount" :key="index">
                            <div class="input-container">
                                <input class="moim-input-question" v-model="moimForm.mq[index]"
                                    :placeholder="'크루 가입 질문을 입력하세요 ' + index">
                                <button v-if="index != 1" type="button" @click="removeQInput(index)" class="remove-button">
                                    <img src="../assets/icon_miu.png" class="miu-icon">
                                </button>
                            </div>
                            <div v-if="!moimForm[mq] && isFormSubmitted" class="invalid-message">질문 {{ index
                            }}를 입력해주세요.</div>
                        </div>
                        <div @click="addQInput" style=" padding: 10px; cursor: pointer;">+ 추가하기</div>
                    </div>
                    <hr class="AllPosts-hr">
                    <div class="moim-max">
                        <h3 class="sub-font">🥂 크루 최대 인원을 선택해주세요</h3>
                        <div>
                            <input class="moim-input" v-model="moimForm.moim_max" placeholder="크루 최대 인원을 입력하세요 (최대 100명)"
                                @input="handleMaxInput">
                            <div v-if="isInvalidInput" class="invalid-message">숫자만 입력해주세요</div>
                            <div v-if="!moimForm.moim_max && isFormSubmitted" class="invalid-message">크루 최대 인원을 입력해주세요.
                            </div>
                        </div>
                    </div>
                    <hr class="AllPosts-hr">
                    <div class="moim-place">
                        <h3 class="sub-font moim-cate">🗺️ 크루 활동 지역을 선택해주세요</h3>
                        <div class="cate-nav">
                            <ul class="cate">
                                <div v-for="(zone, i) in zoneList" :key="i">
                                    <li class="col-xs-1 sub-cate" :class="{ 'active': activeZone === zone.ZONE_NM }"
                                        @click="setActiveZone(zone.ZONE_NM)">{{ zone.ZONE_NM }}</li>
                                </div>
                            </ul>
                        </div>
                        <div v-if="!moimForm.moim_adr && isFormSubmitted" class="invalid-message">크루 활동 지역을 선택해주세요.</div>
                    </div>
                </div>

                <!-- 오른쪽 탭--------------------------------------- -->
                <div class="right">
                    <div class="form">
                        <div class="master">
                            <h5>방장 정보</h5>
                            <div class="master-text">
                                <div class="img-box">
                                    <img v-if="boss.user_img"
                                        :src="require(`../../../node-back/uploads/uploadProfile/${boss.user_img}`)"
                                        class="profileimg">
                                    <img v-else src="../assets/profile.png">
                                </div>
                                <p>{{ boss.user_nick }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="creatediv">
                        <button type="submit" class="col-xs-1 createbtn">크루 만들기</button>
                    </div>
                </div>
            </div>
        </form>
    </body>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            cateList: [],
            zoneList: [],
            active: '',
            activeCategory: '',
            activeZone: '',
            moimForm: {
                moim_title: '',
                moim_intro: '',
                moim_con: '',
                moim_adr: '',
                moim_img: '',
                moim_max: '',
                user_no: '',
                category_no: '',
                cparent_no: '',
                category_nm: '',
                mq: [],
            },
            moim_img: '',
            questionCount: 1,
            maxInputRegex: /^\d*$/,
            isInvalidInput: false,
            isFormSubmitted: false,
            boss: {}
        }
    },
    computed: {
        user() {
            return this.$store.state.user.user;
        }
    },
    mounted() {
        this.getCateList();
        this.getZoneList();
        this.getBossInfo();
    },
    created() {
        this.getCateList();
        this.getZoneList();
    },
    methods: {
        async uploadFile(file) {
            let name = "";
            let pastname = this.moimForm.moim_img;

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
                            this.moimForm.moim_img = name;
                            this.moim_img = name;
                            axios({
                                url: `http://localhost:4000/moim/delete_img`,
                                method: 'POST',
                                data: {
                                    pastname: pastname
                                }
                            })
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
        setActive(category) {
            this.active = category;
            const selectedCategory = this.cateList.find((cate) => cate.CATEGORY_NM === category);
            if (selectedCategory) {
                this.moimForm.category_no = selectedCategory.CATEGORY_NO;
                this.moimForm.cparent_no = selectedCategory.CPARENT_NO;
                this.moimForm.category_nm = selectedCategory.CATEGORY_NM;
            } else {
                this.moimForm.category_no = '';
                this.moimForm.cparent_no = '';
                this.moimForm.category_nm = '';
            }
            this.getCateList(this.getCategoryNo(category));
        },
        setActiveCate(category) {
            this.activeCategory = category;
            const selectedCategory = this.cateList.find((cate) => cate.CATEGORY_NM === category);
            if (selectedCategory) {
                this.moimForm.category_no = selectedCategory.CATEGORY_NO;
                this.moimForm.cparent_no = selectedCategory.CPARENT_NO;
                this.moimForm.category_nm = selectedCategory.CATEGORY_NM;
            } else {
                this.moimForm.category_no = '';
                this.moimForm.cparent_no = '';
                this.moimForm.category_nm = '';
            }
        },
        getCategoryNo(category) {
            const selectedCategory = this.cateList.find((cate) => cate.CATEGORY_NM === category);
            return selectedCategory ? selectedCategory.CATEGORY_NO : null;
        },
        async getCateList(cate) {
            try {
                const response = await axios.get(`http://localhost:4000/moim/cate/${cate}`);
                this.cateList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async getZoneList() {
            try {
                const response = await axios.get(`http://localhost:4000/moim/zone`);
                this.zoneList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        setActiveZone(zoneName) {
            this.activeZone = zoneName;
        },
        handleMaxInput() {
            const input = this.moimForm.moim_max;
            if (!this.maxInputRegex.test(input)) {
                this.isInvalidInput = true;
                this.moimForm.moim_max = input.match(this.maxInputRegex) || '';
            } else {
                const maxNumber = parseInt(input);
                if (maxNumber < 1) {
                    this.moimForm.moim_max = '2';
                } else if (maxNumber > 100) {
                    this.moimForm.moim_max = '100';
                }
                this.isInvalidInput = false;
            }
        },
        addQInput() {
            if (this.questionCount < 3) {
                this.questionCount++;
            } else {
                this.alert("가입 질문은 최대 3개까지 입력할 수 있습니다.");
            }
        },
        validationCheck() {
            // 미입력 항목에 대한 유효성 검사
            const emptyFields = [];
            if (!this.moimForm.moim_title) {
                emptyFields.push('크루 이름');
            }
            if (!this.moimForm.moim_intro) {
                emptyFields.push('크루 소개말');
            }
            if (!this.moimForm.moim_con) {
                emptyFields.push('크루 소개');
            }
            if (!this.activeCategory) {
                emptyFields.push('크루 카테');
            }
            if (!this.moimForm.moim_max) {
                emptyFields.push('크루 최대 인원');
            }
            if (!this.moimForm.moim_img) {
                emptyFields.push('크루 메인 이미지');
            }
            for (let i = 1; i <= this.questionCount; i++) {
                const question = this.moimForm.mq[i];
                if (!question) {
                    emptyFields.push(`추가 질문 ${i}`);
                }
            }

            if (emptyFields.length > 0) {
                this.alert("모든 항목을 입력해주세요");
                return false;
            }
            return true;
        },
        removeQInput(index) {
            event.preventDefault();
            this.moimForm.mq.splice(index, 1);
            this.questionCount--;
        },
        async onSubmitForm() {
            this.isFormSubmitted = true;
            this.moimForm.moim_adr = this.activeZone.trim();
            this.moimForm.user_no = this.user;

            if (!this.validationCheck()) {
                return
            }

            this.moimForm.moim_con = this.moimForm.moim_con.replace(/\n/g, '<br>');

            // 등록 처리
            try {

                await this.$swal.fire({
                    html: `<p style="font-family: 'Pretendard-Regular'; 
                font-size:22px; margin-top:24px">
                등록하시겠습니까?
                </p>`,
                    confirmButtonText: `<p style="font-family: 'Pretendard-Regular';">내보내기</p>`,
                    confirmButtonColor: '#86a8e7',
                    showCancelButton: true,
                    cancelButtonText: `<p style="font-family: 'Pretendard-Regular';">취소</p>`,
                    reverseButtons: true,
                })
                    .then((result) => {

                        if (result.isConfirmed) {
                            this.moim_img = '';
                            axios({
                                url: 'http://localhost:4000/moim/moim_create',
                                method: 'POST',
                                data: this.moimForm
                            })
                                .then((response) => {
                                    if (response.data.message === 'success') {
                                        this.alert('등록이 완료되었습니다');
                                        this.$store.commit("select", { select: 'mymoim' })
                                        location.href = "http://localhost:8001/mymoim"
                                    } else {
                                        this.alert('등록 중 오류가 발생했습니다.');
                                    }
                                })
                                .catch((error) => {
                                    console.error('등록 에러', error);
                                    this.alert('등록 중 오류가 발생했습니다.');
                                });
                        } else {
                            this.alert('등록 중 오류가 발생했습니다.');
                        }
                    })


            } catch (error) {
                console.error('Promise 처리 중 에러', error);
            }
        },
        alert(text) {
            return this.$alert(text)
        },
        async getBossInfo() {
            const response = await axios.get(`http://localhost:4000/auth/user_info/${this.user}`);
            this.boss = response.data[0];
            console.log(this.boss)
        },
    }
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
}

.titledot img {
    width: 24px;
    float: left;
    margin-right: 4px;
}

.tophr {
    margin: 10px 30px 20px 0;
    border: 2px solid #E1E7F0;
}


/* ---------------------------------------------------카테네비 */
.cate-nav {
    position: relative;
    align-items: center;
}

.cate-nav .cate {
    list-style: none;
    
    /* border: 1px solid rgb(0, 47, 255); */
}

/* ---------------------------------------------------box */
.box {
    margin: 0 30px 0 270px;
    display: flex;
    height: auto;
    /* border: 1px solid red;  */
}

.left,
.right {
    float: left;
    padding-top: 30px;
}

.moim-input-title {
    border: none;
    outline: none;
    background: transparent;
    background-color: transparent;
    width: 300px;
    font-size: 20px;
}

.moim-input {
    margin-top: 10px;
    padding: 10px 0 0px 10px;
    border: none;
    outline: none;
    background: transparent;
    background-color: transparent;
    width: 300px;
    font-size: 16px;
}

.moim-input-question {
    padding: 0px 0 14px 10px;
    border: none;
    outline: none;
    background: transparent;
    background-color: transparent;
    width: 96%;
    font-size: 16px;
}

.remove-button {
    border: none;
    background-color: transparent;
    cursor: pointer;
}

.miu-icon {
    width: 20px;
    height: 20px;
}

/* ---------------------------------------------------왼쪽 페이지 */
.left {
    width: 75%;
    height: 100%;
    margin: 0 30px 0 0;
    float: left;
    /* border: 1px solid #282fff; */
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
}

.img-font {
    text-align: center;
    padding: 100px 0;
    color: #9e9d9d;
}

.moim-img {
    width: 100%;
    height: 210px;
    border-radius: 20px;
    background-color: #F9F9F9;
    overflow: hidden;
}

.moim-img>img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}


.recommend-card {
    display: flex;
    justify-content: space-between;
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
    background-color: #fc9393;
    width: 100%;
    height: 140px;
    padding: 20px;
    border-radius: 16px 16px 0 0;
    border: 1.5px solid #005be5;
}

.fakeimg img {
    position: relative;
    display: inline-block;
    object-fit: cover;
    overflow: hidden;
    width: 100%;
    border-radius: 16px 16px 0 0;
    /* border: 1.5px solid #005be5; */
}


.left-card .text {
    padding: 16px 16px 10px 16px;
}

.text p {
    color: #797979;
    font-weight: bold;
    margin: 6px 0 4px;
}

.text h2 {
    font-weight: 900;
    margin: 0px 0 6px;
}

.text img {
    width: 30px;
    height: auto;
}

.writer-member {
    float: left;
    width: 100%;
}

.writer-member p {
    float: left;
    margin-left: 10px;
}

.ico img {
    width: 24px;
    float: right;
    margin-left: 20px;
}

h4 {
    padding: 50px 0 0;
}

.AllPosts-hr {
    margin: 30px 0px 20px 0;
    border: 1px solid #E1E7F0;
}

.moim-introduce textarea {
    margin-top: 20px;
    border-radius: 10px;
}

textarea:focus {
    outline: #86a8e7 2px solid;
}

.writer-member .writer-form .subtitle {
    float: left;
    width: 60px;
    margin: 0 20px 0 0;
}

.writer-member .writer-form :nth-child(2) {
    margin-top: 20px;
}

.writer-member .writer-form .enddate {
    color: #FF4747;
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

.writer-sns .like {
    float: left;
    margin-left: 10px;
}

.writer-sns .commenico {
    margin-left: 10px;
}

.writer-comment {
    position: relative;
    width: 100%;
    height: 56px;
    background-color: #F9F9F9;
    border-radius: 4px;
    padding: 4px 20px;
    margin: 16px 0px 0px 0;
}

.writer-comment .comment-control {
    position: absolute;
    width: 65%;
    height: 48px;
    right: 60px;
    margin-left: 30px;
    border-radius: 4px;
    padding: 0px 10px;
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

textarea {
    position: relative;
    width: 100%;
    height: 17em;
    border: none;
    resize: none;
    background-color: #F9F9F9;
    /* text-align: center; */

    padding: 10px 10px;
    white-space: pre-line;
}

textarea::placeholder {
    font-weight: bold;
    color: #9e9d9d;
    font-size: 18px;
}

.invalid-message {
    color: red;
    font-size: 12px;
    margin: 8px 0 0 10px;
}

.sub-font {
    color: #86a8e7;
}

.moim-place {
    margin-bottom: 90px;
}

/*----------------------------------------------------카테고리 선택*/
.moim-cate{ margin-bottom: 20px; }

.cate-nav {
    display: grid;
    cursor: pointer;
}

.cate-nav .cate {
    list-style: none;
    /* margin: 30px 0 0 0; */
}

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
.sub-cate{ padding-top: 7px; }
.active {
    color: #86a8e7;
    border-color: #86a8e7;
    font-weight: 600;
}

/* ---------------------------------------------------오른쪽 고정페이지 */
.right {
    float: left;
    width: 25%;
    height: 100%;
}

.right .form {
    background-color: #F9F9F9;
    border-radius: 16px;
    padding: 10px 20px 30px 30px;
}

h5 {
    margin: 20px 0;
}

.master .master-text img{
    width: 50px;
    height: 50px;
    object-fit: cover;
    overflow: hidden;
    border-radius: 50%;
    /* border: #005be5 2px solid; */
}

.master-text {
    display: flex;
}

.master-text p{
    padding: 12px 0 0 14px;
}
.img-box .profileimg {
    height: 100%;
    width: 100%;
    object-fit: cover;
    /* border: #005be5 2px solid; */
}

/* ---------------------------------------------------탈퇴하기버튼 */

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

@media screen and (max-width: 768px) {
    .writer-comment .comment-control {
        width: 75%;
        height: 48px;
        right: 60px;
        margin-left: 30px;
        border-radius: 4px;
        padding: 0px 10px;
    }

}
</style>