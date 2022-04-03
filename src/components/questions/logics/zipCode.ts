import { computed, ref } from "vue";
import { getAddress } from "@/libs/zipcloud";
import {
  ZIP_CODE_BAR,
  ZIP_CODE_BAR_INDEX,
  ZIP_CODE_LENGTH,
} from "@/constants/application";
import { ZipCode, ZipCodeAnswer } from "@/@types/schema/question";

type ZipCodeStatus = "insufficient" | "loading" | "fetched" | "error";

export const useZipCode = (
  cb: (answer: ZipCodeAnswer, answered: boolean) => void
) => {
  //
  const question = ref<ZipCode>();
  const zipCode = ref("");
  const region = ref("");
  const status = ref<ZipCodeStatus>("insufficient");
  const answered = computed(
    () =>
      zipCode.value.length >=
      (question.value?.config.requireLength || ZIP_CODE_LENGTH)
  );
  //
  const zipCodeText = computed(() => {
    const codes = zipCode.value.split("");
    if (codes.length > ZIP_CODE_BAR_INDEX)
      codes.splice(ZIP_CODE_BAR_INDEX, 0, ZIP_CODE_BAR);
    return codes.join("");
  });
  //
  const setCode = async (code?: string) => {
    zipCode.value = code || "";
    await setRegion();
  };
  //
  const addCode = async (code: string) => {
    if (zipCode.value.length < ZIP_CODE_LENGTH) {
      zipCode.value += code;
      await setRegion();
    }
  };
  //
  const setRegion = async () => {
    if (zipCode.value.length == ZIP_CODE_LENGTH) {
      status.value = "loading";
      const res = await getAddress(zipCode.value);
      if (res != undefined) {
        region.value = res;
        status.value = region.value.length > 0 ? "fetched" : "insufficient";
      } else status.value = "error";
    }
    cb(zipCode.value, answered.value);
  };
  //
  const removeCode = () => {
    const codes = zipCode.value.split("");
    if (codes.length > 0) {
      codes.pop();
      zipCode.value = codes.join("");
    }
    status.value = "insufficient";
    region.value = "";
  };
  //
  const resetCode = () => {
    zipCode.value = "";
    status.value = "insufficient";
    region.value = "";
  };

  const setQuestion = (q: ZipCode) => {
    question.value = q;
    setCode(q.answer);
  };

  return {
    zipCodeText,
    zipCode,
    region,
    status,
    setCode,
    addCode,
    removeCode,
    resetCode,
    setQuestion,
  };
};
