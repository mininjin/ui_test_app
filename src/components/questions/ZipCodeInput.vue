<template>
  <div class="h-full flex flex-col">
    <div class="flex-grow-0 px-3 py-2 flex-col flex">
      <div
        class="
          py-1
          px-3
          font-bold
          flex
          items-center
          bg-white
          rounded
          border-sub border-2
          flex-auto
        "
      >
        <span>〒</span>
        <input
          type="text"
          ref="code"
          :value="zipCodeText"
          :maxlength="ZIP_CODE_LENGTH + 1"
          @input="onInput"
        />
      </div>
      <div class="flex-auto flex items-center py-1 px-3">
        <span v-if="status == 'fetched'">
          {{ region || "市区町村が見つかりません" }}
        </span>
        <span v-else-if="status == 'insufficient'">
          市区町村が見つかりません
        </span>
        <span v-else-if="status == 'loading'"> 通信中... </span>
        <span v-else-if="status == 'error'"> サーバーエラー </span>
      </div>
    </div>
    <div class="flex-1 flex flex-col p-2">
      <div
        v-for="row in KEYS"
        :key="row + ''"
        class="flex flex-auto items-start"
      >
        <div
          v-for="key in row"
          :key="key"
          class="w-1/3 mx-1 h-full max-h-16 p-2"
        >
          <button
            v-if="key == 'remove'"
            type="button"
            class="bg-white border-2 border-sub w-full rounded-xl h-full"
            @click="removeCode"
            :disabled="zipCode.length == 0"
          >
            ←
          </button>
          <button
            v-else-if="key == 'reset'"
            type="button"
            class="bg-white border-2 border-sub w-full rounded-xl h-full"
            @click="resetCode"
          ></button>
          <button
            v-else
            type="button"
            class="bg-theme w-full rounded-xl h-full"
            @click="addCode(key)"
          >
            {{ key }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ZipCode, ZipCodeAnswer } from "@/@types/schema/question";
import { ZIP_CODE_LENGTH } from "@/constants/application";
import { computed, defineComponent, onMounted, watch } from "vue";
import { useZipCode } from "./logics/zipCode";

const KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["reset", "0", "remove"],
];

export default defineComponent({
  props: {
    question: { type: Object as () => ZipCode, required: true },
  },
  emits: {
    emitUp: (payload: { data: ZipCode["answer"]; answered: boolean }) => true,
    emitChange: () => true,
  },
  setup(props, context) {
    const question = computed(() => props.question);
    //
    const onInput = (event: Event) => {
      //
      const { value } = event.target as HTMLInputElement;
      const zipCode = value
        .split("")
        .filter((v) => !isNaN(parseInt(v)))
        .join("");
      //
      setCode(zipCode);
    };
    const emitInput = (data: ZipCodeAnswer, answered: boolean) => {
      context.emit("emitUp", {
        data,
        answered,
      });
    };
    const {
      zipCodeText,
      zipCode,
      region,
      status,
      setCode,
      addCode,
      removeCode,
      resetCode,
      setQuestion,
    } = useZipCode(emitInput);

    onMounted(() => {
      setQuestion(question.value);
    });

    return {
      zipCodeText,
      region,
      status,
      addCode,
      setCode,
      removeCode,
      resetCode,
      zipCode,
      ZIP_CODE_LENGTH,
      KEYS,
      onInput,
    };
  },
});
</script>
