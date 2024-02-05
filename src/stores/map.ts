import {
    calculateDistance,
    type Item as DistanceItem,
} from '@/api/calculateDistance';
import { getGeolocation, type Feature } from '@/api/getGeolocation';
import L from 'leaflet';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

const DEFAULT_COORDINATE = {
    latitude: 24.972523519373716,
    longitude: 121.44411563873292,
};
const DEFAULT_ZOOM = 14;

export const useMapStore = defineStore('map', () => {
    const map = ref<L.Map>();

    const view = reactive({
        latitude: DEFAULT_COORDINATE.latitude,
        longitude: DEFAULT_COORDINATE.longitude,
        zoom: DEFAULT_ZOOM,
    });
    const currentCoordinate = ref<{
        latitude: number;
        longitude: number;
    }>();

    const stops = ref<DistanceItem[]>();
    const polygonFeatures = ref<Feature[]>([]);

    const fetchStops = async () => {
        try {
            const json = await calculateDistance(view.latitude, view.longitude);

            stops.value = json.result;
        } catch {}
    };

    const fetchPolygonFeatures = async () => {
        try {
            const json = await getGeolocation('tucheng.json');

            polygonFeatures.value = json.result.features;
        } catch (error) {}
    };

    return {
        map,
        view,
        currentCoordinate,
        stops,
        polygonFeatures,
        fetchStops,
        fetchPolygonFeatures,
    };
});
