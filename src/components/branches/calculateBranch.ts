import { Branches } from "@/@types/schema/branches";
import { Questions } from "@/@types/schema/question";

export const calculateBranch = (
  branch: Branches,
  questions: (Questions | Branches)[]
): number => {
  let branchIndex = branch.config.defaultBranch;
  branchIndex = 0;
  return branchIndex;
};
