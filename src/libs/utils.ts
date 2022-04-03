/**
 * URL
 */
export const getFromQuery = (key: string): string | null =>
	new URLSearchParams(location.search).get(key);

/**
 * Date
 */
// constants
const DATE_SPLITTER = "-";
export const DATE_FORMAT = new RegExp(
	`[0-9]{4}${DATE_SPLITTER}[0-9]{2}${DATE_SPLITTER}[0-9]{2}`
);
const DATE_LENGTH = 10;
export const MONTH_LENGTH = 12;
export const TIME_SPLITTER = ":";
export const TIME_FORMAT = new RegExp(`[0-9]{2}${TIME_SPLITTER}[0-9]{2}`);
const TIME_LENGTH = 5;
// Date -> DateString
export const getDateString = (date: Date): string =>
	[
		("0" + date.getFullYear()).slice(-4),
		("0" + (date.getMonth() + 1)).slice(-2),
		("0" + date.getDate()).slice(-2),
	].join(DATE_SPLITTER);
// Date -> TimeString
export const getTimeString = (date: Date): string =>
	[("0" + date.getHours()).slice(-2), ("0" + date.getMinutes()).slice(-2)].join(
		TIME_SPLITTER
	);
// Date -> full date
const MILLISECONDS_PER_DATE = 86400000;
const UTC_DIFFERENCE = 9 * 3600 * 1000;
export const getFullDate = (date: Date): number =>
	Math.floor((date.getTime() + UTC_DIFFERENCE) / MILLISECONDS_PER_DATE);
export const getDateDifference = (start: Date, end: Date) =>
	Math.floor((end.getTime() - start.getTime()) / MILLISECONDS_PER_DATE);
// 月を取得
export const getFullMonth = (date: Date): number =>
	date.getMonth() + 1 + date.getFullYear() * MONTH_LENGTH;
// String -> Date
export const getDateInstanseFromString = (
	str: string,
	timeStr?: string
): Date | undefined => {
	let result: Date | undefined = undefined;
	// フォーマットごとにインスタンスを作成
	if (/[0-9]{4}\/[0-9]{2}\/[0-9]{2}/.test(str)) {
		const [year, month, date] = str.split("/");
		result = new Date(parseInt(year), parseInt(month) - 1, parseInt(date));
	} else if (/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(str)) {
		const [year, month, date] = str.split("-");
		result = new Date(parseInt(year), parseInt(month) - 1, parseInt(date));
	} else if (/[0-9]{8}/.test(str)) {
		const year = parseInt(str.slice(0, 4));
		const month = parseInt(str.slice(4, 6));
		const date = parseInt(str.slice(6, 8));
		result = new Date(year, month - 1, date);
	}
	// 時刻も指定されている場合
	if (result instanceof Date && timeStr) {
		const { hours, minutes } = getHoursMinutes(timeStr);
		result.setHours(hours);
		result.setMinutes(minutes);
	}
	return result;
};
// String -> DateString, TimeString
export const getDateTimeStringFromString = (str?: string) => {
	let date: string | undefined = undefined;
	let time: string | undefined = undefined;
	//
	if (typeof str == "string") {
		//
		const dateIndex = str.search(DATE_FORMAT);
		if (dateIndex >= 0) date = str.slice(dateIndex, dateIndex + DATE_LENGTH);
		//
		const timeIndex = str.search(TIME_FORMAT);
		if (timeIndex >= 0) time = str.slice(timeIndex, timeIndex + TIME_LENGTH);
	}
	return { date, time };
};

// 時刻の範囲内にあるか判定
export const isInTimeInterval = (
	date: Date,
	startString: string,
	endString: string
) => {
	// startの時刻
	const start = new Date(date);
	const startTime = getHoursMinutes(startString);
	start.setHours(startTime.hours);
	start.setMinutes(startTime.minutes);
	// endの時刻
	const end = new Date(date);
	const endTime = getHoursMinutes(endString);
	end.setHours(endTime.hours);
	end.setMinutes(endTime.minutes);
	// 返値
	return start.getTime() <= date.getTime() && date.getTime() <= end.getTime();
};
// string -> hours, minutes
export const getHoursMinutes = (timeString: string) => {
	const result = { hours: 0, minutes: 0 };
	if (TIME_FORMAT.test(timeString)) {
		const [hours, minutes] = timeString.split(TIME_SPLITTER);
		result.hours = parseInt(hours);
		result.minutes = parseInt(minutes);
	}
	return result;
};
// Date -> Year (20xx)
export const getMinimumYear = (date: Date) =>
	parseInt((date.getFullYear() + "").slice(-2));

//
export const increaseIncrement = (increment: number) =>
	Math.sign(increment) * (Math.abs(increment) + 1);

//
export const blobToBase64 = (blob: Blob) =>
	new Promise<string | ArrayBuffer | undefined>((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener("load", ({ target }) =>
			resolve(target?.result || undefined)
		);
		reader.addEventListener("error", ({ target }) => reject(target?.error));
		reader.readAsDataURL(blob);
	});
