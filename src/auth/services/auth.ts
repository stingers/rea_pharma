import { AuthTag, Ste, SteGrp, UserGrp, UserRole, isStaffSte } from "asv-hlps";

interface AuthParam {
  tag?: string;
  roles?: string[];
  grps?: string[];
  staff?: { roles?: string[]; steGrps?: string[] };
  client?: { roles?: string[]; steGrps?: string[] };
  rolesClient?: string[];
  steGrps?: string[];
  steNames?: string[];
  url?: string;
}

type typeT = {
  tags?: AuthTag[];
  ste: Ste;
  role: UserRole;
  grp: UserGrp;
  steGrp: SteGrp;
};

// function getAuth<T extends typeT>(authUser: T, authSte: string[], param?: AuthParam) {
// const getAuth  = (authUser: User | UserNotarial, authSte: string[], param?: AuthParam) => {
const getAuth = <T extends typeT>(authUser: T, authSte: string[], param?: AuthParam) => {
  if (param?.tag && authUser?.tags.length) {
    const tags: string[] = [];
    for (const tag of authUser.tags) {
      tags.push(tag.code.toLowerCase());
    }
    const authIn = tags.includes(param.tag.toLowerCase());
    if (authIn) {
      return true;
    }
  }

  if (param?.roles?.length > 0) {
    if (isStaffSte(authSte, authUser.ste.name) && ["sadm", ...param.roles].includes(authUser.role.code.toLowerCase())) {
      return true;
    }
  }
  // ------ staff ------
  if (param?.staff) {
    if (
      param?.staff.roles?.length > 0 &&
      isStaffSte(authSte, authUser.ste.name) &&
      ["sadm", ...param.roles].includes(authUser.role.code.toLowerCase())
    ) {
      return true;
    }
  }
  // ------ client ------
  if (param?.client) {
    if (!isStaffSte(authSte, authUser.ste.name)) {
      if (
        param.client.roles &&
        !param.client.steGrps &&
        param.client.roles.length > 0 &&
        ["ceo", ...param?.client.roles].includes(authUser.role.code.toLowerCase())
      ) {
        return true;
      }

      if (
        !param.client.roles &&
        param.client.steGrps &&
        param.client.steGrps.length &&
        param.client.steGrps.includes(authUser.ste.grp.code.toLowerCase())
      ) {
        return true;
      }
      if (
        param?.client.roles?.length &&
        param?.client.steGrps.length &&
        ["ceo", ...param?.client.roles].includes(authUser.role.code.toLowerCase()) &&
        (param?.client.steGrps).includes(authUser.ste.grp.code.toLowerCase())
      ) {
        return true;
      }
    }
  }

  // ------ ste grps ------
  if (param?.steGrps?.length > 0 && param.steGrps.includes(authUser.ste.grp.code.toLowerCase())) {
    return true;
  }

  if (param?.grps?.length && param.grps.includes(authUser.grp.code.toLowerCase())) {
    return true;
  }

  if (param?.steNames?.length > 0 && param.steNames.includes(authUser.ste.name.toLowerCase())) {
    return true;
  }
  return false;
};

export { getAuth, type AuthParam };
// export { getAuth };
