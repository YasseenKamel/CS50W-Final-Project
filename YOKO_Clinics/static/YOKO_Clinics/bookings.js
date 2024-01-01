document.addEventListener('DOMContentLoaded', function () {
    let booking_frames = document.querySelectorAll('.dates');
    booking_frames.forEach(cur => {
        let customDatetime = new Date(cur.textContent);
        let str = customDatetime.toLocaleString('en-US',{
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          });
        cur.textContent = 'Date created: ' + str;
    });

    let target = -1;

    function reject(event){
        target = parseInt(event.target.id.slice(6));
        document.getElementById("input_container_reject").style.display = "";
        document.getElementById("error_div").innerHTML = "";
    }

    function reject_final(){
        fetch('booking_final',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token,
            },
            body: JSON.stringify({
                method: "reject",
                id: target
            })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("booking_frame"+target).remove();
            cancel_booking("overriding_banana");
            document.getElementById("error_div").innerHTML = '<div class="alert alert-success" id="beepo5"><a class="close" data-dismiss="alert" href="#" onclick="hide(5)">×</a>Booking has been rejected successfully.</div>';
        });
    }

    function confirm(event){
        target = parseInt(event.target.id.slice(7));
        document.getElementById("error_div").innerHTML = "";
        document.getElementById("confirm_error_div").innerHTML = "";
        document.getElementById("input_container_confirm").style.display = "";
        document.getElementById("duration").value = "";
    }

    function confirm_final(){
        if(isValidTimeFormat(document.getElementById("duration").value) == false){
            document.getElementById("confirm_error_div").innerHTML = '<div class="alert alert-danger" id="beepo2"><a class="close" data-dismiss="alert" href="#" onclick="hide(2)">×</a>Invalid duration format.</div>';
            return;
        }
        fetch('booking_final',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token,
            },
            body: JSON.stringify({
                method: "confirm",
                duration: document.getElementById("duration").value,
                id: target
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data['message'] == 'OK'){
                document.getElementById("booking_frame"+target).remove();
                cancel_booking("overriding_banana");
                let date = new Date(data['start']);
                let start = new Date(data['start']);
                start = start.toLocaleString('en-US',{
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                });
                let end = new Date(data['end']);
                end = end.toLocaleString('en-US',{
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                });
                document.getElementById("error_div").innerHTML = '<div class="alert alert-success" id="beepo5"><a class="close" data-dismiss="alert" href="#" onclick="hide(5)">×</a>Appointment has been set from ' + start + ' till ' + end + ' on ' + date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear() + '</div>';
            }
            else if(data['message'] == 'NO'){
                document.getElementById("confirm_error_div").innerHTML = '<div class="alert alert-danger" id="beepo2"><a class="close" data-dismiss="alert" href="#" onclick="hide(2)">×</a>There is not enough time for this duration. Your maximum time is ' + data['duration'] + '</div>';
            }
            else{
                document.getElementById("confirm_error_div").innerHTML = '<div class="alert alert-danger" id="beepo2"><a class="close" data-dismiss="alert" href="#" onclick="hide(2)">×</a>This booking is on a day off. If you wish to accept it, head to the vacations tab and alter your schedule accordingly.</div>';
            }
        });
    }

    function cancel_booking(event){
        if(event != "overriding_banana"){
            if(event.target != document.getElementById('input_container_reject') && event.target != document.getElementById('input_container_confirm') && event.target != document.getElementById('final_reject') && event.target != document.getElementById('final_confirm_reject')){
                return;
            }
        }
        if(document.getElementById('input_container_reject').style.display == ""){
            document.getElementById('input_container_reject').style.display = "none";
        }
        else if(document.getElementById('input_container_confirm').style.display == ""){
            document.getElementById('input_container_confirm').style.display = "none";
        }
    }

    let reject_btns = document.querySelectorAll('.reject_booking');
    reject_btns.forEach(cur => {
        cur.addEventListener('click',reject);
    });

    let confirm_btns = document.querySelectorAll('.confirm_booking');
    confirm_btns.forEach(cur => {
        cur.addEventListener('click',confirm);
    });

    document.getElementById('input_container_reject').addEventListener('click', cancel_booking);
    document.getElementById('input_container_confirm').addEventListener('click', cancel_booking);
    document.getElementById('duration').addEventListener('focus', function(){
        document.getElementById("confirm_error_div").innerHTML = "";
    });

    document.getElementById('final_reject_confirm').addEventListener('click', reject_final);
    document.getElementById('final_confirm').addEventListener('click', confirm_final);
});