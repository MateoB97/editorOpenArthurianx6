import React, { Reducer, useReducer } from "react";
import "./App.css";
import { MobTemplate, LootItems } from "./data/MobTypes";
import { useImmerReducer, useImmer, ImmerReducer } from "use-immer";
import { Draft } from "immer";
import { MobsReducer } from "./Mobs/MobDataReducer";
import {
  Outlet,
  useOutletContext,
  useLoaderData,
  LoaderFunction,
} from "react-router-dom";
import { defineMobsData } from "./data/Mobs";
import { actionReducerMobs } from "./Mobs/MobDataReducer";

type ContextMobType = {
  MobGlobalData: Array<MobTemplate | undefined>;
  setMobGlobal: React.Dispatch<actionReducerMobs>;
  MobIdState: string;
  setMobIdState: React.Dispatch<string>;
};

export function useMob() {
  return useOutletContext<ContextMobType>();
}
export type LoaderData<TLoaderFn extends LoaderFunction> =
  Awaited<ReturnType<TLoaderFn>> extends Response | infer D ? D : never;

function App() {
  const MobLoader = useLoaderData() as LoaderData<typeof defineMobsData>;

  const [MobGlobalData, setMobGlobal] = useImmerReducer<
    Array<MobTemplate | undefined>,
    actionReducerMobs
  >(MobsReducer, MobLoader);

  const [MobIdState, setMobIdState] = useImmer("");

  return (
    <article>
      <Outlet
        context={
          {
            MobGlobalData,
            setMobGlobal,
            MobIdState,
            setMobIdState,
          } satisfies ContextMobType
        }
      />
    </article>
  );
}
export default App;
