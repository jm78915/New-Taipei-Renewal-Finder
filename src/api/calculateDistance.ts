export interface Item {
    distance: number;
    id: number;
    is_tod: number;
    latitude: number;
    longitude: number;
    name: string;
    radius: number;
    stop_name: string;
}

export const calculateDistance = async (
    latitude: number,
    longitude: number,
) => {
    const response = await fetch(
        'https://enterprise.oakmega.ai/api/v1/server/xinbei/calc-distance',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lat: latitude,
                lng: longitude,
            }),
        },
    );

    if (response.status !== 200) {
        throw new Error('');
    }

    const json = (await response.json()) as Promise<{
        result: Item[];
        tod: boolean;
    }>;

    return json;
};
