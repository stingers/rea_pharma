import { createContext } from "react";

// const AuthContext = createContext<User>(null);
const AuthContext = createContext(null);

AuthContext.displayName = "AuthContext";

export default AuthContext;
