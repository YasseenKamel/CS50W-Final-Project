document.addEventListener('DOMContentLoaded', function () {
    function get_messages(){
        
    }
    document.getElementById("notif").addEventListener('click',function(){
        document.getElementById("blackscreen").style.display = "";
        document.getElementById("message_div").style.display = "";
    });
    document.getElementById("blackscreen").addEventListener('click',function(){
        document.getElementById("blackscreen").style.display = "none";
        document.getElementById("message_div").style.display = "none";
    });
});