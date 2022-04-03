import { Questionnaire } from "@/@types/schema/questionnaire";
import { APIError, ResQuestionnaires } from "@/@types/api";
import { Questions } from "@/@types/schema/question";

export type State = {
  questionnaires: ResQuestionnaires;
  page: {
    questionnaireIndex: number;
    questionIndex: number;
    questionnaire?: Questionnaire;
    question?: Questions;
  };
  common: {
    cameraId?: string;
  };
  nowLoading: boolean;
  error?: APIError;
};

export const initialState = (): State => ({
  questionnaires: {
    questionnaires: [],
    title: "テストアンケート",
    explanation: "これはテストアンケートです。",
  },
  page: {
    questionnaireIndex: 0,
    questionIndex: 0,
  },
  common: {},
  nowLoading: false,
});

export const state: State = initialState();
