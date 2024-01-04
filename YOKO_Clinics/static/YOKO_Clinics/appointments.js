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

    booking_frames = document.querySelectorAll('.dates5');
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
                who: 'pat'
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

    function reject1(event){
        target = parseInt(event.target.id.slice(6));
        document.getElementById("input_container_reject1").style.display = "";
        document.getElementById("error_div").innerHTML = "";
    }

    function reject_final1(){
        fetch('cancel_appoint',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token,
            },
            body: JSON.stringify({
                id: target,
                who: "booking"
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
                document.getElementById("error_div").innerHTML = '<div class="alert alert-success" id="beepo5"><a class="close" data-dismiss="alert" href="#" onclick="hide(5)">×</a>Booking request has been canceled successfully.</div>';
            }
        });
    }

    function review(event){
        target = parseInt(event.target.id.slice(6));
        document.getElementById("input_container_review").style.display = "";
        document.getElementById("error_div").innerHTML = "";
        document.getElementById("review_desc").value = "";
        for(let j = 1 ; j < 6 ; j ++) {
            document.getElementById("s"+String(j)).checked = false;
        }
    }

    function review_final(){
        if(document.getElementById("review_desc").value.trim() == ""){
            if(document.getElementById("beepo100") == undefined){
                document.getElementById("error_div_bookin").innerHTML += '<div class="alert alert-danger" id="beepo100"><a class="close" data-dismiss="alert" href="#" onclick="hide(100)">×</a>Please fill in the description.</div>';
            }
            else{
                document.getElementById("beepo100").style.display = '';
                document.getElementById("beepo100").innerHTML = '<a class="close" data-dismiss="alert" href="#" onclick="hide(100)">×</a>Please fill in the description.';
            }
            return;
        }
        if(document.getElementById("review_desc").value.trim().length > 500){
            if(document.getElementById("beepo100") == undefined){
                document.getElementById("error_div_bookin").innerHTML += '<div class="alert alert-danger" id="beepo100"><a class="close" data-dismiss="alert" href="#" onclick="hide(100)">×</a>Description can not exceed 500 characters.</div>';
            }
            else{
                document.getElementById("beepo100").style.display = '';
                document.getElementById("beepo100").innerHTML = '<a class="close" data-dismiss="alert" href="#" onclick="hide(100)">×</a>Description can not exceed 500 characters.';
            }
            return;
        }
        let rating = 0;
        for(let j = 1 ; j < 6 ; j ++) {
            if(document.getElementById("s"+String(j)).checked){
                rating ++;
            }
        }
        fetch('review_appoint',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token,
            },
            body: JSON.stringify({
                id: target,
                description: document.getElementById("review_desc").value.trim(),
                rating: rating
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data['message'] == "NO"){
                cancel_booking("overriding_banana");
                document.getElementById("error_div").innerHTML = '<div class="alert alert-danger" id="beepo5"><a class="close" data-dismiss="alert" href="#" onclick="hide(5)">×</a>Failed to review appointment. Please refresh and try again.</div>';
            }
            else{
                document.getElementById("review_btns"+target).remove();
                cancel_booking("overriding_banana");
                document.getElementById("error_div").innerHTML = '<div class="alert alert-success" id="beepo5"><a class="close" data-dismiss="alert" href="#" onclick="hide(5)">×</a>Review sent successfully.</div>';
            }
        });
    }

    function cancel_booking(event){
        if(event != "overriding_banana"){
            if(event.target != document.getElementById('input_container_reject') && event.target != document.getElementById('input_container_reject1') && event.target != document.getElementById('input_container_review') && event.target != document.getElementById('final_no') && event.target != document.getElementById('final_no1') && event.target != document.getElementById('final_no_review')){
                return;
            }
        }
        if(document.getElementById('input_container_reject').style.display == ""){
            document.getElementById('input_container_reject').style.display = "none";
        }
        if(document.getElementById('input_container_reject1').style.display == ""){
            document.getElementById('input_container_reject1').style.display = "none";
        }
        if(document.getElementById('input_container_review').style.display == ""){
            document.getElementById('input_container_review').style.display = "none";
        }
    }

    let reject_btns = document.querySelectorAll('.cancel_appointment');
    reject_btns.forEach(cur => {
        cur.addEventListener('click',reject);
    });

    reject_btns = document.querySelectorAll('.cancel_appointment1');
    reject_btns.forEach(cur => {
        cur.addEventListener('click',reject1);
    });

    reject_btns = document.querySelectorAll('.review_appointment');
    reject_btns.forEach(cur => {
        cur.addEventListener('click',review);
    });


    document.getElementById('input_container_reject').addEventListener('click', cancel_booking);
    document.getElementById('input_container_reject1').addEventListener('click', cancel_booking);
    document.getElementById('input_container_review').addEventListener('click', cancel_booking);

    document.getElementById('final_yes').addEventListener('click', reject_final);
    document.getElementById('final_yes1').addEventListener('click', reject_final1);
    document.getElementById('final_review').addEventListener('click', review_final);

    if(document.getElementById("s1") != undefined){
        for(let i = 1 ; i < 6 ; i ++) {
            document.getElementById("s"+String(i)).addEventListener('click', function () {
                if(i == 1){
                    if(document.getElementById("s"+String(i)).checked == false && document.getElementById("s2").checked == false && document.getElementById("s3").checked == false && document.getElementById("s4").checked == false && document.getElementById("s5").checked == false){
                        for(let j = 1 ; j < 6 ; j ++) {
                            document.getElementById("s"+String(j)).checked = false;
                        }
                    }
                    else{
                        for(let j = 1 ; j < i + 1 ; j ++) {
                            document.getElementById("s"+String(j)).checked = true;
                        }
                        for(let j = i + 1 ; j < 6 ; j ++) {
                            document.getElementById("s"+String(j)).checked = false;
                        }
                    }
                }
                else{
                    for(let j = 1 ; j < i + 1 ; j ++) {
                        document.getElementById("s"+String(j)).checked = true;
                    }
                    for(let j = i + 1 ; j < 6 ; j ++) {
                        document.getElementById("s"+String(j)).checked = false;
                    }
                }
            });
            document.getElementById("a"+String(i)).addEventListener('mouseenter', function () {
                for(let j = 1 ; j < 6 ; j ++){
                    if(document.getElementById("a"+String(j)).classList.contains('lil_star_hover')){
                        document.getElementById("a"+String(j)).classList.toggle('lil_star_hover');
                    }
                }
                for(let j = 1 ; j < i + 1 ; j ++) {
                    document.getElementById("a"+String(j)).classList.toggle('lil_star_hover');
                }
            });
            document.getElementById("a"+String(i)).addEventListener('mouseleave', function () {
                for(let j = 1 ; j < 6 ; j ++){
                    if(document.getElementById("a"+String(j)).classList.contains('lil_star_hover')){
                        document.getElementById("a"+String(j)).classList.toggle('lil_star_hover');
                    }
                }
            });
        }
    }
});