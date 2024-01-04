document.addEventListener('DOMContentLoaded', function () {
    let booking_frames = document.querySelectorAll('.dates');
    booking_frames.forEach(cur => {
        let customDatetime = new Date(cur.textContent);
        let str1 = customDatetime.toLocaleString('en-US',{
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        document.getElementById(cur.id + "date").textContent = "On: " + str1;
        let str = customDatetime.toLocaleString('en-US',{
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          });
        cur.textContent = 'From: ' + str;
    });

    booking_frames = document.querySelectorAll('.dates1');
    booking_frames.forEach(cur => {
        let customDatetime = new Date(cur.textContent);
        let str = customDatetime.toLocaleString('en-US',{
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          });
        cur.textContent = 'Till: ' + str;
    });

    let target = -1;

    function reject(event){
        target = parseInt(event.target.id.slice(6));
        document.getElementById("input_container_reject").style.display = "";
        document.getElementById("error_div").innerHTML = "";
    }

    function reject_final(){
        fetch('cancel_appoint',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token,
            },
            body: JSON.stringify({
                id: target,
                who: 'doc'
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data['message'] == "NO"){
                cancel_booking("overriding_banana");
                document.getElementById("error_div").innerHTML = '<div class="alert alert-danger" id="beepo5"><a class="close" data-dismiss="alert" href="#" onclick="hide(5)">×</a>Can not cancel a running appointment.</div>';
            }
            else{
                document.getElementById("booking_frame"+target).remove();
                cancel_booking("overriding_banana");
                document.getElementById("error_div").innerHTML = '<div class="alert alert-success" id="beepo5"><a class="close" data-dismiss="alert" href="#" onclick="hide(5)">×</a>Appointment has been canceled successfully.</div>';
            }
        });
    }

    function cancel_booking(event){
        if(event != "overriding_banana"){
            if(event.target != document.getElementById('input_container_reject') && event.target != document.getElementById('final_no')){
                return;
            }
        }
        if(document.getElementById('input_container_reject').style.display == ""){
            document.getElementById('input_container_reject').style.display = "none";
        }
    }

    let reject_btns = document.querySelectorAll('.cancel_appointment');
    reject_btns.forEach(cur => {
        cur.addEventListener('click',reject);
    });


    document.getElementById('input_container_reject').addEventListener('click', cancel_booking);

    document.getElementById('final_yes').addEventListener('click', reject_final);
});