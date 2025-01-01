export interface IQuestionFEMeta {
  isSkipped: boolean;
  userFlags: string;
  userSortPosition: number;
}

type TUserPromptType = "text" | "multimedia";
type TUserResponseType = "any-of" | "free-text-255" | "one-of-2" | "one-of-4";
type TTextItem = { labelText: string; value: string };
type TBooleanItem = { labelText: string; value: boolean };
type TMultimediaProperties = {
  mediaContentType: "audio/mpeg" | "video/mp4" | "link/youtube" | "link/image";
  height: number;
  width: number;
  url: string;
  specialInstructionText: string;
};

type TQuestionGeneric<
  // maybe these types shouldn't have default values
  UPromptType extends TUserPromptType = "text",
  UResponseType extends TUserResponseType = "free-text-255"
> = {
  userPromptType: UPromptType;
  userResponseType: UResponseType;
  questionId: string;
  userResponseHistory?: any[]; // for teaching tool this is a nice have. for exam this is a security risk (maybe).
  feMeta?: IQuestionFEMeta;
};

type TQuestionTextOneOf4 = TQuestionGeneric<"text", "one-of-4"> & {
  userPromptText: string;
  choices: TChoiceOption[];
  validAnswers: TTextItem[]; // sometimes submitting image or sound file - in which case it wont be multiple guess
  answerFodderId: string;
  userResponse: { value: string | null };
};

type TQuestionGenericUserPromptMultimedia = TQuestionGeneric<
  "multimedia",
  any
> & {
  links: TMultimediaProperties[];
};

// *tmc* - probably want to re-think this type inheritance
// we want generic userPrompt(Text|Multimedia) generic with user response.
// we do not want spaghetti inheritance
type TQuestionUserPromptText = TQuestionGeneric<"text", any> & {
  userPromptText: string;
};

type TQuestionTextText = TQuestionGeneric<"text", "free-text-255"> & {
  userPromptText: string;
  userResponse: { text: string | null };
};

type TQuestionTextTrueFalse = TQuestionGeneric<"text", "one-of-2"> & {
  userPromptText: string;
  validAnswers: TBooleanItem[]; // sometimes submitting image or sound file - in which case it wont be multiple guess
  userResponse: { value: "true" | "false" | null };
};
type TChoiceOption = {
  labelText: string;
  value: string;
};

type TQuestionTextAnyOf = TQuestionGeneric<"text", "any-of"> & {
  userPromptText: string;
  validAnswers: TTextItem[]; // sometimes submitting image or sound file - in which case it wont be multiple guess
  choices: TChoiceOption[];

  userResponse: { values: string[] | null };
};

// --------------

type TQuestionMultimediaText = TQuestionGeneric<
  "multimedia",
  "free-text-255"
> & {
  links: TMultimediaProperties[];
  instructionText: string;
  userResponse: { text: string | null };
};

type TQuestionMultimediaOneOf4 = TQuestionGeneric<"multimedia", "one-of-4"> & {
  links: TMultimediaProperties[];
  instructionText: string;
  choices: TChoiceOption[];

  validAnswers: TTextItem[]; // sometimes submitting image or sound file - in which case it wont be multiple guess
  answerFodderId: string;
  userResponse: { value: string | null };
};

type TQuestionMultimediaAnyOf = TQuestionGeneric<"multimedia", "any-of"> & {
  links: TMultimediaProperties[];
  instructionText: string;
  choices: TChoiceOption[];
  validAnswers: TTextItem[]; // sometimes submitting image or sound file - in which case it wont be multiple guess
  answerFodderId: string;
  userResponse: { values: string[] | null };
};

type TQuestionMultimediaTrueFalse = TQuestionGeneric<
  "multimedia",
  "one-of-2"
> & {
  links: TMultimediaProperties[];
  instructionText: string;
  validAnswers: TBooleanItem[]; // sometimes submitting image or sound file - in which case it wont be multiple guess
  userResponse: { value: "true" | "false" | null };
};

type TMultimediaLink = TMultimediaProperties;

type TQuestionAny =
  | TQuestionGenericUserPromptMultimedia
  | TQuestionTextAnyOf
  | TQuestionTextOneOf4
  | TQuestionTextText
  | TQuestionTextTrueFalse
  | TQuestionMultimediaAnyOf
  | TQuestionMultimediaOneOf4
  | TQuestionMultimediaText
  | TQuestionMultimediaTrueFalse;

type TQuestionUserResponseText = TQuestionTextText | TQuestionMultimediaText;
type TQuestionUserResponseAnyOf = TQuestionTextAnyOf | TQuestionMultimediaAnyOf;
// TQuestionUserResponseText
type TQuestionUserResponseOneOf4 =
  | TQuestionTextOneOf4
  | TQuestionMultimediaOneOf4;

export type {
  TChoiceOption,
  TMultimediaLink,
  TQuestionAny,
  TQuestionUserPromptText,
  TQuestionUserResponseAnyOf,
  TQuestionUserResponseOneOf4,
  TQuestionUserResponseText,
  TQuestionMultimediaOneOf4,
  TQuestionTextOneOf4,
  TQuestionGenericUserPromptMultimedia,
  TUserResponseType,
};

export type TQuestionText = {
  userPromptType: "text";
  userPromptText: string;
};

export type TQuestionMultimedia = {
  userPromptType: "multimedia";
  instructionText: string;
  links: Array<{
    mediaContentType: "link/youtube" | "link/image";
    url: string;
    width: number;
    height: number;
    specialInstructionText: string;
  }>;
};
