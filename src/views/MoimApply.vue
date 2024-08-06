<template>
  <body>
    <div class="title">
      <div class="titledot">
        <img src="../assets/icon_dot.png">
      </div>
      <h3 @click="goToDetail()">{{ moim.MOIM_TITLE }}</h3>
    </div>
    <form ref="moimForm" @submit.prevent="onSubmitForm">

      <hr class="tophr">

      <div class="box">
        <!-- 왼쪽 탭----------------------------------------->
        <div class="left">

          <div class="moim-img">
            <div class="img_box">
              <div class="fakeimg">
                <img v-if="moim.MOIM_IMG" :src="require(`../../../node-back/uploads/uploadMoim/${moim.MOIM_IMG}`)"
                  alt="..." style="width: 100%;">
              </div>
            </div>
          </div>
          <div class="moim-question">
            <h3 class="sub-font" style=" padding: 0 0 20px 0;">❗️ 작성한 크루 답변</h3>

            <div class="moim-questiondiv">
              <h4>Q. {{ QList.MQ1 }}</h4>
              <div class="moim-questioninput">{{ AList.MA1 }}</div>
            </div>
            <div v-if="QList.MQ2" class="moim-questiondiv">
              <h4>Q. {{ QList.MQ2 }}</h4>
              <div class="moim-questioninput">{{ AList.MA2 }}</div>

            </div>
            <div v-if="QList.MQ3" class="moim-questiondiv">
              <h4>Q. {{ QList.MQ3 }}</h4>
              <div class="moim-questioninput">{{ AList.MA3 }}</div>

            </div>
          </div>
        </div>
        <!-- 오른쪽 탭--------------------------------------- -->
        <div class="right">
          <div class="form">
            <div class="master">
              <h5>신청자 정보</h5>
              <div class="master-text">
                <div class="img-box">
                  <img v-if="AList.USER_IMG" :src="require(`../../../node-back/uploads/uploadProfile/${AList.USER_IMG}`)"
                    class="profileimg">
                  <img v-else src="../assets/profile.png">
                </div>
                <p>{{ AList.USER_NICK }}</p>
              </div>
              <p class="user-info">{{ setGender(AList.USER_GENDER) }}</p>
              <p class="user-info">{{ AList.USER_MBTI }}</p>
              <p class="user-info">{{ AList.USER_TEL }}</p>
            </div>
          </div>
          <div class="creatediv">
            <button class="col-xs-1 cancelbtn" @click="denyApply()">거부</button>
            <button class="col-xs-1 confirmbtn" @click="acceptApply()">수락</button>
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
      user_no: this.$route.params.user_no,
      moim: {}, //크루 디테일

      QList: {},
      AList: {},
    }
  },
  computed: {
    user() {
      return this.$store.state.user.user;
    }
  },
  mounted() {
    this.getMoimDetail();
    this.getMoimQ();
    this.getMoimA();
  },
  methods: {
    goToDetail() {  //크루 디테일 홈으로 이동
      window.location.href = `http://localhost:8001/moimdetail/${this.moim_no}`;
    },
    //--------------------------------------------------------------------
    async getMoimDetail() {
      try {
        const response = await axios.get(`http://localhost:4000/moim/moim_detail/${this.moim_no}`);
        this.moim = response.data[0];
      } catch (error) {
        console.error(error);
      }
    },
    async getMoimQ() {
      try {
        const response = await axios.get(`http://localhost:4000/moim/moim_question/${this.moim_no}`);
        this.QList = response.data[0];
      } catch (error) {
        console.error(error);
      }
    },
    async getMoimA() {
      try {
        const response = await axios.get(`http://localhost:4000/moim/moim_answer/${this.moim_no}/${this.user_no}`);
        this.AList = response.data[0];
      } catch (error) {
        console.error(error);
      }
    },
    alert(text) {
      return this.$alert(text)
    },
    setGender(gender) {
      if (gender == 0) {
        return 'Femail'
      }
      else if (gender == 1) {
        return 'Mail'
      }
      else
        return null;
    },
    acceptApply() {
      axios({
        url: `http://localhost:4000/moim/accept_apply`,
        method: `POST`,
        data: {
          moim_no: this.moim_no,
          user_no: this.user_no
        }
      }).then((res) => {
        if (res.data.message == 'complete') {

          this.$swal.fire({
            html: `<p style="font-family: 'Pretendard-Regular'; 
                font-size:22px; margin-top:24px">
                수락 완료되었습니다.
                </p>`,
            confirmButtonColor: '#86a8e7',
            confirmButtonText: `<p style="font-family: 'Pretendard-Regular';">확인</p>`,
          })
            .then(() => {
              history.back();
            })
        }
      })
    },
    denyApply() {
      axios({
        url: `http://localhost:4000/moim/deny_apply`,
        method: `POST`,
        data: {
          moim_no: this.moim_no,
          user_no: this.user_no
        }
      }).then((res) => {
        if (res.data.message == 'complete') {

          this.$swal.fire({
            html: `<p style="font-family: 'Pretendard-Regular'; 
                font-size:22px; margin-top:24px">
                거부 완료되었습니다.
                </p>`,
            confirmButtonColor: '#86a8e7',
            confirmButtonText: `<p style="font-family: 'Pretendard-Regular';">확인</p>`,
          })
            .then(() => {
              history.back();
            })
        }
      })
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
          if (this.user != res.data.message) {
            this.$swal.fire({
              html: `<p style="font-family: 'Pretendard-Regular'; 
                font-size:22px; margin-top:24px">
                크루 리더만 이용 가능합니다.
                </p>`,
              confirmButtonColor: '#86a8e7',
              confirmButtonText: `<p style="font-family: 'Pretendard-Regular';">확인</p>`,
            })
              .then(() => {
                history.back();
              })
          }
          else {
            this.getMoimA();
          }
        })
        .catch(() => {
          this.alert("접속 오류");
        });
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
}

