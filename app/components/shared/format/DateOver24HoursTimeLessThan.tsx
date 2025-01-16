const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

interface DateOver24HoursTimeLessThanProps {
  inputDate: Date;
}

const DateOver24HoursTimeLessThan = ({
  inputDate,
}: DateOver24HoursTimeLessThanProps) => {
  return Math.abs(inputDate.getTime() - new Date().getTime()) >
    TWENTY_FOUR_HOURS_MS
    ? inputDate.toLocaleDateString()
    : inputDate.toLocaleTimeString();
};

export { DateOver24HoursTimeLessThan };
