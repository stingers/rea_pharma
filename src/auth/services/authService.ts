/* import storageService from "asv-hlps/lib/cjs/services/storageService";
import jwtDecode from "jwt-decode";

import { AuthService } from "./auth";

type LoginType = {
  username: string;
  password: string;
};

export class AuthService {
  tokenKey: string = "";
  authStes: string[] = [];
  capacitor?: boolean = false;
  TData;

  constructor(tokenkey: string, authStes: string[], capacitor?: boolean) {
    this.tokenKey = tokenkey;
    this.authStes = authStes;
    // TData = typeof TData;
    capacitor = capacitor;
  }

  // getStorageToken = (tokenKey, local = false) => {
  getStorageToken = (param?: "local") => {
    if (!this.tokenKey) {
      return null;
    }
    return storageService.getStorage(this.tokenKey, param);
  };

  // setStorageToken = (tokenKey, jwt) => {
  setStorageToken = (jwt: any): any => {
    if (!this.tokenKey) {
      return null;
    }
    storageService.setStorage(this.tokenKey, jwt);
  };

  // decodeToken = (tokenKey) => {
  decodeToken = () => {
    return jwtDecode(this.getStorageToken());
  };

  // removeStorageToken = (tokenKey) => {
  removeStorageToken = () => {
    storageService.removeStorage(this.tokenKey);
  };

  login = async (tob: LoginType, httpService: any) => {
    try {
      const { data: jwt } = await httpService.post("auth/login", tob);
      this.setStorageToken(jwt.token);
      return true;
    } catch (error) {
      console.log(error);
    }
  };

  logout = () => {
    this.removeStorageToken();
    // userAuthNavigate("/");
    // navigate("/");
    return true;
  };

  // authUser = (): User => {
  authUser = (): any => {
    // authUser = () => {
    try {
      // const jwt = localStorage.getItem(tokenKey);
      const token = this.getStorageToken();
      return jwtDecode(token);
    } catch (ex) {
      return null;
    }
  };

  getAuth = (authUser: User | UserNotarial, authSte: string[], param?: AuthParam) => {
    return getAuth(authUser, authSte, param);
  };

  getAuth = (param?: AuthParam) => {
    // return getAuth<TData>(this.authUser(), this.authStes, param);
    return getAuth(this.authUser(), this.authStes, param);
  };
}

export default new AuthService("awPharma", ["stinger's", "cpa", "eqeer"]) as AuthService; */

import { AuthService } from "asv-hlps";

export default new AuthService("awPharma", ["stinger's", "cpa", "eqeer"]);
