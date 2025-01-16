export const formatting = {
  formatDate: (date: string | Date): string => {
    return new Date(date).toLocaleDateString();
  },

  formatTime: (date: string | Date): string => {
    return new Date(date).toLocaleTimeString();
  },

  formatDateTime: (date: string | Date): string => {
    return new Date(date).toLocaleString();
  },

  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  truncate: (str: string, length: number): string => {
    if (str.length <= length) return str;
    return str.slice(0, length) + "...";
  },
};
