// export function getLang(){
//     return {
//         type: 'GET_LANGUAGE'
//     };
// }

// export function getJson(){
//     return {
//         type: 'GET_JSON'
//     };
// }

export function setLang(lang){
    return {
        type: 'SET_LANG',
        payload: lang
    };
}

export default setLang