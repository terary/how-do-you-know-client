"use client";
import { Questionnaires } from "../components/questionnaires/Questionnaires";
import { useTranslation } from "react-i18next";

export default function QuestionnairesPage() {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t("questionnairePage.title")}</h1>
      <p>{t("questionnairePage.description")}</p>
      <Questionnaires />
    </>
  );
}
