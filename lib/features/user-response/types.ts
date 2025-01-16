import type { TQuestionAny } from "@/app/questionnaires/types";

export interface IGetQuestionnaireRequestParameters {
  questionnaireId?: string;
}

export interface IGetQuestionnaireResponse {
  questions: TQuestionAny[];
}

export interface ISetUserResponseRequest {
  questionId: string;
  userResponseType: string;
  userResponse: {
    text: string;
  };
}

export interface ISetUserResponseResponse {
  questionId: string;
  userResponse: {
    text: string;
  };
  systemUserResponseId: string;
  systemAcceptTimeUtc: string;
}

export type UserResponseTextType = {
  text?: string;
};

export type UserResponseArraySelectType = {
  selectedOptions?: string[];
};

export interface AcceptedUserResponse<
  T extends UserResponseTextType | UserResponseArraySelectType
> {
  systemUserResponseId: string;
  systemAcceptTime: number;
  questionId: string;
  userResponse: T;
}
