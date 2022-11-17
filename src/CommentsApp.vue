<template>
    <main>
        <!-- nav placeholder -->
        <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div class="relative flex h-16 items-center justify-between"></div>
        </div>
        <!-- bg -->
        <div class="p-4 bg-green-50 min-h-screen">
            <router-view/>
        </div>
        <!-- Nav -->
        <Nav />
    </main>
</template>

<script setup>
import Nav from "./components/CommentNav.vue";
</script>

<style></style>