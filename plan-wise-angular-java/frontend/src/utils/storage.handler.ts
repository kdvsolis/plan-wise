export const StorageHandler = {
    getCookieValue(name: string): string | null {
      const b = document.cookie.match('(^|[^;]+)\\s*' + name + '\\s*=\\s*([^;]+)');
      return b?.pop() || null;
    },
    setCookie(cname: string, cvalue: string, exdays: number): void {
      const d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      const expires = 'expires=' + d.toUTCString();
      document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
    },
    deleteCookie(name: string): void {
      const expires = 'expires=Thu, 01 Jan 1970 00:00:00 UTC';
      document.cookie = name + '=;' + expires + ';path=/';
    },
    localStorageSet(name: string, value: string): void {
      localStorage.setItem(name, value);
    },
    localStorageGet(name: string): string | null {
      return localStorage.getItem(name);
    },
    localStorageSetObject(name: string, value: any): void {
      localStorage.setItem(name, JSON.stringify(value));
    },
    localStorageGetObject(name: string): any {
      const item = localStorage.getItem(name);
      return item ? JSON.parse(item) : null;
    },
    localStorageDelete(name: string): void {
      localStorage.removeItem(name);
    }
};
  