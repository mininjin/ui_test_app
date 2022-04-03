import {
  Branches,
} from "@/@types/schema/branches";
import { Questions } from "@/@types/schema/question";

export const isSkipped = (
  question: Questions | Branches,
  questions: (Questions | Branches)[]
) => {
  // 初期値の代入
  let isSkipped = false;
  isSkipped = false;
  // 結果をreturn
  return isSkipped;
};
