import db from '../utils/db.util';

export default {
    getLandmarkById: async (landmark_id: string) => {
        const landmark = await db('landmark')
            .where('landmark.landmark_id', landmark_id)
            .first();

        if (!landmark) return null;

        return landmark;
    },

    getLandmarksByProvinceId: async (province_id: string) => {
        const landmarks = await db('landmark')
            .where('landmark.province_id', province_id);

        if (landmarks.length === 0) return [];

        return landmarks;
    }

}