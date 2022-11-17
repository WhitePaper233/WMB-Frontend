<template>
    <!-- reply -->
    <div>
        <div class="flex mt-4">
            <img :src="avatar" alt="" class="w-12 h-12 mr-4 rounded-full">
            <div>
                <div class="flex">
                    <div class="flex-none">
                        <p>{{ nickname }}</p>
                    </div>
                    <div class="flex-none w-2"></div>
                    <div class="flex-none">
                        <a class="text-gray-400" :href="emailLink">{{ emailAddress }}</a>
                    </div>
                    <div class="flex-none w-2"></div>
                    <div class="flex-none">
                        <p class="text-sm animate-pulse text-blue-500">#{{ replyID }}</p>
                    </div>
                </div>
                <div class="flex">
                    <div class="flex-initial">
                        <p class="text-gray-400 text-sm pt-0.5">{{ time }}</p>
                    </div>
                </div>
            </div>
        </div>
        <p class="text-gray-800 pt-0.5 pl-16">{{ content }}</p>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

let prop = defineProps(
    [
        "nickname",
        "avatar",
        "emailAddress",
        "time",
        "replyID",
        "content",
    ],
)

const emailLink = ref("");

function formatEmailLink() {
    emailLink.value = "mailto:" + prop.emailAddress;
}

onMounted(() => {
    formatEmailLink();
})
</script>

<style>

</style>