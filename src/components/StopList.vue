<script setup lang="ts">
import { type Item as DistanceItem } from '@/api/calculateDistance';
import { useMapStore } from '@/stores/map';
import { ArrowPathIcon } from '@heroicons/vue/24/outline';

const mapStore = useMapStore();

defineProps<{
    stops: DistanceItem[] | undefined;
}>();

const focus = (stop: DistanceItem) => {
    if (mapStore.map === undefined) {
        return;
    }

    mapStore.map.setView([stop.latitude, stop.longitude]);
};
</script>

<template>
    <template v-if="mapStore.stops !== undefined">
        <div
            v-for="stop of stops"
            :key="stop.id"
            class="flex w-full cursor-pointer items-center justify-between rounded-md bg-white px-4 py-5 shadow-sm"
            @click="focus(stop)"
        >
            <div class="truncate">
                {{ stop.stop_name }}
            </div>

            <div class="flex-shrink-0 text-right text-2xl text-blue-400">
                {{ stop.distance }} km
            </div>
        </div>
    </template>

    <div
        v-if="mapStore.stops === undefined"
        class="flex w-full items-center justify-center"
    >
        <ArrowPathIcon class="h-7 w-7 animate-spin" />
    </div>
</template>
