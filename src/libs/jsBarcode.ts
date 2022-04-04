import { Barcode } from "@/@types/schema/question";
import { Options } from "jsbarcode";

export const getOptionsFromConfig = (config?: Barcode["config"]) => {
  const options: Options = {};
  if (config) {
    const { reader } = config;
    switch (reader) {
      case "code_128_reader":
        options.format = "CODE128";
        break;
      case "ean_reader":
        options.format = "EAN13";
        break;
      case "ean_8_reader":
        options.format = "EAN8";
        break;
      case "upc_e_reader":
      case "upc_reader":
        options.format = "UPC";
        break;
      case "code_39_reader":
      case "code_39_vin_reader":
        options.format = "CODE39";
        break;
      case "codabar_reader":
        options.format = "codabar";
        break;
      case "2of5_reader":
      case "i2of5_reader":
        options.format = "ITF";
        break;
    }
  }
  return options;
};
