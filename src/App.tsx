import React, { RefObject } from 'react';
import './App.css';
import MobTypeData, { MobTemplate, LootItems } from './data/MobTypes';
import Items from './data/Items';

function App() {

  const MobId = React.useRef<HTMLSelectElement>(null);
  const typeNewItem = React.useRef<HTMLSelectElement>(null);
  const qtyNewItem = React.useRef<HTMLInputElement>(null);
  const lootItem = React.useRef<HTMLLIElement>(null);
  let MobObj: MobTemplate | undefined;
  const [MobGlobalData, setMobGlobal] = React.useState<Array<MobTemplate | undefined>>(MobTypeData);
  const [MobActual, setMobActual] = React.useState<MobTemplate | undefined>(MobObj);

  function addValueInput (event: React.ChangeEventHandler<HTMLInputElement>) {
    // let element = (event.target as HTMLInputElement).value

  }

  function exportData () {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(MobGlobalData)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";
    link.click();
  }

  function handleMobId (event: React.ChangeEvent<any>) {
    MobId.current!.value = event.target.value
    setMobActual(MobGlobalData.find((mob) => mob?.id === MobId?.current?.value));
  }
  
  function deleteLootMob (event : React.MouseEvent, id: string | undefined) : void {
    event.stopPropagation();
    function filterItem (actual: MobTemplate | undefined){
      let newItems : Array<LootItems>;
      if (actual != undefined) {
        if (actual?.items) {
          newItems = actual?.items.filter((item) => id !== item.itemId)
          actual.items = newItems;
          return actual;
        }
      }
    }
    setMobActual(filterItem(MobActual));

  }

  const deepMergeObj = (...objects : Array<any>) => {
    const CopiasObj = objects.map(obj => JSON.parse(JSON.stringify(obj)))
    const Reduce =  CopiasObj.reduce((merged, current) => ({...current, ...merged}), {})
    return Reduce
  }

  function addLootMob () : void {
    function pushItem (actual: MobTemplate | undefined) : MobTemplate | undefined {
      const itemValue = typeNewItem.current?.value ?? '';
      const qtyValue = parseInt(qtyNewItem.current?.value ?? '', 10)
      let nuevoLoot: {
        itemId: string | undefined;
        quantity: number | undefined;
      } = {
        itemId: itemValue,
        quantity: qtyValue
      }
      if (actual != undefined) {
        if (!actual?.items) {
          actual!.items = []
        }
        let lootFiltro = actual?.items!.filter((item) => item.itemId !== nuevoLoot.itemId)
        lootFiltro.push(nuevoLoot)
        actual.items = lootFiltro
      }
      return actual;
    }
    setMobActual(pushItem(MobActual));
  }

  return (
    <article className='Tarjeta'>
      <header className='Tarjeta__header'>
        <h4>Monster Editor</h4>
      </header>
      <section className='Tarjeta__head'>
        <figure className='Tarjeta__imagen'>
          <img src="" alt="" />
        </figure>
        <select ref={MobId} onChange={handleMobId} className='Tarjeta__mobSelector' name="monster[id]" id="">
          <option>Select</option>
          {MobGlobalData.map((mob, key) => {
            return (
              <option key={key} value={mob?.id}>{mob?.name}</option>
            );
          })}
        </select>
      </section>
      <section className='Tarjeta__form'>
        <form className='Formulario -MobType' action="">
          <label className='Formulario__campo -MobType' htmlFor="">
            <span>Name</span>
            <input id='monster-name' name='monster[name]' value={MobActual?.name ?? ''} type="text" />
          </label>
          <label className='Formulario__campo -MobType' htmlFor="">
            <span>Description</span>
            <textarea id='monster-description' value={MobActual?.description ?? ''} name="monster[description]" cols={22} rows={10}></textarea>
          </label>
          <label className='Formulario__campo -MobType' htmlFor="">
            <span>Weight</span>
            <input id='monster-weight' name='monster[weight]' type="number" />
          </label>
          <label className='Formulario__campo -MobType' htmlFor="">
            <span>Hit points</span>
            <input id='monster-hitPoints' name='monster[hitPoints]' type="number" />
          </label>
          <label className='Formulario__campo -MobType' htmlFor="">
            <span>Attack</span>
            <input id='monster-attack' name='monster[attack]' type="number" />
          </label>
          <ul className='Formulario__dropList -MobType' id='dropItemList'>
            {
              MobActual?.items?.map((item, key) => {
                return (
                  <li className='Lista__item -DropList' ref={lootItem} key={item.itemId}>
                    <span>{`Drop ${item.quantity} ${item.itemId}`}</span>
                    <button className='Boton -eliminar -DropList' type='button' onClick={e => deleteLootMob(e, item.itemId)}><b>X</b></button>
                  </li>
                );
              })
            }
          </ul>
          <fieldset className='Formulario__dropOption -MobType'>
            <select ref={typeNewItem} name="monster[dropItem]" id="monster_dropItem">
              <option>Select</option>
              {Items.map((item, key) => {
                return (
                  <option key={key} value={item.name}>{item.name}</option>
                );
              })}
            </select>
            <input ref={qtyNewItem} className='' type="number" name='monster[dropQty]' id='monster_dropItemQty' />
          </fieldset>
        </form>
      </section>
      <footer className='Tarjeta__footer'>
        <button type='button' onClick={addLootMob} className='Boton -addLoot'>Add Loot</button>
      </footer>
      <button className='Boton -exportar' type='button' onClick={exportData}>Exportar</button>
    </article>
  );
}

export default App;
