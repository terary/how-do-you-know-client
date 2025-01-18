import { toastService } from "../services/toastService";
import { ToastOptions } from "react-toastify";

export const useToast = () => {
  return {
    show: (
      message: string,
      level: "debug" | "info" | "warn" | "error" = "info",
      options?: ToastOptions
    ) => {
      toastService.show(message, level, options);
    },
    debug: (message: string, options?: ToastOptions) => {
      toastService.debug(message, options);
    },
    info: (message: string, options?: ToastOptions) => {
      toastService.info(message, options);
    },
    warn: (message: string, options?: ToastOptions) => {
      toastService.warn(message, options);
    },
    error: (message: string, options?: ToastOptions) => {
      toastService.error(message, options);
    },
  };
};