.title h3 {
  cursor: pointer;
}

.titledot img {
  width: 24px;
  float: left;
  margin-right: 4px;
}

.tophr {
  margin: 27px 30px 10px 0;
  border: 2px solid #E1E7F0;
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
  padding-top: 10px;
}

/* ---------------------------------------------------왼쪽 페이지 */
.left {
  width: 75%;
  height: 100%;
  margin: 0 30px 30px 0;
  float: left;
  /* border: 1px solid #282fff; */
}

/* ---------------------------------------------------benner */
.moim-img {
  position: relative;
  width: 100%;
  height: 210px;
  background-color: #f9f9f9;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 20px;
}

.img_box {
  position: relative;
}

.fakeimg {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/image-loading2.png) center center no-repeat;
  background-size: cover;
}

.fakeimg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sub-font {
  color: #86a8e7;
  height: 30px;
  /* border: 1px solid #282fff; */
}

/*----------------------------------------------------크루 분류*/
.cate-nav {
  height: 40px;
  display: flex;
  vertical-align: middle;
  /* border: 1px solid #28ff70; */
}

.cate-nav h3 {
  padding-top: 6px;
}

.cate-nav .sub-cate {
  list-style: none;
  display: flex;
  margin: 0px 0 0 10px;
  padding-top: 3px;
  margin-right: 8px;
}

.cate-nav .cate2 {
  display: flex;
  gap: 8px;
  padding-top: 3px;
  /* border: 1px solid #282fff; */
  cursor: pointer;
  list-style: none;
}

[class|="col"] {
  background: #ffffff;
  width: auto;
  height: 32px;
  float: left;
  padding: 5px 20px 6px;
  font-size: .8em;
  text-align: center;
  vertical-align: text-top;
  color: #2b2b2b;
  border-radius: 30px;
  border: 1.5px solid #E1E7F0;
}

.active {
  color: #86a8e7;
  border-color: #86a8e7;
  font-weight: 600;
}

.cate-nav-hr {
  margin: 20px 0px 20px 0;
  border: 1px solid #E1E7F0;
}

/* ---------------------------------------------------질문 */
.moim-questiondiv {
  margin: 20px 10px;
}

.moim-questioninput {
  width: 100%;
  padding: 16px 20px;
  border: none;
  border-radius: 10px;
  background-color: #F9F9F9;
  margin: 16px 0;
}

.moim-questioninput:focus {
  outline: #86A8E7 solid 2px;
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
  width: 40px;
  height: 40px;
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

.user-info {
  margin: 4px 0;
}

/* ---------------------------------------------------버튼 */

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

.creatediv button {
  min-width: 45px;
  font-size: 14px;
  margin: 0 6px;
}

.cancelbtn:hover {
  background-color: #ff4747;
  color: white;
  border: 1px solid #ff4747;
}

.confirmbtn:hover {
  background-color: #86A8E7;
  color: white;
  border: 1px solid #86A8E7;
}


/* --------------------------------------------------- */

@media screen and (max-width: 992px) {
  .box {
    margin: 0 30px 0 100px;
    display: flex;
    height: auto;
  }

  .left {
    min-width: 300px;
    margin: 0;
  }

  .moim-img {
    display: none;
  }

  .right {
    /* display: none; */
    min-width: 180px;
    margin-left: 30px;
  }

}

@media screen and (max-width: 768px) {
  .box {
    display: block;
  }

  .left {
    width: 100%;
    margin: auto;
  }

  .right {
    width: 100%;
    margin: auto;
    padding-right: 30px;
  }

  .creatediv {
    margin: auto;
    width: 200px;
  }

}
</style>