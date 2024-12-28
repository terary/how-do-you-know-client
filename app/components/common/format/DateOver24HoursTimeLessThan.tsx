const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

`
    This is looking pretty good.

    The answer question, when there is answer history is goofy, but I think that is 
    from the answer question control 

    Focus on answer question no history (change order in BE)


`;

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
