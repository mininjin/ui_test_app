<template>
  <main v-if="question" class="h-full flex flex-col px-3 py-5">
    <ProgressBar
      :index="answeredNumber"
      :length="questionLength"
      :duration="PROGRESS_ANIME_DURATION"
    />
    <div class="flex items-center p-2 flex-grow-0 mb-3">
      {{ question.question }}
    </div>
    <div class="flex-1 flex flex-col relative bg-container rounded shadow">
      <component
        v-if="QuestionComponent"
        :is="QuestionComponent"
        :question="question"
        @emitUp="saveInput"
      />
    </div>
    <div class="flex-grow-0 py-2 flex items-center text-center">
      <div class="w-1/2 px-3 flex items-center">
        <button
          type="button"
          class="w-full p-2 rounded-xl bg-sub text-white"
          @click="changePage(-1)"
        >
          戻る
        </button>
      </div>
      <div class="w-1/2 px-3 flex items-center">
        <button
          type="button"
          :disabled="disableNext"
          class="w-full p-2 bg-next rounded-xl"
          @click="changePage(+1)"
        >
          次へ
        </button>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { AnswerPayload } from "@/store/mutations";
import { State } from "@/store/state";
import { useQuestion } from "@/components/questions/useQuestion";
import { useRouter } from "vue-router";
import { ROUTE } from "@/constants/application";
import ProgressBar from "@/components/UI/ProgressBar.vue";

const { INPUT_TOP, INPUT_END } = ROUTE;
const PROGRESS_ANIME_DURATION = 300;

export default defineComponent({
  setup(_) {
    const store = useStore<State>();
    const router = useRouter();
    const question = computed(() => store.state.page.question);
    const questionIndex = computed(() => store.state.page.questionIndex);
    const questionLength = computed(
      () => store.state.page.questionnaire?.questions.length || 0
    );
    const answeredNumber = computed(
      () =>
        store.state.page.questionnaire?.questions.filter((v) => v.answered)
          .length || 0
    );
    const { QuestionComponent, setQuestionComponent } = useQuestion();
    const disableNext = ref(true);
    //
    const changePage = async (incremental: number) => {
      QuestionComponent.value = undefined;
      const nextIndex = await store.dispatch("setQuestion", incremental);
      if (nextIndex < 0) {
        router.push(INPUT_TOP);
      } else if (nextIndex >= questionLength.value) {
        router.push(INPUT_END);
      } else {
        createQuestion();
      }
    };
    //
    const createQuestion = () => {
      if (question.value) {
        setQuestionComponent(question.value.type);
        setDisableNext(question.value.answered || false);
      } else {
        console.error("Error: there is no question !");
        router.push(INPUT_TOP);
      }
    };
    //
    const saveInput = async (payload: AnswerPayload) => {
      store.commit("setAnswer", payload);
      setDisableNext(payload.answered);
    };
    //
    const setDisableNext = (answered: boolean) =>
      (disableNext.value =
        question.value?.required === false ? false : !answered);
    onMounted(async () => {
      // 設問を設定
      await store.dispatch("setQuestion", 0);
      createQuestion();
    });
    return {
      QuestionComponent,
      question,
      questionLength,
      changePage,
      saveInput,
      disableNext,
      PROGRESS_ANIME_DURATION,
      answeredNumber,
    };
  },
  components: { ProgressBar },
});
</script>