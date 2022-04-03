<template>
  <div
    class="h-full w-full top-0 left-0 overflow-y-scroll absolute"
    ref="container"
  >
    <div
      v-for="(item, index) in payloads"
      :key="item.label || '' + index"
      :class="
        'flex items-center p-2 mb-2 space-x-2 rounded-lg ' +
        (item.number > 0 ? 'bg-sub text-white' : 'bg-theme')
      "
    >
      <button
        :disabled="item.step == 0"
        class="
          p-1
          bg-white
          text-sub
          font-bold
          rounded
          flex-grow-0 flex
          items-center
        "
        @click="increment(index, -item.step)"
      >
        <span class="material-icons-outlined"> remove </span>
      </button>
      <span class="flex-grow">
        <span
          v-if="typeof item.label == 'string'"
          class="text text-start px-1"
          >{{ item.label }}</span
        >
        <input
          v-else
          class="bg-white w-full rounded p-1 text-sub"
          type="text"
          :maxlength="MAX_INPUT_LENGTH"
          :value="texts[index] || ''"
          @change="textInput(index, $event)"
        />
      </span>
      <span class="p-1 text-center flex-grow-0">
        {{ item.number }}{{ item.unit }}</span
      >
      <button
        :disabled="item.step == 0"
        class="
          p-1
          bg-white
          text-sub
          font-bold
          rounded
          flex-grow-0 flex
          items-center
        "
        @click="increment(index, item.step)"
      >
        <span class="material-icons-outlined"> add </span>
      </button>
    </div>
  </div>
  <ScrollBar v-if="container" :el="container" />
</template>

<script lang="ts">
import { Member, MemberAnswer } from "@/@types/schema/question";
import { MAX_INPUT_LENGTH } from "@/constants/application";
import { computed, defineComponent, onMounted, ref } from "vue";
import ScrollBar from "../UI/ScrollBar.vue";
import { useMember } from "./logics/member";

export default defineComponent({
  props: {
    question: { type: Object as () => Member, required: true },
  },
  emits: {
    emitUp: (_: { data: MemberAnswer; answered: boolean }) => true,
    emitChange: () => true,
  },
  setup(props, context) {
    const question = computed(() => props.question);
    const container = ref<HTMLElement>();
    const textInput = (index: number, event: Event) => {
      const { value } = event.target as HTMLInputElement;
      texts.value[index] = value;
    };
    const emitInput = (answer: MemberAnswer) => {
      context.emit("emitUp", {
        data: answer,
        answered: answer.length > 0,
      });
    };
    const { payloads, setQuestion, increment, texts } = useMember(emitInput);

    onMounted(() => {
      // 初期化
      setQuestion(question.value);
    });

    return {
      container,
      increment,
      payloads,
      MAX_INPUT_LENGTH,
      texts,
      textInput,
    };
  },
  components: { ScrollBar },
});
</script>
