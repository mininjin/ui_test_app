import { QUESTIONNAIRE_PATH } from "./../constants/api";
import { Questions } from "@/@types/schema/question";
import { calculateBranch } from "@/components/branches/calculateBranch";
import { getCameraId } from "@/libs/getCameraId";
import { isSkipped } from "@/libs/isSkipped";
import { increaseIncrement } from "@/libs/utils";
import { ActionTree } from "vuex";
import { State } from "./state";

export const actions: ActionTree<State, State> = {
  // 全調査データの取得
  async fetchQuestionnaires({ commit }) {
    const res = await fetch(QUESTIONNAIRE_PATH);
    const data = await res.json();
    commit("setQuestionnaires", data);
  },
  // 回答の設定
  async setQuestion({ state, commit, dispatch }, incremental: number) {
    let nextQuestionIndex = state.page.questionIndex + incremental;
    if (
      state.page.questionnaire &&
      nextQuestionIndex >= 0 &&
      nextQuestionIndex < state.page.questionnaire.questions.length
    ) {
      const questions = state.page.questionnaire.questions;
      const rawQuestion = state.page.questionnaire.questions[nextQuestionIndex];
      // スキップチェック
      const skipped = isSkipped(rawQuestion, questions);
      // スキップされたなら次のindexを設定
      if (skipped) {
        incremental = increaseIncrement(incremental);
        nextQuestionIndex = await dispatch("setQuestion", incremental);
      } else {
        // questionの設定
        let question: Questions | undefined = undefined;
        if (rawQuestion.type == "branch") {
          // Branchesの場合は分岐を計算
          const branch = calculateBranch(rawQuestion, questions);
          // 設問を設定
          const branchQuestion = rawQuestion.branches[branch];
          if (branchQuestion.type != "null") {
            question = branchQuestion;
          } else {
            // 次のindexへ
            incremental = increaseIncrement(incremental);
            // indexを設定
            nextQuestionIndex = await dispatch("setQuestion", incremental);
          }
        } else {
          // Questionsの場合
          question = rawQuestion;
        }
        // questionをcommit
        if (question) {
          commit("setQuestion", question);
          commit("setQuestionIndex", nextQuestionIndex);
        }
      }
    }
    return nextQuestionIndex;
  },
  // 使用したいカメラを選択
  async accessCamera({ commit }) {
    commit("setCameraId", await getCameraId());
  },
};
