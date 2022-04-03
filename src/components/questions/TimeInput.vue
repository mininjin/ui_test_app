<template>
  <div class="text-sub h-full overflow-y-scroll">
    <DateInput :date="date" :disableFuture="disableFuture" @emitUp="setDate" />
    <TimeInput
      v-if="!disableTime"
      :time="time"
      :disableFuture="disableFuture"
      :timeStep="timeStep"
      @emitUp="setTime"
    />
  </div>
</template>

<script lang="ts">
import { Time, TimeAnswer } from "@/@types/schema/question";
import { computed, defineComponent, onMounted, ref } from "vue";
import DateInput from "../UI/DateInput.vue";
import TimeInput from "../UI/TimeInput.vue";
import { DEFAULT_TIME_STEP } from "@/constants/application";
import { useTime } from "./logics/time";

export default defineComponent({
  props: {
    question: { type: Object as () => Time, required: true },
  },
  emits: {
    emitUp: (payload: { data: Time["answer"]; answered: boolean }) => true,
    emitChange: () => true,
  },
  setup(props, context) {
    const question = computed(() => props.question);
    const disableTime = computed(
      () => props.question.config?.disableTime || false
    );
    const disableFuture = computed(
      () => props.question.config?.disableFuture || false
    );
    const timeStep = computed(
      () => props.question.config?.timeStep || DEFAULT_TIME_STEP
    );

    // 回答を保存
    const emitInput = (data: TimeAnswer, answered: boolean) => {
      // emit
      context.emit("emitUp", { answered, data });
    };
    const { date, time, setQuestion, setDate, setTime } = useTime(emitInput);

    onMounted(() => {
      setQuestion(question.value);
    });

    return {
      disableTime,
      disableFuture,
      date,
      time,
      timeStep,
      setTime,
      setDate,
    };
  },
  components: { DateInput, TimeInput },
});
</script>

