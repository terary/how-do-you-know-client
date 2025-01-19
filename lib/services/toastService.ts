import { toast, ToastOptions } from "react-toastify";

type LogLevel = "debug" | "info" | "warn" | "error";

const DEFAULT_OPTIONS: ToastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const toastService = {
  show(message: string, level: LogLevel = "info", options: ToastOptions = {}) {
    const toastOptions = { ...DEFAULT_OPTIONS, ...options };

    switch (level) {
      case "debug":
        if (process.env.NODE_ENV === "development") {
          toast.info(message, { ...toastOptions, autoClose: 3000 });
        }
        break;
      case "info":
        toast.info(message, toastOptions);
        break;
      case "warn":
        toast.warning(message, toastOptions);
        break;
      case "error":
        toast.error(message, { ...toastOptions, autoClose: 7000 });
        break;
    }
  },

  // Convenience methods
  debug(message: string, options: ToastOptions = {}) {
    this.show(message, "debug", options);
  },

  info(message: string, options: ToastOptions = {}) {
    this.show(message, "info", options);
  },

  warn(message: string, options: ToastOptions = {}) {
    this.show(message, "warn", options);
  },

  error(message: string, options: ToastOptions = {}) {
    this.show(message, "error", options);
  },
};
