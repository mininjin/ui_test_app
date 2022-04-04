<template>
  <div class="my-3">
    <div class="p-2 mb-1">
      <input
        class="
          flex-grow
          font-bold
          border-2
          rounded
          border-sub
          bg-white
          p-2
          w-full
        "
        type="date"
        :max="disableFuture ? getDateString(today) : ''"
        :value="date"
        @change="setDate"
      />
    </div>
    <div class="flex p-2 w-full items-center">
      <button
        class="border-2 border-sub rounded-lg bg-white font-bold w-1/4 p-2 flex items-center justify-center"
        @click="changeDate(-1)"
      >
        <span class="material-icons-outlined"> remove </span>
      </button>
      <button
        class="
          border-2 border-sub
          rounded-lg
          font-bold
          mx-2
          flex-auto
          p-2
          bg-white
        "
        @click="setToday"
      >
        今日
      </button>
      <button
        class="border-2 border-sub rounded-lg bg-white font-bold w-1/4 p-2 flex items-center justify-center"
        @click="changeDate(1)"
      >
        <span class="material-icons-outlined"> add </span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  getDateInstanseFromString,
  getDateString,
  DATE_FORMAT,
  getFullDate,
} from "@/libs/utils";
import { computed, defineComponent, onMounted, Ref, ref } from "vue";

export default defineComponent({
  props: {
    disableFuture: Boolean,
    date: String,
  },
  emits: {
    emitUp: (data: string) => DATE_FORMAT.test(data),
  },
  setup(props, context) {
    const today = ref(new Date()) as Ref<Date>;
    const data = computed(() => props.date);
    const disableFuture = computed(() => props.disableFuture || false);

    // カレンダー入力
    const setDate = (event: Event) => {
      let { value } = event.target as HTMLInputElement;
      emitUp(value);
    };
    // 日付のスピナーが押された時実行
    const changeDate = (step: 1 | -1) => {
      // 時刻の更新
      const date =
        getDateInstanseFromString(data.value || "") || new Date(today.value);
      date.setDate(date.getDate() + step);
      //
      emitUp(getDateString(date));
    };
    // 今ボタンが押された時実行
    const setToday = () => context.emit("emitUp", getDateString(today.value));
    //
    const emitUp = (str: string) => {
      // 未来が禁止されている場合
      if (disableFuture.value) {
        const displayDate = getDateInstanseFromString(str);
        if (
          displayDate &&
          getFullDate(displayDate) > getFullDate(today.value)
        ) {
          // 未来なら現在の日時に変更
          str = getDateString(today.value);
        }
      }
      console.log(str);
      // emit
      context.emit("emitUp", str);
    };

    onMounted(() => {
      today.value = new Date();
    });

    return { today, getDateString, setDate, changeDate, setToday };
  },
});
</script>
