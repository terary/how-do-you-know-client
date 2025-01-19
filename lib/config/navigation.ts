import {
  Home as HomeIcon,
  People as PeopleIcon,
  QuestionMark as QuestionIcon,
  Folder as FolderIcon,
  Verified as VerifiedIcon,
  QuestionAnswer as QuestionAnswerIcon,
  BugReport as BugReportIcon,
  AccountCircle as AccountCircleIcon,
  School as SchoolIcon,
  Class as ClassIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";

export const navigation = [
  {
    name: "home",
    href: "/",
    icon: HomeIcon,
  },
  {
    name: "verify",
    href: "/verify",
    icon: VerifiedIcon,
  },
  {
    name: "questionnaires",
    href: "/questionnaires",
    icon: QuestionAnswerIcon,
  },
  {
    name: "users",
    href: "/users",
    icon: PeopleIcon,
  },
  {
    name: "questionTemplates",
    href: "/question-templates",
    icon: QuestionIcon,
  },
  {
    name: "examTemplates",
    href: "/exam-templates",
    icon: AssignmentIcon,
  },
  {
    name: "fodderPools",
    href: "/fodder-pools",
    icon: FolderIcon,
  },
  {
    name: "learningInstitutions",
    href: "/learning-institutions",
    icon: SchoolIcon,
  },
  {
    name: "instructionalCourses",
    href: "/instructional-courses",
    icon: ClassIcon,
  },
  {
    name: "errorTest",
    href: "/error-test",
    icon: BugReportIcon,
  },
  {
    name: "profile",
    href: "/profile",
    icon: AccountCircleIcon,
  },
];
