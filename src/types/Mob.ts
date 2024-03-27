export type LootItems = {
  itemId: string | undefined;
  quantity: number | undefined;
};

type UseEffect = { type: string };

export interface MobTemplate {
  id?: string;
  appearance?: string;
  name?: string;
  description?: string;
  hp?: number;
  damage?: number;
  defense?: number;
  speed?: number;
  corpse?: string;
  intent?: string;
  alignment?: string;
  weapon?: string;
  items?: Array<LootItems>;
  portrait?: string;
  useEffect?: UseEffect;
}
