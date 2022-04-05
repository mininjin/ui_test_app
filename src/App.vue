<template>
  <div class="flex">
    <div class="flex-auto bg-theme"></div>
    <div class="flex flex-col flex-grow-0 h-screen w-full max-w-3xl">
      <DisplayHeader />
      <div class="flex-1 bg-background">
        <transition
          enter-active-class="transition-all duration-500"
          enter-from-class="opacity-0"
          enter-to-class="opacity-1"
          leave-active-class="transition-all duration-500"
          leave-from-class="opacity-1"
          leave-to-class="opacity-0"
          mode="out-in"
        >
          <router-view />
        </transition>
      </div>
      <DisplayFooter />
    </div>
    <div class="flex-auto bg-theme"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DisplayHeader from "./components/UI/DisplayHeader.vue";
import DisplayFooter from "./components/UI/DisplayFooter.vue";

export default defineComponent({
  components: { DisplayHeader, DisplayFooter },
});
</script>
