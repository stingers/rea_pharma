export const SADM = ["sadm"];
export const ADM = ["adm", "sadm"];
export const CEO = ["ceo", ...ADM];
export const RPH = ["rph", ...CEO];
export const PHD = ["phd", ...RPH];
export const COMPTA = ["cpt", "acp"];
export const CAISSE = ["cai", "ceo", ...ADM];
export const TLM_COM = ["tlm", "com", ...ADM];
export const MAG = ["mac", "mcc", "mag"];