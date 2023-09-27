import { ADM, COMPTA, PHD, TLM_COM } from "../../auth/services/auth-menu";
import authService from "../../auth/services/authService";

export interface MenuItemType {
  key: string;
  label: string;
  isTitle?: boolean;
  icon?: string;
  url?: string;
  badge?: {
    variant: string;
    text: string;
  };
  param?: any;
  parentKey?: string;
  target?: string;
  children?: MenuItemType[];
  // auth?: AuthParam;
  auth?: boolean;
  authHost?: any;
  state?: any;
}

type AuthType = {
  tag?: string;
  roles: string[];
  rolesClient: string[];
  steGrps?: string[];
};

const deliveriesTabItem = () => {
  if (authService.getAuth({ roles: ["cha"] })) {
    return { tabId: "deliveries_drivers", url: "/dash/deliveries/drivers" };
  } else if (authService.getAuth({ roles: ["sec"] })) {
    return { tabId: "deliveries_done", url: "/dash/deliveries/done" };
  } else {
    return { tabId: "deliveries_list", url: "/dash/deliveries/list" };
  }
};

const userTabItem = () => {
  if (authService.getAuth({ client: { roles: ["ceo"] } })) {
    return { tabId: "users_grps_sf", url: "/dash/users/sf" };
  } else {
    return { tabId: "users_memos", url: "/dash/users/memos" };
  }
};

const cakeTabItem = () => {
  if (authService.getAuth({ roles: ["sadm"] })) {
    return { tabId: "cake_tasks", url: "/dash/cakes/tasks" };
  } else {
    return { tabId: "cake_wishes", url: "/dash/cakes/wishes" };
  }
};

