<template>
  <header class="flex flex-col z-30 bg-theme text-sub">
    <div class="flex items-center p-2">
      <h1 class="px-2 text-2xl flex-grow font-name font-bold">
        {{ APP_NAME }}
      </h1>
      <div class="mr-1 rounded-lg flex items-center justify-center px-2">
        <span class="material-icons text-sub text-4xl" @click="toggleMenu"
          >menu</span
        >
      </div>
    </div>
  </header>
  <transition
    enter-active-class="enter"
    enter-from-class="enter-from"
    enter-to-class="enter-to"
    leave-active-class="leave"
    leave-from-class="leave-from"
    leave-to-class="leave-to"
  >
    <header
      v-if="menu"
      class="fixed flex flex-col top-0 left-0 w-full h-full bg-container z-20"
    >
      <div class="flex items-center opacity-0 mb-5">
        <h1 class="text-xl flex-grow">ここは表示されません。</h1>
        <div
          class="
            mr-1
            shadow-btn
            rounded-lg
            bg-sub
            flex
            items-center
            justify-center
            px-2
          "
        >
          <span class="material-icons text-white text-4xl">menu</span>
        </div>
      </div>
      <div class="flex-grow basis-0 p-3 text-sub flex flex-col">
        <div
          class="rounded shadow my-2 flex-grow basis-0 flex flex-col bg-theme"
        >
          <div
            class="
              flex-grow-0 flex
              items-center
              justify-center
              text-center
              font-bold
              text-lg
              bg-header
              p-2
            "
          >
            メインメニュー
          </div>
          <ul class="overflow-y-scroll flex-grow basis-0 px-2">
            <button
              v-if="nextQuestionnaireIndex >= 0"
              class="w-full bg-next mt-2 px-3 py-2 text-left"
              @click="goNext"
            >
              次のアンケートの入力
            </button>
            <button
              class="w-full bg-sub text-white mt-2 px-3 py-2 text-left"
              @click="go(INPUT_MODIFY)"
            >
              回答の修正
            </button>
            <button
              class="w-full mt-2 px-3 py-2 text-left bg-container"
              @click="fetchData"
            >
              データをリセット
            </button>
            <a
              class="
                w-full
                mt-2
                px-3
                py-2
                text-left
                bg-container
                flex
                items-center
                underline
              "
              href="https://twitter.com/Utan_Otouto"
              target="_blank"
              rel="noopener noreferrer"
            >
              <font-awesome-icon
                icon="twitter"
                type="fab"
                class="mr-2 w-5 h-5"
              />
              Twitter
            </a>
            <a
              class="
                w-full
                mt-2
                px-3
                py-2
                text-left
                bg-container
                flex
                items-center
                underline
              "
              href="https://github.com/mininjin/ui_test_app/tree/front-only"
              target="_blank"
              rel="noopener noreferrer"
            >
              <font-awesome-icon
                icon="github"
                type="fab"
                class="mr-2 w-5 h-5"
              />
              GitHub
            </a>
          </ul>
        </div>
        <div class="flex items-center mt-2 flex-grow-0 py-5">
          <button
            class="
              rounded-xl
              bg-white
              text-sub
              w-full
              shadow
              border-2 border-sub
              p-1
            "
            @click="go(HOME)"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    </header>
  </transition>
</template>

<script lang="ts">
import { APP_NAME, ROUTE } from "@/constants/application";
import FontAwesomeIcon from "@/plugins/FontAwesomeIcon.vue";
import { State } from "@/store/state";
import { computed, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const { HOME, INPUT_MODIFY, INPUT_TOP } = ROUTE;

export default defineComponent({
  components: { FontAwesomeIcon },
  setup() {
    const store = useStore<State>();
    const router = useRouter();
    const nextQuestionnaireIndex = computed(() =>
      store.state.questionnaires.questionnaires.findIndex((v) => !v.answered)
    );
    const menu = ref(false);
    const toggleMenu = () => (menu.value = !menu.value);
    const go = (root: string) => {
      router.push(root);
      menu.value = false;
    };
    const goNext = () => {
      store.commit("setQuestionnaireIndex", nextQuestionnaireIndex.value);
      router.push(INPUT_TOP);
    };
    const fetchData = async () => {
      // 全調査データをサーバーから取得
      await store.dispatch("fetchQuestionnaires");
      go(HOME);
    };
    return {
      go,
      HOME,
      INPUT_MODIFY,
      APP_NAME,
      menu,
      nextQuestionnaireIndex,
      fetchData,
      goNext,
      toggleMenu,
    };
  },
});
</script>

<style scoped>
.enter,
.leave {
  transition: all 0.5s ease-in-out;
}
.enter-from,
.leave-to {
  transform: translateY(-100%);
}
.leave-from,
.enter-to {
  transform: translateY(0);
}
</style>
