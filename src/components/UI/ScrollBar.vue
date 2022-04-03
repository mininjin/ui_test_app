<template>
  <div
    class="absolute bottom-0 left-0 flex items-center justify-center w-full h-5"
    ref="container"
  >
    <transition
      enter-active-class="transition-all"
      enter-from-class="opacity-0"
      enter-to-class="opacity-1"
      leave-active-class="transition-all"
      leave-to-class="opacity-0"
      leave-from-class="opacity-1"
      mode="out-in"
    >
      <span
        v-if="open"
        class="material-icons text-sub h-full font-bold animate-bounce"
      >
        expand_more
      </span>
      <span
        v-else
        class="material-icons text-sub h-full font-bold animate-bounce"
      >
        expand_less
      </span>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";

const WAIT_TIME = 100;

export default defineComponent({
  props: {
    el: { type: Object as () => HTMLElement, required: true },
  },
  setup(props) {
    const el = computed(() => props.el);
    const container = ref<HTMLElement>();
    const open = ref(false);

    // 初期化
    const init = () => {
      if (el.value.scrollHeight > el.value.clientHeight) {
        open.value = true;
        el.value.style.paddingBottom = container.value?.clientHeight + "px";
      } else {
        open.value = false;
      }
    };

    onMounted(() => {
      // 初期化
      setTimeout(() => {
        init();
      }, WAIT_TIME);
      // スクロールイベント
      el.value.addEventListener("scroll", () => {
        open.value = false;
        setTimeout(() => {
          if (container.value) {
            if (
              el.value.scrollTop + el.value.clientHeight <
              el.value.scrollHeight
            ) {
              open.value = true;
            } else {
              open.value = false;
            }
          }
        }, WAIT_TIME);
      });
    });

    window.addEventListener("resize", init);

    return { container, open };
  },
});
</script>