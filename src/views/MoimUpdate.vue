<template>
    <body>
        <div class="title">
            <div class="titledot">
                <img src="../assets/icon_dot.png">
            </div>
            <h3>크루 수정하기</h3>
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
                            <label for="input-file" v-if="moim_img">
                                <img class="img_preview" :src="require(`../../../node-back/uploads/${moim_img}`)" alt="..."
                                    style="width: 100%;">
                            </label>
                            <label for="input-file" v-else>
                                <img class="img_preview"
                                    :src="moimDetail.MOIM_IMG ? require(`../../../node-back/uploads/uploadMoim/${moimDetail.MOIM_IMG}`) : ''"
                                    alt="...">
                            </label>
                        </div>
                    </div>
                    <hr class="AllPosts-hr">

                    <div class="moim-introduce">
                        <h3 class="sub-font">📜 크루을 소개해주세요</h3>
                        <div>
                            <input class="moim-input moimint" v-model="moimForm.moim_intro" placeholder="한줄 소개말을 입력하세요(10자이내)">
                            <div v-if="!moimForm.moim_intro && isFormSubmitted" class="invalid-message">크루 소개말을 입력해주세요.
                            </div>
                        </div>
                        <textarea v-model="moimForm.moim_con" placeholder="크루 소개를 자세히 해주세요"></textarea>
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
                            <div v-if="!moimForm.mq[1] && isFormSubmitted" class="invalid-message">질문 {{ index
                            }}를 입력해주세요.</div>
                        </div>
                        <div @click="addQInput" style=" padding: 10px; cursor: pointer;">+ 추가하기</div>
                    </div>
                    <hr class="AllPosts-hr">
                    <div class="moim-max">
                        <h3 class="sub-font">🥂 크루 최대 인원을 입력해주세요 <span style="font-size: 13px; color: rgb(194, 189, 189);">
                                현재 인원({{ userList.length }}명) 이상 입력</span></h3>
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
                        <h3 class="sub-font  moim-cate">🗺️ 크루 활동 지역을 선택해주세요</h3>
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

                    <div class="creatediv">
                        <button type="submit" class="col-xs-1 createbtn">크루 수정하기</button>
                    </div>
                    <div class="withdraw">
                        <button type="button" @click="deleteMoimCheck()">크루 삭제하기</button>
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
            moim_no: this.$route.params.moim_no,

            cateList: [],
            zoneList: [],
            moimDetail: {},
            active: '',
            activeCategory: '',
            activeZone: '',
            moimForm: {
                moim_no: this.$route.params.moim_no,
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
            boss: {},
            userList: [],
            showMemberModal: false,
            selectedMember: {},
        }
    },
    computed: {
        user() {
            return this.$store.state.user.user;
        }
    },
    mounted() {
        this.bossCheck();

        this.getMoimDetail();
        this.getCateList();
        this.getZoneList();
        this.getQuestion();

        this.getMoimember();
        this.getBossInfo();

    },
    created() {

    },
    methods: {
        bossCheck() { //보스 체크
            axios({
                url: "http://localhost:4000/auth/boss_check",
                method: "POST",
                data: {
                    moim_no: this.$route.params.moim_no,
                },
            })
                .then(res => {
                    if (this.user != res.data.message) {
                        this.$swal.fire({
                            html: `<p style="font-family: 'Pretendard-Regular'; 
                            font-size:22px; margin-top:24px">
                                크루 리더만 이용 가능합니다.
                            </p>`,
                            confirmButtonColor: '#86a8e7',
                            confirmButtonText: `<p style="font-family: 'Pretendard-Regular';">확인</p>`
                        })
                            .then(() => {
                                history.back();
                            })
                    }
                })
                .catch(() => {
                    this.alert("접속 오류");
                });
        },
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

            if (this.moimForm.moim_max < this.userList.length) {
                this.moimForm.moim_max = this.userList.length.toString();
            }
        },
        async getQuestion() {
            const moim_no = this.$route.params.moim_no;
            const response = await axios.get(`http://localhost:4000/moim/moim_question/${moim_no}`);
            this.moimQuestion = response.data[0];

            if (this.moimQuestion.MQ1) {
                this.moimForm.mq[1] = this.moimQuestion.MQ1;
            }
            if (this.moimQuestion.MQ2) {
                this.moimForm.mq[2] = this.moimQuestion.MQ2;
                this.questionCount++;
            }
            if (this.moimQuestion.MQ3) {
                this.moimForm.mq[3] = this.moimQuestion.MQ3;
                this.questionCount++;
            }
        },
        async getMoimDetail() {
            try {
                const moim_no = this.$route.params.moim_no;
                const response = await axios.get(`http://localhost:4000/moim/moim_detail/${moim_no}`);
                this.moimDetail = response.data[0];

                this.moimForm.moim_title = this.moimDetail.MOIM_TITLE;
                this.moimForm.moim_intro = this.moimDetail.MOIM_INTRO;
                this.moimForm.moim_con = this.moimDetail.MOIM_CON;
                this.moimForm.moim_adr = this.moimDetail.MOIM_ADR;
                this.moimForm.moim_img = this.moimDetail.MOIM_IMG;
                this.moimForm.moim_max = this.moimDetail.MOIM_MAX;
                this.moimForm.category_no = this.moimDetail.CATEGORY_NO;
                this.moimForm.cparent_no = this.moimDetail.CPARENT_NO;
                this.moimForm.category_nm = this.moimDetail.CATEGORY_NM;

                if (this.moimForm.cparent_no === 100) {
                    this.setActive('art');
                } else if (this.moimForm.cparent_no === 200) {
                    this.setActive('reading');
                } else if (this.moimForm.cparent_no === 300) {
                    this.setActive('exercise');
                } else if (this.moimForm.cparent_no === 400) {
                    this.setActive('travel');
                } else if (this.moimForm.cparent_no === 500) {
                    this.setActive('etc');
                }

                this.setActiveZone(this.moimForm.moim_adr);
            } catch (error) {
                console.error(error);
            }
        },
        addQInput() {
            if (this.questionCount < 3) {
                this.questionCount++;
            } else {
                this.alert("가입 질문은 최대 3개까지 입력할 수 있습니다.");
            }
        },
        validationCHeck() {
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
            const moim_no = this.$route.params.moim_no;
            this.isFormSubmitted = true;
            this.moimForm.moim_adr = this.activeZone.trim();
            this.moimForm.user_no = this.user;

            if (!this.validationCHeck()) {
                return
            }

            if (this.moim_img == '') {
                this.moimForm.moim_img = null;
            }

            this.moimForm.moim_con = this.moimForm.moim_con.replace(/\n/g, '<br>');

            // 등록 처리
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
                            this.moim_img = '';
                            axios({
                                url: 'http://localhost:4000/moim/moim_update',
                                method: 'POST',
                                data: this.moimForm
                            })
                                .then((response) => {
                                    if (response.data.message === 'success') {
                                        this.alert('수정이 완료되었습니다');

                                        this.$store.commit("select", { select: 'mymoim' })
                                        this.$router.push({ path: `/moimdetail/${moim_no}` })


                                    } else {
                                        this.alert('수정 중 오류가 발생했습니다.')
                                    }
                                })
                                .catch((error) => {
                                    console.error('수정 에러', error);
                                    this.alert('수정 중 오류가 발생했습니다.')

                                });
                        } else {
                            this.alert('취소되었습니다')
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
        },
        async getMoimember() {
            try {
                const moim_no = this.$route.params.moim_no;
                const response = await axios.get(`http://localhost:4000/moim/user_list/${moim_no}`);
                this.userList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        getUserNick(userNo) {
            const user = this.userList.find(user => user.USER_NO === userNo);
            return user ? user.USER_NICK : '이름없음';
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
        openMemberModal(member) {
            this.selectedMember = member;
            this.showMemberModal = true;
        },
        closeMemberModal() {
            this.showMemberModal = false;
            this.selectedMember = {};
        },
        async deleteMoimCheck() {
            this.$swal.fire({
                html: `<p style="font-family: 'Pretendard-Regular'; 
                font-size:22px; margin-top:24px">
                    크루를 정말로 삭제하시겠습니까?
                    삭제 이후에는 복구가 불가능합니다.
                </p>`,
                confirmButtonText: `<p style="font-family: 'Pretendard-Regular';">확인</p>`,
                confirmButtonColor: '#86a8e7',
                showCancelButton: true,
                cancelButtonText: `<p style="font-family: 'Pretendard-Regular';">취소</p>`,
                reverseButtons: true,
            })
                .then((result) => {
                    if (result.isConfirmed) {
                        this.deleteMoim();
                    }
                })
        },
        async deleteMoim() {
            const name = await this.$swal({
                html: `<p style="font-family: 'Pretendard-Regular'; 
                            font-size:22px; margin-top:24px">
                                삭제하시려면 크루명을 정확히 입력해주세요.
                            </p>`,
                confirmButtonText: `<p style="font-family: 'Pretendard-Regular';">확인</p>`,
                confirmButtonColor: '#86a8e7',
                showCancelButton: true,
                cancelButtonText: `<p style="font-family: 'Pretendard-Regular';">취소</p>`,
                reverseButtons: true,
                input: 'text',
                inputLabel: `${this.moimForm.moim_title}`,
            })
            if (name.value == this.moimForm.moim_title) {
                axios({
                    url: 'http://localhost:4000/moim/moim_delete',
                    method: 'POST',
                    data: {
                        moim_no: this.moim_no
                    }
                })
                    .then((response) => {
                        if (response.data.message === 'success') {
                            this.alert('크루가 삭제되었습니다.');

                            this.$store.commit("select", { select: 'home' })
                            this.$router.push({ path: `/` })
                        }
                    })
                    .catch((error) => {
                        console.error('수정 에러', error);
                        this.alert('오류가 발생했습니다.');
                    });
            }
            else {
                this.alert('크루명을 정확히 입력하세요.')
            }
        }
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
    width: 800px;
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
.moimint{margin-left: 10px;}
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
    padding: 10px;
    border-radius: 8px;
}

.moim-introduce textarea:focus {
    outline: #86a8e7 solid 2px;
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

    padding: 10px 0;
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

.master .master-text img {
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

.master-text p {
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

.guide-hr1 {
    margin: 20px 0px;
    border: 1px solid #F9F9F9;
}

.member .member-text img {
    float: left;
    margin-right: 10px;
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

/* --------------------------------------------------- */

@media screen and (max-width: 1080px) {
    
    .title-input, .box {
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