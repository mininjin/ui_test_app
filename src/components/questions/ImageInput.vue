<template>
  <div
    class="h-full w-full top-0 left-0 overflow-y-scroll absolute"
    ref="container"
  >
    <div v-if="image" class="px-2 py-5 rounded">
      <img
        :src="image"
        :alt="alt"
        class="w-full object-contain rounded-xl border-header"
      />
    </div>
    <div v-if="choices.length > 0" class="flex flex-wrap w-full">
      <button
        v-for="(choice, index) in choices"
        :key="choice"
        @click="setAnswer(index)"
        :class="
          'p-2 flex-auto mx-2 ' +
          (answer == index ? 'bg-sub text-white' : 'bg-theme')
        "
      >
        {{ choice }}
      </button>
    </div>
  </div>
  <ScrollBar v-if="container && image" :el="container" />
</template>

<script lang="ts">
import { Image } from "@/@types/schema/question";
import { computed, defineComponent, onMounted, ref } from "vue";
import ScrollBar from "../UI/ScrollBar.vue";
import { useImage } from "./logics/image";

export type SelectAnswer = { checked: boolean; text?: string }[];

export default defineComponent({
  emits: {
    emitUp: (payload: { data: Image["answer"]; answered: boolean }) => true,
    emitChange: () => true,
  },
  props: {
    question: { type: Object as () => Image, required: true },
  },
  setup(props, context) {
    const question = computed(() => props.question);
    const container = ref<HTMLElement>();

    //
    const emitInput = (data?: number) => {
      context.emit("emitUp", {
        data,
        answered: choices.value.length > 0 ? data != undefined : true,
      });
    };
    const { image, choices, setQuestion, alt, answer, setAnswer } = useImage(
      container,
      emitInput
    );

    //
    onMounted(async () => {
      await setQuestion(question.value);
    });

    return { container, answer, image, alt, choices, setAnswer };
  },
  components: { ScrollBar },
});
</script>
