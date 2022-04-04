import { Barcode, BarcodeAnswer } from "@/@types/schema/question";
import { getOptionsFromConfig } from "@/libs/jsBarcode";
import Quagga, { QuaggaJSConfigObject } from "@ericblade/quagga2";
import JsBarcode from "jsbarcode";
import { computed, Ref, ref } from "vue";

const MIN_WIDTH = 640;
const MIN_HEIGHT = 480;
const DETECT_COUNT = 3;

type CameraStatus = "starting" | "started" | "stopped" | "un-match" | "no-read";

export const useBarcode = (
  canvas: Ref<HTMLCanvasElement | undefined>,
  cb: (answer: BarcodeAnswer) => void
) => {
  const question = ref<Barcode>();
  const status = ref<CameraStatus>("stopped");
  const barcode = ref<string>();
  const reader = computed(() => question.value?.config.reader || "");
  const option = computed(() => getOptionsFromConfig(question.value?.config));

  const setQuestion = (q: Barcode) => {
    question.value = q;
    barcode.value = q.answer;
  };
  const start = async (camera: HTMLElement, cameraId?: string) => {
    status.value = "starting";
    //
    const constraints: MediaTrackConstraints = {
      width: { min: MIN_WIDTH },
      height: { min: MIN_HEIGHT },
      facingMode: "environment",
    };
    if (cameraId) {
      //
      delete constraints.facingMode;
      constraints.deviceId = cameraId;
    }
    const config: QuaggaJSConfigObject = {
      inputStream: {
        type: "LiveStream",
        target: camera,
        constraints,
      },
      decoder: { readers: [reader.value] },
      numOfWorkers: navigator.hardwareConcurrency,
    };
    //
    await Quagga.init(config);
    //
    Quagga.start();
    status.value = "started";
    //
    let count = 0;
    let detected = false;
    let data: string | null = null;
    Quagga.onDetected((result) => {
      //
      if (detected) return;
      //
      if (data && data == result.codeResult.code) {
        count++;
      } else if (data) {
        count = 0;
        status.value = "un-match";
      }
      data = result.codeResult.code;
      //
      if (count >= DETECT_COUNT && data) {
        //
        count = 0;
        detected = true;
        //
        barcode.value = data;
        //
        stop(camera);
      }
    });
  };
  //
  const stop = async (camera: HTMLElement) => {
    //
    Quagga.stop();
    status.value = "stopped";
    //
    camera.innerHTML = `<video autoplay="true"></video>`;
    //
    if (barcode.value) {
      if (canvas.value) JsBarcode(canvas.value, barcode.value, option.value);
      cb(barcode.value);
    }
  };

  return { start, stop, status, setQuestion, barcode };
};
