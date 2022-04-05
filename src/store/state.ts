import { Questionnaire } from "@/@types/schema/questionnaire";
import { ResQuestionnaires } from "@/@types/api";
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
});

export const state: State = initialState();
