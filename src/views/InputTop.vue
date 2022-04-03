<template>
  <main class="h-full flex flex-col px-3 py-5">
    <div
      v-if="questionnaire"
      class="flex-1 flex flex-col rounded-lg shadow text-sub bg-container mb-2"
    >
      <div
        class="bg-title text-sub p-2 font-bold flex-grow-0 font-title text-xl"
      >
        {{ questionnaire.title }}
      </div>
      <div class="p-3 bg-container flex-grow-0">
        {{ questionnaire.explanation }}
      </div>
      <div class="bg-header text-sub p-2 font-bold flex-grow-0">
        <div class="question-title">全体の回答状況</div>
      </div>
      <div class="flex-1 overflow-y-scroll p-3 bg-container">
        <p
          v-for="(questionnaire, index) in questionnaires"
          class="mb-1"
          :key="questionnaire.questionnaireId"
        >
          {{ questionnaire.title }}：
          <span v-if="index == questionnaireIndex" class="fw-bold underline"
            >回答中</span
          >
          <span v-else-if="questionnaire.answered"> 回答済 </span>
          <span v-else class="fw-bold"> 未回答 </span>
        </p>
      </div>
      <div class="flex items-center flex-wrap p-2 text-sub">
        <button
          class="w-full p-2 mb-2 bg-next text-sub"
          @click="go(INPUT_INPUT)"
        >
          始める
        </button>
        <button class="w-full p-2 bg-sub text-white" @click="go(INPUT_MODIFY)">
          カテゴリーを選択する
        </button>
      </div>
    </div>
    <HomeButton />
  </main>
</template>

<script lang="ts">
import { ROUTE } from "@/constants/application";
import { State } from "@/store/state";
import { computed, defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import HomeButton from "@/components/UI/HomeButton.vue";

const { HOME, INPUT_INPUT, INPUT_MODIFY } = ROUTE;

export default defineComponent({
  setup() {
    const store = useStore<State>();
    const router = useRouter();
    const questionnaires = computed(
      () => store.state.questionnaires.questionnaires
    );
    const questionnaire = computed(() => store.state.page.questionnaire);
    const questionnaireIndex = computed(
      () => store.state.page.questionnaireIndex
    );
    onMounted(() => {
      if (questionnaire.value != undefined) {
        store.commit("setQuestionIndex", 0);
      } else {
        router.push(HOME);
      }
    });
    return {
      questionnaire,
      questionnaires,
      questionnaireIndex,
      INPUT_INPUT,
      INPUT_MODIFY,
      HOME,
      go: router.push,
    };
  },
  components: { HomeButton },
});
</script>
