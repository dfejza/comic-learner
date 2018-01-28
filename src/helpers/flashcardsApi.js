import axios from 'axios';

export function saveCardToDB(object){
    console.log(object);
    axios.post('http://localhost:8081/api/user/addCard', {
        token: object.token, //user id token
        email: object.email,
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