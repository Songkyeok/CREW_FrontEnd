<template>
  <div>
    <div class="title">
      <div class="titledot">
        <img src="../assets/icon_dot.png">
      </div>
      <h3>내 크루</h3>
    </div>

    <hr class="tophr">

    <div class="mymoimcard" v-if="moimList.length > 0">
      <div class="moim-card" v-for="(moim, index) in moimList" :key="index">
        <div class="imgbox">
          <img v-if="moim.MOIM_GRADE != 0" class="badge" :src="require(`../assets/Badges/${setGrade(moim.MOIM_GRADE)}`)" alt=".">
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
    <div v-else>가입된 크루가 없습니다.</div>

  </div>
</template>
  
<script>
import axios from 'axios';

export default {
  data() {
    return {
      moimList: [],
      myLikeList: [],
    };
  },
  computed: {
    user() {
      return this.$store.state.user.user;
    },
  },
  mounted() {
    this.getMoimList();
    this.getLikeList();
  },
  methods: {
    goToDetail(moim_no) {
      window.location.href = `http://localhost:8001/moimdetail/${moim_no}`;
    },
    setActive(category) {
      this.active = category;
    },
    async getMoimList() {
      try {
        const response = await axios.get(`http://localhost:4000/moim/my_moim_list/${this.user}`);
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
      try {
        const response = await axios.get(`http://localhost:4000/auth/like_list/${this.user}`);
        this.myLikeList = response.data;
        console.log(this.myLikeList)
      } catch (error) {
        console.error(error);
      }
    },
    getLoginCheck() {
      return this.$loginCheck(this.user);
    },
    alert(text) {
      this.$alert(text)
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
  /* 드래그 방지 코드 */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  font-family: 'Pretendard-Regular';
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

.tophr {
  margin: 30px 30px 30px 0;
  border: 2px solid #E1E7F0;
}

/* --------------------------------------------------- */

.mymoimcard {
  display: flow-root;
  height: 100%;
  margin: 0 30px 0;
  /* border: 1px solid #0066ff; */
}

.moim-card {
  position: relative;
  float: left;
  width: 31%;
  min-height: 270px;
  max-height: 270px;
  align-items: center;
  justify-content: space-between;
  margin: 0 3% 30px 0;
  border: 1.5px solid #E1E7F0;
  background-color: white;
  border-radius: 16px;
  background-color: #ffffff;
}

.mymoimcard .moim-card:nth-child(3n) {
  margin-right: 0px;
}

.imgbox {
  position: relative;
  width: 100%;
  height: 160px;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  cursor: pointer;
}


.badge {
    position: absolute;
    z-index: 1;
    max-width: 32px;
    bottom: 8px;
    right: 7px;
}


.moim-img:hover {
  transform: scale(1.1);
  transition-duration: 0.3s;
}

.moim-img:not(:hover) {
  transform: scale(1);
  transition-duration: 0.3s;
}

.fakeimg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url(../assets/image-loading.png);
  border-radius: 16px 16px 0 0;
}

.moim-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.moim-card .text {
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
  font-size: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.text h2:hover {
  color: #86a8e7;
}

.text img {
  width: 30px;
  height: auto;
}

@media screen and (max-width: 768px) {
  .moim-card {
    width: 100%;
  }

}
</style>
  