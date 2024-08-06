<template>
    <div class="layout">
        <div class="hidden-sidebar"></div>
        <SideBar></SideBar>
        <router-view></router-view>
    </div>
</template>

<script>

import SideBar from './SideBar'

export default {
    components: {
        SideBar
    }
}
</script>

<style >
* {
    /* 스크롤바 제거 코드 */
    -ms-overflow-style: none;
    scrollbar-width: none;
}

*::-webkit-scrollbar {
    display: none;
    /* 크롬, 사파리, 오페라, 엣지 */
}

.hidden-sidebar {
    width: 240px;
    height: 700px;
    float: left;
    margin-right: 30px;
}

@media (max-width: 992px) {
    .hidden-sidebar {
        width: 70px;
    }
}
</style>