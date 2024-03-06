import React, { RefObject } from "react";
import "./App.css";
import MobTypeData, { MobTemplate, LootItems } from "./data/MobTypes";
import Items from "./data/Items";

function App() {
  const MobID = React.useRef<HTMLSelectElement>(null);
  const typeNewItem = React.useRef<HTMLSelectElement>(null);
  const qtyNewItem = React.useRef<HTMLInputElement>(null);
  const lootItem = React.useRef<HTMLLIElement>(null);
  let MobObj: MobTemplate | undefined;
  const [MobGlobalData, setMobGlobal] =
    React.useState<Array<MobTemplate | undefined>>(MobTypeData);
  const [MobActual, setMobActual] = React.useState<MobTemplate | undefined>(
    MobObj,
  );

  function addValueInput(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    let element = event.target;
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
    MobID.current!.value = event.target.value;
    setMobActual(
      MobGlobalData.find((mob) => mob?.id === MobID?.current?.value),
    );
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

  // const deepMergeObj = (...objects: Array<any>) => {
  //   const CopiasObj = objects.map((obj) => JSON.parse(JSON.stringify(obj)));
  //   const Reduce = CopiasObj.reduce(
  //     (merged, current) => ({ ...current, ...merged }),
  //     {},
  //   );
  //   return Reduce;
  // };

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

  return (
    <article className="Tarjeta">
      <header className="Tarjeta__header">
        <h4>Monster Editor</h4>
      </header>
      <section className="Tarjeta__head">
        <figure className="Tarjeta__imagen">
          <img src="" alt="" id="moster[portrait]" />
        </figure>
        <select
          ref={MobID}
          onChange={handleMobId}
          className="Tarjeta__mobSelector"
          name="mob[id]"
          id=""
        >
          <option>Select</option>
          {MobGlobalData.map((mob, key) => {
            return (
              <option key={key} value={mob?.id}>
                {mob?.name}
              </option>
            );
          })}
        </select>
      </section>
      <section className="Tarjeta__form">
        <form className="Formulario -MobType" action="">
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Name</span>
            <input
              id="mob-name"
              name="mob[name]"
              onChange={addValueInput}
              value={MobActual?.name ?? ""}
              type="text"
            />
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Appearance</span>
            <input
              id="mob-appearance"
              name="mob[appearance]"
              onChange={addValueInput}
              value={MobActual?.appearance ?? ""}
              type="text"
            />
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Description</span>
            <textarea
              id="mob-description"
              onChange={addValueInput}
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
              onChange={addValueInput}
              name="mob[corpse]"
              type="text"
            />
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Intent</span>
            <input
              id="mob-intent"
              onChange={addValueInput}
              name="mob[intent]"
              type="text"
            />
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Weapon</span>
            <input
              id="mob-weapon"
              onChange={addValueInput}
              name="mob[weapon]"
              type="text"
            />
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Alignment</span>
            <input
              id="mob-alignment"
              onChange={addValueInput}
              name="mob[alignment]"
              type="text"
            />
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Damage</span>
            <input
              id="mob-damage"
              onChange={addValueInput}
              name="mob[damage]"
              type="number"
            />
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Hit points</span>
            <input
              id="mob-hitPoints"
              onChange={addValueInput}
              name="mob[hitPoints]"
              type="number"
            />
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Defense</span>
            <input
              id="mob-defense"
              onChange={addValueInput}
              name="mob[defense]"
              type="number"
            />
          </label>
          <label className="Formulario__campo -MobType" htmlFor="">
            <span>Speed</span>
            <input
              id="mob-speed"
              onChange={addValueInput}
              name="mob[speed]"
              type="number"
            />
          </label>
          <select
              ref={typeNewItem}
              name="mob[useEffect]"
              id="mob_useEffect"
            >
              <option>Select</option>
              
          </select>
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
            <select
              ref={typeNewItem}
              name="mob[dropItem]"
              id="mob_dropItem"
            >
              <option>Select</option>
              {Items.map((item, key) => {
                return (
                  <option key={key} value={item.name}>
                    {item.name}
                  </option>
                );
              })}
            </select>
            <input
              ref={qtyNewItem}
              className=""
              type="number"
              name="mob[dropQty]"
              id="mob_dropItemQty"
            />
          </fieldset>
        </section>
      </section>
      <footer className="Tarjeta__footer -MobType">
        <button type="button" onClick={addLootMob} className="Boton -addLoot">
          Add Loot
        </button>
        <button className="Boton -exportar" type="button" onClick={exportData}>
          Exportar
        </button>
      </footer>
    </article>
  );
}
export default App;
