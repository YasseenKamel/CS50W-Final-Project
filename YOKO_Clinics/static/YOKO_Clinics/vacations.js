document.addEventListener('DOMContentLoaded', function (){
    let month_days = [31,28,31,30,31,30,31,31,30,31,30,31];
    let month_names = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    let weekday_this;
    let weekday_this_prev;
    let weekday_this_next;
    let month_this;
    let month_this_prev;
    let month_this_next;
    let year_this;
    let year_this_prev;
    let year_this_next;
    let weekday;
    let weekday_prev;
    let weekday_next;
    let year;
    let year_prev;
    let year_next;
    let month;
    let month_prev;
    let month_next;

    let mousedown = -1, mouseup = -1;

    let appointments,vacations,altered;
    let starting = -1,ending = -1;

    function get_selected(){
        fetch('get_selected',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token,
            },
            body: JSON.stringify({
                year: year,
                month: (month + 1),
                day: mousedown,
                id1: id1
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data['message'] == 'frame'){
                let start = new Date(data['start']+"+00:00");
                start = start.toLocaleString('en-US',{
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                });
                let end = new Date(data['end']+"+00:00");
                end = end.toLocaleString('en-US',{
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                });
                document.getElementById("day_selected").textContent = "(" + start + " till " + end + ")";
            }
            else{
                document.getElementById("day_selected").textContent = data['message'];
            }
        });
    }

    function color_days(vacations,altered){
        for(let i = 0 ; i < vacations.length ; i ++){
            let day = vacations[i]['fields']['start_date'].split('-')[2].split('T')[0],day1 = vacations[i]['fields']['end_date'].split('-')[2].split('T')[0];
            let day_month = parseInt(vacations[i]['fields']['start_date'].split('-')[1])-1;
            for(let j = parseInt(day) ; j <= parseInt(day1) ; j ++){
                if(day_month == month_prev){
                    document.getElementById('calendar-day-1' + j).classList.add("day_off_new");
                }
                else if(day_month == month){
                    document.getElementById('calendar-day0' + j).classList.add("day_off_new");
                }
                else if(day_month == month_next){
                    document.getElementById('calendar-day1' + j).classList.add("day_off_new");
                }
            }
        }
        for(let i = 0 ; i < altered.length ; i ++){
            let day = altered[i]['fields']['start_date'].split('-')[2].split('T')[0],day1 = altered[i]['fields']['end_date'].split('-')[2].split('T')[0];
            let day_month = parseInt(altered[i]['fields']['start_date'].split('-')[1])-1;
            for(let j = parseInt(day) ; j <= parseInt(day1) ; j ++){
                if(day_month == month_prev){
                    document.getElementById('calendar-day-1' + j).classList.add("altered");
                }
                else if(day_month == month){
                    document.getElementById('calendar-day0' + j).classList.add("altered");
                }
                else if(day_month == month_next){
                    document.getElementById('calendar-day1' + j).classList.add("altered");
                }
            }
        }
    }

    function set_up_input(){
        document.getElementById('start_day').value = mousedown + '/' + (month + 1) + '/' + year;
        document.getElementById('end_day').value = mouseup + '/' + (month + 1) + '/' + year;
        document.getElementById('input_container').style.display = 'flex';
        document.getElementById('vacation_input_title').textContent = ((mousedown == mouseup) ? ("Select your new working times for each of the selected day. (" + mousedown + ((mousedown == 1 || mousedown == 21 || mousedown == 31) ? "st" : ((mousedown == 2 || mousedown == 22) ? "nd" : ((mousedown == 3 || mousedown == 23) ? "rd" : "th"))) + ')') : ("Select your new working times for each of the selected days. (" + mousedown + ((mousedown == 1 || mousedown == 21 || mousedown == 31) ? "st" : ((mousedown == 2 || mousedown == 22) ? "nd" : ((mousedown == 3 || mousedown == 23) ? "rd" : "th"))) + ' till ' + mouseup + ((mouseup == 1 || mouseup == 21 || mouseup == 31) ? "st" : ((mouseup == 2 || mouseup == 22) ? "nd" : ((mouseup == 3 || mouseup == 23) ? "rd" : "th"))) + ')'));
        document.getElementById('success_vacay').innerHTML = "";
        if(mouseup == mousedown){
            get_selected();
        }
        else{
            document.getElementById("day_selected").textContent = "";
        }
        starting = mousedown;
        ending = mouseup;
        mousedown = -1;
        mouseup = -1;
    }

    function getdown(event){
        const clicked = event.target;
        if(!(clicked.classList.contains("calendar-day") && !clicked.classList.contains("disabled_day") && !clicked.classList.contains("past_day")) || event.button === 2){
            mousedown = -1;
            mouseup = -1;
            return;
        }
        mousedown = parseInt(clicked.id.slice(13));
        document.querySelectorAll('.selected_day').forEach(banana => {
            banana.classList.toggle('selected_day');
        });
        clicked.classList.toggle('selected_day');
    }

    function cancel_vacation(event){
        if(event != "overriding_banana"){
            if(event.target != document.getElementById('input_container') && event.target != document.getElementById('cancel_vacay')){
                return;
            }
        }
        document.getElementById('input_container').style.display = 'none';
        document.getElementById('submit_vacation').value = "Set Schedule";
        document.getElementById('error_div').innerHTML = "";
        document.getElementById('start_time').value = "";
        document.getElementById('end_time').value = "";
        document.getElementById('start_time').disabled = false;
        document.getElementById('end_time').disabled = false;
        document.getElementById('is_vacation').checked = false;
        document.getElementById('is_vacation').disabled = false;
        document.getElementById("checker_vacation").style.cursor = "pointer";
        set_vacation = 0;

        document.querySelectorAll('.selected_day').forEach(banana => {
            banana.classList.toggle('selected_day');
        });
    }

    function reset_vacation(event){
        document.getElementById('submit_vacation').value = "Set Schedule";
        document.getElementById('vacation_input_title').textContent = ((starting == ending) ? ("Select your new working times for each of the selected day. (" + starting + ((starting == 1 || starting == 21 || starting == 31) ? "st" : ((starting == 2 || starting == 22) ? "nd" : ((starting == 3 || starting == 23) ? "rd" : "th"))) + ')') : ("Select your new working times for each of the selected days. (" + starting + ((starting == 1 || starting == 21 || starting == 31) ? "st" : ((starting == 2 || starting == 22) ? "nd" : ((starting == 3 || starting == 23) ? "rd" : "th"))) + ' till ' + ending + ((ending == 1 || ending == 21 || ending == 31) ? "st" : ((ending == 2 || ending == 22) ? "nd" : ((ending == 3 || ending == 23) ? "rd" : "th"))) + ')'));
        document.getElementById('error_div').innerHTML = "";
        set_vacation = 0;
    }

    let t1 = 0,t2 = 0,t3 = 0;

    function getup(event){
        if(mousedown == -1 || event.button === 2){
            return;
        }
        const clicked = event.target;
        if(!(clicked.classList.contains("calendar-day") && !clicked.classList.contains("disabled_day") && !clicked.classList.contains("past_day"))){
            mousedown = -1;
            mouseup = -1;
            document.querySelectorAll('.selected_day').forEach(banana => {
                banana.classList.toggle('selected_day');
            });
            return;
        }
        mouseup = parseInt(clicked.id.slice(13));
        if(mousedown > mouseup){
            [mousedown, mouseup] = [mouseup, mousedown];
        }
        set_up_input();
    }


    function enter_element(event){
        if(mousedown == -1 || event.button === 2){
            return;
        }
        const clicked = event.target;
        if(!clicked.classList.contains("calendar-day")){
            return;
        }
        let mouse_target = parseInt(clicked.id.slice(13));
        document.querySelectorAll('.selected_day').forEach(banana => {
            let id = parseInt(banana.id.slice(13));
            if(!((mousedown >= id && mouse_target <= id) || (mousedown <= id && mouse_target >= id))){
                banana.classList.toggle('selected_day');
            }
        });
        if(mouse_target < mousedown){
            for(let i = mouse_target ; i <= mousedown ; i ++){
                if(!document.getElementById('calendar-day0' + i).classList.contains('selected_day')){
                    document.getElementById('calendar-day0' + i).classList.toggle('selected_day')
                }
            }
        }
        else if(mouse_target > mousedown){
            for(let i = mousedown ; i <= mouse_target ; i ++){
                if(!document.getElementById('calendar-day0' + i).classList.contains('selected_day')){
                    document.getElementById('calendar-day0' + i).classList.toggle('selected_day')
                }
            }
        }
    }

    function gettouchdown(event){
        let touch = event.touches[0];
        let clicked = document.elementFromPoint(touch.clientX, touch.clientY);
        if(event.touches.length > 1 || clicked == null || clicked == undefined || !(clicked.classList.contains("calendar-day") && !clicked.classList.contains("disabled_day") && !clicked.classList.contains("past_day"))){
            mousedown = -1;
            mouseup = -1;
            return;
        }
        t1 = 1;
        document.body.style.overflow = 'hidden';
        mousedown = parseInt(clicked.id.slice(13));
        document.querySelectorAll('.selected_day').forEach(banana => {
            banana.classList.toggle('selected_day');
        });
        clicked.classList.toggle('selected_day');
    }

    function gettouchmove(event){
        if(mousedown == -1){
            return;
        }
        let touch = event.touches[0];
        let clicked = document.elementFromPoint(touch.clientX, touch.clientY);
        if(clicked == null || clicked == undefined || !(clicked.classList.contains("calendar-day") && !clicked.classList.contains("disabled_day") && !clicked.classList.contains("past_day"))){
            return;
        }
        t2 = 1;
        let mouse_target = parseInt(clicked.id.slice(13));
        document.querySelectorAll('.selected_day').forEach(banana => {
            let id = parseInt(banana.id.slice(13));
            if(!((mousedown >= id && mouse_target <= id) || (mousedown <= id && mouse_target >= id))){
                banana.classList.toggle('selected_day');
            }
        });
        if(mouse_target < mousedown){
            for(let i = mouse_target ; i <= mousedown ; i ++){
                if(!document.getElementById('calendar-day0' + i).classList.contains('selected_day')){
                    document.getElementById('calendar-day0' + i).classList.toggle('selected_day')
                }
            }
        }
        else if(mouse_target > mousedown){
            for(let i = mousedown ; i <= mouse_target ; i ++){
                if(!document.getElementById('calendar-day0' + i).classList.contains('selected_day')){
                    document.getElementById('calendar-day0' + i).classList.toggle('selected_day')
                }
            }
        }
    }

    function gettouchup(event){
        document.body.style.overflow = 'auto';
        if(mousedown == -1){
            return;
        }
        let clicked = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        if(clicked == null || clicked == undefined || !(clicked.classList.contains("calendar-day") && !clicked.classList.contains("disabled_day") && !clicked.classList.contains("past_day"))){
            mousedown = -1;
            mouseup = -1;
            document.querySelectorAll('.selected_day').forEach(banana => {
                banana.classList.toggle('selected_day');
            });
            return;
        }
        t3 = 1;
        event.preventDefault();
        mouseup = parseInt(clicked.id.slice(13));
        if(mousedown > mouseup){
            [mousedown, mouseup] = [mouseup, mousedown];
        }
        set_up_input();
    }

    document.body.addEventListener('click', function(e) {
        if(t1 && !t2 && t3){
            e.stopPropagation();
            e.preventDefault();
        }
        t1 = 0;
        t2 = 0;
        t3 = 0;
    });


    function load_month(year, month, weekday, idx){
        let template = '<section class="calendar-month-header"><div id="selected-month' + idx + '" class="calendar-month-header-selected-month">' + month_names[month] + ' ' + year + '</div><div class="calendar-month-header-selectors"><span id="previous-month-selector' + idx + '"><</span><span id="present-month-selector' + idx + '">Today</span><span id="next-month-selector' + idx + '">></span></div></section><ol id="days-of-week' + idx + '" class="day-of-week"><li>Sun</li><li>Mon</li><li>Tue</li><li>Wed</li><li>Thu</li><li>Fri</li><li>Sat</li></ol><ol id="calendar-days' + idx + '" class="days-grid">';
        let template_close = '</ol>';
        let days_num = month_days[month] + ((year % 4 == 0) && (year % 100 != 0 || year % 400 == 0) && month == 1);
        let day1 = '<li class="calendar-day" id="calendar-day', day02 = '"><span>',day2 = '</span></li>';
        let day3 = '<li class="calendar-day" id="calendar-day', day04 = '"><span class="number_thing1">&nbsp',day4 = '&nbsp</span></li>';
        let no_day1 = '<li class="calendar-day disabled_day"><span>',no_day2 = '</span></li>';
        let past_day1 = '<li class="calendar-day past_day" id="calendar-day',past_day02 = '"><span>',past_day2 = '</span></li>';
        let last_month = month_days[((month - 1) < 0 ? 11 : (month - 1))] + ((year % 4 == 0) && (year % 100 != 0 || year % 400 == 0) && month == 2);
        let sm = 0;
        let currentDate1 = new Date();
        let userTimeZone1 = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let options1 = { timeZone: userTimeZone1, year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        let date1 = new Date(currentDate1.toLocaleString('en-US', options1));
        let today_date1 = date1.getDate();
        for(let i = last_month - weekday + 2 ; i <= last_month ; i ++){
            template += no_day1 + i + no_day2;
            sm ++;
        }

        
        let day11 = '<li class="calendar-day day_off" id="calendar-day', day021 = '"><span>',day21 = '</span></li>';
        let day31 = '<li class="calendar-day day_off" id="calendar-day', day041 = '"><span class="number_thing1">&nbsp',day41 = '&nbsp</span></li>';
        let past_day11 = '<li class="calendar-day past_day day_off" id="calendar-day',past_day021 = '"><span>',past_day21 = '</span></li>';

        let cur_weekday = weekday;
        for(let i = 1 ; i <= days_num ; i ++){
            if(year == year_this && month == month_this && i == today_date1){
                if(repeated_vacations.includes(cur_weekday)){
                    template += day31 + idx + i + day041 + i + day41;
                }
                else{
                    template += day3 + idx + i + day04 + i + day4;
                }
            }
            else if(year < year_this || (year == year_this && month < month_this) || (year == year_this && month == month_this && i < today_date1)){
                if(repeated_vacations.includes(cur_weekday)){
                    template += past_day11 + idx + i + past_day021 + i + past_day21;
                }
                else{
                    template += past_day1 + idx + i + past_day02 + i + past_day2;
                }
            }
            else{
                if(repeated_vacations.includes(cur_weekday)){
                    template += day11 + idx + i + day021 + i + day21;
                }
                else{
                    template += day1 + idx + i + day02 + i + day2;
                }
            }
            sm ++;
            cur_weekday ++;
            if(cur_weekday > 7){
                cur_weekday -= 7;
            }
        }
        for(let i = 1 ; i <= 42 - sm ; i ++){
            template += no_day1 + i + no_day2;
        }
        return template + template_close;
    }


    function prev_month(){
        month_next = month;
        month = month_prev;
        month_prev = (month - 1) % 12 + (12 * (month == 0));

        year_next = year;
        year = year_prev;
        year_prev = year - (month == 0);

        weekday_next = weekday;
        weekday = weekday_prev;
        weekday_prev = (weekday - (month_days[((month - 1) < 0 ? 11 : (month - 1))] + ((year % 4 == 0) && (year % 100 != 0 || year % 400 == 0) && month == 2))) % 7 + 7;

        fetch('get_cal_data',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token,
            },
            body: JSON.stringify({
                year: year,
                month: (month + 1)
            })
        })
        .then(response => response.json())
        .then(data => {

            appointments = JSON.parse(data['appointments']);
            vacations = JSON.parse(data['vacays']);
            altered = JSON.parse(data['altered']);

            document.getElementById('calendar_slide0').classList.toggle('cal_slid2');
            document.getElementById('calendar_slide-1').classList.toggle('cal_slid1');
            ////

            //// cycling divs and renaming ids and redeclaring event listeners

            document.getElementById('calendar_slide1').remove();
            document.getElementById('previous-month-selector0').removeEventListener('click',prev_month);
            document.getElementById('next-month-selector0').removeEventListener('click',next_month);
            document.getElementById('present-month-selector0').removeEventListener('click',cur_month);

            // renaming ids
            document.getElementById('calendar_slide0').id = 'calendar_slide1';
            document.getElementById('selected-month0').id = 'selected-month1';
            document.getElementById('previous-month-selector0').id = 'previous-month-selector1';
            document.getElementById('present-month-selector0').id = 'present-month-selector1';
            document.getElementById('next-month-selector0').id = 'next-month-selector1';
            document.getElementById('days-of-week0').id = 'days-of-week1';
            document.getElementById('calendar-days0').id = 'calendar-days1';

            document.getElementById('calendar_slide-1').id = 'calendar_slide0';
            document.getElementById('selected-month-1').id = 'selected-month0';
            document.getElementById('previous-month-selector-1').id = 'previous-month-selector0';
            document.getElementById('present-month-selector-1').id = 'present-month-selector0';
            document.getElementById('next-month-selector-1').id = 'next-month-selector0';
            document.getElementById('days-of-week-1').id = 'days-of-week0';
            document.getElementById('calendar-days-1').id = 'calendar-days0';

            document.querySelectorAll('.calendar-day').forEach(slot => {
                if(slot.id.length > 12){
                    if(slot.id[12] == '0'){
                        slot.id = slot.id.slice(0,12) + '1' + slot.id.slice(13);
                        slot.removeEventListener('mouseenter',enter_element);
                    }
                }
            });

            document.querySelectorAll('.calendar-day').forEach(slot => {
                if(slot.id.length > 12){
                    if(slot.id[12] == '-'){
                        slot.id = slot.id.slice(0,12) + '0' + slot.id.slice(14);
                        if(!slot.classList.contains('past_day')){
                            slot.addEventListener('mouseenter',enter_element);
                        }
                    }
                }
            });

            // adding first div
            let prev_div = document.createElement('div');
            prev_div.id = 'calendar_slide-1';
            prev_div.classList.value = 'calendar_slide cal_slid1';
            prev_div.innerHTML = load_month(year_prev,month_prev,weekday_prev,'-1');

            document.getElementById('calendar-month').insertBefore(prev_div,document.getElementById('calendar-month').firstChild);
            color_days(vacations,altered);
            // redeclaring event listeners
            document.getElementById('previous-month-selector0').addEventListener('click',prev_month);
            document.getElementById('next-month-selector0').addEventListener('click',next_month);
            document.getElementById('present-month-selector0').addEventListener('click',cur_month);


        });

        
    }


    function next_month(){
        month_prev = month;
        month = month_next;
        month_next = (month + 1) % 12;

        year_prev = year;
        year = year_next;
        year_next = year + (month == 11);

        weekday_prev = weekday;
        weekday = weekday_next;
        weekday_next = (weekday + month_days[month] + ((year % 4 == 0) && (year % 100 != 0 || year % 400 == 0) && month == 1)) % 7;
        weekday_next += 7 * (weekday_next == 0);

        fetch('get_cal_data',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token,
            },
            body: JSON.stringify({
                year: year,
                month: (month + 1)
            })
        })
        .then(response => response.json())
        .then(data => {

            appointments = JSON.parse(data['appointments']);
            vacations = JSON.parse(data['vacays']);
            altered = JSON.parse(data['altered']);

            document.getElementById('calendar_slide0').classList.toggle('cal_slid1');
            document.getElementById('calendar_slide1').classList.toggle('cal_slid2');
            ////
            
            //// cycling divs and renaming ids and redeclaring event listeners

            document.getElementById('calendar_slide-1').remove();
            document.getElementById('previous-month-selector0').removeEventListener('click',prev_month);
            document.getElementById('next-month-selector0').removeEventListener('click',next_month);
            document.getElementById('present-month-selector0').removeEventListener('click',cur_month);

            // renaming ids
            document.getElementById('calendar_slide0').id = 'calendar_slide-1';
            document.getElementById('selected-month0').id = 'selected-month-1';
            document.getElementById('previous-month-selector0').id = 'previous-month-selector-1';
            document.getElementById('present-month-selector0').id = 'present-month-selector-1';
            document.getElementById('next-month-selector0').id = 'next-month-selector-1';
            document.getElementById('days-of-week0').id = 'days-of-week-1';
            document.getElementById('calendar-days0').id = 'calendar-days-1';

            document.getElementById('calendar_slide1').id = 'calendar_slide0';
            document.getElementById('selected-month1').id = 'selected-month0';
            document.getElementById('previous-month-selector1').id = 'previous-month-selector0';
            document.getElementById('present-month-selector1').id = 'present-month-selector0';
            document.getElementById('next-month-selector1').id = 'next-month-selector0';
            document.getElementById('days-of-week1').id = 'days-of-week0';
            document.getElementById('calendar-days1').id = 'calendar-days0';

            document.querySelectorAll('.calendar-day').forEach(slot => {
                if(slot.id.length > 12){
                    if(slot.id[12] == '0'){
                        slot.id = slot.id.slice(0,12) + '-1' + slot.id.slice(13);
                        slot.removeEventListener('mouseenter',enter_element);
                    }
                }
            });

            document.querySelectorAll('.calendar-day').forEach(slot => {
                if(slot.id.length > 12){
                    if(slot.id[12] == '1'){
                        slot.id = slot.id.slice(0,12) + '0' + slot.id.slice(13);
                        if(!slot.classList.contains('past_day')){
                            slot.addEventListener('mouseenter',enter_element);
                        }
                    }
                }
            });

            // adding first div
            let next_div = document.createElement('div');
            next_div.id = 'calendar_slide1';
            next_div.classList.value = 'calendar_slide cal_slid2';
            next_div.innerHTML = load_month(year_next,month_next,weekday_next,'1');

            document.getElementById('calendar-month').appendChild(next_div);
            color_days(vacations,altered);
            // redeclaring event listeners
            document.getElementById('previous-month-selector0').addEventListener('click',prev_month);
            document.getElementById('next-month-selector0').addEventListener('click',next_month);
            document.getElementById('present-month-selector0').addEventListener('click',cur_month);

        });
    }


    function cur_month(){
        if(year > year_this || (year == year_this && month > month_this)){

            fetch('get_cal_data',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrf_token,
                },
                body: JSON.stringify({
                    year: year_this,
                    month: (month_this + 1)
                })
            })
            .then(response => response.json())
            .then(data => {

                appointments = JSON.parse(data['appointments']);
                vacations = JSON.parse(data['vacays']);
                altered = JSON.parse(data['altered']);
                /// edit content of -1 first so it slides in ready
                document.getElementById('calendar_slide-1').innerHTML = load_month(year_this,month_this,weekday_this,'0');


                document.getElementById('calendar_slide0').classList.toggle('cal_slid2');
                document.getElementById('calendar_slide-1').classList.toggle('cal_slid1');

                document.getElementById('calendar_slide1').remove();
                document.getElementById('previous-month-selector0').removeEventListener('click',prev_month);
                document.getElementById('next-month-selector0').removeEventListener('click',next_month);
                document.getElementById('present-month-selector0').removeEventListener('click',cur_month);

                weekday = weekday_this;
                weekday_prev = weekday_this_prev;
                weekday_next = weekday_this_next;

                year = year_this;
                year_prev = year_this_prev;
                year_next = year_this_next;

                month = month_this;
                month_prev = month_this_prev;
                month_next = month_this_next;


                document.getElementById('calendar_slide0').innerHTML = load_month(year_next,month_next,weekday_next,'1');
                document.getElementById('calendar_slide0').id = 'calendar_slide1';

                document.getElementById('calendar_slide-1').id = 'calendar_slide0';


                let prev_div = document.createElement('div');
                prev_div.id = 'calendar_slide-1';
                prev_div.classList.value = 'calendar_slide cal_slid1';
                prev_div.innerHTML = load_month(year_prev,month_prev,weekday_prev,'-1');

                document.querySelectorAll('.calendar-day').forEach(slot => {
                    if(slot.id.length > 12 && !slot.classList.contains('past_day')){
                        if(slot.id[12] == '0'){
                            slot.addEventListener('mouseenter',enter_element);
                        }
                    }
                });

                document.getElementById('calendar-month').insertBefore(prev_div,document.getElementById('calendar-month').firstChild);
                color_days(vacations,altered);
                document.getElementById('previous-month-selector0').addEventListener('click',prev_month);
                document.getElementById('next-month-selector0').addEventListener('click',next_month);
                document.getElementById('present-month-selector0').addEventListener('click',cur_month);

            });

        }
        else if(year < year_this || (year == year_this && month < month_this)){

            fetch('get_cal_data',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrf_token,
                },
                body: JSON.stringify({
                    year: year_this,
                    month: (month_this + 1)
                })
            })
            .then(response => response.json())
            .then(data => {

                    
                appointments = JSON.parse(data['appointments']);
                vacations = JSON.parse(data['vacays']);
                altered = JSON.parse(data['altered']);
                document.getElementById('calendar_slide1').innerHTML = load_month(year_this,month_this,weekday_this,'0');

                document.getElementById('calendar_slide0').classList.toggle('cal_slid1');
                document.getElementById('calendar_slide1').classList.toggle('cal_slid2');

                document.getElementById('calendar_slide-1').remove();
                document.getElementById('previous-month-selector0').removeEventListener('click',prev_month);
                document.getElementById('next-month-selector0').removeEventListener('click',next_month);
                document.getElementById('present-month-selector0').removeEventListener('click',cur_month);

                weekday = weekday_this;
                weekday_prev = weekday_this_prev;
                weekday_next = weekday_this_next;

                year = year_this;
                year_prev = year_this_prev;
                year_next = year_this_next;

                month = month_this;
                month_prev = month_this_prev;
                month_next = month_this_next;


                document.getElementById('calendar_slide0').innerHTML = load_month(year_prev,month_prev,weekday_prev,'-1');
                document.getElementById('calendar_slide0').id = 'calendar_slide-1';

                document.getElementById('calendar_slide1').id = 'calendar_slide0';


                let next_div = document.createElement('div');
                next_div.id = 'calendar_slide1';
                next_div.classList.value = 'calendar_slide cal_slid2';
                next_div.innerHTML = load_month(year_next,month_next,weekday_next,'1');

                document.querySelectorAll('.calendar-day').forEach(slot => {
                    if(slot.id.length > 12 && !slot.classList.contains('past_day')){
                        if(slot.id[12] == '0'){
                            slot.addEventListener('mouseenter',enter_element);
                        }
                    }
                });

                document.getElementById('calendar-month').appendChild(next_div);
                color_days(vacations,altered);
                document.getElementById('previous-month-selector0').addEventListener('click',prev_month);
                document.getElementById('next-month-selector0').addEventListener('click',next_month);
                document.getElementById('present-month-selector0').addEventListener('click',cur_month);

            });
        }
    }


    if(document.getElementById("calendar_container") != undefined){
        let currentDate = new Date();
        let userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let options = { timeZone: userTimeZone, year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        let date = new Date(currentDate.toLocaleString('en-US', options));
        let today = date.getDay() + 1;
        let today_date = date.getDate();
        let first_day = today - ((today_date - 1) % 7);
        if(first_day < 1){
            first_day += 7;
        }

        //// MAIN VARIABLES

        weekday_this = first_day;
        weekday_this_prev = (weekday_this - (month_days[((date.getMonth() - 1) < 0 ? 11 : (date.getMonth() - 1))] + ((date.getFullYear() % 4 == 0) && (date.getFullYear() % 100 != 0 || date.getFullYear() % 400 == 0) && date.getMonth() == 2))) % 7 + 7;
        weekday_this_next = (weekday_this + month_days[date.getMonth()] + ((date.getFullYear() % 4 == 0) && (date.getFullYear() % 100 != 0 || date.getFullYear() % 400 == 0) && date.getMonth() == 1)) % 7;
        weekday_this_next += 7 * (weekday_this_next == 0);
        
        month_this = date.getMonth();
        month_this_prev = (month_this - 1) % 12 + (12 * (month_this == 0));
        month_this_next = (month_this + 1) % 12;

        year_this = date.getFullYear();
        year_this_prev = year_this - (month_this == 0);
        year_this_next = year_this + (month_this == 11);


        weekday = weekday_this;
        weekday_prev = weekday_this_prev;
        weekday_next = weekday_this_next;

        year = year_this;
        year_prev = year_this_prev;
        year_next = year_this_next;

        month = month_this;
        month_prev = month_this_prev;
        month_next = month_this_next;

        ////

        document.getElementById('calendar_slide-1').innerHTML = load_month(year_prev,month_prev,weekday_prev,'-1');
        document.getElementById('calendar_slide0').innerHTML = load_month(year,month,weekday,'0');
        document.getElementById('calendar_slide1').innerHTML = load_month(year_next,month_next,weekday_next,'1');

        fetch('get_cal_data',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token,
            },
            body: JSON.stringify({
                year: year_this,
                month: (month_this + 1)
            })
        })
        .then(response => response.json())
        .then(data => {
            
            appointments = JSON.parse(data['appointments']);
            vacations = JSON.parse(data['vacays']);
            altered = JSON.parse(data['altered']);
            color_days(vacations,altered);
            ////////////////////////////////////////////////////////////
            document.getElementById('previous-month-selector0').addEventListener('click',prev_month);
            document.getElementById('next-month-selector0').addEventListener('click',next_month);
            document.getElementById('present-month-selector0').addEventListener('click',cur_month);
            document.querySelectorAll('.calendar-day').forEach(slot => {
                if(slot.id.length > 12 && !slot.classList.contains('past_day')){
                    if(slot.id[12] == '0'){
                        slot.addEventListener('mouseenter',enter_element);
                    }
                }
            });
            document.addEventListener('mousedown', getdown);
            document.addEventListener('mouseup', getup);
            document.addEventListener('touchstart', gettouchdown);
            document.addEventListener('touchmove', gettouchmove);
            document.addEventListener('touchend', gettouchup);

            document.getElementById('input_container').addEventListener('click', cancel_vacation);
            document.getElementById('cancel_vacay').addEventListener('click', cancel_vacation);
        });
    }


    if(document.getElementById('is_vacation') != undefined){
        document.getElementById('is_vacation').addEventListener('click',function(){
            if(document.getElementById('is_vacation').checked){
                document.getElementById('start_time').disabled = true;
                document.getElementById('end_time').disabled = true;
            }
            else{
                document.getElementById('start_time').disabled = false;
                document.getElementById('end_time').disabled = false;
            }
        });
    }

    function bs_appointment_days(tar){
        let s = 0,e = appointments.length - 1;
        let mid = parseInt((s + e) / 2);
        while(s < e){
            mid = parseInt((s + e) / 2);
            let day = new Date(appointments[mid]['fields']['start_date']);
            day = day.getDate();
            if(day < tar){
                s = mid + 1;
            }
            else{
                e = mid;
            }
        }
        return s;
    }

    let set_vacation = 0;

    function submit_vacation(start, end, is_vacation){
        if(is_vacation){
            start = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(),start.getMinutes()));
            end = new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate(), end.getHours(),end.getMinutes()));
        }
        fetch('vacation_add',{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token,
            },
            body: JSON.stringify({
                start: start,
                end: end,
                is_vacation: is_vacation,
                start_day: start.getDate(),
                end_day: end.getDate()
            })
        })
        .then(response => response.json())
        .then(data => {
            if(is_vacation){
                let s = start.toISOString().split('-')[2].split('T')[0],e = end.toISOString().split('-')[2].split('T')[0];
                for(let i = parseInt(s) ; i <= parseInt(e) ; i ++){
                    document.getElementById('calendar-day0' + i).classList.add("day_off_new");
                    document.getElementById('calendar-day0' + i).classList.remove("altered");
                }
            }
            else{
                let s = (new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(),start.getMinutes()))).toISOString().split('-')[2].split('T')[0],e = (new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate(), end.getHours(),end.getMinutes()))).toISOString().split('-')[2].split('T')[0];
                for(let i = parseInt(s) ; i <= parseInt(e) ; i ++){
                    document.getElementById('calendar-day0' + i).classList.add("altered");
                    document.getElementById('calendar-day0' + i).classList.remove("day_off_new");
                }
            }
            let msg = '<div class="alert alert-success" id="beep' + (-1) + '"><a class="close" data-dismiss="alert" href="#" onclick="hide(' + (-1) + ')">×</a>Schedule set successfully.</div>';
            document.getElementById('success_vacay').innerHTML = msg;
            cancel_vacation("overriding_banana");
        });
    }

    if(document.getElementById('submit_vacation') != undefined){
        document.getElementById('submit_vacation').addEventListener('click',function(){
            if(set_vacation == 0){
                set_vacation ++;
                if(appointments.length != 0){
                    let start = bs_appointment_days(starting),end = bs_appointment_days(ending);
                    let day = new Date(appointments[start]['fields']['start_date']);
                    day = day.getDate();
                    if(day < starting){
                        start ++;
                    }
                    day = new Date(appointments[end]['fields']['start_date']);
                    day = day.getDate();
                    if(day > ending){
                        end --;
                    }
                    if(start <= end){
                        if(document.getElementById('is_vacation').checked == true){
                            document.getElementById('error_div').innerHTML = "";
                            document.getElementById('submit_vacation').value = "Set Anyway";
                            document.getElementById('vacation_input_title').innerHTML += "<br>These appointments will be cancelled if schedule is set.";
                            for(let i = start ; i <= end ; i ++){
                                let day = new Date(appointments[i]['fields']['start_date']),daye = new Date(appointments[i]['fields']['end_date']);
                                let day1 = day;
                                day = day.getDate();
                                let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                                let error_msg = '<div class="alert alert-danger" id="beep' + i + '"><a class="close" data-dismiss="alert" href="#" onclick="hide(' + i + ')">×</a>You have an appointment on the ' + day + ((day == 1 || day == 21 || day == 31) ? "st" : ((day == 2 || day == 22) ? "nd" : ((day == 3 || day == 23) ? "rd" : "th"))) + ' at ' + day1.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: true, timeZone }) + ' till ' + daye.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: true, timeZone }) + '.</div>';
                                document.getElementById('error_div').innerHTML += error_msg;
                            }
                        }
                        else{
                            if(!validateTime("start_time") || !validateTime("end_time") || document.getElementById('start_time').value == document.getElementById('end_time').value){
                                let error_msg = '<div class="alert alert-danger" id="beep1"><a class="close" data-dismiss="alert" href="#" onclick="hide(1)">×</a>Please set a valid time.</div>';
                                document.getElementById('error_div').innerHTML = error_msg;
                                set_vacation = 0;
                            }
                            else{
                                let bad_appointments = 0;
                                document.getElementById('error_div').innerHTML = "";
                                for(let i = starting ; i <= ending ; i ++){
                                    let start_tar = new Date(year, month, i, parseInt(document.getElementById("start_time").value.split(':')[0],10), parseInt(document.getElementById("start_time").value.split(':')[1],10));
                                    let end_tar = new Date(year, month, i + (document.getElementById("end_time").value < document.getElementById("start_time").value), parseInt(document.getElementById("end_time").value.split(':')[0],10), parseInt(document.getElementById("end_time").value.split(':')[1],10));
                                    let start = bs_appointment_days(i),end = bs_appointment_days(i + 1);
                                    let day = new Date(appointments[start]['fields']['start_date']);
                                    if(day.getDate() != i){
                                        continue;
                                    }
                                    day = new Date(appointments[end]['fields']['start_date']);
                                    if(day.getDate() <= i){
                                        end = appointments.length - 1;
                                    }
                                    else{
                                        end --;
                                    }
                                    for(let j = start ; j <= end ; j ++){
                                        let days = new Date(appointments[j]['fields']['start_date']),daye = new Date(appointments[j]['fields']['end_date']);
                                        if(!(days >= start_tar && daye <= end_tar)){
                                            bad_appointments ++;
                                            document.getElementById('submit_vacation').value = "Set Anyway";
                                            document.getElementById('vacation_input_title').innerHTML += "<br>These appointments will be cancelled if schedule is set.";
                                            let day1 = days;
                                            days = days.getDate();
                                            let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                                            let error_msg = '<div class="alert alert-danger" id="beep' + bad_appointments + '"><a class="close" data-dismiss="alert" href="#" onclick="hide(' + bad_appointments + ')">×</a>You have an appointment on the ' + days + ((days == 1 || days == 21 || days == 31) ? "st" : ((days == 2 || days == 22) ? "nd" : ((days == 3 || days == 23) ? "rd" : "th"))) + ' at ' + day1.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: true, timeZone }) + ' till ' + daye.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: true, timeZone }) + '.</div>';
                                            document.getElementById('error_div').innerHTML += error_msg;
                                        }
                                    }
                                }
                                if(bad_appointments == 0){
                                    submit_vacation(new Date(year, month, starting, parseInt(document.getElementById("start_time").value.split(':')[0],10), parseInt(document.getElementById("start_time").value.split(':')[1],10)),new Date(year, month, ending, parseInt(document.getElementById("end_time").value.split(':')[0],10), parseInt(document.getElementById("end_time").value.split(':')[1],10)),document.getElementById('is_vacation').checked);
                                }
                            }
                        }
                    }
                    else{
                        ///No bad appointments
                        if(document.getElementById('is_vacation').checked == true){
                            submit_vacation(new Date(year, month, starting, 0, 0, 0, 0),new Date(year, month, ending, 23, 59, 59, 0),document.getElementById('is_vacation').checked);
                        }
                        else{
                            if(!validateTime("start_time") || !validateTime("end_time") || document.getElementById('start_time').value == document.getElementById('end_time').value){
                                let error_msg = '<div class="alert alert-danger" id="beep1"><a class="close" data-dismiss="alert" href="#" onclick="hide(1)">×</a>Please set a valid time.</div>';
                                document.getElementById('error_div').innerHTML = error_msg;
                                set_vacation = 0;
                            }
                            else{
                                submit_vacation(new Date(year, month, starting, parseInt(document.getElementById("start_time").value.split(':')[0],10), parseInt(document.getElementById("start_time").value.split(':')[1],10)),new Date(year, month, ending, parseInt(document.getElementById("end_time").value.split(':')[0],10), parseInt(document.getElementById("end_time").value.split(':')[1],10)),document.getElementById('is_vacation').checked);
                            }
                        }
                    }
                }
                else{
                    if(document.getElementById('is_vacation').checked == true){
                        submit_vacation(new Date(year, month, starting, 0, 0, 0, 0),new Date(year, month, ending, 23, 59, 59, 0),document.getElementById('is_vacation').checked);
                    }
                    else{
                        if(!validateTime("start_time") || !validateTime("end_time") || document.getElementById('start_time').value == document.getElementById('end_time').value){
                            let error_msg = '<div class="alert alert-danger" id="beep1"><a class="close" data-dismiss="alert" href="#" onclick="hide(1)">×</a>Please set a valid time.</div>';
                            document.getElementById('error_div').innerHTML = error_msg;
                            set_vacation = 0;
                        }
                        else{
                            submit_vacation(new Date(year, month, starting, parseInt(document.getElementById("start_time").value.split(':')[0],10), parseInt(document.getElementById("start_time").value.split(':')[1],10)),new Date(year, month, ending, parseInt(document.getElementById("end_time").value.split(':')[0],10), parseInt(document.getElementById("end_time").value.split(':')[1],10)),document.getElementById('is_vacation').checked);
                        }
                    }
                }
            }
            else{
                set_vacation = 0;
                if(document.getElementById('is_vacation').checked == false){
                    submit_vacation(new Date(year, month, starting, parseInt(document.getElementById("start_time").value.split(':')[0],10), parseInt(document.getElementById("start_time").value.split(':')[1],10)),new Date(year, month, ending, parseInt(document.getElementById("end_time").value.split(':')[0],10), parseInt(document.getElementById("end_time").value.split(':')[1],10)),document.getElementById('is_vacation').checked);
                }
                else{
                    submit_vacation(new Date(year, month, starting, 0, 0, 0, 0),new Date(year, month, ending, 23, 59, 59, 0),document.getElementById('is_vacation').checked);
                }
            }
        });

        document.getElementById('start_time').addEventListener('change',reset_vacation);
        document.getElementById('end_time').addEventListener('change',reset_vacation);
        document.getElementById('is_vacation').addEventListener('change',reset_vacation);
    }
});