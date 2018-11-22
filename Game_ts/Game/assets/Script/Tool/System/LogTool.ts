const SHOW_FLAG:boolean = true;
export function showLog(string: string) {
    if (!SHOW_FLAG) {
        return;
    }
    if (cc.sys.isNative) {
        cc.log(string);
    } else {
        console.log(string);
    }
}