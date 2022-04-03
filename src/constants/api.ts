export const API_HOST = "http://192.168.11.9:4000/api";
export const IMAGE_DIR = "/images/";

import { Barcode } from "@/@types/schema/question";

const data: Barcode = {
  questionId: 8,
  type: "barcode",
  question: "食料品のバーコードを読み取ります。",
  required: true,
  config: { reader: "ean_reader" },
};
