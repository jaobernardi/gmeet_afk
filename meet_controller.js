// Define variables
var enabled = false;
var auto_leave = false;
var sent_goodbye = false;
var sent_presence = false;
var min_users = 10;
var panic_phrases = ["joão?", "jão?", "jão", "joão"]
var messages_presence = ["🙋‍♀️ aqui", "🙋‍♀️ eu", "eu", "👋 aqui", "aqui", "👋 Aqui", "🙋‍♀️ Aqui", "Aqui", "👋 presente", "👋 Presente", "presente", "Presente", "🙋‍♀️ Eu", "🙋‍♀️ Eu", "Bom dia"];
var messages_leave = ['Até mais! 👋', 'Tchau! 👋', 'Até! 👋'];
var watch_user = ["João", "Guilherme"];
var watch_presence_key = ["eu", "euu", "presente", "aqui"];
var watch_leave_key = ['tchau'];
var old_title = document.title;
var yourself = ["Você", "You"]

// Link the message event for command recieving
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    
    if (request.command == "toggle-feature-bar"){
        enabled = !enabled
        auto_leave = enabled
        
        if (enabled){
            
            old_title = document.title
            document.title = "(GOD MODE) "+document.title
    
            sendResponse({
                notification:{            
                    type: 'basic',
                    iconUrl: 'icon.png',
                    title: 'Google Meet Anti-Falta',
                    message: 'Full automatic mode activated. Now you can go to sleep 🛌💤.'
                }
            })
        } else{
            document.title = old_title
            sendResponse({
                notification:{            
                    type: 'basic',
                    iconUrl: 'icon.png',
                    title: 'Google Meet Anti-Falta',
                    message: 'Full automatic mode deactivated. Welcome back 🥱 👋'
                }
            })
        }

    } else if (request.command == "toggle-feature-foo"){
        enabled = !enabled
        if (enabled){
            old_title = document.title
            document.title = "(Anti-Falta) "+document.title
    
            sendResponse({
                notification:{            
                    type: 'basic',
                    iconUrl: 'icon.png',
                    title: 'Google Meet Anti-Falta',
                    message: 'Auto-reply mode activated. Now you can go to sleep 🛌💤.'
                }
            })
        } else{
            document.title = old_title
            sendResponse({
                notification:{            
                    type: 'basic',
                    iconUrl: 'icon.png',
                    title: 'Google Meet Anti-Falta',
                    message: 'Auto-reply mode deactivated. Welcome back 🥱 👋'
                }
            })
        }

    } else{
        auto_leave = !auto_leave
        if (auto_leave){
            old_title = document.title
            document.title = "(Anti-Alone) "+document.title
    
            sendResponse({
                notification:{            
                    type: 'basic',
                    iconUrl: 'icon.png',
                    title: 'Google Meet Anti-Falta',
                    message: 'Auto-leave mode activated. Now you can go to sleep 🛌💤.'
                }
            })
        } else{
            document.title = old_title
            sendResponse({
                notification:{            
                    type: 'basic',
                    iconUrl: 'icon.png',
                    title: 'Google Meet Anti-Falta',
                    message: 'Auto-leave mode deactivated. Welcome back 🥱 👋'
                }
            })
        }
    }
    console.log({enabled: enabled, auto_leave: auto_leave})
})

// Send message function
function send_message(message){
    // Get text input and submit elements.
    let textarea = document.querySelector('textarea[name="chatTextInput"]')
    let submit = document.querySelector('[role="button"][data-tooltip="Enviar mensagem"]')

    // Check for other languages
    if (submit == null){
        let submit = document.querySelector('[role="button"][data-tooltip="Enviar mensagem"]')
    }

    //Send the message    
    textarea.click()
    textarea.value = message
    submit.removeAttribute('aria-disabled')
    submit.click()
    

}


// Main loop
function main_loop(){
    return setInterval(() => {
        if (enabled){
            // Get messages
            x = document.getElementsByClassName("GDhqjd")
            
            // Check if there is any message 
            if (x.length > 0) {
                // Get the message content element
                y = x[x.length-1].getElementsByClassName("oIy2qc")
                
                // Get all data into one variable
                data = {
                    online_users: parseInt(document.querySelector("[jsname=EydYod]").innerText.replace("(", "").replace(")", "")),
                    user: x[x.length-1].getAttribute("data-sender-name"),
                    message: y[y.length-1].getAttribute("data-message-text"),
                    sanitized_message: y[y.length-1].getAttribute("data-message-text").replace(new RegExp('\\W+'), '')
                };                
                //Check for presence messages.
                if(
                    !sent_presence &&
                    watch_user.includes(data.user.split(" ")[0]) && 
                    watch_presence_key.includes(data.sanitized_message.toLowerCase())
                ){            
                    console.log(data)        
                    // Reply with random presence message and start timeout
                    send_message(messages_presence[Math.floor(Math.random() * messages_presence.length)]);
                    sent_presence = true;
                    setTimeout(() => {sent_presence=false}, 20000)

                } 

                // Check for goodbye messages
                else if (
                    !sent_goodbye && !yourself.includes(data.user) 
                    && watch_leave_key.includes(data.sanitized_message.split(" ")[0].toLowerCase())
                ){
                    console.log(data)
                    // Reply with random goodbye message and reset timeout                    
                    sent_goodbye = true
                    send_message(messages_leave[Math.floor(Math.random() * messages_leave.length)])
                    setTimeout(() => {sent_goodbye=false}, 20000)
    
                } else if (
                    data.message.startsWith("$")
                ) {
                    if (data.message.toLowerCase() == "$ping"){
                        send_message("🏓 - Pong");
                    } else if (data.message.toLowerCase().startsWith("$eval")){
                        send_message(eval(data.message.split(" ").slice(1).join(" ")));
                    } else if (data.message.toLowerCase().startsWith("$clear")){
                        send_message("⠀\n".repeat(100));
                    }
                }

                // Check for panic phrases
                else if (
                    panic_phrases.includes(data.message.split(" ")[0].toLowerCase())
                ){
                    console.log(data)
                    window.location = "about:blank"; 
                }
            }
            
        }
        // Check if autoleave is enabled.
        if (auto_leave) {
            online_users = document.querySelector("[jsname=EydYod]")
            if (online_users){
                // Parse online users
                online_users = parseInt(document.querySelector("[jsname=EydYod]").innerText.replace("(", "").replace(")", ""))
                
                // Check if there is enough online users to stay connected
                if (online_users < min_users) {

                    // Leave
                    window.location = "about:blank";                   
                }
    
            }
    
        }
    }, 100)
}

main_loop();

