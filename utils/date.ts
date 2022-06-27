import moment from "moment";

const toDateTime = (secs: number) => {
  var t = new Date(1970, 0, 1);
  t.setSeconds(secs);
  return t;
};

const getAvlDate = (time: number): string => {
  const date = moment(toDateTime(time as number))
    .utcOffset(0, false)
    .format("ll");

  return date;
};

const getAvlTime = (time: number): string => {
  const date = moment(toDateTime(time as number))
    .utcOffset(0, false)
    .format("LTS");

  return date;
};

export { getAvlDate,getAvlTime };
