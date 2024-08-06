<template>
    <body>
        <div class="title">
            <div class="titledot">
                <div>
                    <img src="../assets/icon_dot.png">
                </div>
            </div>
            <h3>설정</h3>
        </div>

        <hr class="tophr">

        <div class="content">
            <!--유저 정보-->
            <div class="left">
                <div class="list list-profile">
                    <p>프로필 사진</p>
                    <label class="profile-box" for="input-file">
                        <img :src="getUserImage(loginUser)" alt="이미지">
                    </label>
                </div>
                <input type="file" id="input-file" class="form-control" accept="image/png,image/jpeg"
                    @change="uploadFile($event.target.files)" style="display: none;">
                <div class="list">
                    <p>닉네임</p>
                    <input type="text" class="form-control" v-model="loginUser.user_nick" />
                </div>
                <div class="list">
                    <p>이메일</p>
                    <input type="text" class="form-control form-email" v-model="loginUser.user_id" disabled />
                </div>
                <div class="list">
                    <p>전화번호</p>
                    <input type="tel" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" class="form-control" v-model="loginUser.user_tel" placeholder="숫자만 입력"/>
                </div>
                <div class="list">
                    <p>성별</p>
                    남자 <input type="radio" class="radio-control" name="gender" value='1' v-model="loginUser.user_gender">
                    여자 <input type="radio" class="radio-control" name="gender" value='0' v-model="loginUser.user_gender">
                </div>
                <div class="list">
                    <p>생년월일</p>
                    <input type="date" v-model="birth">

                    <!-- {{ getFormatDateTime(loginUser.user_birth) }} -->
                </div>
                <div class="list">
                    <p>성향</p>
                    <span v-if="loginUser.user_mbti">{{ loginUser.user_mbti }} <button class="mbti-button" @click="goTo('MBTI')">테스트 다시하기</button></span>
                    <button class="mbti-button" @click="goTo('MBTI')" v-else>테스트하러 가기</button>
                </div>
                <div class="list">
                    <p>활동지역</p>
                    <span style="font-size: 14px; color: red;">최대 2개까지 선택</span>
                </div>
                <div class="list-zone">
                    <div class="category-list" v-for="(zone, i) in zoneList" :key="i">
                        <label :for="zone.ZONE_NO" @click="zoneCnt()">
                            <input type="checkbox" :value="zone.ZONE_NM" :id="zone.ZONE_NO" v-model="userZoneList">
                            <p class="cate-name">{{ zone.ZONE_NM }}</p>
                        </label>
                    </div>
                </div>
            </div>
            <!--내 관심사 선택-->
            <div class="right">
                <div style="display: flex; justify-content: end;">
                    <span class="pass-btn" @click="goTo('pass')">비밀번호 수정</span>
                    <span class="delete-btn" @click="goTo('userdelete')">회원 탈퇴</span>
                </div>
                <div class="category">
                    <div class="art">
                        <p>✨ 예술</p>

                        <hr class="cate-hr">
                        <div class="category-box" v-for="(cate, i) in category" :key="i">
                            <div class="category-list" v-if="category[i].CPARENT_NO == 100">
                                <label :for="cate.CATEGORY_NO">
                                    <input type="checkbox" :value="cate.CATEGORY_NO" :id="cate.CATEGORY_NO"
                                        v-model="hobbyList">
                                    <p class="cate-name">{{ cate.CATEGORY_NM }}</p>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="food">
                        <p>🍴 푸드</p>
                        <hr class="cate-hr">
                        <div class="category-box" v-for="(cate, i) in category" :key="i">
                            <div class="category-list" v-if="category[i].CPARENT_NO == 200">
                                <label :for="cate.CATEGORY_NO">
                                    <input type="checkbox" :value="cate.CATEGORY_NO" :id="cate.CATEGORY_NO"
                                        v-model="hobbyList">
                                    <p class="cate-name">{{ cate.CATEGORY_NM }}</p>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="exercise">
                        <p>💪 운동</p>
                        <hr class="cate-hr">
                        <div class="category-box" v-for="(cate, i) in category" :key="i">
                            <div class="category-list" v-if="category[i].CPARENT_NO == 300">
                                <label :for="cate.CATEGORY_NO">
                                    <input type="checkbox" :value="cate.CATEGORY_NO" :id="cate.CATEGORY_NO"
                                        v-model="hobbyList">
                                    <p class="cate-name">{{ cate.CATEGORY_NM }}</p>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="travel">
                        <p>🛩️ 여행</p>
                        <hr class="cate-hr">
                        <div class="category-box" v-for="(cate, i) in category" :key="i">
                            <div class="category-list" v-if="category[i].CPARENT_NO == 400">
                                <label :for="cate.CATEGORY_NO">
                                    <input type="checkbox" :value="cate.CATEGORY_NO" :id="cate.CATEGORY_NO"
                                        v-model="hobbyList">
                                    <p class="cate-name">{{ cate.CATEGORY_NM }}</p>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="etc">
                        <p>💭 기타</p>
                        <hr class="cate-hr">
                        <div class="category-box" v-for="(cate, i) in category" :key="i">
                            <div class="category-list" v-if="category[i].CPARENT_NO == 500">
                                <label :for="cate.CATEGORY_NO">
                                    <input type="checkbox" :value="cate.CATEGORY_NO" :id="cate.CATEGORY_NO"
                                        v-model="hobbyList">
                                    <p class="cate-name">{{ cate.CATEGORY_NM }}</p>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="confirm-btn">
                    <button type="button" class="btn" @click="confirmEdit()">수정완료</button>

                </div>
            </div>
        </div>
    </body>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            hobby: [],      // 유저 취미 가져오기
            loginUser: {},
            editable: false,
            hobbyList: [],  // 유저 취미 저장하기
            category: [],   // 카테고리 가져오기
            tmpImg: '',     // 임시 이미지 파일명
            birth: [],
            zoneList: [], //지역구 가져오기
            userZoneList: [], //지역구 저장
            userZone: [],

        }
    },
    computed: {
        user() {
            return this.$store.state.user.user;
        }
    },
    mounted() {
        if (!this.getLoginCheck()) {
            this.alert('로그인해주세요');
            this.$router.push({ path: '/login' });
        }
        else {
            this.getCategory()
            this.getUser()
            this.getHobby()
            this.getZone()
            this.getZoneList();
        }
    },
    created() {

    },
    methods: {
        async uploadFile(file) {
            let name = "";
            let pastname = this.tmpImg;

            if (file) {
                name = file[0].name;
            }

            const formData = new FormData();
            formData.append('img', file[0]);

            try {
                await axios({
                    url: `http://localhost:4000/auth/upload_img`,
                    method: 'POST',
                    headers: { 'Content-Type': 'multipart/form-data' },
                    data: formData
                })
                    .then((res) => {
                        if (res.data.message == 'success') {
                            this.tmpImg = name;
                            pastname;
                            // axios({
                            //     url: `http://localhost:4000/auth/delete_img`,
                            //     method: 'POST',
                            //     data: {
                            //         pastname: pastname
                            //     }
                            // })
                        }
                        else {
                            this.alert("DB 에러");
                        }
                    })
                    .catch(e => {
                        console.error(e);
                        return
                    })
                // return true;

            } catch (err) {
                console.error(err);
                return false;
            }

        },
        async getCategory() {
            try {
                const response = await axios.post(`http://localhost:4000/auth/category`);
                this.category = response.data;

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
        async confirmZone() {
            await axios.post('http://localhost:4000/auth/setting_zone', {

                user_no: this.user,
                user_zone: this.userZoneList
            })
                .then((res) => {
                    if (res.data.message === 'mypage_update') {
                        this.alert("수정이 완료되었습니다");
                        this.$store.commit("select", { select: 'myprofile' })
                        this.$router.push('/myprofile')
                    } else {
                        this.alert("수정에 실패했습니다.");
                    }
                })
                .catch((err) => {
                    console.error(err);
                    this.alert("수정에 실패했습니다.");
                });

        },
        getLoginCheck() {
            return this.$loginCheck(this.user);
        },
        async getUser() {
            try {
                const response = await axios.get(`http://localhost:4000/auth/user_info/${this.user}`);
                this.loginUser = response.data[0];
                const birth = response.data[0].user_birth.split('T')[0]
                const date = new Date(birth);

                const birthday = new Date(date);
                birthday.setDate(date.getDate() + 1);
                const year = birthday.getFullYear();
                const month = ('0' + (birthday.getMonth() + 1)).slice(-2);
                const day = ('0' + (birthday.getDate())).slice(-2);
                const realBirthday = `${year}-${month}-${day}`;

                this.birth = realBirthday;


                // let dateObj = new Date(response.data[0].user_birth);
                // let timeString_KR = dateObj.toLocaleString("ko-KR", {timeZone: "Asia/Seoul"});
            } catch (error) {
                console.error(error);
            }
        },
        async confirmEdit() {
            if (this.loginUser.user_nick === "" || this.loginUser.user_tel === "" || this.loginUser.user_gender === "") {
                this.alert("모든 항목을 입력해주세요");
            } else {
                await axios.post('http://localhost:4000/auth/setting', {
                    user_no: this.user,
                    user_nick: this.loginUser.user_nick,
                    user_tel: this.loginUser.user_tel,
                    user_gender: this.loginUser.user_gender,
                    user_img: this.loginUser.user_img,
                    tmp_img: this.tmpImg,
                    user_birth: this.birth,

                })
                    .then((res) => {
                        if (res.data.message != 'mypage_update') {
                            this.alert("수정에 실패했습니다.");
                        }
                        else {
                            this.confirmHobby();
                            this.confirmZone();

                        }
                    })
                    .catch((err) => {
                        console.error(err);
                        this.alert("수정에 실패했습니다.");
                        return
                    });
            }
        },
        //취미 등록
        async confirmHobby() {
            await axios.post('http://localhost:4000/auth/setting_hobby', {
                user_no: this.user,
                user_hobby: this.hobbyList
            })
                .then((res) => {
                    if (res.data.message === 'hobby_update') {
                        this.alert("수정이 완료되었습니다");
                        this.$store.commit("select", { select: 'myprofile' })
                        this.$router.push('/myprofile')
                    } else {
                        this.alert("수정에 실패했습니다.");
                    }
                })
                .catch((err) => {
                    console.error(err);
                    this.alert("수정에 실패했습니다.");
                });

        },
        async getHobby() {
            try {
                const response = await axios.get(`http://localhost:4000/auth/user_hobby_no/${this.user}`);
                this.hobby = response.data;
                this.hobby.forEach(cate => {
                    this.hobbyList.push(cate.category_no);
                })
            } catch (error) {
                console.error(error);
            }
        },
        async getZone() {
            try {
                const response = await axios.get(`http://localhost:4000/auth/user_zone/${this.user}`);
                this.userZone = response.data[0];
                for (const adr in this.userZone) {
                    if (this.userZone[adr] != null) {
                        this.userZoneList.push(this.userZone[adr]);
                    }
                }

            } catch (error) {
                console.error(error);
            }
        },
        getFormatDateTime(datetime) {
            return this.$formatDateTime(datetime);
        },
        alert(text) {
            this.$alert(text)
        },
        getUserImage(user) { //프로필 이미지
            if (this.tmpImg) {
                return require(`../../../node-back/uploads/${this.tmpImg}`);
            }
            else if (user.user_img) {
                return require(`../../../node-back/uploads/uploadProfile/${user.user_img}`);
            } else {
                return require('../assets/profile.png');
            }
        },
        zoneCnt() {
            // this.alert(this.userZoneList.length)
            if (this.userZoneList.length >= 2) {
                this.userZoneList.shift();
            }
        },
        goTo(page) {
            this.$router.push(`/${page}`)
        },
    }
}

</script>

<style scoped>
.cate-name {
    margin-right: 10px;
    border: 1px solid #86a8e7;
    color: #86a8e7;
    border-radius: 15px;
    padding: 4px 12px;
}

input[type="checkbox"] {

    opacity: 0;

}

label {
    color: rgb(0, 0, 0);
}

input[type="checkbox"]:checked+p {
    border: 1px solid #638bd7;
    color: #638bd7;
    font-weight: bold;
    border-radius: 15px;

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

.contain {
    margin: 0 30px 0px 0px;
    display: flex;
    width: 70%;
    border: 3px solid rgb(128, 0, 255);

}

body {
    border: white solid 1px;
}

.title {
    margin: 30px 0 0 0;
    width: 100%;
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

.cate-hr {
    margin: 10px 30px 5px 0;
    border: 2px solid #E1E7F0;
}

.content {
    margin: 28px 30px 0px 0px;
    display: flex;
    height: auto;
    justify-content: space-between;
    /* border: 2px solid red; */

}


.left {
    margin-right: 20px;
}

.right {
    width: 500px;
    /* min-width: 300px; */
    font-size: 16px;
}


/* ------------------------------------------ */

.list {
    display: flex;
    font-size: 16px;
    margin: 36px 0px;
    align-items: center;

}


.form-control {
    width: 240px;
    border-radius: 8px;
}

.form-control:focus {
    outline: #86A8E7 1.5px solid;
}

.list p {
    width: 114px;
    display: inline-block;
    font-weight: bolder;
    letter-spacing: 0.5px;
    /* border: 1px solid red; */
}


.list-profile {
    margin-top: 0px;
}

.profile-box {
    display: flex;
    flex-direction: column;
    cursor: pointer;
    justify-content: center;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
}

.profile-box img {
    object-fit: cover;
    width: 100%;
    height: 100%;
}

.radio-control {
    margin: 0px 15px 0px 5px;
}

input {
    color: rgb(59, 59, 59);
    border: 1px solid rgb(213, 213, 213);
    padding: 8px;
    font-size: 14px;
    background-color: rgba(239, 248, 255, 0.31);

}


.form-email {
    border: 1px solid rgb(213, 213, 213);
    color: rgb(163, 163, 163);
    background-color: #eeeeee;
}

.category {
    padding: 20px;
    background-color: #F9F9F9;
    border-radius: 16px;
    display: flex;
    flex-direction: column;

}

.category input {
    /* display: none; */
}

.confirm-btn {
    margin: 0 20px;
    float: right;
    text-align: center;
    width: 200px;
}

.btn {
    margin-top: 20px;
    padding: 10px;
    font-size: 18px;
    border: none;
    border-radius: 40px;
    color: white;
    background-color: #9DB3FF;
    width: 100%;
}


.delete-btn {
    display: flex;
    padding: 12px;
    font-size: 16px;
    color: #ff4747;
    cursor: pointer;
}

.mbti-button{
    cursor: pointer;
    padding: 6px 8px;
    border: none;
    border-radius: 4px;
    background-color: #E1E7F0;
}
.btn:hover {
    cursor: pointer;
    background-color: #7592f8;
    transition: all 0.5s;
}

.btn:active {
    background-color: #4964c5;
}


input[type="checkbox"]:checked+label {
    background-color: #7592f8;
}

.label {
    color: black;
    cursor: pointer;
    border: 2px solid red;

}

.category-box {
    margin-top: -12px;
}

.category-list {
    margin: -4px auto;
    float: left;
}

.exercise,
.food,
.travel,
.etc {
    margin-top: 20px;
}


@media (max-width: 768px) {
    .content {
        display: block;

    }

    .left {
        margin-left: 120px;

    }

    .right {
        width: 78%;
        margin-left: 110px;
    }

    .confirm-btn {
        margin-bottom: 50px;
    }
}

.list-zone {
    position: relative;
    padding: 10px;
    left: -8px;
    bottom: 30px;
    height: 250px;
    width: 500px;
    border-radius: 8px;
    /* border: 1px solid rgb(213, 213, 213); */
    color: rgb(163, 163, 163);
    background-color: white;
}

.pass-btn {
    display: flex;
    padding: 12px;
    font-size: 16px;
    color: #86A8E7;
    cursor: pointer;
}
</style>