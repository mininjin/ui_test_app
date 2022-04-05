import { computed, Ref } from "vue";
import { ref } from "vue";
import { Image, ImageAnswer } from "@/@types/schema/question";
import { blobToBase64 } from "@/libs/utils";
import { IMAGE_DIR } from "@/constants/api";

const CALCULATE_WAI_TIME = 300;

export const useImage = (
  container: Ref<HTMLElement | undefined>,
  cb: (answer?: ImageAnswer) => void
) => {
  const question = ref<Image>();
  const image = ref<string>();
  const choices = computed(() => question.value?.config.choices || []);
  const alt = computed(
    () => question.value?.config.alt || question.value?.question || ""
  );
  const answer = ref<number>();

  //
  const setAnswer = (index: number) => {
    answer.value = index;
    cb(index);
  };
  const setQuestion = async (q: Image) => {
    question.value = q;
    answer.value = q.answer;
    image.value = undefined;
    try {
      const res = await fetch(IMAGE_DIR + q.config.src);
      const blob = await res.blob();
      image.value = (await blobToBase64(blob)) as string | undefined;
      setTimeout(() => {
        if (container.value) {
          if (container.value.clientHeight >= container.value.scrollHeight) {
            cb(answer.value);
          } else {
            container.value?.addEventListener("scroll", () => {
              if (
                container.value &&
                container.value.scrollTop + container.value.clientHeight >=
                  container.value.scrollHeight
              ) {
                cb(answer.value);
              }
            });
          }
        }
      }, CALCULATE_WAI_TIME);
    } catch (err) {
      console.error(err);
      image.value = undefined;
    }
  };

  return { image, choices, alt, answer, setQuestion, setAnswer };
};
