<template>
    <main>
        <!-- comment box-->
        <CommentBox @postComment="refreshComment" />

        <br>

        <!-- latest comments -->
        <div class="max-w-screen-xl mx-auto bg-white p-8 rounded-lg shadow-2xl">
            <h2 class="text-3xl">最新留言</h2>
            <div class="mt-4 mb-2">
                <router-link to="/comments/all">
                    <a class="animate-pulse text-blue-500 text-lg hover:text-blue-900" @click="document.body.scrollTop = document.documentElement.scrollTop = 0;">查看全部 {{ totalComments }} 条留言</a>
                </router-link>
                </div>
            <el-divider content-position="right">最新留言列表</el-divider>
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
    </main>
</template>

<script setup>
import CommentBox from "./components/CommentBox.vue";
import CommentItem from "./components/CommentItem.vue";
import { onMounted, ref } from "vue";

const comments = ref([]);
const totalComments = ref(0);

async function getLatestComments() {
    const res = await fetch("/api/comment/latest");
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

async function refreshComment() {
    await getTotalCommentNum();
    await getLatestComments();
}

onMounted(() => {
    getTotalCommentNum();
    getLatestComments();
});

</script>

<style></style>