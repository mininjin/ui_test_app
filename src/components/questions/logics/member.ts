import { MemberAnswer } from "@/@types/schema/question";
import { Member } from "@/@types/schema/question";
import { computed, ref } from "vue";

type MemberPayload = {
  label?: string;
  step: number;
  unit: string;
  number: number;
};

export const useMember = (cb: (answer: MemberAnswer) => void) => {
  const question = ref<Member>();
  const answer = ref<MemberAnswer>([]);
  const inputSingle = computed(
    () => question.value?.config.inputSingle || false
  );
  const texts = ref<(string | undefined)[]>([]);
  const payloads = computed(
    () =>
      question.value?.config.choices.map((v, i) => {
        const answerData = answer.value.find((v) => v.index == i);
        const payload: MemberPayload = {
          ...v,
          number: answerData?.number || 0,
        };
        return payload;
      }) || []
  );
  const setQuestion = (member: Member) => {
    question.value = member;
    answer.value = member.answer || [];
    texts.value = question.value.config.choices.map((v, i) =>
      v == undefined
        ? answer.value.find((v) => v.index == i)?.label || ""
        : undefined
    );
  };

  // ＋をクリック時に実行
  const increment = (index: number, step: number) => {
    let number = payloads.value[index].number + step;
    if (number < 0) number = payloads.value[index].number;
    // 入力数の制限
    if (inputSingle.value) {
      answer.value = answer.value.map((v) => ({ ...v, number: 0 }));
    }
    const label =
      question.value?.config.choices[index].label || texts.value[index];
    const dataIndex = answer.value.findIndex((v) => v.index == index);
    if (label) {
      if (dataIndex >= 0) {
        answer.value.splice(dataIndex, 1, { label, number, index });
      } else {
        answer.value.push({ label, index, number });
      }
    }
    answer.value = answer.value.filter((v) => v.number > 0);
    // 数値を更新
    cb(answer.value);
  };

  return { payloads, setQuestion, increment, texts };
};
