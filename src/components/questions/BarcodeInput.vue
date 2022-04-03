<template>
  <div class="h-full w-full overflow-y-scroll">
    <div
      :class="cameraOn ? 'fixed h-full w-full top-0 left-0 bg-black' : 'hidden'"
    >
      <div class="camera-main" ref="camera">
        <video id="stream" autoplay="true"></video>
      </div>
    </div>
    <div v-if="status == 'started'" class="camera-wrap">
      <div class="footer">
        <button class="camera-btn p-2" @click="onStop">カメラストップ</button>
      </div>
    </div>
    <div v-else class="data-wrap w-full p-1 text-center">
      <div class="flex py-2 px-4">
        <button
          class="bg-theme rounded-xl text-sub p-2 w-full"
          :disabled="disableCamera"
          @click="onStart"
        >
          カメラスタート
        </button>
      </div>
      <div class="flex py-1">
        <div class="flex-shrink-0 px-2 text-lg font-bold text-sub">
          バーコード
        </div>
        <div
          class="
            flex-auto
            overflow-x-scroll
            bg-white
            rounded
            border-2 border-header
          "
        >
          {{ barcode || "" }}
        </div>
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
const ERROR_INTERVAL = 3000;

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
    const cameraOn = ref(false);
    const camera = ref<HTMLElement>();

    //
    const onStart = async () => {
      if (camera.value) {
        cameraOn.value = true;
        await start(camera.value, cameraId.value);
      }
    };
    //
    const onStop = async () => {
      if (camera.value) {
        cameraOn.value = false;
        stop(camera.value);
      }
    };
    //
    const emitInput = (code: string) => {
      //
      context.emit("emitUp", { data: code, answered: true });
    };
    //
    const { start, stop, status, setQuestion, barcode } = useBarcode(emitInput);
    watch(status, () => {
      if (status.value == "stopped") cameraOn.value = false;
    });
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
      cameraOn,
      disableCamera,
      barcode,
    };
  },
});
</script>