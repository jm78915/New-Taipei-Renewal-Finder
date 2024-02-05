<script setup lang="ts">
import { useOAuthStore } from '@/stores/oAuth.js';
import { ArrowPathIcon, UserCircleIcon } from '@heroicons/vue/24/outline';
import { computed, onMounted, watch } from 'vue';

const oAuthStore = useOAuthStore();

const isLoading = computed(() => {
    return (
        oAuthStore.googleProfile.picture === undefined &&
        oAuthStore.facebookProfile.picture === undefined
    );
});

const handleLogin = async () => {
    oAuthStore.loginGoogle();
};

watch(
    () => oAuthStore.googleProfile.picture,
    (picture) => {
        if (picture !== '') {
            oAuthStore.loginFacebook();
        }
    },
);

onMounted(() => {
    handleLogin();
});
</script>

<template>
    <main
        v-if="
            oAuthStore.googleProfile.picture === '' ||
            oAuthStore.facebookProfile.picture === ''
        "
        class="absolute z-[2000] flex h-screen w-screen items-center justify-center bg-black/85"
    >
        <div
            class="felx flex-col items-center justify-center rounded-md bg-white px-10 py-3"
        >
            <div class="flex justify-center">
                <UserCircleIcon class="h-40 w-40" />
            </div>

            <div
                id="login-button"
                class="flex w-full items-center justify-center text-2xl"
            >
                <div>Log In...</div>
                <ArrowPathIcon
                    v-if="isLoading === true"
                    class="h-5 w-5 animate-spin font-bold"
                />
            </div>
        </div>
    </main>
</template>
