<template>
  <footer class="bg-theme">
    <div class="text-xs p-2 text-right text-copyright">{{ COPYRIGHT }}</div>
  </footer>
</template>

<script lang="ts">
import { COPYRIGHT } from "@/constants/application";
import { defineComponent } from "vue";

export default defineComponent({
  setup: () => ({ COPYRIGHT }),
});
</script>