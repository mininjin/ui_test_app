<template>
  <div class="h-full overflow-y-scroll pb-5" ref="container">
    <div v-if="image" class="p-2 rounded">
      <img
        :src="image"
        :alt="src"
        class="w-full object-contain rounded-xl border-header"
      />
    </div>
    <div v-if="text" class="p-3">
      {{ text }}
    </div>
    <div v-if="choices.length > 0" class="flex flex-wrap w-full">
      <button
        v-for="(choice, index) in choices"
        :key="choice"
        @click="onClick(index)"
        :class="
          'p-2 flex-auto mx-2 bg-theme' + (answer == index ? ' selected' : '')
        "
      >
        {{ choice }}
      </button>
    </div>
    <ScrollBar v-if="container" :el="container" />
  </div>
</template>

<script lang="ts">
import { Image } from "@/@types/schema/question";
import { State } from "@/store/state";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useStore } from "vuex";
import ScrollBar from "../UI/ScrollBar.vue";

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
    const store = useStore<State>();
    const src = computed(() => props.question.option.src);
    const text = computed(() => props.question.option.text);
    const image = ref<string>();
    const choices = computed(() => props.question.option.choices);
    const answer = computed(() => props.question.answer);
    const container = ref<HTMLElement>();

    //
    const onClick = (index: number) => {
      // answerをemit
      emitInput(index);
    };
    //
    const emitInput = (index?: number) => {
      let data = index != undefined ? index : answer.value;
      //
      context.emit("emitUp", {
        data,
        answered: choices.value.length > 0 ? data != undefined : true,
      });
    };

    //
    onMounted(async () => {
      //
      image.value = await store.dispatch("fetchImage", src.value);
      //
      container.value?.addEventListener("scroll", () => {
        if (container.value) {
          const parent = container.value.parentElement;
          if (
            parent &&
            container.value.scrollTop + parent.clientHeight >=
              container.value.scrollHeight
          ) {
            emitInput();
          }
        }
      });
    });

    return {
      container,
      answer,
      image,
      src,
      choices,
      onClick,
      text,
    };
  },
  components: { ScrollBar },
});
</script>
