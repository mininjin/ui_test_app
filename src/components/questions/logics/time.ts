import { TimeAnswer } from "@/@types/schema/question";
import { Time } from "@/@types/schema/question";
import { DATE_TIME_SPLITTER } from "@/constants/application";
import { computed, ref } from "vue";
import { DATE_FORMAT, TIME_FORMAT } from "@/libs/utils";

export const useTime = (
  cb: (answer: TimeAnswer, answered: boolean) => void
) => {
  const question = ref<Time>();
  const date = ref<string>();
  const time = ref<string>();
  const answered = computed(
    () =>
      (question.value?.config?.disableTime
        ? true
        : TIME_FORMAT.test(time.value || "")) &&
      (question.value?.config?.disableDate
        ? true
        : DATE_FORMAT.test(date.value || ""))
  );

  const setQuestion = (q: Time) => {
    question.value = q;
    date.value = q.answer?.date;
    time.value = q.answer?.time;
  };
  // 日付入力
  const setDate = (str: string) => {
    date.value = str;
    cb({ date: str, time: time.value }, answered.value);
  };
  // 時刻入力
  const setTime = (str?: string) => {
    time.value = str;
    cb({ time: str, date: date.value }, answered.value);
  };

  return { setQuestion, setDate, setTime, date, time };
};
