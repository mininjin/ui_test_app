<template>
  <div class="flex items-center mt-2 flex-grow-0 py-5">
    <button
      class="rounded-xl bg-white text-sub w-full shadow border-2 border-sub p-1"
      @click="goHome"
    >
      ホームに戻る
    </button>
  </div>
</template>

<script lang="ts">
import { ROUTE } from "@/constants/application";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

const { HOME } = ROUTE;

export default defineComponent({
  setup() {
    const router = useRouter();
    return {
      goHome: () => router.push(HOME),
    };
  },
});
</script>
