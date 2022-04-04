import { Questions, QuestionTemplate, TypeName } from "./question";

export type Branches = Branch;

///////////////////////////////////////////////////////////////////////
// スキップ
///////////////////////////////////////////////////////////////////////
export type Skip = SelectSkip | SeekBarSkip;

export type SelectSkip = {
  refId: number; // 参照先id
  skipLabels: string[]; // jumpTo == skipIndexの時はスキップ
  connector: "and" | "or"; // 前のスキップとの結合方式
  defaultSkip?: boolean; // 全て未選択の場合にスキップするかどうか
};

export type SeekBarSkip = {
  refId: number; // 参照先id
  min: number; // min < answer.data < max
  max: number; // の場合にスキップ
  reversed?: boolean; // スキップ条件を反転
  connector: "and" | "or"; // 前のスキップとの結合方式
};

///////////////////////////////////////////////////////////////////////
// 分岐
///////////////////////////////////////////////////////////////////////
export type Branch = Pick<QuestionTemplate, "questionId" | "answered"> & {
  type: "branch";
  refId: number;
  config: {
    type: TypeName;
    defaultBranch: number;
  } & BranchConfig;
  branches: Questions[];
  answer?: Questions["answer"];
};

export type BranchConfig =
  | BranchSelect
  | BranchSeekBar
  | BranchRanking
  | BranchMember
  | BranchTime
  | BranchBarcode
  | BranchText
  | BranchZipCode
  | BranchImage;

export type BranchSelect = {
  type: "select";
  branchLabels: string[][];
};
export type BranchSeekBar = {
  type: "seek-bar";
  branchSections: { min: number; max: number }[];
};
export type BranchRanking = {
  type: "ranking";
  branchRankingLabels: { [k in number]: string[] }[];
};
export type BranchMember = {
  type: "member";
  branchMemberNumbers: { [k in string]: number }[];
};
export type BranchTime = {
  type: "time";
  branchTimes: { min?: string; max?: string }[];
};
export type BranchText = {
  type: "text";
  branchTexts: string[]; // 含む場合分岐
};
export type BranchBarcode = {
  type: "barcode";
  branchBarcodes: string[]; // 含む場合分岐
};
export type BranchZipCode = {
  type: "zip-code";
  branchZipCodes: string[]; // 含む場合分岐
};
export type BranchImage = {
  type: "image";
  branchZipCodes: number[];
};
