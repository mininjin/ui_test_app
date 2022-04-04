<template>
  <div class="flex items-center justify-center w-full">
    <span
      v-for="item in list"
      :key="item"
      :class="`w-5 h-5 rounded-full bg-white mx-2 bounce`"
      :style="{ animationDelay: item + 'ms' }"
    ></span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup: () => ({ list: [0, 100, 200] }),
});
</script>

<style scoped>
.bounce {
  animation-name: bounce;
  animation-duration: 500ms;
  animation-timing-function: ease-in;
  animation-iteration-count: infinite;
}
@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-0.7rem);
  }
  100% {
    transform: translateY(0);
  }
}
</style>