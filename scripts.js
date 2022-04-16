//start
let userName ='';
let lastMessage;
apiMessage()
userList ()
setInterval(keepOnLine, 4000)
setInterval(apiMessage,3000)
setInterval(userList,10000)
document.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        sendMessage();
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
        if (data.type !== 'Reservadamente'){
            mensagem += `<div class="mensagem ${data.type}">
            <p><span>(${data.time})</span> <strong> ${data.from}</strong> para <strong>${data.to}</strong>: ${data.text} </p>
            </div>`
        } else if (data.type === 'Reservadamente' && data.to === userName) {
            mensagem  += `<div class="mensagem ${data.type}">
            <p><span>(${data.time})</span> <strong> ${data.from}</strong> para <strong>${data.to}</strong>: ${data.text} </p>
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
function sendMessage (){
    if (userName!== '' && document.querySelector('footer input').value !==''){
        let message = {
            from:userName,
            to:'Todos',
            text:document.querySelector('footer input').value,
            type:'message',
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

    let innerHTML = ""; 
     innerHTML =  
    `<div class="userType">
        <div class="all">
            <ion-icon name="people"></ion-icon>
            <p>Todos</p>
        </div>
    </div>`
    let userList = {
        name:"",
    } 
    for (let i = 0;  i < success.data.length; i++ ){
       userList={
           name:success.data[i].name,
        }
        innerHTML += 
        `<div class="userType">
            <div class="user">
                <ion-icon name="people"></ion-icon>
             <p>${userList.name}</p>
            </div>
        </div>`
    }
    document.querySelector('.users').innerHTML = innerHTML
}


function windowReload(){
    window.location.reload()
}
function toggleHidden(element){
    document.querySelector(element).classList.toggle('hidden')
}

