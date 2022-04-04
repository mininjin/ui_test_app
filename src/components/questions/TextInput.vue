<template>
  <div class="h-full p-3">
    <textarea
      class="
        w-full
        h-full
        resize-y
        rounded-lg
        border-2 border-header
        text-sub
        font-bold
        p-3
      "
      :value="answer"
      :placeholder="placeholder"
      @input="onInput"
      :maxlength="max"
      :minlength="min"
      ref="textarea"
    ></textarea>
  </div>
</template>

<script lang="ts">
import { Text } from "@/@types/schema/question";
import { MAX_TEXTAREA_LENGTH } from "@/constants/application";
import { computed, defineComponent, onMounted, ref } from "vue";

const PLACEHOLDER = "テキストを自由に入力してください。";

export default defineComponent({
  props: {
    question: { type: Object as () => Text, required: true },
  },
  emits: {
    emitUp: (payload: { data: string; answered: boolean }) => true,
    emitChange: () => true,
  },
  setup(props, context) {
    const question = computed(() => props.question);
    const placeholder = computed(
      () => props.question.config?.placeholder || PLACEHOLDER
    );
    const max = computed(
      () => props.question.config?.max || MAX_TEXTAREA_LENGTH
    );
    const min = computed(() => props.question.config?.min);
    const answer = ref("");

    //
    const onInput = (event: Event) => {
      //
      const { value } = event.target as HTMLTextAreaElement;
      answer.value = value;
      const length = answer.value.length;
      const answered =
        length > 0 &&
        (min.value == undefined || length >= min.value) &&
        (max.value == undefined || length <= max.value);
      //
      context.emit("emitUp", { data: answer.value, answered });
    };
    //
    onMounted(() => (answer.value = question.value.answer || ""));

    return { placeholder, answer, onInput, max, min };
  },
});
</script>
