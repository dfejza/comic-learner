import axios from 'axios';

export function saveCardToDB(object){
    axios.post('http://localhost:8081/api/user/addCard', {
        idToken: object.idToken, //user id token
        front: object.card.front,
        back: object.card.back,
        manga : object.card.manga,
        volume : object.card.volume,
        page : object.card.page
    })
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
}

export function getCardsFromDB(idToken){
    return new Promise(function (resolve, reject) {
        axios.get('http://localhost:8081/api/user/getAllCards',{
            params: {
                idToken: idToken
            }
        })
        .then(function (response) {
            resolve(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    });
}


export function deleteCardsFromDB(idToken, deleteArray){
    return new Promise(function (resolve, reject) {
        axios.post('http://localhost:8081/api/user/deleteCards', {
            idToken: idToken, //user id token
            deleteArray: deleteArray,
        })
        .then(function (response) {
            console.log(response);
            resolve(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    });
}