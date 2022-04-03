import { Branches } from "./branches";
import { Questions } from "./question";

export type Questionnaire = {
	questionnaireId: number;
	title: string;
	explanation: string;
	questions: (Questions | Branches)[];
	answered?: boolean;
};
