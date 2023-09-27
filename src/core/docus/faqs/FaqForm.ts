import * as yup from "yup";

interface FaqForm {
  catId: number;
  extern: string;
  id?: number;
  intern: boolean;
  question: string;
  response: string;
}

export const FaqSchema = yup.object({
  catId: yup.number().required(),
  question: yup.string().required(),
  response: yup.string().required(),
  extern: yup.boolean(),
  intern: yup.boolean(),
});

export default FaqForm;
