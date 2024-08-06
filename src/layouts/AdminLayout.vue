<template>
    <div class="admin-layout">
        <div class="hidden-admin-sidebar"></div>
        <AdminSideBar></AdminSideBar>
        <router-view class="admin-content"></router-view>
    </div>
</template>

<script>

import AdminSideBar from './AdminSideBar'

export default {
    components: {
        AdminSideBar
    }
}
</script>

<style scoped>
.hidden-admin-sidebar {
    position: absolute;
    top: 0;
    width: 150px;
    height: 700px;
    float: left;
    margin-right: 30px;
}

.admin-content {
    margin-left: 150px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}


</style>