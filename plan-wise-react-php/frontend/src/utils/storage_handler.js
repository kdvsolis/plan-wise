const storageHandler = {
    getCookieValue: function (name) {
        var b = document.cookie.match('(^|[^;]+)\\s*' + name + '\\s*=\\s*([^;]+)');
        return b != null ? b.pop() : '';
    },
    setCookie: function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
    deleteCookie: function (name) {
        var expires = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
        document.cookie = name + "=;" + expires + ";path=/";
    },
    localStorageSet: function(name, value){
        localStorage.setItem(name, value);
        //localStorage.setItem(name, value); 
    },
    localStorageGet: function(name){
        return localStorage.getItem(name);
        //return localStorage.getItem(name); 
    },
    localStorageSetObject: function(name, value){
        localStorage.setItem(name, JSON.stringify(value));
        //localStorage.setItem(name, value); 
    },
    localStorageGetObject: function(name){
        return JSON.parse(localStorage.getItem(name));
        //return localStorage.getItem(name); 
    },
    localStorageDelete: function(name){
        localStorage.removeItem(name);
        //localStorage.removeItem(name); 
    }
}

export { storageHandler }