<template>
    <!-- comment -->
    <div>
        <div>
            <div class="flex mt-4">
                <img :src="avatar" alt="" class="w-12 h-12 mr-4 rounded-full">
                <div>
                    <div class="flex">
                        <div class="flex-none">
                            <p>{{ nickname }}</p>
                        </div>
                        <div class="flex-none w-2" v-if="emailAddress != ''"></div>
                        <div class="flex-none">
                            <a class="text-gray-400" :href="emailLink">{{ emailAddress }}</a>
                        </div>
                        <div class="flex-none w-2"></div>
                        <div class="flex-none">
                            <button @click="openCommentDetail = true">
                                <a class="text-sm animate-pulse text-blue-500 hover:text-blue-800">#{{ commentID }}</a>
                            </button>
                        </div>
                    </div>
                    <div class="flex">
                        <div class="flex-initial">
                            <p class="text-gray-400 text-sm pt-0.5">发布于 {{ time }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <p class="text-gray-800 pt-0.5 pl-16">{{ content }}</p>
            <div class="grid mt-1">
                <div class="pl-14">
                    <div class="flex">
                        <button type="reply"
                        class="px-1.5 qinline-flex justify-center rounded-md border border-transparent bg-white text-base text-blue-500 font-medium hover:text-blue-900"
                        @click="showReplyBox = !showReplyBox"
                        >{{ showReplyBox ? "收起回复" : "回复" }}</button>
                        <div class="w-4"></div>
                        <button
                        @click="openCommentDetail = true"
                        type="detail"
                        class="px-1.5 qinline-flex justify-center rounded-md border border-transparent bg-white text-base text-blue-500 font-medium hover:text-blue-900"
                        >查看详情</button>
                    </div>
                    <transition
                    enter-active-class="transition duration-80 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-100 ease-in"
                    leave-from-class="transform scale-80 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                    >
                        <ReplyBox v-if="showReplyBox" @postReply="refreshReply" :commentID="prop.commentID" />
                    </transition>
                </div>
            </div>
        </div>

        <!-- reply commet -->
        <div class="pl-8 border-l-2 border-gray-200">
            <div v-if="replies.length > 0">
                <div v-if="!showAllReplies" v-for="reply in replies.slice(0, 3)" :key="reply.reply_id">
                    <ReplyItem
                    :replyID="reply.reply_id"
                    :avatar="reply.avatar"
                    :nickname="reply.nickname"
                    :time="reply.time"
                    :emailAddress="reply.email_address"
                    :content="reply.content"
                    :commentPage="reply.comment_page"
                    />
                </div>
                <div v-if="showAllReplies" v-for="reply in replies" :key="reply.reply_id">
                    <ReplyItem
                    :replyID="reply.reply_id"
                    :avatar="reply.avatar"
                    :nickname="reply.nickname"
                    :time="reply.time"
                    :emailAddress="reply.email_address"
                    :content="reply.content"
                    :commentPage="reply.comment_page"
                    />
                </div>
            </div>
        </div>
        <div class="flex-initial pt-3" v-if="totalReplies > 3 && !showAllReplies">
            <button type="reply"
                class="inline-flex justify-center rounded-md border border-transparent bg-white text-base text-blue-500 font-medium hover:text-blue-900"
                @click="unfold"
                >展开共 {{ totalReplies }} 条回复</button>
        </div>
        <div v-if="showAllReplies">
            <div>
                <el-pagination
                :page-size="5"
                layout="prev, pager, next"
                :total="totalReplies"
                :hide-on-single-page="true"
                @current-change="changeReplyPage"
                />
            </div>
        </div>
    </div>

    <el-dialog v-model="openCommentDetail" title="评论详情" width="80%">
        <div class="flex">
            <img :src="avatar" alt="" class="w-12 h-12 mr-4 rounded-full">
            <div>
                <div class="flex">
                    <div class="flex-none">
                        <p>{{ nickname }}</p>
                    </div>
                    <div class="flex-none w-2" v-if="emailAddress != ''"></div>
                    <div class="flex-none">
                        <a class="text-gray-400" :href="emailLink">{{ emailAddress }}</a>
                    </div>
                    <div class="flex-none w-2"></div>
                    <div class="flex-none">
                        <button @click="openCommentDetail = true">
                            <a class="text-sm animate-pulse text-blue-500 hover:text-blue-800">#{{ commentID }}</a>
                        </button>
                    </div>
                </div>
                <div class="flex">
                    <div class="flex-initial">
                        <p class="text-gray-400 text-sm pt-0.5">发布于 {{ time }}</p>
                    </div>
                </div>
            </div>
        </div>
        <p class="text-gray-800 pt-0.5 pl-16">{{ content }}</p>

        <!-- reply commet -->
        <div class="pl-8 border-l-2 border-gray-200">
            <div v-if="replies.length > 0" v-infinite-scroll="loadDetailPage">
                <div v-for="reply in detailedReplies" :key="reply.reply_id">
                    <ReplyItem
                    :replyID="reply.reply_id"
                    :avatar="reply.avatar"
                    :nickname="reply.nickname"
                    :time="reply.time"
                    :emailAddress="reply.email_address"
                    :content="reply.content"
                    :commentPage="reply.comment_page"
                    />
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ReplyItem from './ReplyItem.vue';
import ReplyBox from './ReplyBox.vue';

const replies = ref([]);
const detailedReplies = ref([]);
const showReplyBox = ref(false);
const showAllReplies = ref(false);
const totalReplies = ref(0);
const openCommentDetail = ref(false);
const emailLink = ref("");
const currentReplyPage = ref(1);
const currentDetailPage = ref(1);

const loadDetailPage = () => {
    if (currentDetailPage.value < (totalReplies.value / 5 + 1)) {
        getDetailedRepliesByPage();
        currentDetailPage.value += 1;
    }
}

let prop = defineProps(
    [
        "nickname",
        "avatar",
        "emailAddress",
        "time",
        "commentID",
        "content",
    ],
);

function formatData() {
    if (prop.emailAddress != "") {
        emailLink.value = "mailto:" + prop.emailAddress
    }
}

async function getUnfoldedReplies() {
    const res = await fetch("/api/reply/unfolded/" + prop.commentID);
    const data = (await res.json()).data;
    data.forEach((item) => {
        item["avatar"] = "/src/assets/avatars/avatar" + item["avatar"] + ".jpg"
    });
    replies.value = data;
}

async function getTotalReplyNum() {
    const res = await fetch("/api/reply/count/" + prop.commentID);
    const data = (await res.json()).data;
    totalReplies.value = data.count;
}

async function getRepliesByPage() {
    const res = await fetch("/api/reply/query/" + prop.commentID + "/page/" + currentReplyPage.value);
    const data = (await res.json()).data;
    data.forEach((item) => {
        item["avatar"] = "/src/assets/avatars/avatar" + item["avatar"] + ".jpg"
    });
    replies.value = data;
}

async function getDetailedRepliesByPage() {
    const res = await fetch("/api/reply/query/" + prop.commentID + "/page/" + currentDetailPage.value);
    const data = (await res.json()).data;
    data.forEach((item) => {
        item["avatar"] = "/src/assets/avatars/avatar" + item["avatar"] + ".jpg"
    });
    detailedReplies.value.push(...data);
}

function refreshReply() {
    getUnfoldedReplies();
    getTotalReplyNum();
    showReplyBox.value = false;
}

function changeReplyPage(page) {
    currentReplyPage.value = page;
    getRepliesByPage();
}

function unfold() {
    showAllReplies.value = !showAllReplies.value; 
    getRepliesByPage();
}

onMounted(() => {
    getUnfoldedReplies();
    getTotalReplyNum();
    formatData();
});
</script>

<style></style>