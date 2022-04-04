import { APIError, ResQuestionnaires } from "@/@types/api";
import { Questions } from "@/@types/schema/question";
import { MutationTree } from "vuex";
import { State } from "./state";

export type AnswerPayload = { data: any; answered: boolean };

export const mutations: MutationTree<State> = {
  //
  setCameraId: (state, id: string) => (state.common.cameraId = id),
  //
  setNowLoading: (state, nowLoading: boolean) =>
    (state.nowLoading = nowLoading),
  //
  setError: (state, error: APIError) => (state.error = error),
  // 全調査データの設定
  setQuestionnaires: (state, questionnaires: ResQuestionnaires) =>
    (state.questionnaires = questionnaires),
  // ページ情報の設定系
  setQuestionnaireIndex: (state, questionnaireIndex) => {
    const prevIndex = state.page.questionnaireIndex;
    if (prevIndex != questionnaireIndex) {
      state.page.question = undefined;
      state.page.questionIndex = 0;
    }
    state.page.questionnaireIndex = questionnaireIndex;
    state.page.questionnaire =
      state.questionnaires.questionnaires[questionnaireIndex];
  },
  setQuestionIndex: (state, questionIndex: number) =>
    (state.page.questionIndex = questionIndex),
  setQuestion: (state, question: Questions) => (state.page.question = question),
  // questionの回答の設定
  setAnswer(state, payload: AnswerPayload) {
    if (state.page.question && state.page.questionnaire) {
      state.page.question.answer = payload.data;
      state.page.question.answered = payload.answered;
      const question =
        state.page.questionnaire.questions[state.page.questionIndex];
      if (question.type == "branch") {
        question.answered = payload.answered;
      }
    }
  },
  // questionnaireのansweredフラグを設定
  setAnswered(state, answered) {
    if (state.page.questionnaire) {
      state.page.questionnaire.answered = answered;
    }
  },
};
