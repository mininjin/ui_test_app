<template>
  <main class="px-3 py-5 h-full flex flex-col">
    <div class="rounded-lg shadow flex-1 bg-container">
      <div class="p-2 text-xl font-bold rounded-t-lg">{{ title }}</div>
      <div class="p-2">{{ explanation }}</div>
      <div class="p-2 text-lg font-bold">回答状況</div>
      <div class="p-3">
        <li v-for="(item, i) in questionnaires" :key="item.questionnaireId">
          {{ i + 1 }}. {{ item.title }}：<span
            v-if="item.answered"
            class="material-icons-outlined text-base"
          >
            done_outline </span
          ><span v-else class="text-base">-</span>
        </li>
        <p
          v-if="isCompleted"
          class="mt-4 text-xl font-name font-bold text-sub text-shadow"
        >
          Congratulations !!
        </p>
      </div>
    </div>
    <div
      v-if="questionnaires.length > 0"
      class="mt-2 flex-auto flex items-center"
    >
      <button class="w-full bg-next control-btn" @click="goInput">
        入力に進む
      </button>
    </div>
    <div v-else class="mt-2 flex-auto flex flex-wrap items-center">
      <button class="w-full bg-next control-btn" @click="init">
        データの再取得
      </button>
    </div>
    <ErrorDialog @close="close" @resend="init" />
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { State } from "@/store/state";
import { ROUTE } from "@/constants/application";
import ErrorDialog from "@/components/UI/ErrorDialog.vue";

const { INPUT_TOP, INPUT_MODIFY } = ROUTE;

export default defineComponent({
  setup() {
    const store = useStore<State>();
    const router = useRouter();
    //
    const title = computed(() => store.state.questionnaires.title);
    const questionnaires = computed(
      () => store.state.questionnaires.questionnaires
    );
    const explanation = computed(() => store.state.questionnaires.explanation);
    const nextQuestionnaireIndex = computed(() =>
      store.state.questionnaires.questionnaires.findIndex((v) => !v.answered)
    );
    const isCompleted = computed(
      () =>
        store.state.questionnaires.questionnaires.findIndex(
          (v) => !v.answered
        ) < 0
    );

    const goInput = () => {
      if (nextQuestionnaireIndex.value >= 0) {
        store.commit("setQuestionnaireIndex", nextQuestionnaireIndex.value);
        router.push(INPUT_TOP);
      } else {
        router.push(INPUT_MODIFY);
      }
    };

    onMounted(async () => {
      await init();
    });

    const init = async () => {
      // データをサーバーから取得
      if (questionnaires.value.length == 0) {
        await store.dispatch("fetchQuestionnaires");
      }
    };
    const close = () => store.commit("setError", undefined);
    return {
      title,
      explanation,
      questionnaires,
      goInput,
      init,
      close,
      isCompleted,
    };
  },
  components: { ErrorDialog },
});
</script>

<style scoped>
.text-shadow {
  text-shadow: 0.1rem 0.1rem 0.1rem #0005;
}
</style>