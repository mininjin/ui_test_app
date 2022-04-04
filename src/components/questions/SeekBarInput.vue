<template>
  <div class="absolute py-5 h-full w-full flex flex-col">
    <div class="flex-1 text-center flex flex-col" ref="container">
      <div
        class="flex-1 my-5 relative"
        @touchstart="onTouchStart"
        @touchmove="onTouchStart"
        @touchend="onTouchEnd"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
      >
        <div class="centerline absolute h-full top-0 bg-gray-500"></div>
        <div class="absolute flex flex-col h-full justify-items-stretch">
          <div
            v-for="item in labels"
            :key="item.label"
            class="flex flex-grow"
            :style="{ height: item.height + 'px' }"
          >
            <div class="pad" :style="{ marginTop: item.top + 'px' }">
              <div class="bar bg-gray-500"></div>
            </div>
            <div class="flex-grow">
              <div class="label">
                <p class="break-all" :style="{ marginTop: item.top + 'px' }">
                  {{ item.label }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="absolute" :style="{ top: 100 - answer + '%' }">
          <div class="icon rounded-full shadow-lg bg-error"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { SeekBar, SeekBarAnswer } from "@/@types/schema/question";
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { useSeekBar } from "./logics/seekBar";

export default defineComponent({
  props: {
    question: { type: Object as () => SeekBar, required: true },
  },
  setup(props, context) {
    const question = computed(() => props.question);
    //
    const container = ref<HTMLElement>();
    const emitInput = (answer: SeekBarAnswer) => {
      context.emit("emitUp", {
        data: answer,
        answered: true,
      });
    };
    const {
      init,
      onTouchStart,
      onTouchEnd,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      answer,
      labels,
    } = useSeekBar(emitInput, container);

    watch(question, () => init(question.value));

    onMounted(() => {
      init(question.value);
      window.addEventListener("resize", () => init(question.value));
    });

    return {
      container,
      onTouchStart,
      onTouchEnd,
      answer,
      labels,
      onMouseDown,
      onMouseMove,
      onMouseUp,
    };
  },
});
</script>

<style scoped>
.icon {
  width: 3rem;
  height: 3rem;
  margin-left: calc(3rem * 2);
  margin-top: calc(0rem - 3rem / 2);
}
.centerline {
  width: 0.3rem;
  left: calc(3rem * 2.5 - 0.3rem / 2);
}
.pad {
  width: calc(3rem * 3);
}
.bar {
  height: 0.3rem;
  width: calc(3rem / 2);
  margin-top: calc(0rem - 0.3rem / 2);
  margin-left: calc(3rem * 2.5 - 3rem / 4);
}
.label {
  margin-top: calc(0rem - 1rem / 2);
  text-align: left;
  padding: 0 1.5rem;
}
</style>
