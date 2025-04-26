import db from '../utils/db.util';

export default {
    getQuestions: async (landmark_id: string) => {
        const questions = await db('question')
            .where('landmark_id', landmark_id)
            .select('*');

        if (questions.length === 0) return null;

        const questionIds = questions.map(q => q.question_id);

        const answers = await db('answer')
            .whereIn('question_id', questionIds)
            .select('*');

        const questionMap = questions.map(q => ({
            ...q,
            answers: answers.filter(a => a.question_id === q.question_id)
        }));

        return questionMap;
    }
}