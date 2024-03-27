import React, { RefObject, useEffect, useContext } from "react";
import "../App.css";
import MobTypeData, { MobTemplate, LootItems } from "../data/MobTypes";
import { Link, useLoaderData, useOutletContext } from "react-router-dom";
import { deleteMob } from "../data/Mobs";
import { useMob } from "../App";

export function List() {
  const { MobGlobalData, setMobGlobal } = useMob();

  function exportData(): void {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(MobGlobalData),
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";
    link.click();
  }

  return (
    <article>
      <section>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Appearance</th>
            </tr>
          </thead>
          <tbody>
            {MobGlobalData?.map((mob, k) => {
              return (
                <tr key={k}>
                  <td>{mob?.name}</td>
                  <td>{mob?.description}</td>
                  <td>{mob?.appearance}</td>
                  <td>
                    <Link to={`form/${mob?.id}`}>
                      <b>&#9998;</b>
                    </Link>
                  </td>
                  <td>
                    <button
                      onClick={(e) => {
                        setMobGlobal({ type: "delete", MobId: mob?.id });
                        deleteMob(e, mob?.id);
                      }}
                    >
                      <b>&#10006;</b>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
      <footer>
        <Link to={`form`}>Create</Link>
        <button className="Boton -exportar" type="button" onClick={exportData}>
          Export Mob List
        </button>
      </footer>
    </article>
  );
}
