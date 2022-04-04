import { State } from "@/store/state";

export const APP_NAME = "UIテストアプリ";
export const COPYRIGHT = "2022 ©︎ 0ta Utan";
export const ROUTE = {
  HOME: "/",
  INPUT_TOP: "/input",
  INPUT_INPUT: "/input/input",
  INPUT_END: "/input/end",
  INPUT_MODIFY: "/input/modify",
};
export const STORAGE_PATHS: (keyof State)[] = ["questionnaires", "common", "page"];
export const ERROR_MESSAGE_TIME = 3000;
export const MAX_INPUT_LENGTH = 255;
export const MAX_TEXTAREA_LENGTH = 1000;
export const DEFAULT_TIME_STEP = 1;
export const DEFAULT_CHECKBOX_MSG = "日時入力が不可";
export const DATE_TIME_SPLITTER = " ";
export const ZIP_CODE_LENGTH = 7;
export const ZIP_CODE_BAR = "-";
export const ZIP_CODE_BAR_INDEX = 3;
