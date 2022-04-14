// function logIn() {
//     const user = { 
//         name: "testetstesteste"
//     }
//     const promise = axios.get
// }

apiMessage()
sendUserName()
setInterval(apiMessage,3000)


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
    document.querySelector('.container').innerHTML = ""
    for (let i = 0;  i < success.data.length; i++ ){
        data = {
            from:success.data[i].from,
            text:success.data[i].text,
            to:success.data[i].to,
            type:success.data[i].type,
            time:success.data[i].time,
        }
        document.querySelector('.container').innerHTML += `<div class="mensagem ${data.type}">
        <p><span>(${data.time})</span> <strong> ${data.from}</strong> para <strong>${data.to}</strong>: ${data.text} </p>
        </div>`
        
    } 
    console.log('b')
    document.querySelector('.container div:last-child').scrollIntoView()
    console.log('a')
}
  
// function apiUsers (){
//     const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants')
//     promise.then()
// }
function sendUserName(){
    const userName = prompt('Qual o seu nome?')
    let user ={
        name: userName
    }
    const sendUser = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', user)
    sendUser.catch(userAlreadyTaken)
}

function userAlreadyTaken(erro) {
	alert('Nome Já escolhido')
	sendUserName()
}



function displayHidden(){
    document.querySelector('.messageInterface').classList.remove('hidden')
}