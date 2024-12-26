import type { TUserResponseType } from "@/app/questionnaires/types";

export type TUserResponse = {
  questionId: string;
  systemAcceptTimeUtc?: number; // this is backend generated so it's not available when FE creates the update request
  systemUserResponseId?: string; // this is backend generated so it's not available when FE creates the update request

  userResponseType: TUserResponseType;
  userResponse: {
    text: string;
  };
};
