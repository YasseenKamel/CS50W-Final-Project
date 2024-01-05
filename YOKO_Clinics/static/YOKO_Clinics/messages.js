document.addEventListener('DOMContentLoaded', function () {
    let timer;
    let sent = 0,cnt = 0;
    let og_unread,ids = [];
    function mark(){
        fetch('get_messages',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token,
            },
            body: JSON.stringify({
                method: 'post',
                ids: ids
            })
        })
        .then(response => response.json())
        .then(data => {
            sent = 1;
            document.getElementById('notif').innerHTML = '<path fill="currentColor"d="M4 19v-2h2v-7q0-2.075 1.25-3.687T10.5 4.2V2h3v2.2q2 .5 3.25 2.113T18 10v7h2v2zm8 3q-.825 0-1.412-.587T10 20h4q0 .825-.587 1.413T12 22" />'
        });
    }
    function get_messages(){
        fetch('get_messages',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token,
            },
            body: JSON.stringify({
                method: 'get'
            })
        })
        .then(response => response.json())
        .then(data => {
            cnt = data['data'].length;
            for(let i = 0 ; i < cnt ; i ++){
                let container = document.createElement('div');
                let content = document.createElement('p');
                content.style.margin = "0";
                content.style.padding = "0.5rem";
                content.style.paddingLeft = "0.7rem";
                content.style.paddingRight = "0.7rem";
                content.textContent = data['data'][i]['content'];
                container.appendChild(content);
                if(data['data'][i]['read']){
                    container.classList.add("read");
                }
                else{
                    container.classList.add("unread");
                    ids.push(data['data'][i]['id']);
                }
                container.id = "message" + data['data'][i]['id'];
                document.getElementById("message_div").appendChild(container);
                document.getElementById("message_div").appendChild(document.createElement('hr'));
            }
            
        });
    }
    get_messages();
    let offset = document.getElementById("message_div").offsetLeft;
    document.getElementById("notif").addEventListener('click',function(){
        document.getElementById("blackscreen").style.display = "";
        if(!sent){
            timer = setTimeout(mark, 3000);
        }
        document.getElementById("message_div").style.display = "";
        offset = document.getElementById("message_div").offsetLeft;
        document.getElementById("message_div").style.left = (offset - document.getElementById("message_div").offsetWidth) + 'px';
        og_unread = document.querySelectorAll(".unread");
        og_unread.forEach(mes => {
            mes.classList = "read";
        });
    });
    document.getElementById("blackscreen").addEventListener('click',function(){
        document.getElementById("blackscreen").style.display = "none";
        document.getElementById("message_div").style.display = "none";
        document.getElementById("message_div").style.left = "";
        if(!sent){
            og_unread.forEach(mes => {
                mes.classList = "unread";
            });
        }
        clearTimeout(timer);
    });
    window.addEventListener('resize', function() {
        if(document.getElementById("message_div").style.display == ""){
            document.getElementById("message_div").style.left = "";
            offset = document.getElementById("message_div").offsetLeft;
            document.getElementById("message_div").style.left = (offset - document.getElementById("message_div").offsetWidth) + 'px';
        }
    });
});