const MENU_ITEMS: MenuItemType[] = [
  {
    key: "dash",
    label: "Dashboard",
    isTitle: false,
    icon: "fas fa-home",
    url: "/dash",
  },
  {
    key: "task",
    label: "Task",
    isTitle: false,
    icon: "fas fa-tools",
    url: cakeTabItem().url,
    state: { tabId: cakeTabItem().tabId },
    auth: authService.getAuth({ roles: ["sadm"] }),
  },
  {
    key: "shops",
    label: "boutiques",
    isTitle: false,
    icon: "fas fa-store",
    url: "/dash/shops/arrivals",
    auth: authService.getAuth({ tag: "shop", roles: [...PHD, ...TLM_COM], client: { roles: ["ceo"], steGrps: ["ph"] } }),
    authHost: ["cpa"],
  },
  {
    key: "cash",
    label: "caisse",
    isTitle: false,
    icon: "fas fa-cash-register",
    url: "/dash/cashs",
    param: "nopaid",
    auth: authService.getAuth({ tag: "cpt", roles: [...ADM, "cai", "cpt"] }),
  },
  {
    key: "stats",
    label: "stats",
    isTitle: false,
    icon: "fas fa-chart-line",
    url: "/dash/stats",
    state: { tabId: "stats_sales" },
    param: "nopaid",
    auth: authService.getAuth({ roles: [...PHD], client: { roles: ["ceo"] } }),
  },
  {
    key: "comptas",
    label: "comptas",
    isTitle: false,
    icon: "fas fa-cash-register",
    url: "/dash/comptas/entries",
    auth: authService.getAuth({ tag: "cpt", roles: [...ADM, ...COMPTA] }),
  },
  // ------ bills ------
  {
    key: "bills",
    label: "factures",
    isTitle: false,
    icon: "fas fa-funnel-dollar",
    url: "/dash/bills/memos",
    param: "nopaid",
    auth: authService.getAuth({
      tag: "shop",
      roles: [...PHD, ...COMPTA, "cai", "rcm"],
      client: { roles: ["ceo"], steGrps: ["ph"] },
    }),
  },
  // ------ shopcart ------
  {
    key: "shop_cart",
    label: "faire une commande",
    isTitle: false,
    icon: "fas fa-cart-arrow-down",
    // url: "/dash/bills/nopaid",
    url: "/dash/shopcart",
    auth: authService.getAuth({ tag: "fuc", roles: [...PHD, ...TLM_COM, "rcm"], client: { roles: ["ceo"], steGrps: ["ph"] } }),
  },

  {
    key: "sales",
    label: "Commandes",
    isTitle: false,
    icon: "fas fa-gift",
    // url: "/dash/bills/nopaid",
    url: "/dash/sales",
    auth: authService.getAuth({ tag: "cl", roles: [...PHD, ...TLM_COM, "rcm"], client: { roles: ["ceo"], steGrps: ["ph"] } }),
  },
  {
    key: "sales_treat",
    label: "suivi des commandes",
    isTitle: false,
    icon: "fas fa-chalkboard-teacher",
    // url: "/dash/bills/nopaid",
    // url: "/dash/sales/treatment",
    url: "/dash/treatment",
    auth: authService.getAuth({
      tag: "sdc_menu",
      roles: [...PHD, ...TLM_COM, "mag", "mcc", "mac", "rcm"],
      client: { roles: ["ceo"], steGrps: ["ph"] },
    }),
    authHost: ["cpa", "eqeer"],
  },
  {
    key: "deliveries",
    label: "livraison commandes",
    isTitle: false,
    icon: "fas fa-truck",
    url: deliveriesTabItem().url,
    state: { tabId: deliveriesTabItem().tabId },
    auth: authService.getAuth({ tag: "profm", roles: [...PHD, ...TLM_COM, "rcm", "cha"] }),
  },
  {
    key: "proformas",
    label: "proformas",
    isTitle: false,
    icon: "fas fa-paperclip",
    auth: authService.getAuth({ tag: "profm", roles: [...PHD, ...TLM_COM, "rcm"] }),
    authHost: ["cpa", "eqeer"],
    children: [
      {
        key: "proformas_create",
        label: "Créer un proforma",
        url: "/dash/proformacart",
        parentKey: "proformas",
      },
      {
        key: "proformas_tab",
        label: "liste Proformas",
        state: { tabId: "proformas" },
        url: "/dash/proformas/list",
        parentKey: "proformas",
      },
    ],
  },

  {
    key: "stores",
    label: "magasin",
    isTitle: false,
    icon: "fas fa-store-alt",
    url: "/dash/stores/memos",
    state: { tabId: "stores_memos" },

    auth: authService.getAuth({ tag: "mag", roles: [...PHD, "rcm"] }),
    authHost: ["cpa", "eqeer"],
  },
  {
    key: "users",
    label: "Utilisateurs",
    isTitle: false,
    icon: "fas fa-users",
    state: { tabId: userTabItem().tabId },
    url: userTabItem().url,
    auth: authService.getAuth({
      tag: "users",
      roles: [...PHD, ...COMPTA, "cai", "rcm"],
      client: { roles: ["ceo"] },
    }),
    authHost: ["cpa", "eqeer"],
  },
  {
    key: "docus",
    label: "documents",
    isTitle: false,
    icon: "fas fa-copy",
    url: "/dash/docus",
  },
  {
    key: "tools",
    label: "Outils",
    isTitle: false,
    icon: "fas fa-cogs",
    auth: authService.getAuth({ tag: "tools", roles: [...ADM, ...COMPTA] }),
    authHost: ["cpa"],
    children: [
      /* {
        key: "docus",
        label: "Documents",
        url: "/dash/tools/docus",
        parentKey: "tools",
        // auth: { roles: ["cai"] },
      }, */
      {
        key: "utilities",
        label: "Utilitaires",
        url: "/dash/tools/utilities",
        parentKey: "tools",
      },
      {
        key: "world",
        label: "Monde",
        url: "/dash/tools/world",
        parentKey: "tools",
      },
    ],
  },
  {
    key: "zut",
    label: "zut",
    isTitle: false,
    icon: "fas fa-palette",
    url: "/dash/zut/list",
    auth: authService.getAuth({ roles: [...ADM] }),
  },
];

const HORIZONTAL_MENU_ITEMS: MenuItemType[] = [...MENU_ITEMS];

const TWO_COl_MENU_ITEMS: MenuItemType[] = [...MENU_ITEMS];

export { HORIZONTAL_MENU_ITEMS, MENU_ITEMS, TWO_COl_MENU_ITEMS };
