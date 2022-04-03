<template>
  <main class="px-3 py-5 h-full flex flex-col">
    <div class="flex-1 flex flex-col rounded-lg shadow bg-container">
      <div
        class="
          bg-header
          font-bold
          px-2
          text-sub
          flex-auto flex
          items-center
          justify-center
        "
      >
        回答するカテゴリーを選んでください。
      </div>
      <div class="px-2 h-7/8 overflow-scroll bg-container">
        <li
          class="questionnaires"
          v-for="(item, index) in questionnaires"
          :key="item.questionnaireId"
          @click="onClick(index)"
        >
          <button class="w-full rounded-lg bg-theme p-2 mt-2">
            {{ item.title }}
          </button>
        </li>
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

const { HOME, INPUT_TOP } = ROUTE;

export default defineComponent({
  setup() {
    const store = useStore<State>();
    const router = useRouter();
    const questionnaires = computed(
      () => store.state.questionnaires.questionnaires
    );
    const onClick = (index: number) => {
      store.commit("setQuestionnaireIndex", index);
      go(INPUT_TOP);
    };
    const go = router.push;
    onMounted(() => {
      if (questionnaires.value.length == 0) go(HOME);
    });
    return { questionnaires, onClick, go, HOME };
  },
  components: { HomeButton },
});
</script>
