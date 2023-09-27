import { dateFormatter } from "asv-hlps";

const FormatDate = ({ date }) => {
  // const format = dayjs(date).format("DD/MM/YYYY");
  const format = dateFormatter(new Date(date));

  return <span>{format}</span>;
};

export default FormatDate;
