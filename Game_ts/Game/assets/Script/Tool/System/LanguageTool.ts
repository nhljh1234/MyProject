/**
 * 获取一个字符串
 * 会把%s给替换掉
 */
export function getLanguageStr(key: string, ...replaceStrArr: string[]): string {
    //新建一个字符串
    let string: string = '' + HistoryGame.Language_CHS[key];
    let i, len;
    for (i = 0, len = replaceStrArr.length; i < len; i++) {
        string = string.replace('%s', replaceStrArr[i]);
    }
    return string;
}