import { makeAutoObservable } from 'mobx';
import { persist } from 'mobx-persist';

export default class CounterStore {
  @persist count = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increment(): void {
    this.count++;
  }

  decrement(): void {
    this.count--;
  }
}
