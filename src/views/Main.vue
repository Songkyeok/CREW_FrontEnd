<template>
  <body>
    <div class="cate-nav">
      <ul class="cate">
        <li class="col-xs-1" :class="{ 'active': active === 'all' }" @click="setActive('all'), getMoimList(), open()">👀
          전체
        </li>
        <li class="col-xs-1" :class="{ 'active': active === 'art' }" @click="setActive('art'), getMoimList(1), close()">✨
          예술
        </li>
        <li class="col-xs-1" :class="{ 'active': active === 'reading' }"
          @click="setActive('reading'), getMoimList(2), close()">
          🍴 푸드
        </li>
        <li class="col-xs-1" :class="{ 'active': active === 'exercise' }"
          @click="setActive('exercise'), getMoimList(3), close()">
          💪 운동
        </li>
        <li class="col-xs-1" :class="{ 'active': active === 'travel' }"
          @click="setActive('travel'), getMoimList(4), close()">
          🛩️ 여행
        </li>
        <li class="col-xs-1" :class="{ 'active': active === 'etc' }" @click="setActive('etc'), getMoimList(5), close()">💭
          기타
        </li>
      </ul>
    </div>

    <div class="header">
      <div id="mainslider">
        <splide :options="options">
          <splide-slide>
            <img class="slider-image" src="../../../node-back/uploads/uploadBanner/1.jpg" alt="크루 배너 이미지1" />
          </splide-slide>
          <splide-slide>
            <img class="slider-image" src="../../../node-back/uploads/uploadBanner/2.jpg" alt="크루 배너 이미지2" />
          </splide-slide>
          <splide-slide>
            <img class="slider-image" src="../../../node-back/uploads/uploadBanner/3.jpg" alt="크루 배너 이미지3" />
          </splide-slide>
        </splide>
      </div>
    </div>

    <!--  main content 영역 -->
    <div class="maincontent">
      <div class="left">

        <!--  크루 추천 영역 -->
        <div v-if="getLoginCheck() && (recommendMoimList.length != 0)" class="recommend-moim " id="r-moim">
          <div class="recommend-title" style="display: flex; padding: 4px; margin-bottom: 10px;">
            <img src="../assets/icon_dot.png" style="width: 24px;">
            <h3>추천 크루</h3>
          </div>

          <div class="left-card" v-for="(moim, index) in recommendMoimList" :key="index">
            <div class="imgbox">
              <img v-if="moim.MOIM_GRADE != 0" class="badge" :src="require(`../assets/Badges/${setGrade(moim.MOIM_GRADE)}`)" alt=".">
              <div class="fakeimg"></div>
              <img :src="require(`../../../node-back/uploads/uploadMoim/${moim.MOIM_IMG}`)" alt="크루 이미지" class="moim-img"
                @click="goToDetail(moim.MOIM_NO)">
            </div>
            <div v-if="moim.MOIM_MAX > moim.MOIM_CNT" class="moim-parti">인원: {{ moim.MOIM_CNT }} / {{ moim.MOIM_MAX }}
            </div>
            <div v-else class="moim-parti" style="color: #ff4747;">인원: {{ moim.MOIM_CNT }} / {{ moim.MOIM_MAX }}</div>
            <div class="like" @click="toggleLike(moim.MOIM_NO, checkLike(moim.MOIM_NO))">
              <img v-if="checkLike(moim.MOIM_NO)" src="../assets/icon_like-on.png">
              <img v-else src="../assets/icon_like-off.png">
            </div>
            <div class="text">
              <h5>#{{ moim.CATEGORY_NM }}</h5>
              <p>{{ moim.MOIM_INTRO }}</p>
              <h2 @click="goToDetail(moim.MOIM_NO)">{{ moim.MOIM_TITLE }}</h2>
            </div>
          </div>
        </div>

        <!--  기본 크루 영역 -->
        <div>
          <div class="recommend-title" style="display: flex; padding: 4px; margin-bottom: 10px;">
            <img src="../assets/icon_dot.png" style="width: 24px;">
            <h3>신규 크루</h3>
          </div>
          <div class="left-card" v-for="(moim, index) in moimList.slice(0, listCnt)" :key="index">
            <div class="imgbox">
              <img v-if="moim.MOIM_GRADE && (moim.MOIM_GRADE !=0)" class="badge" :src="require(`../assets/Badges/${setGrade(moim.MOIM_GRADE)}`)" alt=".">
              <div class="fakeimg"></div> <!-- .fakeimg를 마스크로 사용 -->
              <img :src="require(`../../../node-back/uploads/uploadMoim/${moim.MOIM_IMG}`)" alt="크루 이미지" class="moim-img"
                @click="goToDetail(moim.MOIM_NO)">
            </div>
            <div v-if="moim.MOIM_MAX > moim.MOIM_CNT" class="moim-parti">인원: {{ moim.MOIM_CNT }} / {{ moim.MOIM_MAX }}
            </div>
            <div v-else class="moim-parti" style="color: #ff4747;">인원: {{ moim.MOIM_CNT }} / {{ moim.MOIM_MAX }}</div>
            <div class="like" @click="toggleLike(moim.MOIM_NO, checkLike(moim.MOIM_NO))">
              <img v-if="checkLike(moim.MOIM_NO)" src="../assets/icon_like-on.png">
              <img v-else src="../assets/icon_like-off.png">
            </div>
            <div class="text">
              <h5>#{{ moim.CATEGORY_NM }}</h5>
              <p>{{ moim.MOIM_INTRO }}</p>
              <h2 @click="goToDetail(moim.MOIM_NO)">{{ moim.MOIM_TITLE }}</h2>
            </div>
          </div>
        </div>
      </div>
      <div class="left" v-if="moimList.length == 0">
        등록된 크루이 없습니다
      </div>

      <!-- 챌린지 영역 -->
      <div class="right">
        <div class="challdot">
          <img src="../assets/icon_dot.png">
          <h3>진행중인 챌린지</h3>
        </div>
        <div class="chall-list" v-for="(chall, i) in challList" :key="i">
          <div class="content" @click="goToChall(chall.MOIM_NO)">

            <div class="contentimg">
              <img :src="require(`../../../node-back/uploads/uploadChall/${chall.CHALL_IMG}`)" class="moim-img">
            </div>
            <div class="event-end-message" v-if="chall.CHALL_STATUS === 1">
              <p>챌린지 종료</p>
            </div>
            <div class="challtext">
              <h3>{{ chall.CHALL_TITLE }}</h3>
              <p>{{ getFormatDateTime(chall.CHALL_SDD) }} ~ {{ getFormatDateTime(chall.CHALL_EDD) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <-- footer 영역 -->
    <div class="footer">
      <button v-if="listTotalCnt > listCnt" class="morebtn" @click="showMore()">더보기</button>
    </div>

  </body>
</template>
  
<script>
import axios from 'axios';
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';


export default {
  name: 'MainSlider',
  components: {
    Splide,
    SplideSlide,
  },
  data() {
    return {
      moimList: [],
      myLikeList: [],
      active: 'all',
      listCnt: 9,
      listTotalCnt: 0,
      recommendMoimList: [], //추천 크루 
      challList: [],
      options: {
        // ------------------------배너
        type: 'fade',
        rewind: true,
        perPage: 1,
        autoplay: true,
        interval: 3000,
        pauseOnHover: false,
        arrows: false,
        dots: true,
        animatedDots: true,
        transition: 'fade',
        speed: 800,
      },
    }
  },
  computed: {
    user() {
      return this.$store.state.user.user;
    },
  },
  mounted() {
    this.getMoimList();
    this.getRecommendMoimList();
    this.getChallList();
  },
  methods: {
    getFormatDateTime(date) {
      return this.$formatDateTime(date)
    },
    async getChallList() {
      try {
        const response = await axios.get(`http://localhost:4000/moim/chall_main`);
        this.challList = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async getMoimTitle(moim_no) {
      const matchingMoim = this.moimList.find(moim => moim.MOIM_NO === moim_no);
      return matchingMoim ? matchingMoim.MOIM_TITLE : '크루 이름 없음';
    },
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
    goToChall(moim_no) {
      window.location.href = `http://localhost:8001/moimchall/${moim_no}`;
    },
    setActive(category) {
      this.active = category;
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
    async getMoimList(sortCaseNum) {
      try {
        const response = await axios.get(`http://localhost:4000/moim/moim_list/${sortCaseNum}`);
        this.moimList = response.data;
        this.listTotalCnt = this.moimList.length

        this.getLikeList();
      } catch (error) {
        console.error(error);
      }
    },
    async getRecommendMoimList() {
      if (this.user != '') {
        try {//추천 크루 가져오기
          const response = await axios.get(`http://localhost:4000/moim/recommend_moim_list/${this.user}`);
          this.recommendMoimList = response.data;

          this.getLikeList();
        } catch (error) {
          console.error(error);
        }
      }
    },
    showMore() {
      this.listCnt += 9;
      this.$router.push({ path: '/' })
    },
    getLoginCheck() {
      return this.$loginCheck(this.user);
    },
    alert(text) {
      this.$alert(text)
    },
    close() {
      const moim = document.getElementById('r-moim');
      if (moim != null) {
        moim.style.display = 'none';
      }
      //  moim.style.display = 'none';
    },
    open() {
      let moim = document.getElementById('r-moim');
      if (moim != null) {
        moim.style.display = 'block';
      }
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
    }
  }
}
</script>
  
<style scoped>
#r-moim {
  display: block;
}

.AllPosts-hr {
  margin: 0px 36px 10px 0;
  border: 1px solid #ebebeb;
}

.AllPosts-hr2 {
  margin: 0px 36px 40px 0;
  border: 1px solid #ebebeb;
}

.recommend-moim {
  height: 350px;
  border-bottom: 1px solid #E1E7F0;
  margin-bottom: 20px;
}

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
  /* 드래그 방지 코드 */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

body {
  padding: 0;
  margin: 0;
  font-family: 'Pretendard-Regular';
}

/* ---------------------------------------------------카테네비 */
.cate-nav {
  display: grid;
  /* cursor: pointer; */
}

.cate-nav .cate {
  list-style: none;
  margin: 30px 0 0 0;
}

.cate-nav .cate li {
  cursor: pointer;
}

[class|="col"] {
  background: #ffffff;
  width: auto;
  height: 32px;
  float: left;
  padding: 4px 20px 6px;
  margin: 0 8px 10px 0;
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

/* ---------------------------------------------------배너 */
#mainslider {
  margin: 20px 30px 0 0;
  display: grid;
}

.slider-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 16px;
  /* border: 1.5px solid #287eff; */
}

/* ---------------------------------------------------메인 */
.maincontent {
  display: flex;
  margin: 10px 30px 0 0;
}

.left,
.right {
  float: left;
}

.left {
  /* flex-direction: column; */
  width: 75%;
}

.left-card {
  position: relative;
  width: 30%;
  float: left;
  min-height: 290px;
  max-height: 290px;
  /* height: auto; */
  align-items: center;
  justify-content: space-between;
  margin: 0 3% 30px 0;
  border: 1.5px solid #E1E7F0;
  background-color: white;
  border-radius: 16px;
  background-color: #ffffff;
}

.imgbox {
  position: relative;
  width: 100%;
  height: 160px;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
}

.badge {
  position: absolute;
  z-index: 1;
  max-width: 32px;
  bottom: 8px;
  right: 7px;
}

.fakeimg {
  position: absolute;
  background: url(../assets/image-loading.png);
  top: 0;
  left: 0;
  width: 100%;
  height: 160px;
  overflow: hidden;
  object-fit: cover;
  /* border-radius: 16px 16px 0 0; */
}

.moim-img {
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.moim-img:hover {
  transform: scale(1.1);
  transition-duration: 0.3s;
}

.moim-img:not(:hover) {
  transform: scale(1);
  transition-duration: 0.3s;
}

.moim-parti {
  position: absolute;
  top: 175px;
  right: 8px;
  font-size: small;
  color: #7F7FD5;
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

.like p {
  color: #ff4747;
  text-align: center;
  /* background-color: white;
    border-radius: 8px;
    width: 20px;
    margin: -10px auto; */
}

.like .normal {
  color: #bbbbbb;

}

.left-card .text {
  padding: 16px 16px 10px 16px;
}

.text p {
  color: #797979;
  font-weight: bold;
  font-size: 16px;
  margin: 6px 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.text h2 {
  font-weight: 900;
  margin: 0px 0 6px;
  font-size: 18px;
  /* white-space: nowrap; */
  /* overflow: hidden; */
  /* text-overflow: ellipsis; */
  cursor: pointer;
  word-break: keep-all;
}

.text h2:hover {
  color: #86a8e7;
}

.text img {
  width: 30px;
  height: auto;
}

/* ---------------------------------------------------챌린지 */

.right {
  width: 25%;
  display: inline-table;
  border-left: 1px solid#E1E7F0;
  padding: 0 0 30px 0;
  /* border: 1.5px solid #287eff; */
}

.challdot {
  margin: 4px 0 0 14px;
}

.challdot img {
  width: 24px;
  float: left;
  margin-right: 4px;
}

.chall-list {
  padding: 0 20px;
}

.content {
  position: relative;
  max-width: 300px;
  margin-top: 20px;
  border-radius: 16px;
  border: 1.5px solid #E1E7F0;
}

.contentimg {
  position: relative;
  width: 100%;
  height: 160px;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
}

.contentimg img {
  display: inline-block;
  width: 100%;
  border-radius: 16px 16px 0 0;
}

.challtext {
  padding: 10px 10px 20px 10px;
  text-align: center;
}

.content .challtext p {
  padding-top: 8px;
  font-size: 12px;
  font-weight: bold;
  color: #FF4747;
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
}

.event-end-message p {
  color: white;
  font-size: 18px;
  font-weight: bold;
}

/* ---------------------------------------------------로딩?? */
.footer {
  position: relative;
  bottom: 0;
  width: 100%;
  text-align: center;
  /* background-color: rgba(0, 0, 0, 0.3); */
}

.morebtn {
  padding: 10px 80px;
  margin: 30px 0;
  border-radius: 30px;
  border: none;
  background-color: #86a8e7;
  color: #ffffff;
  font-family: 'Pretendard-Regular';
}

@media screen and (max-width: 992px) {
  .maincontent {
    margin: 30px 0px 0 0;
  }

  .left {
    width: 100%;
    margin: 0;
  }

  .right {
    display: none;
  }


  .morebtn {
    padding: 10px 60px;
    margin: 30px 0 30px 8%;
  }
}

@media screen and (max-width: 768px) {
  .maincontent {
    margin: 30px 30px 0 0;
  }

  .left-card {
    width: 100%;
    min-height: 260px;
    max-height: auto;
  }
}
</style>