<template>
    <div class="border rounded-md">
        <div class="mx-4 my-4">
            <form action="#" method="POST" @submit="openVerification">
                <div class="grid grid-cols-6 gap-6">
                    <div class="col-span-6 sm:col-span-3">
                        <label for="nickname" class="block text-sm font-medium text-gray-700">昵称</label>
                        <input @input="checkNicknameLength" @click="resetNicknameStyle" type="text" name="nickname"
                            id="nickname" placeholder="在此输入您的昵称" autocomplete="name" v-model="nickname"
                            :class="nicknameStyle">
                    </div>

                    <div class="col-span-6 sm:col-span-3">
                        <label for="email" class="block text-sm font-medium text-gray-700">邮箱（可选）</label>
                        <input @input="checkEmailLength" @click="resetEmailStyle" type="text" name="email" id="contact"
                            placeholder="在此填写邮箱" autocomplete="email" v-model="email" :class="emailStyle">
                    </div>
                </div>

                <br>

                <div>
                    <label for="content" class="block text-sm font-medium text-gray-700">回复 ( {{ content.length }} /
                        1000 字 ) </label>
                    <div class="mt-1">
                        <textarea @input="checkContentLength" @click="resetContentStyle" id="content" name="content"
                            rows="5" v-model="content" :class="contentStyle" placeholder="在此输入您的回复"></textarea>
                    </div>
                </div>

                <br>

                <fieldset>
                    <button type="submit"
                        class="mr-1 inline-flex font-medium items-center px-4 py-2 leading-6 text-md shadow rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition ease-in-out duration-150">
                        <svg v-if="isSubmitted" class="animate-spin h-4 w-4 mr-3 text-white" viewBox="0 0 24 24">
                            <path class="opacity-90" fill="white"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        {{ isSubmitted ? "正在进行人机验证" : "回复" }}
                    </button>

                    <button @click="clearForm" type="reset"
                        class="ml-1 inline-flex justify-center items-center rounded-md border border-transparent bg-white py-2 px-4 text-base font-medium hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200 focus:ring-offset-1">清空
                    </button>
                </fieldset>
            </form>
        </div>

        <TransitionRoot appear :show="isSubmitted" as="template">
            <Dialog as="e-dialog" @close="closeVerification" class="relative z-10">
                <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0"
                    enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                    <div class="fixed inset-0 bg-black bg-opacity-25" />
                </TransitionChild>

                <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                            enter-to="opacity-100 scale-100" leave="duration-200 ease-in"
                            leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
                            <DialogPanel
                                class="w-full max-w-md transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                                    你需要通过人机验证才可以提交回复
                                </DialogTitle>
                                <div class="mt-1">
                                    <p class="text-sm text-gray-500">
                                        点击右图以刷新验证码
                                    </p>
                                </div>

                                <div class="mt-2 grid grid-cols-8 gap-6">
                                    <input type="text" name="captcha" id="captcha" placeholder="输入右图中的字母和数字"
                                        v-model="captchaAnswer"
                                        class="col-span-6 sm:col-span-5 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-lg">
                                    <img @click="fetchCaptcha" :src="captchaBase64" alt="captcha"
                                        class="col-span-6 sm:col-span-3 rounded-md border">
                                </div>

                                <p class="text-sm text-red-500 mt-1" v-if="ifFailed">
                                    验证码错误，请重试
                                </p>

                                <div class="mt-3">
                                    <fieldset>
                                        <button type="button"
                                            class="inline-flex justify-center rounded-md border border-transparent bg-emerald-600 py-1 px-5 mr-2 text-base font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:ring-offset-1"
                                            @click="handlePostReply">
                                            验证
                                        </button>
                                        <button type="button"
                                            class="inline-flex justify-center rounded-md border border-transparent bg-white py-1 px-5 text-base font-medium hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200 focus:ring-offset-1"
                                            @click="closeVerification">
                                            取消
                                        </button>
                                    </fieldset>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue';
import { ElMessage } from 'element-plus';


const isSubmitted = ref(false);
const ifFailed = ref(false);
const captchaID = ref("");
const captchaBase64 = ref("");
const captchaAnswer = ref("");
const nickname = ref("");
const email = ref("");
const content = ref("");


const nicknameStyle = ref("mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm");
const emailStyle = ref("mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm");
const contentStyle = ref("mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm");


let prop = defineProps(["commentID"]);
let emit = defineEmits(["postReply"]);


function clearForm() {
    ElMessage({
    message: '已清空评论信息',
    type: 'info',
    });
    nickname.value = "";
    email.value = "";
    content.value = "";
}

function resetNicknameStyle() {
    nicknameStyle.value = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm";
}

function resetEmailStyle() {
    emailStyle.value = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm";
}

function resetContentStyle() {
    contentStyle.value = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm";
}

function checkNicknameLength() {
    if (nickname.value.length > 10) {
        nickname.value = nickname.value.slice(0, 10);
        ElMessage({
            message: '昵称最长为 10 字符',
            type: 'warning',
        });
    }
}

function checkEmailLength() {
    if (email.value.length > 32) {
        email.value = email.value.slice(0, 32);
        ElMessage({
            message: '邮箱最长为 32 字符',
            type: 'warning',
        });
    }
}

function checkContentLength() {
    if (content.value.length > 1000) {
        content.value = content.value.slice(0, 1000);
        ElMessage({
            message: '回复内容最长为 1000 字符',
            type: 'warning',
        });
    }
}

function postCheckInput() {
    var retValue = true;
    var emailRE=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;

    if (nickname.value == "") {
        nicknameStyle.value = "mt-1 block w-full rounded-md border-red-500 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm";
        ElMessage({
            message: '请输入您的昵称',
            type: 'error',
        });
        retValue = false;
    }
    if (email.value != "" && !emailRE.test(email.value)) {
        emailStyle.value = "mt-1 block w-full rounded-md border-red-500 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm";
        ElMessage({
            message: '请输入正确的邮箱地址',
            type: 'error',
        });
        retValue = false;
    }
    if (content.value == "") {
        contentStyle.value = "mt-1 block w-full rounded-md border-red-500 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm";
        ElMessage({
            message: '回复内容不能为空',
            type: 'error',
        });
        retValue = false;
    }

    return retValue
}

function closeVerification() {
    ifFailed.value = false;
    isSubmitted.value = false;
}

function openVerification(e) {
    e.preventDefault();
    if (postCheckInput()) {
        fetchCaptcha();
        isSubmitted.value = true;
    }
}

async function fetchCaptcha() {
    const res = await fetch("/api/captcha/new");
    const data = (await res.json()).data;
    captchaID.value = data.id;
    captchaBase64.value = data.bs64;
}

async function handlePostReply() {
    const res = await fetch(
        "/api/reply/new",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "captcha_verify_data": {
                    "id": captchaID.value,
                    "answer": captchaAnswer.value,
                },
                "reply_data": {
                    "comment_id": prop.commentID,
                    "nickname": nickname.value,
                    "email": email.value,
                    "content": content.value,
                },
            }),
        },
    );

    if (res.status != 200) {
        ifFailed.value = true;
        fetchCaptcha();
    } else {
        captchaAnswer.value = "";
        nickname.value = "";
        email.value = "";
        content.value = "";
        emit("postReply");
        isSubmitted.value = false;
        ElMessage({
            message: '回复成功！',
            type: 'success',
        });
    }
}
</script>

<style></style>