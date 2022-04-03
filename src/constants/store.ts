import { State } from "@/store/state";

export const PERSISTED_STATES: (keyof State)[] = [
  "questionnaires",
  "common",
  "page",
];

export const NO_QUESTIONNAIRES: State["questionnaires"] = {
  title: "設問がありません",
  explanation: "以下のボタンをクリックして再取得してください。",
  questionnaires: [],
};
