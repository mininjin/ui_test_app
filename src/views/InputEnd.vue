<template>
  <main class="px-3 py-5 h-full flex flex-col">
    <div class="rounded-lg shadow flex-1 bg-container flex flex-col">
      <div class="flex-grow-0 font-title text-xl p-2 font-bold bg-title rounded-t-lg">お疲れ様です</div>
      <div class="flex-1 p-3 overflow-y-scroll">
        <span v-if="nextQuestionnaire">
          次のアンケートは{{ nextQuestionnaire.title }}です。
        </span>
        <span v-else> おめでとうございます！全ての質問に答えました！ </span>
      </div>
    </div>
    <div class="flex-grow-0 flex flex-col mt-2">
      <button
        type="button"
        v-if="nextQuestionnaire"
        class="w-full p-2 bg-next text-sub mb-2"
        @click="goNext"
      >
        次へ進む
      </button>
      <button
        type="button"
        class="w-full p-2 bg-sub text-white mb-2"
        @click="go(INPUT_INPUT)"
      >
        先ほどの回答を修正
      </button>
      <button
        type="button"
        class="w-full p-2 bg-sub text-white mb-2"
        @click="go(INPUT_MODIFY)"
      >
        修正する設問を選択する
      </button>
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

const { HOME, INPUT_TOP, INPUT_INPUT, INPUT_MODIFY } = ROUTE;

export default defineComponent({
  props: {},
  setup() {
    const store = useStore<State>();
    const router = useRouter();
    const nextQuestionnaire = computed(() =>
      store.state.questionnaires.questionnaires.find((v) => !v.answered)
    );
    const nextQuestionnaireIndex = computed(() =>
      store.state.questionnaires.questionnaires.findIndex((v) => !v.answered)
    );
    const go = router.push;
    const goNext = () => {
      store.commit("setQuestionnaireIndex", nextQuestionnaireIndex.value);
      go(INPUT_TOP);
    };
    onMounted(() => {
      store.commit("setAnswered", true);
    });
    return {
      goNext,
      go,
      HOME,
      INPUT_INPUT,
      INPUT_MODIFY,
      nextQuestionnaire,
    };
  },
  components: { HomeButton },
});
</script>
