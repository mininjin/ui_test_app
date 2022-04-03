import { Select, SelectAnswer } from "@/@types/schema/question";
import { computed, ref } from "vue";

type SelectPayload = { label?: string; checked: boolean };

export const useSelect = (cb: (answer: SelectAnswer) => void) => {
  const question = ref<Select>();
  const answer = ref<SelectAnswer>([]);
  const texts = ref<(string | undefined)[]>([]);
  const multiSelect = computed(
    () => question.value?.config.multiSelect || false
  );
  const payloads = computed(
    () =>
      question.value?.config.choices.map((v, i) => {
        const answerData = answer.value.find((v) => v.index == i);
        const payload: SelectPayload = {
          label: v,
          checked: answerData != undefined,
        };
        return payload;
      }) || []
  );
  const setQuestion = (select: Select) => {
    question.value = select;
    answer.value = select.answer || [];
    texts.value = question.value.config.choices.map((v, i) =>
      v == undefined
        ? answer.value.find((v) => v.index == i)?.label || ""
        : undefined
    );
  };
  const toggleAnswer = (index: number, text?: string) => {
    if (typeof text == "string") texts.value.splice(index, 1, text);
    const answerIndex = answer.value.findIndex((v) => v.index == index);
    if (multiSelect.value == false) {
      answer.value = [];
    }
    if (answerIndex >= 0) {
      answer.value.splice(answerIndex, 1);
    } else if (question.value) {
      const label = question.value.config.choices[index] || texts.value[index];
      if (label) answer.value.push({ index, label });
    }
    cb(answer.value);
  };

  return { setQuestion, payloads, toggleAnswer, texts };
};
