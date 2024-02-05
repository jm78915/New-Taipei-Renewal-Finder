<script setup lang="ts">
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet/dist/leaflet.css';

import { useMapStore } from '@/stores/map';
import { useOAuthStore } from '@/stores/oAuth';
import L from 'leaflet';
import 'leaflet.markercluster';
import { onMounted, watch } from 'vue';

const mapStore = useMapStore();
const oAuthStore = useOAuthStore();

let currentCoordinateMarker: L.Marker | undefined;
//@ts-ignore
const markerClusterGroup = L.markerClusterGroup();

const handleGetCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition((position) => {
        const { map } = mapStore;

        const { latitude, longitude } = position.coords;

        if (map === undefined) {
            return;
        }

        map.setView([latitude, longitude], map.getZoom());

        mapStore.currentCoordinate = {
            latitude,
            longitude,
        };
    });
};

const setupMap = () => {
    mapStore.map = L.map('map');

    mapStore.map.setView(
        [mapStore.view.latitude, mapStore.view.longitude],
        mapStore.view.zoom,
    );

    mapStore.map.on('moveend', () => {
        if (mapStore.map === undefined) {
            return;
        }

        const { lat, lng } = mapStore.map.getCenter();

        mapStore.view.latitude = lat;
        mapStore.view.longitude = lng;
    });

    const tileLayer = L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            maxZoom: 19,
            attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        },
    );

    mapStore.map.addLayer(tileLayer);
    mapStore.map.addLayer(markerClusterGroup);

    handleGetCurrentPosition();
};

const refreshCurrentCoordinateMarker = () => {
    const { currentCoordinate } = mapStore;

    if (currentCoordinate === undefined) {
        return;
    }

    if (mapStore.map === undefined) {
        return;
    }

    if (currentCoordinateMarker !== undefined) {
        mapStore.map.removeLayer(currentCoordinateMarker);
    }

    currentCoordinateMarker = L.marker([
        currentCoordinate.latitude,
        currentCoordinate.longitude,
    ]);

    mapStore.map.addLayer(currentCoordinateMarker);

    currentCoordinateMarker.bindPopup(
        `
        <div style="display: flex; justify-content: space-around; width: 125px">
            <img src="${oAuthStore.googleProfile.picture}" width="50" />
            <img src="${oAuthStore.facebookProfile.picture}" width="50" />
        </div>
       `,
    );
};

watch(
    [
        () => mapStore.currentCoordinate,
        () => oAuthStore.googleProfile.picture,
        () => oAuthStore.facebookProfile.picture,
    ],
    () => {
        refreshCurrentCoordinateMarker();
    },
);

watch([() => mapStore.view.latitude, () => mapStore.view.longitude], () => {
    mapStore.fetchStops();
});

watch(
    () => mapStore.stops,
    (stops) => {
        if (stops === undefined) {
            return;
        }

        markerClusterGroup.clearLayers();

        stops.forEach((stop) => {
            const marker = L.marker([stop.latitude, stop.longitude], {
                title: stop.stop_name,
            }).bindPopup(stop.stop_name);

            markerClusterGroup.addLayer(marker);
        });
    },
);

watch(
    () => mapStore.polygonFeatures,
    (polygonFeatures) => {
        if (mapStore.map === undefined) {
            return;
        }

        polygonFeatures.forEach((feature) => {
            if (mapStore.map === undefined) {
                return;
            }

            const coordinates = feature.geometry.coordinates[0].map(
                ([longitude, latitude]) => {
                    return new L.LatLng(latitude, longitude);
                },
            );

            const polygon = L.polygon(coordinates);

            mapStore.map.addLayer(polygon);
        });
    },
);

onMounted(() => {
    setupMap();
    mapStore.fetchPolygonFeatures();
});
</script>

<template>
    <div id="map" class="h-full w-full"></div>
</template>
