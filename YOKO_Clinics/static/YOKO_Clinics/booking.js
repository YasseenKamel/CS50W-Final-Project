document.addEventListener('DOMContentLoaded', function () {
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

    const hue_initial=81, saturation_initial=1, brightness_initial=1;
    const hue_final=0, saturation_final=1, brightness_final=1;
    // const hue_initial=260, saturation_initial=0.5, brightness_initial=0.8;
    // const hue_final=0, saturation_final=1, brightness_final=1;

    function set_business(val,el) {
        // let t=3*(val/100)**2 - 2*(val/100)**3;
        // let t = val/100;
        // let t = Math.sin(Math.PI*val/200)**0.5;
        el.classList.remove("day_off1");
        let v = val/100;
        let t = v*(1-v)**2 + 3*(1-v)*v**2 + v**3;
        let h= (1-t)*hue_initial + t*hue_final;
        let s= (1-t)*saturation_initial + t*saturation_final;
        let b= (1-t)*brightness_initial + t*brightness_final;
        console.log(val);
        el.style.filter=`hue-rotate(${h}deg) saturate(${s}) brightness(${b})`;
    }

    function book_event(event){

    }

    function add_booking_event(){
        for(let i = 0 ; i < document.getElementById("calendar-days0").children.length ; i ++){
            let cur = document.getElementById("calendar-days0").children[i];
            if(cur.classList != "calendar-day"){
                continue;
            }
            cur.addEventListener('click',book_event);
        }
    }

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
        let date1 = new Date(currentDate1.toLocaleString(undefined, options1));
        let today_date1 = date1.getDate();
        for(let i = last_month - weekday + 2 ; i <= last_month ; i ++){
            template += no_day1 + i + no_day2;
            sm ++;
        }

        
        let day11 = '<li class="calendar-day day_off1" id="calendar-day', day021 = '"><span>',day21 = '</span></li>';
        let day31 = '<li class="calendar-day day_off1" id="calendar-day', day041 = '"><span class="number_thing1">&nbsp',day41 = '&nbsp</span></li>';
        let past_day11 = '<li class="calendar-day past_day day_off1" id="calendar-day',past_day021 = '"><span>',past_day21 = '</span></li>';

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

        fetch('get_cal_data1',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token,
            },
            body: JSON.stringify({
                year: year,
                month: (month + 1),
                id1: doctors_id
            })
        })
        .then(response => response.json())
        .then(data => {

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
                    }
                }
            });

            document.querySelectorAll('.calendar-day').forEach(slot => {
                if(slot.id.length > 12 && !slot.classList.contains('past_day')){
                    if(slot.id[12] == '-'){
                        slot.id = slot.id.slice(0,12) + '0' + slot.id.slice(14);
                    }
                }
            });

            // adding first div
            let prev_div = document.createElement('div');
            prev_div.id = 'calendar_slide-1';
            prev_div.classList.value = 'calendar_slide cal_slid1';
            prev_div.innerHTML = load_month(year_prev,month_prev,weekday_prev,'-1');

            document.getElementById('calendar-month').insertBefore(prev_div,document.getElementById('calendar-month').firstChild);
            prev_month_data = data['prev_month_data'];
                prev_month_shifts = data['prev_month_shifts'];
                month_data = data['month_data'];
                month_shifts = data['month_shifts'];
                next_month_data = data['next_month_data'];
                next_month_shifts = data['next_month_shifts'];
                let idx = 0;
                for(let i = 0 ; i < document.getElementById('calendar-days-1').children.length ; i ++){
                    let cur = document.getElementById('calendar-days-1').children[i];
                    if(cur.id == ""){
                        continue;
                    }
                    if(prev_month_data[idx] == -1){
                        cur.classList.add("day_off1");
                        cur.classList.add("past_day");
                    }
                    else{
                        set_business(prev_month_data[idx],cur);
                    }
                    idx ++;
                }
                idx = 0;
                for(let i = 0 ; i < document.getElementById('calendar-days0').children.length ; i ++){
                    let cur = document.getElementById('calendar-days0').children[i];
                    if(cur.id == ""){
                        continue;
                    }
                    if(month_data[idx] == -1){
                        cur.classList.add("day_off1");
                        cur.classList.add("past_day");
                    }
                    else{
                        set_business(month_data[idx],cur);
                    }
                    idx ++;
                }
                idx = 0;
                for(let i = 0 ; i < document.getElementById('calendar-days1').children.length ; i ++){
                    let cur = document.getElementById('calendar-days1').children[i];
                    if(cur.id == ""){
                        continue;
                    }
                    if(next_month_data[idx] == -1){
                        cur.classList.add("day_off1");
                        cur.classList.add("past_day");
                    }
                    else{
                        set_business(next_month_data[idx],cur);
                    }
                    idx ++;
                }
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

        fetch('get_cal_data1',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token,
            },
            body: JSON.stringify({
                year: year,
                month: (month + 1),
                id1: doctors_id
            })
        })
        .then(response => response.json())
        .then(data => {
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
                    }
                }
            });

            document.querySelectorAll('.calendar-day').forEach(slot => {
                if(slot.id.length > 12 && !slot.classList.contains('past_day')){
                    if(slot.id[12] == '1'){
                        slot.id = slot.id.slice(0,12) + '0' + slot.id.slice(13);
                    }
                }
            });

            // adding first div
            let next_div = document.createElement('div');
            next_div.id = 'calendar_slide1';
            next_div.classList.value = 'calendar_slide cal_slid2';
            next_div.innerHTML = load_month(year_next,month_next,weekday_next,'1');

            document.getElementById('calendar-month').appendChild(next_div);
            prev_month_data = data['prev_month_data'];
                prev_month_shifts = data['prev_month_shifts'];
                month_data = data['month_data'];
                month_shifts = data['month_shifts'];
                next_month_data = data['next_month_data'];
                next_month_shifts = data['next_month_shifts'];
                let idx = 0;
                for(let i = 0 ; i < document.getElementById('calendar-days-1').children.length ; i ++){
                    let cur = document.getElementById('calendar-days-1').children[i];
                    if(cur.id == ""){
                        continue;
                    }
                    if(prev_month_data[idx] == -1){
                        cur.classList.add("day_off1");
                        cur.classList.add("past_day");
                    }
                    else{
                        set_business(prev_month_data[idx],cur);
                    }
                    idx ++;
                }
                idx = 0;
                for(let i = 0 ; i < document.getElementById('calendar-days0').children.length ; i ++){
                    let cur = document.getElementById('calendar-days0').children[i];
                    if(cur.id == ""){
                        continue;
                    }
                    if(month_data[idx] == -1){
                        cur.classList.add("day_off1");
                        cur.classList.add("past_day");
                    }
                    else{
                        set_business(month_data[idx],cur);
                    }
                    idx ++;
                }
                idx = 0;
                for(let i = 0 ; i < document.getElementById('calendar-days1').children.length ; i ++){
                    let cur = document.getElementById('calendar-days1').children[i];
                    if(cur.id == ""){
                        continue;
                    }
                    if(next_month_data[idx] == -1){
                        cur.classList.add("day_off1");
                        cur.classList.add("past_day");
                    }
                    else{
                        set_business(next_month_data[idx],cur);
                    }
                    idx ++;
                }
            // redeclaring event listeners
            document.getElementById('previous-month-selector0').addEventListener('click',prev_month);
            document.getElementById('next-month-selector0').addEventListener('click',next_month);
            document.getElementById('present-month-selector0').addEventListener('click',cur_month);

        });
    }


    function cur_month(){
        if(year > year_this || (year == year_this && month > month_this)){

            fetch('get_cal_data1',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrf_token,
                },
                body: JSON.stringify({
                    year: year_this,
                    month: (month_this + 1),
                    id1: doctors_id
                })
            })
            .then(response => response.json())
            .then(data => {

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


                document.getElementById('calendar-month').insertBefore(prev_div,document.getElementById('calendar-month').firstChild);
                prev_month_data = data['prev_month_data'];
                prev_month_shifts = data['prev_month_shifts'];
                month_data = data['month_data'];
                month_shifts = data['month_shifts'];
                next_month_data = data['next_month_data'];
                next_month_shifts = data['next_month_shifts'];
                let idx = 0;
                for(let i = 0 ; i < document.getElementById('calendar-days-1').children.length ; i ++){
                    let cur = document.getElementById('calendar-days-1').children[i];
                    if(cur.id == ""){
                        continue;
                    }
                    if(prev_month_data[idx] == -1){
                        cur.classList.add("day_off1");
                        cur.classList.add("past_day");
                    }
                    else{
                        set_business(prev_month_data[idx],cur);
                    }
                    idx ++;
                }
                idx = 0;
                for(let i = 0 ; i < document.getElementById('calendar-days0').children.length ; i ++){
                    let cur = document.getElementById('calendar-days0').children[i];
                    if(cur.id == ""){
                        continue;
                    }
                    if(month_data[idx] == -1){
                        cur.classList.add("day_off1");
                        cur.classList.add("past_day");
                    }
                    else{
                        set_business(month_data[idx],cur);
                    }
                    idx ++;
                }
                idx = 0;
                for(let i = 0 ; i < document.getElementById('calendar-days1').children.length ; i ++){
                    let cur = document.getElementById('calendar-days1').children[i];
                    if(cur.id == ""){
                        continue;
                    }
                    if(next_month_data[idx] == -1){
                        cur.classList.add("day_off1");
                        cur.classList.add("past_day");
                    }
                    else{
                        set_business(next_month_data[idx],cur);
                    }
                    idx ++;
                }
                document.getElementById('previous-month-selector0').addEventListener('click',prev_month);
                document.getElementById('next-month-selector0').addEventListener('click',next_month);
                document.getElementById('present-month-selector0').addEventListener('click',cur_month);

            });

        }
        else if(year < year_this || (year == year_this && month < month_this)){

            fetch('get_cal_data1',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrf_token,
                },
                body: JSON.stringify({
                    year: year_this,
                    month: (month_this + 1),
                    id1: doctors_id
                })
            })
            .then(response => response.json())
            .then(data => {

                
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

                document.getElementById('calendar-month').appendChild(next_div);
                prev_month_data = data['prev_month_data'];
                prev_month_shifts = data['prev_month_shifts'];
                month_data = data['month_data'];
                month_shifts = data['month_shifts'];
                next_month_data = data['next_month_data'];
                next_month_shifts = data['next_month_shifts'];
                let idx = 0;
                for(let i = 0 ; i < document.getElementById('calendar-days-1').children.length ; i ++){
                    let cur = document.getElementById('calendar-days-1').children[i];
                    if(cur.id == ""){
                        continue;
                    }
                    if(prev_month_data[idx] == -1){
                        cur.classList.add("day_off1");
                        cur.classList.add("past_day");
                    }
                    else{
                        set_business(prev_month_data[idx],cur);
                    }
                    idx ++;
                }
                idx = 0;
                for(let i = 0 ; i < document.getElementById('calendar-days0').children.length ; i ++){
                    let cur = document.getElementById('calendar-days0').children[i];
                    if(cur.id == ""){
                        continue;
                    }
                    if(month_data[idx] == -1){
                        cur.classList.add("day_off1");
                        cur.classList.add("past_day");
                    }
                    else{
                        set_business(month_data[idx],cur);
                    }
                    idx ++;
                }
                idx = 0;
                for(let i = 0 ; i < document.getElementById('calendar-days1').children.length ; i ++){
                    let cur = document.getElementById('calendar-days1').children[i];
                    if(cur.id == ""){
                        continue;
                    }
                    if(next_month_data[idx] == -1){
                        cur.classList.add("day_off1");
                        cur.classList.add("past_day");
                    }
                    else{
                        set_business(next_month_data[idx],cur);
                    }
                    idx ++;
                }
                document.getElementById('previous-month-selector0').addEventListener('click',prev_month);
                document.getElementById('next-month-selector0').addEventListener('click',next_month);
                document.getElementById('present-month-selector0').addEventListener('click',cur_month);

            });
        }
    }
    function cancel_booking(event){
        if(event != "overriding_banana"){
            if(event.target != document.getElementById('input_container')){
                return;
            }
        }
        document.getElementById('input_container').style.display = 'none';
    }

    if(document.getElementById("book_btn") != undefined){
        set_business(100,document.getElementById("empty_color"));
        set_business(0,document.getElementById("busy_color"));
        let currentDate = new Date();
        let userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let options = { timeZone: userTimeZone, year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        let date = new Date(currentDate.toLocaleString(undefined, options));
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

        fetch('get_cal_data1',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token,
            },
            body: JSON.stringify({
                year: year_this,
                month: (month_this + 1),
                id1: doctors_id
            })
        })
        .then(response => response.json())
        .then(data => {
            prev_month_data = data['prev_month_data'];
            prev_month_shifts = data['prev_month_shifts'];
            month_data = data['month_data'];
            month_shifts = data['month_shifts'];
            next_month_data = data['next_month_data'];
            next_month_shifts = data['next_month_shifts'];
            let idx = 0;
            for(let i = 0 ; i < document.getElementById('calendar-days-1').children.length ; i ++){
                let cur = document.getElementById('calendar-days-1').children[i];
                if(cur.id == ""){
                    continue;
                }
                if(prev_month_data[idx] == -1){
                    cur.classList.add("day_off1");
                    cur.classList.add("past_day");
                }
                else{
                    set_business(prev_month_data[idx],cur);
                }
                idx ++;
            }
            idx = 0;
            for(let i = 0 ; i < document.getElementById('calendar-days0').children.length ; i ++){
                let cur = document.getElementById('calendar-days0').children[i];
                if(cur.id == ""){
                    continue;
                }
                if(month_data[idx] == -1){
                    cur.classList.add("day_off1");
                    cur.classList.add("past_day");
                }
                else{
                    set_business(month_data[idx],cur);
                }
                idx ++;
            }
            idx = 0;
            for(let i = 0 ; i < document.getElementById('calendar-days1').children.length ; i ++){
                let cur = document.getElementById('calendar-days1').children[i];
                if(cur.id == ""){
                    continue;
                }
                if(next_month_data[idx] == -1){
                    cur.classList.add("day_off1");
                    cur.classList.add("past_day");
                }
                else{
                    set_business(next_month_data[idx],cur);
                }
                idx ++;
            }
            ////////////////////////////////////////////////////////////
            document.getElementById('previous-month-selector0').addEventListener('click',prev_month);
            document.getElementById('next-month-selector0').addEventListener('click',next_month);
            document.getElementById('present-month-selector0').addEventListener('click',cur_month);
        });
        document.getElementById("book_btn").addEventListener('click',function(){
            document.getElementById("input_container").style.display="flex";
        });
        
        document.getElementById('input_container').addEventListener('click', cancel_booking);
    }
    ///////////////////////
    if(document.getElementById("back_thing") != undefined){
        document.getElementById("back_thing").addEventListener('click',function(){
            window.history.back();
        });
        document.getElementById("back_arrow").addEventListener('click',function(){
            window.history.back();
        });
    }
});