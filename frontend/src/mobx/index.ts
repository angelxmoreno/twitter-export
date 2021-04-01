/* eslint-disable no-console */
import { Context, createContext, useContext } from 'react';
import { create } from 'mobx-persist';
import { configure } from 'mobx';
import AuthStore from './stores/AuthStore';

configure({ enforceActions: 'observed' }); // don't allow state modifications outside actions

type RootStore = {
  authStore: AuthStore;
};

export const rootStore: RootStore = {
  authStore: new AuthStore(),
};

export const StoreContext: Context<RootStore> = createContext(rootStore);

export const useStore = (): RootStore => useContext(StoreContext);

export async function hydrateStores(): Promise<void[]> {
  const hydrate = create({
    storage: localStorage,
    jsonify: true,
  });

  const promises = Object.keys(rootStore).map(storeName => {
    const store = rootStore[storeName as keyof RootStore];

    return hydrate(storeName, store)
      .then(() => console.log(`${storeName} has been hydrated`))
      .catch(e => console.error(`Issue hydrating ${storeName}: `, e));
  });

  return Promise.all(promises);
}
