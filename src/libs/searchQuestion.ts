import { Branches } from "@/@types/schema/branches";
import { Questions } from "@/@types/schema/question";

export const searchQuestion = (
  refId: number,
  questions: (Questions | Branches)[]
) => {
  let result: Questions | Branches | undefined = undefined;
  // １問ずつidを検索
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    if (question.questionId == refId) {
      result = question;
      break;
    } else if (question.type == "branch") {
      // branchの場合はbranches内を検索
      const branch = question.branches.find((v) => v.questionId == refId);
      if (branch) {
        result = branch;
        break;
      }
    }
  }
  return result;
};
