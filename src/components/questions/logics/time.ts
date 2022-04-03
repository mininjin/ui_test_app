import { TimeAnswer } from "@/@types/schema/question";
import { Time } from "@/@types/schema/question";
import { DATE_TIME_SPLITTER } from "@/constants/application";
import { computed, ref } from "vue";
import {
  DATE_FORMAT,
  getDateTimeStringFromString,
  TIME_FORMAT,
} from "@/libs/utils";

export const useTime = (
  cb: (answer: TimeAnswer, answered: boolean) => void
) => {
  const question = ref<Time>();
  const date = ref<string>();
  const time = ref<string>();
  const answer = computed(() =>
    question.value?.config?.disableTime || false
      ? date.value || ""
      : [date.value, time.value].join(DATE_TIME_SPLITTER)
  );
  const answered = computed(() =>
    question.value?.config?.disableTime || false
      ? DATE_FORMAT.test(date.value || "")
      : DATE_FORMAT.test(date.value || "") && TIME_FORMAT.test(time.value || "")
  );

  const setQuestion = (q: Time) => {
    question.value = q;
    // マウント時の回答を確認
    const result = getDateTimeStringFromString(q.answer);
    date.value = result.date;
    time.value = result.time;
  };
  // 日付入力
  const setDate = (str: string) => {
    date.value = str;
    cb(answer.value, answered.value);
  };
  // 時刻入力
  const setTime = (str?: string) => {
    time.value = str;
    cb(answer.value, answered.value);
  };

  return { setQuestion, setDate, setTime,date,time };
};
