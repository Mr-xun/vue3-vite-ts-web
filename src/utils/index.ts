import { AES, enc } from 'crypto-ts';
/**
     * @description 加密
     * @param  {string} word   加密字符
     * @param  {string} keyStr key
     * @return {string}        加密后字符
     */
export const encrypt = (word: any, keyStr: any) => {
    keyStr = keyStr ? keyStr : 'abcdefgabcdefg12';
    var key = enc.Utf8.parse(keyStr); //Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    var srcs = enc.Utf8.parse(word);
    var encrypted = AES.encrypt(srcs, key);
    return encrypted.toString();
};
/**
     * @description 解密
     * @param  {string} word   解密字符
     * @param  {string} keyStr key
     * @return {string}        解密后字符
     */
export const decrypt = (word: any, keyStr: any) => {
    keyStr = keyStr ? keyStr : 'abcdefgabcdefg12';
    var key = enc.Utf8.parse(keyStr); //Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    var decrypt = AES.decrypt(word, key);
    return enc.Utf8.stringify(decrypt).toString();
};

export const setCookie = (name: string, value: string, expiredays: number) => {
    var date = new Date();
    var expires = '';
    if (expiredays) {
        date.setTime(date.getTime() + expiredays * 24 * 3600 * 1000);
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + value + expires + ';path=/';
};
export const getCookie = (name: string | number) => {
    var cookies: any = {};
    var cookiesArr = document.cookie.replace(/\s+/g, '').split(';');
    for (var i = 0; i < cookiesArr.length; i++) {
        var _arr = cookiesArr[i].split('=');
        cookies[_arr[0]] = _arr[1];
    }
    return cookies[name];
};
export const delCookie = (name: any) => {
    setCookie(name, '', -1);
};
