import { shallowRef } from "vue";
import { TypeName } from "@/@types/schema/question";
import SeekBar from "@/components/questions/SeekBarInput.vue";
import Select from "@/components/questions/SelectInput.vue";
import Address from "@/components/questions/ZipCodeInput.vue";
import Text from "@/components/questions/TextInput.vue";
import Time from "@/components/questions/TimeInput.vue";
import Ranking from "@/components/questions/RankingInput.vue";
import Member from "@/components/questions/MemberInput.vue";
import Camera from "@/components/questions/BarcodeInput.vue";
import Image from "@/components/questions/ImageInput.vue";

type QuestionVue =
  | typeof Select
  | typeof SeekBar
  | typeof Member
  | typeof Ranking
  | typeof Text
  | typeof Time
  | typeof Camera
  | typeof Image
  | typeof Address;

export const useQuestion = () => {
  const QuestionComponent = shallowRef<QuestionVue>();
  const setQuestionComponent = (type: TypeName) => {
    switch (type) {
      case "select":
        QuestionComponent.value = Select;
        break;
      case "ranking":
        QuestionComponent.value = Ranking;
        break;
      case "member":
        QuestionComponent.value = Member;
        break;
      case "seek-bar":
        QuestionComponent.value = SeekBar;
        break;
      case "barcode":
        QuestionComponent.value = Camera;
        break;
      case "text":
        QuestionComponent.value = Text;
        break;
      case "time":
        QuestionComponent.value = Time;
        break;
      case "zip-code":
        QuestionComponent.value = Address;
        break;
      case "image":
        QuestionComponent.value = Image;
        break;
      default:
        console.error(`Error: ${type} is invalid type !`);
    }
  };

  return { QuestionComponent, setQuestionComponent };
};
