const storageHandler = {
    getCookieValue: function (name: any): any {
        var b = document.cookie.match('(^|[^;]+)\\s*' + name + '\\s*=\\s*([^;]+)');
        return b != null ? b.pop() : '';
    },
    setCookie: function (cname: any, cvalue: any, exdays: any): void {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
    deleteCookie: function (name: any): void {
        var expires = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
        document.cookie = name + "=;" + expires + ";path=/";
    },
    localStorageSet: function (name: any, value: any): void {
        localStorage.setItem(name, value);
    },
    localStorageGet: function (name: any): any {
        return localStorage.getItem(name);
    },
    localStorageSetObject: function (name: any, value: any): void {
        localStorage.setItem(name, JSON.stringify(value));
    },
    localStorageGetObject: function (name: any): any {
        return JSON.parse(localStorage.getItem(name) || "{}");
    },
    localStorageDelete: function (name: any): void {
        localStorage.removeItem(name);
    }
};

export { storageHandler };
