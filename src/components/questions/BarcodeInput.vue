<template>
  <div class="h-full p-3">
    <div
      :class="
        status != 'stopped'
          ? 'fixed h-full w-full top-0 left-0 bg-black z-40'
          : 'hidden'
      "
    >
      <transition
        enter-active-class="transition-all duration-500"
        enter-from-class="opacity-0"
        enter-to-class="opacity-1"
      >
        <div
          v-if="status == 'starting'"
          class="absolute w-full h-full flex items-center top-0 left-0"
        >
          <LoadingAnimation />
        </div>
      </transition>
      <div class="w-full h-full flex items-center" ref="camera">
        <video autoplay="true"></video>
      </div>
      <div
        v-if="status != 'starting'"
        class="absolute bottom-0 left-0 py-5 w-full p-2"
      >
        <button class="w-full p-2 bg-white rounded" @click="onStop">
          カメラストップ
        </button>
      </div>
    </div>
    <div class="flex flex-col h-full">
      <div class="flex-grow-0 px-2 text-lg font-bold text-sub mb-2">
        バーコード
      </div>
      <div
        class="flex-grow-0 bg-white rounded border-2 border-header w-full p-1"
      >
        {{ barcode || "カメラを起動してください" }}
      </div>
      <div class="flex-1 relative p-2 flex items-center flex-wrap">
        <div
          v-if="cameraId == undefined"
          class="flex justify-center items-center w-full text-lg"
        >
          <font-awesome-icon
            icon="spinner"
            class="w-5 h-5 animate-spin mr-2"
          />カメラの準備中...
        </div>
        <canvas v-else ref="canvas" class="w-full h-full"></canvas>
      </div>
      <div class="flex-grow-0 flex flex-wrap items-center py-2 px-4">
        <button
          class="bg-theme rounded-xl text-sub p-2 w-full"
          :disabled="disableCamera"
          @click="onStart"
        >
          カメラスタート
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Barcode } from "@/@types/schema/question";
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { State } from "@/store/state";
import { useBarcode } from "./logics/barcode";
import { valueToNode } from "@babel/types";
import LoadingAnimation from "../UI/LoadingAnimation.vue";
import FontAwesomeIcon from "@/plugins/FontAwesomeIcon.vue";

export default defineComponent({
  emits: {
    emitUp: (payload: { data: Barcode["answer"]; answered: boolean }) => true,
    emitChange: () => true,
  },
  props: {
    question: { type: Object as () => Barcode, required: true },
  },
  setup(props, context) {
    const store = useStore<State>();
    const cameraId = computed(() => store.state.common.cameraId);
    const question = computed(() => props.question);
    const disableCamera = ref(false);
    //
    const camera = ref<HTMLElement>();
    const canvas = ref<HTMLCanvasElement>();
    //
    const onStart = async () => {
      if (camera.value) {
        await start(camera.value, cameraId.value);
      }
    };
    //
    const onStop = async () => {
      if (camera.value) {
        stop(camera.value);
      }
    };
    //
    const emitInput = (data: string) => {
      context.emit("emitUp", { data, answered: true });
    };
    //
    const { start, stop, status, setQuestion, barcode } = useBarcode(
      canvas,
      emitInput
    );
    watch(question.value, () => setQuestion(question.value));
    onMounted(async () => {
      //
      setQuestion(question.value);
      //
      if (cameraId.value == undefined) {
        disableCamera.value = true;
        await store.dispatch("accessCamera");
        disableCamera.value = false;
      }
    });
    return {
      camera,
      onStart,
      onStop,
      status,
      disableCamera,
      barcode,
      canvas,
      cameraId,
    };
  },
  components: { LoadingAnimation, FontAwesomeIcon },
});
</script>