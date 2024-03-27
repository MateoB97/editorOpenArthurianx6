import React, { createContext } from "react";
import MobTypeData, { MobTemplate, LootItems } from "../data/MobTypes";
import { defineMobsData, deleteMob } from "../data/Mobs";
import { useImmerReducer, useImmer, ImmerReducer } from "use-immer";
import { Draft } from "immer";

export type actionReducerMobs = { type: string; MobActual?: MobTemplate | undefined; MobId?: string; };

export const MobsReducer: ImmerReducer<
  Array<MobTemplate | undefined>,
  actionReducerMobs
> = function (
  state: Array<MobTemplate | undefined>,
  action: actionReducerMobs
  ): Array<MobTemplate | undefined> | undefined {
  switch (action.type) {
    case "add":
      try {
        if (action?.MobActual !== undefined) {
          let index = state.findIndex(
            (mob) => mob?.id === action?.MobActual!.id,
          );
          if (index >= 0) {
            if (Object.keys(action?.MobActual).length !== 0) {
              state.splice(index, 1, action?.MobActual);
            }
          } else if (index < 0) {
            state.push(action?.MobActual);
          }
        }
        return state;
      } catch (error) {
        console.error(error);
      }
      break;
    case "delete":
    if (action?.MobId !== undefined) {
        let indice = state?.findIndex(
          (mob: MobTemplate | undefined) => mob?.id === action?.MobId!,
        );
        state?.splice(indice, 1);
      }
      return state;
    default:
      break;
  }
};
