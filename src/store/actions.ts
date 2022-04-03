import { APIError } from "@/@types/api";
// import { ReqAnswer } from "@/@types/api";
import { Questions } from "@/@types/schema/question";
import { calculateBranch } from "@/components/branches/calculateBranch";
import { _fetch } from "@/libs/api";
import { getCameraId } from "@/libs/getCameraId";
import { isSkipped } from "@/libs/isSkipped";
import { blobToBase64, increaseIncrement } from "@/libs/utils";
import { ActionTree } from "vuex";
import { State } from "./state";

export const actions: ActionTree<State, State> = {
  // 全調査データの取得
  async fetchQuestionnaires({ commit }) {
    commit("setNowLoading", true);
    const { error, response } = await _fetch({
      path: "/questionnaires",
      method: "GET",
      params: {},
      body: null,
    });
    //
    if (error == undefined) {
      commit("setQuestionnaires", response);
    } else {
      commit("setError", error);
    }
    commit("setNowLoading", false);
  },
  // // データのPOST
  // async postData({ state, commit }) {
  //   commit("setNowLoading", true);
  //   // リクエストボディ
  //   const body: ReqAnswer = { data: state.questionnaires.questionnaires };
  //   const { error } = await _fetch({
  //     path: "/answer",
  //     method: "POST",
  //     params: {},
  //     body,
  //   });
  //   if (error != undefined) {
  //     commit("setError", error);
  //   }
  //   commit("setNowLoading", false);
  // },
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
  async fetchImage({ commit }, key: string): Promise<string | void> {
    try {
      commit("setNowLoading", true);
      const res = await fetch(key);
      const blob = await res.blob();
      return (await blobToBase64(blob)) as string;
    } catch (err) {
      console.error(err);
      const error: APIError = { status: 1000 };
      commit("setError", error);
    } finally {
      commit("setNowLoading", false);
    }
  },
};
