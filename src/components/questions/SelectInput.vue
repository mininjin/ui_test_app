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
        'flex items-center text-left w-full mb-2 ' +
        (item.checked ? 'text-white bg-sub' : 'bg-theme text-sub')
      "
    >
      <span class="flex-grow-0">
        <span v-if="multiSelect">
          <span class="w-5 h-5 flex items-center justify-center bg-white">
            <transition
              enter-active-class="transition-all"
              enter-from-class="opacity-0 transform translate-y-3 -translate-x-3"
              enter-to-class="opacity-1"
              leave-active-class="transition-all duration-500"
              leave-from-class="opacity-1"
              leave-to-class="opacity-0"
            >
              <span v-if="item.checked" class="material-icons-outlined text-lg text-sub"> done </span>
            </transition>
          </span>
        </span>
        <span v-else>
          <span
            class="
              w-5
              h-5
              flex
              items-center
              justify-center
              rounded-full
              bg-white
            "
          >
            <transition
              enter-active-class="transition-all duration-500"
              enter-from-class="opacity-0"
              enter-to-class="opacity-1"
              leave-active-class="transition-all duration-500"
              leave-from-class="opacity-1"
              leave-to-class="opacity-0"
            >
              <span
                v-if="item.checked"
                class="w-2.5 h-2.5 bg-sub rounded-full"
              ></span>
            </transition>
          </span>
        </span>
      </span>
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
    </button>
  </div>
  <ScrollBar v-if="container" :el="container" />
</template>

<script lang="ts">
import { Select, SelectAnswer } from "@/@types/schema/question";
import { computed, defineComponent, onMounted, ref } from "vue";
import ScrollBar from "@/components/UI/ScrollBar.vue";
import { MAX_INPUT_LENGTH } from "@/constants/application";
import { useSelect } from "./logics/select";

export default defineComponent({
  emits: {
    emitUp: (payload: { data: SelectAnswer; answered: boolean }) => true,
  },
  props: {
    question: { type: Object as () => Select, required: true },
  },
  setup(props, context) {
    const question = computed(() => props.question);
    const multiSelect = computed(
      () => props.question.config.multiSelect || false
    );
    const container = ref<HTMLElement>();
    const textInput = (index: number, event: Event) => {
      const { value } = event.target as HTMLInputElement;
      toggleAnswer(index, value);
    };
    const emitInput = (answer: SelectAnswer) => {
      //
      context.emit("emitUp", {
        data: answer,
        answered: answer.length > 0,
      });
    };
    const { setQuestion, payloads, toggleAnswer, texts } = useSelect(emitInput);

    onMounted(() => {
      setQuestion(question.value);
    });

    return {
      payloads,
      toggleAnswer,
      MAX_INPUT_LENGTH,
      container,
      multiSelect,
      textInput,
      texts,
    };
  },
  components: { ScrollBar },
});
</script>