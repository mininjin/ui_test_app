<template>
	<div class="my-1">
		<div class="flex p-1 w-full items-center">
			<label for="input-time" class="w-1/4 text-center font-bold">時刻</label>
			<input
				type="time"
				id="input-time"
				class="flex-grow font-bold border-2 rounded border-header bg-white p-2"
				v-model="timeValue"
				:max="disableFuture ? getTimeString(new Date()) : ''"
				@input="setTime"
			/>
		</div>
		<div class="flex p-1 w-full items-center">
			<div class="w-1/4"></div>
			<div class="w-3/4 flex items-center">
				<button
					class="border-2 border-sub rounded-lg bg-white font-bold w-1/4 p-2"
					@click="changeTime(-timeStep)"
				>
					ー
				</button>
				<button
					class="border-2 border-sub rounded-lg font-bold mx-2 flex-auto p-2 bg-white"
					@click="setNow"
				>
					現在時刻
				</button>
				<button
					class="border-2 border-sub rounded-lg bg-white font-bold w-1/4 p-2"
					@click="changeTime(timeStep)"
				>
					＋
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {
	getDateInstanseFromString,
	getTimeString,
	TIME_FORMAT,
	getHoursMinutes,
} from "@/libs/utils";
import { computed, defineComponent, onMounted, ref, watch } from "vue";

export default defineComponent({
	props: {
		disableFuture: Boolean,
		timeStep: { type: Number, required: true },
		time: String,
		date: String,
	},
	emits: {
		emitUp: (data?: string) => (data ? TIME_FORMAT.test(data) : true),
	},
	setup(props, context) {
		const data = computed(() => props.time);
		const date = computed(() => props.date);
		const timeValue = ref<string>();
		const disableFuture = computed(() => props.disableFuture || false);

		// カレンダー入力
		const setTime = (event: Event) => {
			const { value } = event.target as HTMLInputElement;
			const { hours, minutes } = getHoursMinutes(value);
			emitUp(hours, minutes);
		};
		// 日付のスピナーが押された時実行
		const changeTime = (step: number) => {
			// 前回回答の取得
			const time = data.value || getTimeString(new Date());
			const { hours, minutes } = getHoursMinutes(time);
			// 変更してemit
			emitUp(hours, minutes + step);
		};
		// 今ボタンが押された時実行
		const setNow = () => {
			timeValue.value = getTimeString(new Date());
			context.emit("emitUp", timeValue.value);
		};
		// emit
		const emitUp = (hours: number, minutes: number) => {
			// dateインスタンスの作成
			let dateInstance =
				getDateInstanseFromString(date.value || "") || new Date();
			dateInstance.setHours(hours);
			dateInstance.setMinutes(minutes);
			// 未来が禁止されている場合
			if (disableFuture.value) {
				dateInstance.setSeconds(0);
				dateInstance.setMilliseconds(0);
				if (dateInstance.getTime() > new Date().getTime()) {
					// 未来なら現在の日時に変更
					dateInstance = new Date();
				}
			}
			timeValue.value = getTimeString(dateInstance);
			// emit
			context.emit("emitUp", timeValue.value);
		};
		// データを設定
		watch(data, () => {
			timeValue.value = data.value;
		});

		onMounted(() => {
			// データを設定
			timeValue.value = data.value;
		});

		return { getTimeString, setTime, changeTime, setNow, timeValue };
	},
});
</script>
