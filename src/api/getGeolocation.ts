interface Result {
    crs: CRS;
    features: Feature[];
    name: string;
    type: string;
}

interface CRS {
    properties: CRSProperties;
    type: string;
}

interface CRSProperties {
    name: string;
}

export interface Feature {
    geometry: Geometry;
    properties: FeatureProperties;
    type: FeatureType;
}

interface Geometry {
    coordinates: Array<Array<number[]>>;
    type: GeometryType;
}

enum GeometryType {
    Polygon = 'Polygon',
}

interface FeatureProperties {
    SHAPE_Area: number;
    TxtMemo: TxtMemo;
    分區: LandUseType;
}

enum TxtMemo {
    乙工 = '乙工',
    住一 = '住一',
    住二 = '住二',
    商二 = '商二',
    市六 = '市六',
}

enum LandUseType {
    乙種工業區 = '乙種工業區',
    市場用地 = '市場用地',
    第一種住宅區 = '第一種住宅區',
    第二種住宅區 = '第二種住宅區',
    第二種商業區 = '第二種商業區',
}

enum FeatureType {
    Feature = 'Feature',
}

export const getGeolocation = async (directory: string) => {
    const response = await fetch(
        'https://enterprise.oakmega.ai/api/v1/server/xinbei/geolocation-json?directory=' +
            directory,
    );

    if (response.status !== 200) {
        throw new Error('');
    }

    const json = (await response.json()) as Promise<{
        result: Result;
    }>;

    return json;
};
