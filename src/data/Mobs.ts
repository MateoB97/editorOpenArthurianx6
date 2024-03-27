import MobTypeData, { MobTemplate, LootItems } from "./MobTypes";

export function defineMobsData(): Array<MobTemplate | undefined> {
  let MobsLocal = localStorage.getItem("Mobs");
  let obj: Array<MobTemplate | undefined> = [];
  if (MobsLocal) {
    obj = JSON.parse(MobsLocal);
  } else {
    obj = searchDataMob();
  }
  return obj;
}

function searchDataMob(): Array<MobTemplate | undefined> {
  // fetch a alguna BD o archivo en sv
  try {
    localStorage.setItem("Mobs", JSON.stringify(MobTypeData));
    return MobTypeData;
  } catch (error) {
    // return error
    throw new Error("error en consulta Datos Mob" + error);
  }
}

export function deleteMob(
  event: React.MouseEvent,
  id: string | undefined,
): void {
  try {
    let Mobs = localStorage.getItem("Mobs");
    if (Mobs) {
      let data = JSON.parse(Mobs);
      let indice = data?.findIndex(
        (mob: MobTemplate | undefined) => mob?.id === id,
      );
      if (indice >= 0) {
        data?.splice(indice, 1);
        localStorage.setItem("Mobs", JSON.stringify(data));
      }
    }
  } catch (error) {}
}

export function addMobData({
  MobActual,
}: {
  MobActual: MobTemplate | undefined;
}): void {
  try {
    let MobsLocalString = localStorage.getItem("Mobs");
    if (MobsLocalString) {
      let MobsLocal: Array<MobTemplate | undefined> =
        JSON.parse(MobsLocalString);
      let index = MobsLocal.findIndex((mob) => mob?.id === MobActual?.id);
      if (index > -1) {
        MobsLocal.splice(index, 1, MobActual);
      } else {
        MobsLocal.push(MobActual);
      }
      localStorage.setItem("Mobs", JSON.stringify(MobsLocal));
    } else {
      throw new Error("MobsLocal value has not been reset correctly");
    }
  } catch (error) {
    console.error(error);
  }
}
