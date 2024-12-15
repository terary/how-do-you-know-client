import type { TUserResponseType } from "@/app/questionnaires/types";

export type TUserResponse = {
  questionId: string;
  userResponseType: TUserResponseType;
  userResponse: {
    text: string;
  };
};
