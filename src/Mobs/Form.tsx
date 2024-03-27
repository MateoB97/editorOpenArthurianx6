import React, { RefObject, useEffect, useContext } from "react";
import "../App.css";
import MobTypeData, { MobTemplate, LootItems } from "../data/MobTypes";
import Items from "../data/Items";
import { useImmer } from "use-immer";
import {
  Outlet,
  Link,
  useLoaderData,
  useOutletContext,
  LoaderFunction,
} from "react-router-dom";
import { addMobData } from "../data/Mobs";
import { useMob } from "../App";
import { defineMobsData as MobLoader } from "../data/Mobs";

export type LoaderData<TLoaderFn extends LoaderFunction> =
  Awaited<ReturnType<TLoaderFn>> extends Response | infer D ? D : never;

export async function loaderMobs({
  params,
}: {
  params: any;
}): Promise<MobTemplate | undefined> {
  const MobGlobalData = MobLoader();
  const MobActual = MobGlobalData.find((mob) => mob?.id === params?.mobId);
  if (!MobActual) {
    return {};
  }
  return MobActual;
}

export function Form() {
  const typeNewItem = React.useRef<HTMLSelectElement>(null);
  const qtyNewItem = React.useRef<HTMLInputElement>(null);
  const lootItem = React.useRef<HTMLLIElement>(null);

  const { MobGlobalData, setMobGlobal, MobIdState, setMobIdState } = useMob();

  const MobActual = useLoaderData() as LoaderData<typeof loaderMobs>;
  const [Mob, setMobActual] = useImmer(MobActual);
  console.log(Mob);
  console.log(MobGlobalData);

  function changeValueInput(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const objetivo = event.target;
    let matchKeyInput: RegExpMatchArray | null =
      objetivo.name.match(/\[(.*?)\]/);
    let keyInput: string = "";
    try {
      if (matchKeyInput) {
        keyInput = matchKeyInput[1];
      } else {
        throw new Error(`Name on input ${event.target} is incorrectly formed`);
      }
      if (!MobActual || Object.keys(MobActual).length === 0) {
        let newId =
          Date.now().toString(36) + Math.random().toString(36).substring(0, 5);

        setMobActual((draft) => ({
          ...draft,
          id: newId,
          [keyInput]: objetivo.value,
        }));
      } else {
        setMobActual((draft) => ({
          ...draft,
          [keyInput]: objetivo.value,
        }));
      }
    } catch (error) {
      console.error(error); // Probar
    }
  }

  function deleteLootMob(
    event: React.MouseEvent,
    id: string | undefined,
  ): void {
    event.stopPropagation();
    try {
      setMobActual((draft) => {
        if (draft !== undefined) {
          if (draft?.items) {
            let index = draft?.items.findIndex((item) => id === item.itemId);
            if (index > -1) {
              draft?.items.splice(index, 1);
            } else {
              throw new Error("Index not encounter on item list to delete");
            }
          }
        }
        return draft;
      });
    } catch (error) {
      console.error(error);
    }
  }

  function addLootMob(): void {
    const itemValue = typeNewItem.current?.value ?? "";
    const qtyValue = parseInt(qtyNewItem.current?.value ?? "", 10);
    let nuevoLoot: {
      itemId: string | undefined;
      quantity: number | undefined;
    } = {
      itemId: itemValue,
      quantity: qtyValue,
    };
    setMobActual((draft) => {
      if (draft !== undefined) {
        if (!draft?.items) {
          draft!.items = [];
        }
        let index = draft?.items.findIndex((item) => item.itemId === itemValue);
        if (index === -1) {
          draft?.items!.push(nuevoLoot);
        } else if (index >= 0) {
          draft?.items!.splice(index, 1, nuevoLoot);
        }
      }
      return draft;
    });
  }

  return (
    <article className="Tarjeta">
      <header className="Tarjeta__header">
        <h4>Monster Editor</h4>
      </header>
      <section className="Tarjeta__head">
        <figure className="Tarjeta__imagen">
          <img src="" alt="" id="moster[portrait]" />
        </figure>
      </section>
      <section className="Tarjeta__form">
        <form className="Formulario -MobType" action="">
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Name</span>
            <input
              id="mob-name"
              name="mob[name]"
              onChange={changeValueInput}
              value={Mob?.name ?? ""}
              type="text"
            />
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Appearance</span>
            <input
              id="mob-appearance"
              name="mob[appearance]"
              onChange={changeValueInput}
              value={Mob?.appearance ?? ""}
              type="text"
            />
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Description</span>
            <textarea
              id="mob-description"
              onChange={changeValueInput}
              value={Mob?.description ?? ""}
              name="mob[description]"
              cols={22}
              rows={10}
            ></textarea>
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Corpse</span>
            <select
              onChange={changeValueInput}
              name="mob[corpse]"
              id="mob-corpse"
            >
              <option key={"select"} value={"select"}>
                Select
              </option>
              {Items.map((mob, key) => {
                let reg = /corpse/i;
                let encontrado = mob.id.match(reg);
                if (encontrado?.length != undefined && encontrado?.length > 0) {
                  return (
                    <option key={key} value={mob?.id}>
                      {mob?.name ?? "No name"}
                    </option>
                  );
                }
              })}
            </select>
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Intent</span>
            <select
              onChange={changeValueInput}
              name="mob[intent]"
              id="mob-intent"
            >
              <option key={"select"} value={"select"}>
                Select
              </option>
              <option value="Wander">Wander</option>
              <option value="waitForCommand">Wait for command</option>
            </select>
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Weapon</span>
            <select
              onChange={changeValueInput}
              name="mob[weapon]"
              id="mob-weapon"
            >
              <option key={"select"} value={"select"}>
                Select
              </option>
              {Items.map((mob, key) => {
                return (
                  <option key={key} value={mob?.id}>
                    {mob?.name ?? "No name"}
                  </option>
                );
              })}
            </select>
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Alignment</span>
            <select
              onChange={changeValueInput}
              name="mob[alignment]"
              id="mob-alignment"
            >
              <option key={"select"} value={"select"}>
                Select
              </option>
              <option value="Enemy">Enemy</option>
              <option value="Player">Player</option>
              <option value="Neutral">Neutral</option>
            </select>
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Damage</span>
            <input
              id="mob-damage"
              onChange={changeValueInput}
              name="mob[damage]"
              type="number"
              min={0}
              value={Mob?.damage ?? ""}
            />
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Hit points</span>
            <input
              id="mob-hitPoints"
              onChange={changeValueInput}
              name="mob[hp]"
              type="number"
              min={0}
              value={Mob?.hp ?? ""}
            />
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Defense</span>
            <input
              id="mob-defense"
              onChange={changeValueInput}
              name="mob[defense]"
              type="number"
              min={0}
              value={Mob?.defense ?? ""}
            />
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Speed</span>
            <input
              id="mob-speed"
              onChange={changeValueInput}
              name="mob[speed]"
              type="number"
              min={0}
              value={Mob?.speed ?? ""}
            />
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>UseEffect</span>
            <select name="mob[useEffect]" id="mob_useEffect">
              <option>Select</option>
              <option value="">{Mob?.useEffect?.type}</option>
            </select>
          </label>
        </form>
        <section className="Items">
          <ul className="Items__dropList -MobType" id="dropItemList">
            {Mob?.items?.map((item, key) => {
              return (
                <li
                  className="Lista__item -DropList"
                  ref={lootItem}
                  key={item.itemId}
                >
                  <span>{`Drop ${item.quantity} ${item.itemId}`}</span>
                  <button
                    className="Boton -eliminar -DropList"
                    type="button"
                    onClick={(e) => deleteLootMob(e, item.itemId)}
                  >
                    <b>X</b>
                  </button>
                </li>
              );
            })}
          </ul>
          <fieldset className="Items__dropOption -MobType">
            <label
              className="Formulario__campo -dropOption -MobType"
              htmlFor=""
            >
              <span>Items</span>
              <select ref={typeNewItem} name="mob[dropItem]" id="mob_dropItem">
                <option>Select</option>
                {Items.map((item, key) => {
                  return (
                    <option key={key} value={item.name}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </label>
            <label
              className="Formulario__campo -dropOption -MobType"
              htmlFor=""
            >
              <span>Qty</span>
              <input
                ref={qtyNewItem}
                className=""
                type="number"
                min={0}
                name="mob[dropQty]"
                id="mob_dropItemQty"
              />
            </label>
            <button
              type="button"
              onClick={addLootMob}
              className="Boton -addLoot"
            >
              Add Loot
            </button>
          </fieldset>
        </section>
      </section>
      <footer className="Tarjeta__footer -MobType">
        <button
          type="button"
          onClick={() => {
            setMobGlobal({type: 'add', MobActual: Mob});
            addMobData({MobActual: Mob});
          }}
          className="Boton -guardar"
        >
          Save
        </button>
      </footer>
    </article>
  );
}
