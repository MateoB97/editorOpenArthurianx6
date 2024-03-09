import React, { RefObject, useEffect } from "react";
import "./App.css";
import MobTypeData, { MobTemplate, LootItems } from "./data/MobTypes";
import Items from "./data/Items";
import { useImmer } from "use-immer";

function App() {
  const typeNewItem = React.useRef<HTMLSelectElement>(null);
  const qtyNewItem = React.useRef<HTMLInputElement>(null);
  const lootItem = React.useRef<HTMLLIElement>(null);
  const [MobGlobalData, setMobGlobal] =
    useImmer<Array<MobTemplate | undefined>>(defineMobsData());
  const [MobActual, setMobActual] = useImmer<MobTemplate | undefined>(
    undefined,
  );
  const inputRef = React.useRef<MobTemplate | undefined>(MobActual);

  // console.log(MobActual, "actual");
  // console.log(MobGlobalData, "global");

  function defineMobsData(): Array<MobTemplate | undefined> {
    let MobsLocal = localStorage.getItem("Mobs");
    let obj: Array<MobTemplate | undefined> = [];
    if (MobsLocal) {
      obj = JSON.parse(MobsLocal);
    } else {
      obj = consultaDatosMob();
    }
    return obj;
  }

  function consultaDatosMob(): Array<MobTemplate | undefined> {
    // fetch a alguna BD o archivo en sv
    try {
      return MobTypeData;
    } catch (error) {
      // return error
      throw new Error("error en consulta Datos Mob" + error);
    }
  }

  function changeValueInput(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
          Date.now().toString(36) +
          Math.random().toString(36).substring(0, 5);

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

  function exportData(): void {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(MobGlobalData),
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";
    link.click();
  }

  function handleMobId(event: React.ChangeEvent<any>) {
    if (MobActual) {
      setMobGlobal((draft) => {
        let indice = draft.findIndex((mob) => mob?.id === MobActual?.id);
        if (indice >= 0) {
          draft.splice(indice, 1, MobActual);
        } else if (indice === -1 && MobActual?.id) {
          draft.push(MobActual);
        }
        return draft;
      });
    }
    setMobActual(prevState => {
      const Mob = MobGlobalData.find((mob) => mob?.id === event.target.value);
      return Mob ?? {};
    });
  }

  function deleteLootMob(
    event: React.MouseEvent,
    id: string | undefined,
  ): void {
    event.stopPropagation();
    function filterItem(actual: MobTemplate | undefined) {
      let newItems: Array<LootItems>;
      if (actual !== undefined) {
        if (actual?.items) {
          newItems = actual?.items.filter((item) => id !== item.itemId);
          actual.items = newItems;
          return actual;
        }
      }
    }
    setMobActual(filterItem(MobActual));
  }

  function addLootMob(): void {
    function pushItem(
      actual: MobTemplate | undefined,
    ): MobTemplate | undefined {
      const itemValue = typeNewItem.current?.value ?? "";
      const qtyValue = parseInt(qtyNewItem.current?.value ?? "", 10);
      let nuevoLoot: {
        itemId: string | undefined;
        quantity: number | undefined;
      } = {
        itemId: itemValue,
        quantity: qtyValue,
      };
      if (actual !== undefined) {
        if (!actual?.items) {
          actual!.items = [];
        }
        let lootFiltro = actual?.items!.filter(
          (item) => item.itemId !== nuevoLoot.itemId,
        );
        lootFiltro.push(nuevoLoot);
        actual.items = lootFiltro;
      }
      return actual;
    }
    setMobActual(pushItem(MobActual));
  }

  function addMobData(): void {
    try {
      // localStorage.setItem("Mobs", JSON.stringify(MobGlobalData));
    } catch (error) {}
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
        <label className="Tarjeta__mobSelector" htmlFor="">
          <span>Mob</span>
          <select onChange={handleMobId} name="mob[id]" id="">
            <option key={"select"} value={"select"}>
              Select
            </option>
            {MobGlobalData.map((mob, key) => {
              // console.log(mob?.id)
              return (
                <option key={key} value={mob?.id}>
                  {mob?.name ?? 'No name'}
                </option>
              );
            })}
          </select>
        </label>
      </section>
      <section className="Tarjeta__form">
        <form className="Formulario -MobType" action="">
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Name</span>
            <input
              id="mob-name"
              name="mob[name]"
              onChange={changeValueInput}
              value={MobActual?.name ?? ""}
              type="text"
            />
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Appearance</span>
            <input
              id="mob-appearance"
              name="mob[appearance]"
              onChange={changeValueInput}
              value={MobActual?.appearance ?? ""}
              type="text"
            />
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Description</span>
            <textarea
              id="mob-description"
              onChange={changeValueInput}
              value={MobActual?.description ?? ""}
              name="mob[description]"
              cols={22}
              rows={10}
            ></textarea>
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Corpse</span>
            <input
              id="mob-corpse"
              onChange={changeValueInput}
              name="mob[corpse]"
              type="text"
              value={MobActual?.corpse ?? ""}
            />
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Intent</span>
            <input
              id="mob-intent"
              onChange={changeValueInput}
              name="mob[intent]"
              type="text"
              value={MobActual?.intent ?? ""}
            />
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Weapon</span>
            <input
              id="mob-weapon"
              onChange={changeValueInput}
              name="mob[weapon]"
              type="text"
              value={MobActual?.weapon ?? ""}
            />
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Alignment</span>
            <input
              id="mob-alignment"
              onChange={changeValueInput}
              name="mob[alignment]"
              type="text"
              value={MobActual?.alignment ?? ""}
            />
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Damage</span>
            <input
              id="mob-damage"
              onChange={changeValueInput}
              name="mob[damage]"
              type="number"
              min={0}
              value={MobActual?.damage ?? ""}
            />
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Hit points</span>
            <input
              id="mob-hitPoints"
              onChange={changeValueInput}
              name="mob[hitPoints]"
              type="number"
              min={0}
              value={MobActual?.hp ?? ""}
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
              value={MobActual?.defense ?? ""}
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
              value={MobActual?.speed ?? ""}
            />
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>UseEffect</span>
            <select
              ref={inputRef?.current?.useEffect?.type}
              name="mob[useEffect]"
              id="mob_useEffect"
            >
              <option>Select</option>
              <option value="">{MobActual?.useEffect?.type}</option>
            </select>
          </label>
        </form>
        <section className="Items">
          <ul className="Items__dropList -MobType" id="dropItemList">
            {MobActual?.items?.map((item, key) => {
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
        <button type="button" onClick={addMobData} className="Boton -guardar">
          Add Mob
        </button>
        <button className="Boton -exportar" type="button" onClick={exportData}>
          Export Mob List
        </button>
      </footer>
    </article>
  );
}
export default App;
