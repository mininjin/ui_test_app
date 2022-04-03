import { RankingAnswer, Ranking } from "@/@types/schema/question";
import { computed, ref } from "vue";

type RankingPayload = { label?: string; rank: number };

export const useRanking = (
  cb: (answer: RankingAnswer, answered: boolean) => void
) => {
  const question = ref<Ranking>();
  const answer = ref<RankingAnswer>([]);
  const texts = ref<(string | undefined)[]>([]);
  const lowest = computed(() => question.value?.config.lowest || 1);
  const payloads = computed(
    () =>
      question.value?.config.choices.map((v, i) => {
        const answerData = answer.value.find((v) => v.index == i);
        const payload: RankingPayload = {
          label: v,
          rank: answerData ? answerData.rank : 0,
        };
        return payload;
      }) || []
  );
  const answered = computed(
    () => answer.value.length == (question.value?.config.lowest || 1)
  );
  const setQuestion = (select: Ranking) => {
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
    if (answerIndex >= 0) {
      answer.value.splice(answerIndex, 1);
    } else if (question.value) {
      const answeredRanks = answer.value.map((v) => v.rank);
      const label = question.value.config.choices[index] || texts.value[index];
      if (label) {
        const rank = Array(lowest.value)
          .fill(null)
          .map((_, i) => i + 1)
          .filter((v) => !answeredRanks.includes(v))
          .reduce((prev, cur) => (cur < prev ? cur : prev), lowest.value + 1);
        if (rank <= lowest.value) {
          answer.value.push({ index, label, rank });
        } else {
          const lowestIndex = answer.value.findIndex(
            (v) => v.rank == lowest.value
          );
          answer.value.splice(lowestIndex, 1, {
            index,
            label,
            rank: lowest.value,
          });
        }
      }
    }
    cb(answer.value, answered.value);
  };

  return { setQuestion, payloads, toggleAnswer, texts };
};
