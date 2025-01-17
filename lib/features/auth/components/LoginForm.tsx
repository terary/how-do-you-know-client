import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LoginCredentials } from "../types";
import { validation } from "@/utils/validation";

export const LoginForm = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validation.isEmail(credentials.username) && credentials.password) {
      await login(credentials);
    }
  };

  return <form onSubmit={handleSubmit}>{/* Form implementation */}</form>;
};
