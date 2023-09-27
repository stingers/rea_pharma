import { User } from "asv-hlps/lib/cjs/models/entities/users/User";
import React, { createContext, ReactNode, useContext } from "react";

import authService from "./services/authService";

type TobProps = {
  children: ReactNode;
};

const authUser: User = authService.authUser();

const AuthContext = createContext<User>({} as User);

export const useAuthContext = () => useContext(AuthContext);

const AuthProvider = ({ children }: TobProps) => {
  return <AuthContext.Provider value={authUser}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
