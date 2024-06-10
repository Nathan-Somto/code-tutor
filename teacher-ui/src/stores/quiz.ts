// stores/quizStore.ts
import { defineStore } from 'pinia'

export type QuizType = "MULTIPLE_CHOICE" | "COMPLETE_SEQUENCE" | "MATCHING_PAIRS";

export type MCQ = {
    question: string;
    answer: string;
    options: string[];
}

export type Quiz = {
    quizType: QuizType;
    question?: string;
    answer: string;
    options: string[];
}

type QuizStoreState = {
    quizzes: Quiz[];
}

export const useQuizStore = defineStore('quizStore', {
    state: (): QuizStoreState => ({
        quizzes: []
    }),
    actions: {
        addQuiz(quiz: Quiz) {
            this.quizzes.push(quiz);
        },
        publishQuizzes() {
            // logic to handle the publishing of quizzes
            console.log('Publishing quizzes', this.quizzes);
            this.quizzes = [];
        }
    }
});
