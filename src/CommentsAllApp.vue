<template>
    <main>
        <!-- breadcrumb -->
        <div class="max-w-screen-xl mx-auto bg-white p-6 rounded-lg shadow-xl">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item class="text-lg" :to="{ path: '/comments' }">留言板</el-breadcrumb-item>
                <el-breadcrumb-item class="text-lg">全部留言</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <!-- latest comments -->
        <div class="max-w-screen-xl mx-auto bg-white p-8 rounded-lg shadow-xl my-4">
            <h2 class="text-3xl">全部留言</h2>
            <el-divider content-position="right">留言列表</el-divider>
            <div>
                <!-- comment -->
                <div v-for="comment in comments" :key="comment.comment_id">
                    <CommentItem
                    :commentID="comment.comment_id"
                    :avatar="comment.avatar"
                    :nickname="comment.nickname"
                    :time="comment.time"
                    :emailAddress="comment.email_address"
                    :content="comment.content"
                    />
                    <div v-if="comment.comment_id != (totalComments - 4)">
                        <el-divider border-style="dotted" />
                    </div>
                </div>
            </div>
        </div>

        <!-- pagination -->
        <div class="max-w-screen-xl mx-auto bg-white p-6 rounded-lg shadow-xl" >
            <el-pagination
            class="justify-center"
            v-model:current-page="currentPage"
            :page-size="10"
            layout="prev, pager, next"
            :total="totalComments"
            @current-change="handlePageChange"
            />
        </div>
    </main>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import CommentItem from "./components/CommentItem.vue";
import { onMounted, ref } from "vue";

const comments = ref([]);
const totalComments = ref(0);
const currentPage = ref(1);

async function getComments() {
    const res = await fetch("/api/comment/query/page/" + currentPage.value);
    const data = (await res.json()).data;
    data.forEach((item) => {
        item["avatar"] = "/src/assets/avatars/avatar" + item["avatar"] + ".jpg"
    });
    comments.value = data;
}

async function getTotalCommentNum() {
    const res = await fetch("/api/comment/count");
    const data = (await res.json()).data;
    totalComments.value = data.count
}

function handlePageChange(page) {
    currentPage.value = page;
    getComments();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
}

onMounted(() => {
    getTotalCommentNum();
    getComments();
});

</script>

<style></style>