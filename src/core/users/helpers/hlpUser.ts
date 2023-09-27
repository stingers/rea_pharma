import { AuthTag, AuthTagCat, User, UserRole } from "asv-hlps";

export class HlpUser {
  /* constructor(
    public authService: AuthService,
  ) {
    super();
  } */

  static isStaffCpa(user: User) {
    return user.ste && user.ste.name.toLowerCase() === "cpa" ? true : false;
  }

  static userCoef(user: User) {
    return user.grp.code.toLowerCase() === "st" ? user.ste.grp.coef : user.grp.coef;
  }

  static roleZosseur(plus?: string[]) {
    return { roles: ["adm", "phd", "rph", "mcc", ...plus] };
  }

  static getTagSlots = (tags: string[], userTags: string[]) => {
    let map = {};
    tags.forEach((i) => (map[i] = false));
    userTags.forEach((i) => map[i] === false && (map[i] = true));
    return Object.keys(map).map((k, i) => ({ id: i, name: k, isChecked: map[k] }));
  };

  static getPermissions = (tagCats: AuthTagCat[], userTags: AuthTag[], checks: any[]) => {
    // ------ tag names ------
    const tagNames: string[] = [];
    for (const cat of tagCats) {
      for (const tag of cat.tags) {
        tagNames.push(tag.name);
      }
    }

    // ------ user tag names ------
    const userTagNames: string[] = [];

    if (userTags) {
      for (const tag of userTags) {
        userTagNames.push(tag.name);
        // ------ checked existing tags ------
        tag.isChecked = true;
        checks.push(tag);
      }
    }
    // ------ create grp tags ------
    const grpTags = this.getTagSlots(tagNames, userTagNames);
    // ------ add isChecked on tags ------
    for (const cat of tagCats) {
      for (const tag of cat.tags) {
        for (const grp of grpTags) {
          if (tag.name === grp.name) {
            tag.isChecked = grp.isChecked;
          }
        }
      }
    }
    return tagCats;
  };

  static getRoleMenuAccess = (roles: UserRole[], authUser: User) => {
    switch (authUser.role.code) {
      case "sadm":
        return roles;
      case "ceo":
        return roles.filter((x) => !["sadm", "ceo"].includes(x.code));
      case "adm":
        return roles.filter((x) => !["sadm", "ceo", "adm"].includes(x.code));

      default:
        return roles.filter((x) => !["sadm", "ceo", "adm"].includes(x.code));
    }
  };
}
