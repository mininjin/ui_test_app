<template>
  <div
    class="h-full w-full top-0 left-0 overflow-y-scroll absolute"
    ref="container"
  >
    <button
      v-for="(item, index) in payloads"
      :key="item.label || '' + index"
      @click="toggleAnswer(index)"
      :class="
        'w-full flex items-center text-left mb-2 ' +
        (item.rank > 0 ? 'bg-sub text-white' : 'bg-theme')
      "
    >
      <span class="flex-grow px-2">
        <span v-if="typeof item.label == 'string'">
          {{ item.label }}
        </span>
        <input
          v-else
          class="bg-white w-full rounded p-1 text-sub"
          type="text"
          :maxlength="MAX_INPUT_LENGTH"
          :value="texts[index] || ''"
          @change="textInput(index, $event)"
        />
      </span>
      <span class="flex-grow-0 px-2">
        <transition
          enter-active-class="transition-all duration-500"
          enter-from-class="opacity-0 transform -translate-x-3"
          enter-to-class="opacity-1"
        >
          <span v-if="item.rank > 0"> No.{{ item.rank }} </span>
          <span v-else style="opacity: 0"> No.{{ item.rank }} </span>
        </transition>
      </span>
    </button>
  </div>
  <ScrollBar v-if="container" :el="container" />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import ScrollBar from "@/components/UI/ScrollBar.vue";
import { MAX_INPUT_LENGTH } from "@/constants/application";
import { Ranking, RankingAnswer } from "@/@types/schema/question";
import { useRanking } from "./logics/ranking";

export default defineComponent({
  emits: {
    emitUp: (payload: { data: RankingAnswer; answered: boolean }) => true,
  },
  props: {
    question: { type: Object as () => Ranking, required: true },
  },
  setup(props, context) {
    const question = computed(() => props.question);
    const container = ref<HTMLElement>();
    const textInput = (index: number, event: Event) => {
      const { value } = event.target as HTMLInputElement;
      toggleAnswer(index, value);
    };
    const emitInput = (data: RankingAnswer, answered: boolean) =>
      context.emit("emitUp", { data, answered });
    const { setQuestion, payloads, toggleAnswer, texts } =
      useRanking(emitInput);

    onMounted(() => {
      setQuestion(question.value);
    });

    return {
      payloads,
      toggleAnswer,
      MAX_INPUT_LENGTH,
      container,
      textInput,
      texts,
    };
  },
  components: { ScrollBar },
});
</script>