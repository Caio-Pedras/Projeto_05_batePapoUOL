// function logIn() {
//     const user = { 
//         name: "testetstesteste"
//     }
//     const promise = axios.get
// }
apiMessage()
// setInterval(apiMessage,3000)


function apiMessage (){
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')
    promise.then(loadMessage);

}
function loadMessage (success){
    let data = {
        from:"",
        text:"",
        to:"",
        type:"",
        time:"",
    }

    console.log(success)
    console.log(success.data.length)
    for (let i = 0; iMax = success.data.length;  i < iMax, i++ ){
        data = {
            from: success.data[i].from,
            text:success.data[i].text,
            to:success.data[i].to,
            type:success.data[i].type,
            time:success.data[i].time,
        }
        document.querySelector('.container').innerHTML += `<div class="mensagem ${data.type}">
        <p>(${data.time}) <strong>${data.from}</strong> para <strong>${data.to}</strong>: ${data.text} </p>
        </div>`
    }
}
