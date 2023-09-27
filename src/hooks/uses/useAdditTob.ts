import { useForm } from "react-hook-form";

// const useAdditTob = ({ schema, tob, onSubmitForm, onCancelForm }) => {
const useAdditTob = (schema, tob, onSubmitForm, onCancelForm) => {
  const methods = useForm<{ name: string; code: string }>({
    defaultValues: tob ? tob : {},
    resolver: schema,
    mode: "onChange",
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
  } = methods;

  const formSubmit = (data) => {
    onSubmitForm(data);
    methods.reset();
  };

  const handleCancel = (props) => {
    onCancelForm(false);
    methods.reset();
  };
  return { handleCancel, formSubmit, methods };
};

export default useAdditTob;
