const storageHandler = {
    getCookieValue: function (name: any) {
        var b = document.cookie.match('(^|[^;]+)\\s*' + name + '\\s*=\\s*([^;]+)');
        return b != null ? b.pop() : '';
    },
    setCookie: function (cname: any, cvalue: any, exdays: any) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
    deleteCookie: function (name: any) {
        var expires = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
        document.cookie = name + "=;" + expires + ";path=/";
    },
    localStorageSet: function(name: any, value: any){
        localStorage.setItem(name, value);
        //localStorage.setItem(name, value); 
    },
    localStorageGet: function(name: any){
        return localStorage.getItem(name);
        //return localStorage.getItem(name); 
    },
    localStorageSetObject: function(name: any, value: any){
        localStorage.setItem(name, JSON.stringify(value));
        //localStorage.setItem(name, value); 
    },
    localStorageGetObject: function(name: any){
        // @ts-expect-error TS(2345): Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
        return JSON.parse(localStorage.getItem(name));
        //return localStorage.getItem(name); 
    },
    localStorageDelete: function(name: any){
        localStorage.removeItem(name);
        //localStorage.removeItem(name); 
    }
}

export { storageHandler }