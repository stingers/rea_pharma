import { toast } from "react-toastify";

export class Toastify {
  static success: any = (msg = "Votre action a été bien éffectuée") => {
    return toast.success(msg);
  };

  static error: any = (msg = "Une erreur s'est produite") => {
    return toast.error(msg);
  };
}
