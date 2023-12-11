import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  localStorage: Storage;
  constructor() {
    this.localStorage = window.localStorage;
  }
  get(key: string): any 
  {
    if (this.isLocalStorageSupported)
    {
      if(this.localStorage.getItem(key) != null)
      {
        let x = this.localStorage.getItem(key);
        return x;
      }
      else
        return null;
    }
    return null;
  }
  set(key: string, value: any): boolean
  {
    if (this.isLocalStorageSupported) {
      this.localStorage.setItem(key, JSON.stringify(value));
      return true;
    }
    return false;
  }
  remove(key: string): boolean
  {
    if (this.isLocalStorageSupported) {
      this.localStorage.removeItem(key);
      return true;
    }
    return false;
  }
  get isLocalStorageSupported(): boolean 
  {
    return !!this.localStorage
  }
}
