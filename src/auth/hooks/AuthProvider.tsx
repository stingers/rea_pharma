import { AuthContext } from "asv-hlps-react";
import { ReactNode } from "react";

import useAuthUser from "../../hooks/uses/useAuthUser";
import authService from "../services/authService";

interface Props {
  children: ReactNode;
}

const AuthProvider = ({ children }: Props) => {
  const authUser = authService.authUser();
  // const authUser = useAuthUser();

  return <AuthContext.Provider value={authUser}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
