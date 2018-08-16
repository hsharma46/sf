/*In-Builts*/
import { Injectable } from '@angular/core';

@Injectable()

export class AppStorageService {
  public storage: any;
  constructor() {
    this.storage = localStorage;
  }


    getDataFromStorage(key: string): any {
      return JSON.parse(this.storage.getItem(key));
    }

    setDataInStorage(key: string, value: any) {
      this.storage.setItem(key, JSON.stringify(value));
    }

    removeStorage(key: string) {
      this.storage.clear();
    }
}
