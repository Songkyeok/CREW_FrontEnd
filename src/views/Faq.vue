<template>
  <div class="all">
    <div class="title">
      <div class="titledot">
        <img src="../assets/icon_dot.png">
      </div>
      <h3>자주 묻는 질문</h3>
    </div>

    <hr class="tophr">

    <div class="form">


      <div class="rating">
        <div class="gold">
          <img src="../assets/Badges/gold1.png">
          <img src="../assets/Badges/gold2.png">
          <img src="../assets/Badges/gold3.png">
          <h5>골드배지</h5>
        </div>

        <div class="silver">
          <img src="../assets/Badges/silver1.png">
          <img src="../assets/Badges/silver2.png">
          <img src="../assets/Badges/silver3.png">
          <h5>실버배지</h5>
        </div>

        <div class="bronze">
          <img src="../assets/Badges/bronze1.png">
          <img src="../assets/Badges/bronze2.png">
          <img src="../assets/Badges/bronze3.png">
          <h5>브론즈배지</h5>
        </div>
      </div>


      <div v-for="(item, index) in faq" :key="index" class="faq-item">
        <div class="faq-header" @click="toggleContent(index)">
          <h4 class="faq-title">{{ item.QNA_Q }}</h4>
          <label class="icon-label">
            <img v-if="!item.expanded" class="icon-img" src="../assets/icon_down.png" alt="Toggle Icon" />
            <img v-else class="icon-img" src="../assets/icon_up.png" alt="Toggle Icon" />
          </label>
        </div>

        <div class="faq-content" :class="{ 'show': item.expanded }">
          <div role="region">
            <div>
              <p class="faq-text" v-html="item.QNA_A.replace(/\n/g, '<br>')"></p>
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
      faq: [],
    };
  },
  mounted() {
    this.getFaq();
  },
  methods: {
    toggleContent(index) {
      // 선택한 faq 항목의 expanded 값을 토글
      this.faq[index].expanded = !this.faq[index].expanded;
    },
    async getFaq() {
      try {
        const response = await axios.get('http://localhost:4000/auth/faq');
        this.faq = response.data;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
  
<style scoped>
/* ---------------------------------------------------기본css */

* {
  /* 드래그 방지 코드 */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  /* 스크롤바 제거 코드 */
  -ms-overflow-style: none;
  scrollbar-width: none;
}

* ::-webkit-scrollbar {
  display: none;
  /* 크롬, 사파리, 오페라, 엣지 */
}

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
  color: #2b2b2b;
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
  margin: 30px 30px 0px 0;
  border: 2px solid #E1E7F0;
}

/* --------------------------------------------------- */
.rating {
  display: flex;
  justify-content: space-between;
  margin: 30px 0 10px 0;
}

.rating div {
  width: 100%;
  text-align: center;
  /* border: 1px solid red; */
}

.rating img {
  width: 16%;
  max-width: 60px;
  min-width: 30px;
  margin-right: 4%;
}

.rating h5 {
  text-align: center;
  margin-top: 4px;
  margin-right: 4%;
}

/* --------------------------------------------------- */
.form {
  margin: 0px 30px 0px 270px;
}

.faq-item {
  display: inline;
  border: 1px solid #ffffff;
  margin-bottom: 20px;
}

.faq-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background-color: #f3f5f8;
  padding: 10px;
}

.faq-title {
  margin: 0;
}

.icon-label {
  display: flex;
  align-items: center;
}

.icon-img {
  width: 24px;
  cursor: pointer;
  transition: transform 0.3s;
}

.faq-content {
  display: none;
  padding: 20px 10px;
  /* border: 1px solid #b700ff; */
}

.faq-content.show {
  display: block;
}

.faq-content p {
  font-family: 'Pretendard-Regular';
}

.faq-text {
  margin: 0;
}

@media (max-width: 992px) {
  .form {
    margin: 0px 30px 0px 100px;
  }
}
</style>