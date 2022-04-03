<template>
  <div class="px-5 mb-3">
    <div class="w-full h-5 relative">
      <div class="absolute h-full w-full top-0 left-0 bg-container"></div>
      <div
        class="absolute h-full top-0 left-0 transition-all duration-300 bg-sub"
        :style="{
          width: (index / length) * 100 + '%',
          transitionDuration: duration + 'ms',
        }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    index: { type: Number, required: true },
    length: { type: Number, required: true },
    duration: { type: Number, required: true },
  },
});
</script>
