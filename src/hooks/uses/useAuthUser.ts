import { useEffect, useState } from "react";

import authService from "../../auth/services/authService";

const useAuthUser = (): { user: any | void } => {
  const [authUser, setAuthUser] = useState(null);
  useEffect(() => {
    try {
      const user = authService.decodeToken();
      setAuthUser(user);
    } catch (error) {
      console.log(error);
    }
  }, []);
  return authUser;
};

export default useAuthUser;
