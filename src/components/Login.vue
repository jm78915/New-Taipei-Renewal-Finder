<script setup lang="ts">
import { UserCircleIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { useOAuthStore } from '@/stores/oAuth.js';
import { ref } from 'vue';

const oAuthStore = useOAuthStore();

const isLoading = ref(false);

const login = async () => {
    try {
        isLoading.value = true;

        await oAuthStore.loginGoogle();
        await oAuthStore.loginFacebook();
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};
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

            <button
                class="mx-auto flex items-center justify-center gap-x-3 rounded-md border border-gray-100 bg-blue-500 px-9 py-3 text-xl font-bold text-white shadow-md transition-transform active:scale-90 disabled:cursor-wait disabled:bg-gray-500"
                :disabled="isLoading === true"
                @click="login"
            >
                <div>Log In</div>
                <ArrowPathIcon
                    v-if="isLoading === true"
                    class="h-7 w-7 animate-spin font-bold text-white"
                />
            </button>
        </div>
    </main>
</template>
