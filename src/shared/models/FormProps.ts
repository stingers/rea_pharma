export type FormPropsType<T> = {
  onSubmitForm: (values) => any;
  onCancelForm: (value) => any;
  tob?: T;
};
