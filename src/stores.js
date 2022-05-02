import { writable } from "svelte/store";

const createWritableStore = (key, startValue) => {
  const { subscribe, set } = writable(startValue);
  
  return {
    subscribe,
    set,
    useLocalStorage: () => {
      const json = localStorage.getItem(key);
      if (json) {
        set(JSON.parse(json));
      }
      
      subscribe(current => {
        localStorage.setItem(key, JSON.stringify(current));
      });
    }
  };
}

export const guessUsed = createWritableStore("guessUsed", [true, false, false, false, false]);
export const inputVar = createWritableStore("inputVar", ["", "", "", "", ""]);

// export const guessUsed = writable(localStorage.getItem("guessUsed") || [true, false, false, false, false]);
// export const inputVar = writable(localStorage.getItem("inputVar") || ["", "", "", "", ""]);

// guessUsed.subscribe(val => localStorage.setItem("guessUsed", val));
// inputVar.subscribe(val => localStorage.setItem("inputVar", val));