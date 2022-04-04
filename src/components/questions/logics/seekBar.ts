import { SeekBar, SeekBarAnswer } from "@/@types/schema/question";
import { ref, Ref } from "vue";

type LabelData = { label: string; top: number; height: number };

export const useSeekBar = (
  cb: (answer: SeekBarAnswer) => void,
  container: Ref<HTMLElement | undefined>
) => {
  const answer = ref<SeekBarAnswer>(0);
  const height = ref(0);
  const labels = ref<LabelData[]>([]);
  let mouse = false;
  //
  const onTouchStart = (evt: TouchEvent) => {
    // その他のイベントをキャンセル
    evt.preventDefault();
    console.log(evt.type);
    // タッチ位置を取得
    const touchObject = evt.changedTouches[0];
    const pageY = touchObject.pageY;
    setPageY(pageY);
  };
  const setPageY = (pageY: number) => {
    const clientRect = container.value?.getBoundingClientRect();
    const positionY = (clientRect?.top || 0) + window.pageYOffset;
    let yFromTop = pageY - positionY;

    // y座標の最大値と最小値内に変換
    if (yFromTop < 0) {
      yFromTop = 0;
    } else if (yFromTop > height.value) {
      yFromTop = height.value;
    }

    // データを%表示に変換
    answer.value = 100 - (yFromTop / height.value) * 100;
  };
  //
  const onTouchEnd = (evt: Event) => {
    evt.preventDefault();
    // データを親コンポーネントに渡す
    cb(answer.value);
  };
  const onMouseDown = (evt: MouseEvent) => {
    // その他のイベントをキャンセル
    evt.preventDefault();
    mouse = true;
  };
  const onMouseMove = (evt: MouseEvent) => {
    // その他のイベントをキャンセル
    evt.preventDefault();
    if (mouse) {
      // タッチ位置を取得
      const pageY = evt.pageY;
      setPageY(pageY);
    }
  };
  const onMouseUp = (evt: Event) => {
    evt.preventDefault();
    // データを親コンポーネントに渡す
    mouse = false;
    cb(answer.value);
  };

  const init = (seekBar: SeekBar) => {
    if (container.value) {
      height.value = container.value.clientHeight;
      const length = seekBar.config.labels.length;
      const labelHeight = height.value / length;
      labels.value = seekBar.config.labels.map((v, i) => ({
        label: v,
        top: (labelHeight / (length - 1)) * i,
        height: labelHeight,
      }));
    }
  };

  return {
    onTouchStart,
    onTouchEnd,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    init,
    answer,
    labels,
  };
};
