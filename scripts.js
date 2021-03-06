//start
let userName ='';
let lastMessage;
let loginInputIsDisplayed = true;
setInterval(keepOnLine, 4000)
setInterval(apiMessage,3000)
setInterval(userList,10000)
document.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        if (loginInputIsDisplayed === true){
            logIn ();
        } else{
        sendMessage();
        }
    }
})

//funções
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
   let container = document.querySelector('.container')
   let mensagem =""; 
    for (let i = 0;  i < success.data.length; i++ ){
        data = {
            from:success.data[i].from,
            text:success.data[i].text,
            to:success.data[i].to,
            type:success.data[i].type,
            time:success.data[i].time,
        }
        if (data.type !== 'private_message'){
            mensagem += `<div class="mensagem ${data.type}">
            <p><span>(${data.time})</span> <strong> ${data.from}</strong> para <strong>${data.to}</strong>: ${data.text} </p>
            </div>`
        } else if (data.type === 'private_message' && (data.to === userName || data.from === userName)) {
            mensagem  += `<div class="mensagem ${data.type}">
            <p><span>(${data.time})</span> <strong> ${data.from}</strong> reservadamente para <strong>${data.to}</strong>: ${data.text} </p>
            </div>`
        }
    }
    container.innerHTML= mensagem
    if (lastMessage !==container.querySelector('div:last-child').innerHTML){  
        container.querySelector('div:last-child').scrollIntoView()
        lastMessage = container.querySelector('div:last-child').innerHTML
    }
}
function logIn (){
    userName = document.querySelector('.loginInput .loginBox input').value
    if (userName !== ''){
        toggleHidden('.loginBox')
        toggleHidden('.loading')
        sendUserName()
    } else {
        alert("Campo em branco, digite seu nome")
    }
}
function sendUserName(){  
    let user ={
        name: userName
    }
    const promiseSendUser = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', user)
    promiseSendUser.catch(userAlreadyTaken)
    promiseSendUser.then(logInDone)
}
function logInDone(){
    toggleHidden('.loginInput')
    loginInputIsDisplayed = false;
    userList()
    apiMessage()
}
function userAlreadyTaken(erro) {
	toggleHidden('.loginBox')
    toggleHidden('.loading')
    document.querySelector('.loginInput .loginBox input').value = ''
    alert('Nome já está em uso tente novamente com outra opção')
}
function keepOnLine(){
    if (userName!== ''){
        let user ={
            name: userName
        }
        const promiseSendUser = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', user)
        promiseSendUser.catch(windowReload)
    }
}
//document.querySelector('.users .selected').innerText
function sendMessage (){
    if (userName!== '' && document.querySelector('footer input').value !==''){
        let messageType = document.querySelector('.visibilityList .selected p').innerText
        let  messageReceiver = document.querySelector('.users .selected')

        if (messageReceiver === null){
            alert ('O usuário saiu da sala, selecione para quem você quer enviar mensagem')
            return
        }

        let message = {
            from:userName,
            to:messageReceiver.innerText,
            text:document.querySelector('footer input').value,
            type:'message',
        }
        if (messageType === 'Reservadamente'){
            message.type = 'private_message'
        }

        const promiseSendMessage=axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', message)
        document.querySelector('footer input').value = ""
        promiseSendMessage.then(apiMessage)    
        promiseSendMessage.catch(windowReload)
    } 
}
function userList () {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants')
    promise.then(loadUserList);
}
function loadUserList (success) {
    let selectedUser = document.querySelector('.users .selected p');
    let check =''
    let checkIcon =''
    if (selectedUser.innerHTML === 'Todos' || selectedUser === null ){
        check = 'selected'
    } else {
        checkIcon = 'hidden'
    }
    let innerHTML = 
        `<div class="userType ${check}" onclick="selection(this, 'users')">
            <div class="user" >
                <ion-icon name="people"></ion-icon>
                <p>Todos</p>
            </div>
            <div class="selectedIcon ${checkIcon}">
                <ion-icon name="checkmark"></ion-icon>
            </div>
        </div>`     
    let userList = {
        name:"",
    } 

    for (let i = 0;  i < success.data.length; i++ ){

       userList={
           name:success.data[i].name,
        }

        if (success.data[i].name === selectedUser.innerHTML) {
        innerHTML += 
        `<div class="userType selected" onclick="selection(this, 'users')">
            <div class="user" >
                <ion-icon name="people"></ion-icon>
             <p>${userList.name}</p>
            </div>
            <div class="selectedIcon">
                <ion-icon name="checkmark"></ion-icon>
            </div>
        </div>`
        } else{
            innerHTML += 
            `<div class="userType" onclick="selection(this, 'users')">
            <div class="user" >
                <ion-icon name="people"></ion-icon>
             <p>${userList.name}</p>
            </div>
            <div class="selectedIcon hidden">
                <ion-icon name="checkmark"></ion-icon>
            </div>
        </div>`
        }

    }
    document.querySelector('.users').innerHTML = innerHTML
    selectedUser = document.querySelector('.users .selected p');
}
function windowReload(){
    window.location.reload()
}
function toggleHidden(element){
    document.querySelector(element).classList.toggle('hidden')
}

function selection (selected, type){
    let verify = document.querySelector(`.${type} .selected`)
    if (verify !== null) {
        verify.querySelector('.selectedIcon').classList.add(`hidden`);
        verify.classList.remove(`selected`)
    }
    selected.classList.add(`selected`);
    selected.querySelector('.selectedIcon').classList.remove(`hidden`);
    document.querySelector('footer span').innerHTML = `Enviando para ${document.querySelector('.users .selected').innerText} (${document.querySelector('.visibilityList .selected').innerText})`
}