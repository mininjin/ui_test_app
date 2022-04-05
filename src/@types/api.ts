import { Questionnaire } from "./schema/questionnaire";

export type ResQuestionnaires = {
  questionnaires: Questionnaire[];
  title: string;
  explanation: string;
};
