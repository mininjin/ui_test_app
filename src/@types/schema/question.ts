import { Skip } from "./branches";

export type Questions =
  | Select
  | Member
  | SeekBar
  | Ranking
  | Barcode
  | Text
  | Time
  | Image
  | ZipCode
  | Null;
export type TypeName =
  | "select"
  | "member"
  | "seek-bar"
  | "ranking"
  | "barcode"
  | "text"
  | "time"
  | "zip-code"
  | "image"
  | "null"; // typeリスト
///////////////////////////////////////////////////////////////////////
// 基本の型
///////////////////////////////////////////////////////////////////////
export type QuestionTemplate = {
  questionId: number; // 設問Id
  type: TypeName | "branch";
  question: string; // 設問タイトル
  required?: boolean; // 回答必須かどうか デフォルトは必須
  skip?: Skip[]; // スキップのコンフィグ
  answered?: boolean;
};

///////////////////////////////////////////////////////////////////////
// 選択式
///////////////////////////////////////////////////////////////////////
export type Select = QuestionTemplate & {
  type: "select";
  config: { choices: (string | undefined)[]; multiSelect?: boolean };
  answer?: SelectAnswer;
};
export type SelectAnswer = { index: number; label: string }[];

///////////////////////////////////////////////////////////////////////
// 人数入力
///////////////////////////////////////////////////////////////////////
export type Member = QuestionTemplate & {
  type: "member";
  config: {
    choices: {
      label?: string; // 選択肢表示名
      unit: string; // 単位
      step: number; // 増減の1単位
    }[];
    inputSingle?: boolean; // 1項目のみ入力 全てに入力可能ならnullかundefined
  };
  answer?: MemberAnswer;
};
export type MemberAnswer = { label: string; number: number; index: number }[];

///////////////////////////////////////////////////////////////////////
// シークバー
///////////////////////////////////////////////////////////////////////
export type SeekBar = QuestionTemplate & {
  type: "seek-bar";
  config: {
    labels: string[]; // 表示ラベル index/(length-1)の割合の位置に入る
  };
  answer?: SeekBarAnswer; // 回答の割合[%]
};
export type SeekBarAnswer = number;

///////////////////////////////////////////////////////////////////////
// ランキング
///////////////////////////////////////////////////////////////////////
export type Ranking = QuestionTemplate & {
  type: "ranking";
  config: {
    choices: (string | undefined)[];
    lowest?: number; // 何位まで入れるか最大5
  };
  answer?: RankingAnswer;
};
export type RankingAnswer = { index: number; rank: number; label: string }[];

///////////////////////////////////////////////////////////////////////
// カメラ
///////////////////////////////////////////////////////////////////////
export type Barcode = QuestionTemplate & {
  type: "barcode";
  config: { reader: string };
  answer?: BarcodeAnswer;
};
export type BarcodeAnswer = string;

///////////////////////////////////////////////////////////////////////
// 自由入力
///////////////////////////////////////////////////////////////////////
export type Text = QuestionTemplate & {
  type: "text";
  config: {
    placeholder?: string; // テキストボックス内が空欄の時に表示される文字列 デフォルトは"自由入力欄"
    rows?: number; // 行数
    max?: number; // 最大文字数
    min?: number; // 最小文字数
  };
  answer?: TextAnswer;
};
export type TextAnswer = string;

///////////////////////////////////////////////////////////////////////
// 時刻
///////////////////////////////////////////////////////////////////////
export type Time = QuestionTemplate & {
  type: "time";
  config?: {
    disableTime?: boolean; // trueなら時刻を非表示
    disableFuture?: boolean; // trueの時は現在より未来は不可にする
    timeStep?: number; // 時刻の刻み幅
  };
  answer?: TimeAnswer;
};
export type TimeAnswer = string;

///////////////////////////////////////////////////////////////////////
// 住所
///////////////////////////////////////////////////////////////////////
export type ZipCode = QuestionTemplate & {
  type: "zip-code";
  config: { requireLength?: number };
  answer?: ZipCodeAnswer;
};
export type ZipCodeAnswer = string;

///////////////////////////////////////////////////////////////////////
// 画像
///////////////////////////////////////////////////////////////////////
export type Image = QuestionTemplate & {
  type: "image";
  option: {
    src: string;
    text?: string;
    choices: string[];
  };
  answer?: ImageAnswer;
};
export type ImageAnswer = number;

///////////////////////////////////////////////////////////////////////
// スキップ
///////////////////////////////////////////////////////////////////////
export type Null = QuestionTemplate & {
  type: "null";
  required: false;
  answered: true;
  answer: undefined;
};
