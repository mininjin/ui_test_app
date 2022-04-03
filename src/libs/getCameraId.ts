const VIDEO_LABEL = "camera2 0, facing back";

export const getCameraId = async (): Promise<string> => {
	// enumerateDeviceでlabelを取得するためにアクセス許可する
	const stream = await navigator.mediaDevices.getUserMedia({
		audio: false,
		video: true,
	});
	stream.getVideoTracks().forEach((v) => v.stop());
	// MediaDevices内から検索
	const devices = await navigator.mediaDevices.enumerateDevices();
	const videoDevices = devices.filter(
		(v) => v.kind == "videoinput" && v.label.indexOf(VIDEO_LABEL) >= 0 // カメラの選定
	);
	// idの取得
	let cameraId = "";
	if (videoDevices.length > 0) {
		cameraId = videoDevices[0].deviceId;
	}
	return cameraId;
};
