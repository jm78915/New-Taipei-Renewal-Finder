<script setup lang="ts">
import Login from '@/components/Login.vue';
import Map from '@/components/Map.vue';
import StopList from '@/components/StopList.vue';
import { useMapStore } from '@/stores/map';
import { computed, onMounted, ref } from 'vue';

const mapStore = useMapStore();

const keyword = ref('');

const stops = computed(() => {
    if (mapStore.stops === undefined) {
        return undefined;
    }

    return mapStore.stops.filter(
        ({ stop_name }) => stop_name.includes(keyword.value) === true,
    );
});

onMounted(() => {
    mapStore.fetchStops();
});
</script>

<template>
    <main class="flex h-screen flex-col bg-gray-100 p-0 md:flex-row">
        <Login />

        <div
            class="h-1/3 w-full flex-shrink-0 md:order-1 md:h-full md:flex-shrink"
        >
            <Map />
        </div>

        <div
            class="flex h-2/3 flex-shrink-0 flex-col gap-y-2 px-3 py-1 md:h-full md:w-96"
        >
            <input
                v-model="keyword"
                type="text"
                class="border border-gray-200 px-3 py-1"
                placeholder="請輸入您要查詢的地址"
            />

            <div class="flex h-full flex-col gap-y-2 overflow-y-auto">
                <StopList :stops="stops" />
            </div>
        </div>
    </main>
</template>
