<template>
  <div
    v-if="error"
    class="fixed w-full h-full top-0 left-0 bg-black bg-opacity-50 p-5 text-sub z-50"
  >
    <div class="flex flex-col bg-white rounded-lg justify-center py-5">
      <div class="text-left text-error font-bold p-3 text-lg">
        {{ message }}
      </div>
      <div class="p-3">
        <button
          v-if="error.status == 1000"
          type="button"
          class="w-full my-1 rounded-xl bg-theme"
          @click="resend"
        >
          再送信
        </button>
        <button
          v-else
          type="button"
          class="w-full my-1 rounded-xl bg-theme"
          @click="close"
        >
          閉じる
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { State } from "@/store/state";
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  emits: {
    close: () => true,
    resend: () => true,
  },
  setup(props, context) {
    const store = useStore<State>();
    const message = computed(() => {
      let message: string | undefined = undefined;
      const error = store.state.error;
      switch (error?.status) {
        case 500:
          message = "サーバー内部のエラーが発生しました。";
          break;
        default:
          message = "通信エラーが発生しました。";
          break;
      }
      return message;
    });
    const error = computed(() => store.state.error);

    return {
      resend: () => {
        store.commit("setError", undefined);
        context.emit("resend");
      },
      close: () => {
        store.commit("setError", undefined);
        context.emit("close");
      },
      message,
      error,
    };
  },
});
</script>
