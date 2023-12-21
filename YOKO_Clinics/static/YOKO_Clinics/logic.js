document.addEventListener('DOMContentLoaded', function () {
    let toggle = document.getElementById("scroll_toggle1");

    let storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    if (storedTheme){
        document.documentElement.setAttribute('data-theme', storedTheme)
        if(storedTheme === "dark"){
            toggle.checked = true;
            if(document.getElementById('arrow1') != undefined){
                document.getElementById('arrow1').src="../static/YOKO_Clinics/right-arrow1.png";
            }
            if(document.getElementById('arrow2') != undefined){
                document.getElementById('arrow2').src="../static/YOKO_Clinics/right-arrow1.png";
            }
            if(document.getElementById('back_arrow') != undefined){
                document.getElementById('back_arrow').src="../static/YOKO_Clinics/left-arrow1.png";
            }
        }
        else{
            toggle.checked = false;
            if(document.getElementById('arrow1') != undefined){
                document.getElementById('arrow1').src="../static/YOKO_Clinics/right-arrow.png";
            }
            if(document.getElementById('arrow2') != undefined){
                document.getElementById('arrow2').src="../static/YOKO_Clinics/right-arrow.png";
            }
            if(document.getElementById('back_arrow') != undefined){
                document.getElementById('back_arrow').src="../static/YOKO_Clinics/left-arrow.png";
            }
        }
    }
    
    let countrySelect = document.querySelector('.country'),
    stateSelect = document.querySelector('.state'),
    citySelect = document.querySelector('.city');
    let countries,specialties;
    function convertTo24HourFormat(twelveHourTime) {
        var date = new Date("2000-01-01 " + twelveHourTime);
        var twentyFourHourTime = date.toLocaleTimeString('en-US', {hour12: false});
        return twentyFourHourTime;
    }
    function convertTo12HourFormat(twentyFourHourTime) {
        var splitTime = twentyFourHourTime.split(":");
        var hours = parseInt(splitTime[0], 10);
        var minutes = splitTime[1];
    
        var period = hours >= 12 ? 'PM' : 'AM';
    
        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight (00:00)
    
        return hours + ':' + minutes + ' ' + period;
    }
    if(countrySelect != undefined){
        function fetchJson(url) {
            return fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.statusText}`);
                    }
                    return response.json();
                });
        }
        function load_specialties(data){
            specialties = data;
            for(let i = 0 ; i < Object.keys(data).length ; i ++){
                const option = document.createElement('option');
                option.value = Object.keys(data)[i];
                option.textContent = Object.keys(data)[i];
                option.id = "subs"+(i + 1);
                option.tabindex="-1";
                document.getElementById("specialty").appendChild(option);
            }
            document.getElementById("specialty").addEventListener('change',function(){
                if(document.getElementById("specialty").value == "Select Specialty"){
                    let div = document.getElementById("sub_specialties1");
                    document.getElementById("all_subs").style.display='none';
                    document.getElementById("all_sub").checked=false;
                    let children = div.children;
                    for (let i = children.length - 1; i >= 0; i--) {
                        if (children[i].id !== 'all_subs') {
                            div.removeChild(children[i]);
                        }
                    }
                }
                else{
                    let div = document.getElementById("sub_specialties1");
                    document.getElementById("all_subs").style.display='block';
                    document.getElementById("all_sub").checked=false;
                    let idx = 0,sm = 0;
                    for(let i = 0 ; i < Object.keys(specialties).length ; i ++){
                        if(document.getElementById("specialty").value == Object.keys(specialties)[i]){
                            idx = sm + 1;
                        }
                        sm += specialties[Object.keys(specialties)[i]].length;
                    }
                    let children = div.children;
                    for (let i = children.length - 1; i >= 0; i--) {
                        if (children[i].id !== 'all_subs') {
                            div.removeChild(children[i]);
                        }
                    }
                    for(let i = 0 ; i < specialties[document.getElementById("specialty").value].length ; i ++){
                        const input = document.createElement('input');
                        input.type = "checkbox";
                        input.autocomplete = "off";
                        input.name = "sub_specialties";
                        input.value = i + idx;
                        input.id = i + idx;
                        input.classList.toggle('sub_checker');
                        const label = document.createElement('label');
                        label.classList.toggle('toggle-control1');
                        label.htmlFor = i + idx;
                        label.innerHTML = specialties[document.getElementById("specialty").value][i];
                        let div1 = document.createElement('div');
                        div1.appendChild(input);
                        div1.appendChild(label);
                        div.appendChild(div1);
                    }
                    document.getElementById("all_sub").addEventListener('change',function(){
                        let checks = document.querySelectorAll('.sub_checker');
                        for(let i = 0 ; i < checks.length ; i ++){
                            if(checks[i] != document.getElementById("all_sub")){
                                checks[i].checked = document.getElementById("all_sub").checked;
                            }
                        }
                    });
                    let checks = document.querySelectorAll('.sub_checker');
                    for(let i = 0 ; i < checks.length ; i ++){
                        if(checks[i] != document.getElementById("all_sub")){
                            checks[i].addEventListener('change',function(){
                                let b1 = true;
                                for(let j = 0 ; j < checks.length ; j ++){
                                    if(checks[j] != document.getElementById("all_sub")){
                                        b1 &= checks[j].checked;
                                    }
                                }
                                document.getElementById("all_sub").checked = b1;
                            });
                        }
                    }
                }
            });

            
        }
        function load_countries(data){
            countries = data;
            for(let i = 0 ; i < Object.keys(data).length ; i ++){
                let country = data[Object.keys[i]];
                const option = document.createElement('option');
                option.value = Object.keys(data)[i];
                option.textContent = Object.keys(data)[i];
                countrySelect.appendChild(option);
            }
            stateSelect.disabled = true;
            citySelect.disabled = true;
            stateSelect.style.pointerEvents = 'none';
            citySelect.style.pointerEvents = 'none';
            document.querySelector('.country').addEventListener('change',function(){
                if(document.querySelector('.country').value == "Select Country"){
                    stateSelect.disabled = true;
                    citySelect.disabled = true;
                    stateSelect.selectedIndex = 1;
                    citySelect.selectedIndex = 1;
                }
                stateSelect.disabled = false;
                citySelect.disabled = true;
                stateSelect.style.pointerEvents = 'auto';
                citySelect.style.pointerEvents = 'none';
            
                const selectedCountryCode = countrySelect.value;
                stateSelect.innerHTML = '<option value="" disabled selected>Select State</option>';
                citySelect.innerHTML = '<option value="" disabled selected>Select City</option>';
                for(let i = 0 ; i < Object.keys(countries[selectedCountryCode]).length ; i ++){
                    let state = countries[selectedCountryCode][Object.keys(countries[selectedCountryCode])[i]];
                    const option = document.createElement('option');
                    option.value = Object.keys(countries[selectedCountryCode])[i];
                    option.textContent = Object.keys(countries[selectedCountryCode])[i];
                    stateSelect.appendChild(option);
                }
            });
            document.querySelector('.state').addEventListener('change',function(){
                citySelect.disabled = false;
                citySelect.style.pointerEvents = 'auto';
            
                const selectedCountryCode = countrySelect.value;
                const selectedStateCode = stateSelect.value;
            
                citySelect.innerHTML = '<option value="" disabled selected>Select City</option>' ;
            
                for(let i = 0 ; i < countries[selectedCountryCode][selectedStateCode].length ; i ++){
                    let city = countries[selectedCountryCode][countries[selectedCountryCode][selectedStateCode][i]];
                    const option = document.createElement('option');
                    option.value = countries[selectedCountryCode][selectedStateCode][i];
                    option.textContent = countries[selectedCountryCode][selectedStateCode][i] ;
                    citySelect.appendChild(option);
                }
            });
        }
        fetchJson("../static/YOKO_Clinics/countries.json")
        .then(load_countries)
        .catch(error => console.error('Error fetching JSON:', error));
        fetchJson("../static/YOKO_Clinics/specialties.json")
        .then(load_specialties)
        .catch(error => console.error('Error fetching JSON:', error));


    }

    if(document.getElementById("save_btn") != undefined){
        document.getElementById("save_btn").addEventListener('click',function(){
            document.getElementById('beep1').style.display = "none";
            document.getElementById("error_msgs").innerHTML = "";
            let address = document.getElementById('address_display');
            let country = document.getElementById('country_display');
            let country_select = document.getElementById('country_select');
            let state_select = document.getElementById('state_select');
            let city_select = document.getElementById('city_select');
            let bio = document.getElementById('bio_display');
            let time = document.getElementById('time_display');
            let day = document.getElementById('day_display');
            let sub_specialties = document.getElementById('sub_specialties_display');
            let address_input = document.getElementById('address_input');
            let country_input = document.getElementById('country_input');
            let bio_input = document.getElementById('bio_input');
            let time_input = document.getElementById('time_input');
            let day_input = document.getElementById('day_input');
            let sub_specialties_input1 = document.getElementById('sub_specialties_data1');
            let sub_specialties_input2 = document.getElementById('sub_specialties1');
            let days_list = [0,0,0,0,0,0,0];
            let subs_list = [];
            let day_selected = false;
            for(let i = 0 ; i < 7 ; i ++){
                days_list[i] = document.getElementById((i + 1) + 'd').checked;
                day_selected |= document.getElementById((i + 1) + 'd').checked;
            }
            
            for(let i = 0 ; i < document.querySelectorAll('.sub_checker').length ; i ++){
                if(document.querySelectorAll('.sub_checker')[i].id != 'all_sub' && document.querySelectorAll('.sub_checker')[i].checked == true){
                    subs_list.push(document.querySelectorAll('.sub_checker')[i].id);
                }
            }

            if(document.getElementById('start_time').value == "" || document.getElementById('end_time').value == "" || country_select.value == "Select Country" || state_select.value == "Select State" || city_select.value == "Select City" || country_select.value == "" || state_select.value == "" || city_select.value == "" || document.getElementById('address').value == "" || subs_list.length == 0 || day_selected == false){
                document.getElementById('beep1').classList.value="alert alert-danger";
                document.getElementById('beep1').innerHTML = '<a class="close" data-dismiss="alert" href="#" onclick="hide1()">×</a>Please fill in all fields.';
                document.getElementById('beep1').style.display = "block";
                document.getElementById("error_msgs").innerHTML = "";
            }
            else if(document.getElementById("start_time").value === document.getElementById("end_time").value){
                document.getElementById('beep1').classList.value="alert alert-danger";
                document.getElementById("beep1").style.display='block';
                document.getElementById("error_msgs").innerHTML = "";
                document.getElementById("beep1").innerHTML = '<a class="close" data-dismiss="alert" href="#" onclick="hide2()">×</a>Start time cannot be the same as end time.';
            }
            else{
                fetch('edit_profile',{
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrf_token,
                    },
                    body: JSON.stringify({
                        country: country_select.value,
                        state: state_select.value,
                        city: city_select.value,
                        address: document.getElementById('address').value,
                        bio: document.getElementById('bio').value,
                        start_time: document.getElementById('start_time').value,
                        end_time: document.getElementById('end_time').value,
                        days: days_list,
                        sub_specialties: subs_list,
                        main_specialty: document.getElementById('specialty').value
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if(data['message'] == 'Failed'){
                        document.getElementById('beep1').classList.value="alert alert-danger";
                        document.getElementById("beep1").style.display='block';
                        document.getElementById("beep1").innerHTML = '<a class="close" data-dismiss="alert" href="#" onclick="hide2()">×</a>Failed to update profile.';
                        return;
                    }
                    if(data['message'] == 'Bad'){
                        console.log(data['appointments']);
                        for(let i = 0 ; i < data['appointments'].length ; i ++){
                            let start = data['appointments'][i]['start_date'],end = data['appointments'][i]['end_date'];
                            start = new Date(start);
                            end = new Date(end);
                            start = start.toLocaleString();
                            end = end.toLocaleString();
                            document.getElementById("error_msgs").innerHTML += '<div class="alert alert-danger" id="beepo' + i + '"><a class="close" data-dismiss="alert" href="#" onclick="hide(' + i + ')">×</a>The newly set schedule can not be set due to your appointment on ' + start + ' till ' + end + '. You may cancel the appointment from your home page or manually add a vacation from your vacations page.' + '</div>';
                        }
                        return;
                    }
                    address_input.style.display='none';
                    bio_input.style.display='none';
                    country_input.style.display="none";
                    time_input.style.display="none";
                    day_input.style.display="none";
                    sub_specialties_input1.style.display="none";
                    sub_specialties_input2.style.display="none";
                    document.getElementById('main_specialty').textContent = '-- ' + document.getElementById('specialty').value;
                    document.getElementById('country_display').textContent = country_select.value;
                    if(country_select.value != state_select.value){
                        document.getElementById('country_display').textContent += ', ' + state_select.value;
                    }
                    if(city_select.value != state_select.value){
                        document.getElementById('country_display').textContent += ', ' + state_select.value;
                    }
                    document.getElementById('address_display').textContent = 'Address: ' + document.getElementById('address').value;
                    document.getElementById('bio_display').textContent = document.getElementById('bio').value;
                    document.getElementById('start_time_display').textContent = convertTo12HourFormat(document.getElementById('start_time').value);
                    document.getElementById('end_time_display').textContent = convertTo12HourFormat(document.getElementById('end_time').value);
                    for(let i = 0 ; i < 7 ; i ++){
                        if(days_list[i]){
                            document.getElementById('d' + (i + 1)).classList.value = "toggle-control6";
                        }
                        else{
                            document.getElementById('d' + (i + 1)).classList.value = "toggle-control5";
                        }
                    }
                    document.getElementById('all_subs1').innerHTML = "";
                    let sm1 = 1;
                    let key = "";
                    for(let i = 0 ; i < Object.keys(specialties).length ; i ++){
                        if(parseInt(subs_list[0]) < sm1){
                            break;
                        }
                        sm1 += specialties[Object.keys(specialties)[i]].length;
                        key = Object.keys(specialties)[i];
                    }
                    sm1 -= specialties[key].length;
                    for(let i = 0 ; i < subs_list.length ; i ++){
                        document.getElementById('all_subs1').innerHTML += '<p class="toggle-control2" id="sub' + subs_list[i] + '">' + specialties[key][parseInt(subs_list[i]) - sm1] + '</p>';
                    }
                    address.style.display="block";
                    document.getElementById("error_msgs").innerHTML = "";
                    document.getElementById('beep1').classList.value="alert alert-success";
                    document.getElementById('beep1').innerHTML = '<a class="close" data-dismiss="alert" href="#" onclick="hide1()">×</a>Profile editted successfully';
                    document.getElementById('beep1').style.display = "block";
                    time.style.display="flex";
                    country.style.display="block";
                    bio.style.display="block";
                    day.style.display="flex";
                    sub_specialties.style.display="flex";
                    document.getElementById('edit_btn').style.display="inline-block";
                    document.getElementById('save_btn').style.display="none";
                    document.getElementById('cancel_btn').style.display="none";
                });
            }
        });
    }

    if(document.getElementById("cancel_btn") != undefined){
        document.getElementById("cancel_btn").addEventListener('click',function(){
            let address = document.getElementById('address_display');
            let country = document.getElementById('country_display');
            let country_select = document.getElementById('country_select');
            let state_select = document.getElementById('state_select');
            let city_select = document.getElementById('city_select');
            let bio = document.getElementById('bio_display');
            let time = document.getElementById('time_display');
            let day = document.getElementById('day_display');
            let sub_specialties = document.getElementById('sub_specialties_display');
            let address_input = document.getElementById('address_input');
            let country_input = document.getElementById('country_input');
            let bio_input = document.getElementById('bio_input');
            let time_input = document.getElementById('time_input');
            let day_input = document.getElementById('day_input');
            let sub_specialties_input1 = document.getElementById('sub_specialties_data1');
            let sub_specialties_input2 = document.getElementById('sub_specialties1');

            address_input.style.display='none';
            bio_input.style.display='none';
            country_input.style.display="none";
            time_input.style.display="none";
            day_input.style.display="none";
            sub_specialties_input1.style.display="none";
            sub_specialties_input2.style.display="none";
            address.style.display="block";
            time.style.display="flex";
            country.style.display="block";
            bio.style.display="block";
            day.style.display="flex";
            sub_specialties.style.display="flex";
            document.getElementById("error_msgs").innerHTML = "";
            document.getElementById('beep1').style.display = "none";
            document.getElementById('edit_btn').style.display="inline-block";
            document.getElementById('save_btn').style.display="none";
            document.getElementById('cancel_btn').style.display="none";
        });
    }

    if(document.getElementById("edit_btn") != undefined){
        document.getElementById('edit_btn').addEventListener('click',function(){
            document.getElementById('beep1').style.display = "none";
            let address = document.getElementById('address_display');
            let country = document.getElementById('country_display');
            let country_select = document.getElementById('country_select');
            let state_select = document.getElementById('state_select');
            let city_select = document.getElementById('city_select');
            let bio = document.getElementById('bio_display');
            let time = document.getElementById('time_display');
            let day = document.getElementById('day_display');
            let sub_specialties = document.getElementById('sub_specialties_display');
            let address_input = document.getElementById('address_input');
            let country_input = document.getElementById('country_input');
            let bio_input = document.getElementById('bio_input');
            let time_input = document.getElementById('time_input');
            let day_input = document.getElementById('day_input');
            let sub_specialties_input1 = document.getElementById('sub_specialties_data1');
            let sub_specialties_input2 = document.getElementById('sub_specialties1');
            let country_data = "";
            let state_data = "",city_data = "";
            let temp = "";


            let first = document.querySelectorAll('.toggle-control2')[0].id.slice(3);

            let selected_subs = [];
            for(let i = 0 ; i < document.querySelectorAll('.toggle-control2').length ; i ++){
                selected_subs.push(document.querySelectorAll('.toggle-control2')[i].id.slice(3));
            }

            let idx = 1;
            for(let i = 0 ; i < Object.keys(specialties).length ; i ++){
                if(first < idx){
                    document.getElementById('subs'+(i)).selected = true;
                    break;
                }
                idx += specialties[Object.keys(specialties)[i]].length;
            }

            document.getElementById("all_subs").style.display='block';
            document.getElementById("all_sub").checked=false;
            let idx1 = 0,sm = 0;
            for(let i = 0 ; i < Object.keys(specialties).length ; i ++){
                if(document.getElementById("specialty").value == Object.keys(specialties)[i]){
                    idx1 = sm + 1;
                }
                sm += specialties[Object.keys(specialties)[i]].length;
            }
            let children = sub_specialties_input2.children;
            for (let i = children.length - 1; i >= 0; i--) {
                if (children[i].id !== 'all_subs') {
                    sub_specialties_input2.removeChild(children[i]);
                }
            }
            for(let i = 0 ; i < specialties[document.getElementById("specialty").value].length ; i ++){
                const input = document.createElement('input');
                input.type = "checkbox";
                input.autocomplete = "off";
                input.name = "sub_specialties";
                input.value = i + idx1;
                input.id = i + idx1;
                input.classList.toggle('sub_checker');
                const label = document.createElement('label');
                label.classList.toggle('toggle-control1');
                label.htmlFor = i + idx1;
                label.innerHTML = specialties[document.getElementById("specialty").value][i];
                let div1 = document.createElement('div');
                div1.appendChild(input);
                div1.appendChild(label);
                sub_specialties_input2.appendChild(div1);
            }
            document.getElementById("all_sub").addEventListener('change',function(){
                let checks = document.querySelectorAll('.sub_checker');
                for(let i = 0 ; i < checks.length ; i ++){
                    if(checks[i] != document.getElementById("all_sub")){
                        checks[i].checked = document.getElementById("all_sub").checked;
                    }
                }
            });
            let checks = document.querySelectorAll('.sub_checker');
            for(let i = 0 ; i < checks.length ; i ++){
                if(checks[i] != document.getElementById("all_sub")){
                    if(selected_subs.includes(checks[i].id)){
                        checks[i].checked = true;
                    }
                    checks[i].addEventListener('change',function(){
                        let b1 = true;
                        for(let j = 0 ; j < checks.length ; j ++){
                            if(checks[j] != document.getElementById("all_sub")){
                                b1 &= checks[j].checked;
                            }
                        }
                        document.getElementById("all_sub").checked = b1;
                    });
                }
            }

            let b1 = true;
            for(let j = 0 ; j < checks.length ; j ++){
                if(checks[j] != document.getElementById("all_sub")){
                    b1 &= checks[j].checked;
                }
            }
            document.getElementById("all_sub").checked = b1;

            let days = document.querySelectorAll('.toggle-control6');
            for(let i = 0 ; i < days.length ; i ++){
                document.getElementById(days[i].id.slice(1) + 'd').checked = true;
            }

            for(let i = 0 ; i < country.innerHTML.length ; i ++){
                if(country.innerHTML[i] != ','){
                    temp += country.innerHTML[i];
                }
                else{
                    if(country_data == ""){
                        country_data = temp;
                    }
                    else{
                        state_data = temp;
                    }
                    i ++;
                    temp = "";
                }
            }
            if(country_data === ""){
                country_data = temp;
                state_data = temp;
                city_data = temp;
            }
            else if(state_data === ""){
                state_data = temp;
                city_data = temp;
            }
            city_data = temp;
            let country_idx = 0
            for(let i = 0 ; i < country_select.children.length ; i ++){
                if(country_select.children[i].innerHTML == country_data){
                    country_select.children[i].selected = true;
                    country_idx = i;
                    break;
                }
            }
            for(let i = 0 ; i < Object.keys(countries[country_data]).length ; i ++){
                const option = document.createElement('option');
                option.value = Object.keys(countries[country_data])[i];
                option.textContent = Object.keys(countries[country_data])[i];
                if(option.value == state_data){
                    option.selected = true;
                }
                state_select.appendChild(option);
            }
            for(let i = 0 ; i < countries[country_data][state_data].length ; i ++){
                const option = document.createElement('option');
                option.value = countries[country_data][state_data][i];
                option.textContent = countries[country_data][state_data][i];
                if(option.value == city_data){
                    option.selected = true;
                }
                city_select.appendChild(option);
            }
            stateSelect.disabled = false;
            citySelect.disabled = false;
            stateSelect.style.pointerEvents = 'auto';
            citySelect.style.pointerEvents = 'auto';
            address_input.style.display='block';
            bio_input.style.display='block';
            document.getElementById('bio').value = bio.innerHTML;
            document.getElementById('address').value = address.innerHTML.slice(9);
            document.getElementById('start_time').value = convertTo24HourFormat(document.getElementById('start_time_display').innerHTML);
            document.getElementById('end_time').value = convertTo24HourFormat(document.getElementById('end_time_display').innerHTML);
            country_input.style.display="flex";
            time_input.style.display="flex";
            day_input.style.display="flex";
            sub_specialties_input1.style.display="block";
            sub_specialties_input2.style.display="flex";
            address.style.display="none";
            time.style.display="none";
            country.style.display="none";
            bio.style.display="none";
            day.style.display="none";
            sub_specialties.style.display="none";
            document.getElementById('edit_btn').style.display="none";
            document.getElementById('save_btn').style.display="inline-block";
            document.getElementById('cancel_btn').style.display="inline-block";
        });
    }

    toggle.addEventListener('click',function() {
        let currentTheme = document.documentElement.getAttribute("data-theme");
        let targetTheme = "light";
    
        if(document.getElementById('arrow1') != undefined){
            document.getElementById('arrow1').src="../static/YOKO_Clinics/right-arrow.png";
        }
        if(document.getElementById('back_arrow') != undefined){
            document.getElementById('back_arrow').src="../static/YOKO_Clinics/left-arrow.png";
        }
        if (currentTheme === "light") {
            targetTheme = "dark";
            if(document.getElementById('arrow1') != undefined){
                document.getElementById('arrow1').src="../static/YOKO_Clinics/right-arrow1.png";
            }
            if(document.getElementById('back_arrow') != undefined){
                document.getElementById('back_arrow').src="../static/YOKO_Clinics/left-arrow1.png";
            }
        }
    
        document.documentElement.setAttribute('data-theme', targetTheme)
        localStorage.setItem('theme', targetTheme);
    });
    
    
    if(document.getElementById("scroll_toggle") != undefined){
        document.getElementById("scroll_toggle").addEventListener('click',function(){
            if(document.querySelector('.slid1') != undefined){
                document.getElementById('page_1').classList.toggle('slid1');
                document.getElementById('page_2').classList.toggle('slid2');
                document.getElementById("special_button").style.display="inline-block";
                document.getElementById("submit").style.display="none";
                document.getElementById("submit").style.marginLeft="auto";
                document.getElementById("prev_button").style.display="none";
                document.getElementById('page_dots').innerHTML = '<img src="../static/YOKO_Clinics/current_dot.png" class="lil_dot"> <img src="../static/YOKO_Clinics/dot.png" class="lil_dot">';
            }
            let countrySelect = document.querySelector('.country'),
                stateSelect = document.querySelector('.state'),
                citySelect = document.querySelector('.city');
            let dots = document.getElementById('page_dots');
            if(document.getElementById("signing_up").innerHTML == "Signing up as a <strong>Patient</strong>:"){
                document.getElementById("signing_up").innerHTML = "Signing up as a <strong>Doctor</strong>:";
                countrySelect.required = true;
                stateSelect.required = true;
                citySelect.required = true;
                document.getElementById("address").required = true;
                document.getElementById("specialty").required = true;
                document.getElementById("special_button").style.display="inline-block";
                document.getElementById("submit").style.display="none";
                dots.style.display="flex";
            }
            else{
                document.getElementById("signing_up").innerHTML = "Signing up as a <strong>Patient</strong>:";
                countrySelect.required = false;
                stateSelect.required = false;
                citySelect.required = false;
                document.getElementById("address").required = false;
                document.getElementById("specialty").required = false;
                document.getElementById("special_button").style.display="none";
                if(document.getElementById("submit").style.marginLeft=="0.5rem"){
                    document.getElementById("submit").style.marginLeft="auto";
                }
                document.getElementById("submit").style.display="inline-block";
                dots.style.display="none";
            }
            let div = document.getElementById('doc-div');
            div.classList.toggle('visible-doc');

        });
    }
    function validate_form(){
        let countrySelect = document.querySelector('.country'),
            stateSelect = document.querySelector('.state'),
            citySelect = document.querySelector('.city');
        let em = document.getElementById("email").value;
        let b1 = false,b2 = false;
        for(let i = 0 ; i < em.length ; i ++){
            if(!b1 && em[i] == '@'){
                b1 = true;
            }
            if(b1 && em[i] == '.'){
                b2 = true;
            }
        }
        if(countrySelect.value.trim() === '' || citySelect.value.trim() === '' || stateSelect.value.trim() === '' || document.getElementById("address").value.trim() === '' || document.getElementById("start_time").value.trim() === '' || document.getElementById("end_time").value.trim() === '' || document.getElementById("username").value.trim() === '' || document.getElementById("email").value.trim() === '' || document.getElementById("password").value.trim() === '' || document.getElementById("confirmation").value.trim() === ''){
            document.getElementById("beep1").style.display='block';
            return false;
        }
        else if(document.getElementById("password").value.trim() != document.getElementById("confirmation").value.trim()){
            document.getElementById("beep2").style.display='block';
            document.getElementById("beep2").innerHTML = '<a class="close" data-dismiss="alert" href="#" onclick="hide2()">×</a>Passwords do not match.';
            return false;
        }
        else if(!(b1 && b2)){
            document.getElementById("beep2").style.display='block';
            document.getElementById("beep2").innerHTML = '<a class="close" data-dismiss="alert" href="#" onclick="hide2()">×</a>Email format invalid.';
            return false;
        }
        else if(document.getElementById("start_time").value === document.getElementById("end_time").value){
            document.getElementById("beep2").style.display='block';
            document.getElementById("beep2").innerHTML = '<a class="close" data-dismiss="alert" href="#" onclick="hide2()">×</a>Start time cannot be the same as end time.';
            return false;
        }
        else{
            return true;
        }
    }

    
    if(document.getElementById("special_button") != undefined){
        document.getElementById("special_button").addEventListener('click',function(){
            if(validate_form()){
                document.getElementById('page_1').classList.toggle('slid1');
                document.getElementById('page_2').classList.toggle('slid2');
                document.getElementById("special_button").style.display="none";
                document.getElementById("beep1").style.display="none";
                document.getElementById("beep2").style.display="none";
                document.getElementById("submit").style.display="inline-block";
                document.getElementById("submit").style.marginLeft="0.5rem";
                document.getElementById("prev_button").style.display="inline-block";
                document.getElementById('page_dots').innerHTML = '<img src="../static/YOKO_Clinics/dot.png" class="lil_dot"> <img src="../static/YOKO_Clinics/current_dot.png" class="lil_dot">';
            }
        });
    }
    if(document.getElementById("prev_button") != undefined){
        document.getElementById("prev_button").addEventListener('click',function(){
            document.getElementById('page_1').classList.toggle('slid1');
            document.getElementById('page_2').classList.toggle('slid2');
            document.getElementById("special_button").style.display="inline-block";
            document.getElementById("submit").style.display="none";
            document.getElementById("submit").style.marginLeft="auto";
            document.getElementById("prev_button").style.display="none";
            document.getElementById('page_dots').innerHTML = '<img src="../static/YOKO_Clinics/current_dot.png" class="lil_dot"> <img src="../static/YOKO_Clinics/dot.png" class="lil_dot">';
        });
    }
    
    if(document.getElementById("back_thing") != undefined){
        document.getElementById("back_thing").addEventListener('click',function(){
            window.history.back();
        });
        document.getElementById("back_arrow").addEventListener('click',function(){
            window.history.back();
        });
    }

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
        document.getElementById('start_day').value = mousedown + '/' + (month + 1) + '/' + year;
        document.getElementById('end_day').value = mouseup + '/' + (month + 1) + '/' + year;
        document.getElementById('input_container').style.display = 'flex';
        document.getElementById('vacation_input_title').textContent = ((mousedown == mouseup) ? ("Select your new working times for each of the selected day. (" + mousedown + ((mousedown == 1 || mousedown == 21 || mousedown == 31) ? "st" : ((mousedown == 2 || mousedown == 22) ? "nd" : ((mousedown == 3 || mousedown == 23) ? "rd" : "th"))) + ')') : ("Select your new working times for each of the selected days. (" + mousedown + ((mousedown == 1 || mousedown == 21 || mousedown == 31) ? "st" : ((mousedown == 2 || mousedown == 22) ? "nd" : ((mousedown == 3 || mousedown == 23) ? "rd" : "th"))) + ' till ' + mouseup + ((mouseup == 1 || mouseup == 21 || mouseup == 31) ? "st" : ((mouseup == 2 || mouseup == 22) ? "nd" : ((mouseup == 3 || mouseup == 23) ? "rd" : "th"))) + ')'));
        document.getElementById('success_vacay').innerHTML = "";
        starting = mousedown;
        ending = mouseup;
        mousedown = -1;
        mouseup = -1;
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
        if(clicked == null || clicked == undefined || !(clicked.classList.contains("calendar-day") && !clicked.classList.contains("disabled_day") && !clicked.classList.contains("past_day"))){
            mousedown = -1;
            mouseup = -1;
            return;
        }
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
        mouseup = parseInt(clicked.id.slice(13));
        if(mousedown > mouseup){
            [mousedown, mouseup] = [mouseup, mousedown];
        }
        document.getElementById('start_day').value = mousedown + '/' + (month + 1) + '/' + year;
        document.getElementById('end_day').value = mouseup + '/' + (month + 1) + '/' + year;
        document.getElementById('input_container').style.display = 'flex';
        document.getElementById('vacation_input_title').textContent = ((mousedown == mouseup) ? ("Select your new working times for each of the selected day. (" + mousedown + ((mousedown == 1 || mousedown == 21 || mousedown == 31) ? "st" : ((mousedown == 2 || mousedown == 22) ? "nd" : ((mousedown == 3 || mousedown == 23) ? "rd" : "th"))) + ')') : ("Select your new working times for each of the selected days. (" + mousedown + ((mousedown == 1 || mousedown == 21 || mousedown == 31) ? "st" : ((mousedown == 2 || mousedown == 22) ? "nd" : ((mousedown == 3 || mousedown == 23) ? "rd" : "th"))) + ' till ' + mouseup + ((mouseup == 1 || mouseup == 21 || mouseup == 31) ? "st" : ((mouseup == 2 || mouseup == 22) ? "nd" : ((mouseup == 3 || mouseup == 23) ? "rd" : "th"))) + ')'));
        document.getElementById('success_vacay').innerHTML = "";
        starting = mousedown;
        ending = mouseup;
        mousedown = -1;
        mouseup = -1;
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
                if(slot.id.length > 12 && !slot.classList.contains('past_day')){
                    if(slot.id[12] == '-'){
                        slot.id = slot.id.slice(0,12) + '0' + slot.id.slice(14);
                        slot.addEventListener('mouseenter',enter_element);
                    }
                }
            });

            // adding first div
            let prev_div = document.createElement('div');
            prev_div.id = 'calendar_slide-1';
            prev_div.classList.value = 'calendar_slide cal_slid1';
            prev_div.innerHTML = load_month(year_prev,month_prev,weekday_prev,'-1');

            document.getElementById('calendar-month').insertBefore(prev_div,document.getElementById('calendar-month').firstChild);
            for(let i = 0 ; i < vacations.length ; i ++){
                let day = new Date(vacations[i]['fields']['start_date']),day1 = new Date(vacations[i]['fields']['end_date']);
                for(let j = day.getDate() ; j <= day1.getDate() ; j ++){
                    if(day.getMonth() == month_prev){
                        document.getElementById('calendar-day-1' + j).classList.add("day_off_new");
                    }
                    else if(day.getMonth() == month){
                        document.getElementById('calendar-day0' + j).classList.add("day_off_new");
                    }
                    else if(day.getMonth() == month_next){
                        document.getElementById('calendar-day1' + j).classList.add("day_off_new");
                    }
                }
            }
            for(let i = 0 ; i < altered.length ; i ++){
                let day = new Date(altered[i]['fields']['start_date']),day1 = new Date(altered[i]['fields']['end_date']);
                for(let j = day.getDate() ; j <= day1.getDate() ; j ++){
                    if(day.getMonth() == month_prev){
                        document.getElementById('calendar-day-1' + j).classList.add("altered");
                    }
                    else if(day.getMonth() == month){
                        document.getElementById('calendar-day0' + j).classList.add("altered");
                    }
                    else if(day.getMonth() == month_next){
                        document.getElementById('calendar-day1' + j).classList.add("altered");
                    }
                }
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
                if(slot.id.length > 12 && !slot.classList.contains('past_day')){
                    if(slot.id[12] == '1'){
                        slot.id = slot.id.slice(0,12) + '0' + slot.id.slice(13);
                        slot.addEventListener('mouseenter',enter_element);
                    }
                }
            });

            // adding first div
            let next_div = document.createElement('div');
            next_div.id = 'calendar_slide1';
            next_div.classList.value = 'calendar_slide cal_slid2';
            next_div.innerHTML = load_month(year_next,month_next,weekday_next,'1');

            document.getElementById('calendar-month').appendChild(next_div);
            for(let i = 0 ; i < vacations.length ; i ++){
                let day = new Date(vacations[i]['fields']['start_date']),day1 = new Date(vacations[i]['fields']['end_date']);
                for(let j = day.getDate() ; j <= day1.getDate() ; j ++){
                    if(day.getMonth() == month_prev){
                        document.getElementById('calendar-day-1' + j).classList.add("day_off_new");
                    }
                    else if(day.getMonth() == month){
                        document.getElementById('calendar-day0' + j).classList.add("day_off_new");
                    }
                    else if(day.getMonth() == month_next){
                        document.getElementById('calendar-day1' + j).classList.add("day_off_new");
                    }
                }
            }
            for(let i = 0 ; i < altered.length ; i ++){
                let day = new Date(altered[i]['fields']['start_date']),day1 = new Date(altered[i]['fields']['end_date']);
                for(let j = day.getDate() ; j <= day1.getDate() ; j ++){
                    if(day.getMonth() == month_prev){
                        document.getElementById('calendar-day-1' + j).classList.add("altered");
                    }
                    else if(day.getMonth() == month){
                        document.getElementById('calendar-day0' + j).classList.add("altered");
                    }
                    else if(day.getMonth() == month_next){
                        document.getElementById('calendar-day1' + j).classList.add("altered");
                    }
                }
            }
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
                for(let i = 0 ; i < vacations.length ; i ++){
                    let day = new Date(vacations[i]['fields']['start_date']),day1 = new Date(vacations[i]['fields']['end_date']);
                    for(let j = day.getDate() ; j <= day1.getDate() ; j ++){
                        if(day.getMonth() == month_prev){
                            document.getElementById('calendar-day-1' + j).classList.add("day_off_new");
                        }
                        else if(day.getMonth() == month){
                            document.getElementById('calendar-day0' + j).classList.add("day_off_new");
                        }
                        else if(day.getMonth() == month_next){
                            document.getElementById('calendar-day1' + j).classList.add("day_off_new");
                        }
                    }
                }
                for(let i = 0 ; i < altered.length ; i ++){
                    let day = new Date(altered[i]['fields']['start_date']),day1 = new Date(altered[i]['fields']['end_date']);
                    for(let j = day.getDate() ; j <= day1.getDate() ; j ++){
                        if(day.getMonth() == month_prev){
                            document.getElementById('calendar-day-1' + j).classList.add("altered");
                        }
                        else if(day.getMonth() == month){
                            document.getElementById('calendar-day0' + j).classList.add("altered");
                        }
                        else if(day.getMonth() == month_next){
                            document.getElementById('calendar-day1' + j).classList.add("altered");
                        }
                    }
                }
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
                for(let i = 0 ; i < vacations.length ; i ++){
                    let day = new Date(vacations[i]['fields']['start_date']),day1 = new Date(vacations[i]['fields']['end_date']);
                    for(let j = day.getDate() ; j <= day1.getDate() ; j ++){
                        if(day.getMonth() == month_prev){
                            document.getElementById('calendar-day-1' + j).classList.add("day_off_new");
                        }
                        else if(day.getMonth() == month){
                            document.getElementById('calendar-day0' + j).classList.add("day_off_new");
                        }
                        else if(day.getMonth() == month_next){
                            document.getElementById('calendar-day1' + j).classList.add("day_off_new");
                        }
                    }
                }
                for(let i = 0 ; i < altered.length ; i ++){
                    let day = new Date(altered[i]['fields']['start_date']),day1 = new Date(altered[i]['fields']['end_date']);
                    for(let j = day.getDate() ; j <= day1.getDate() ; j ++){
                        if(day.getMonth() == month_prev){
                            document.getElementById('calendar-day-1' + j).classList.add("altered");
                        }
                        else if(day.getMonth() == month){
                            document.getElementById('calendar-day0' + j).classList.add("altered");
                        }
                        else if(day.getMonth() == month_next){
                            document.getElementById('calendar-day1' + j).classList.add("altered");
                        }
                    }
                }
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
            for(let i = 0 ; i < vacations.length ; i ++){
                let day = new Date(vacations[i]['fields']['start_date']),day1 = new Date(vacations[i]['fields']['end_date']);
                for(let j = day.getDate() ; j <= day1.getDate() ; j ++){
                    if(day.getMonth() == month_prev){
                        document.getElementById('calendar-day-1' + j).classList.add("day_off_new");
                    }
                    else if(day.getMonth() == month){
                        document.getElementById('calendar-day0' + j).classList.add("day_off_new");
                    }
                    else if(day.getMonth() == month_next){
                        document.getElementById('calendar-day1' + j).classList.add("day_off_new");
                    }
                }
            }
            for(let i = 0 ; i < altered.length ; i ++){
                let day = new Date(altered[i]['fields']['start_date']),day1 = new Date(altered[i]['fields']['end_date']);
                for(let j = day.getDate() ; j <= day1.getDate() ; j ++){
                    if(day.getMonth() == month_prev){
                        document.getElementById('calendar-day-1' + j).classList.add("altered");
                    }
                    else if(day.getMonth() == month){
                        document.getElementById('calendar-day0' + j).classList.add("altered");
                    }
                    else if(day.getMonth() == month_next){
                        document.getElementById('calendar-day1' + j).classList.add("altered");
                    }
                }
            }
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

    function validateTime(id) {
        var timeInput = document.getElementById(id);
        if (timeInput.value.trim() === '') {
            return false;
        }
    
        var isValidTime = isValidTimeFormat(timeInput.value);
    
        if (isValidTime) {
            return true;
        } else {
            return false;
        }
    }
    
    function isValidTimeFormat(time) {
        var timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(time);
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
        console.log(start);
        console.log(end);
        console.log(is_vacation);
        fetch('vacation_add',{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token,
            },
            body: JSON.stringify({
                start: start,
                end: end,
                is_vacation: is_vacation
            })
        })
        .then(response => response.json())
        .then(data => {
            if(is_vacation){
                let s = start.getDate(),e = end.getDate();
                for(let i = s ; i <= e ; i ++){
                    document.getElementById('calendar-day0' + i).classList.add("day_off_new");
                    document.getElementById('calendar-day0' + i).classList.remove("altered");
                }
            }
            else{
                let s = start.getDate(),e = end.getDate();
                for(let i = s ; i <= e ; i ++){
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
                            document.getElementById('vacation_input_title').innerHTML += " (These appointments will be cancelled if schedule is set)";
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
                                            document.getElementById('vacation_input_title').innerHTML += " (These appointments will be cancelled if schedule is set)";
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
                            submit_vacation(new Date(year, month, starting, 12, 30, 45, 500),new Date(year, month, ending, 12, 30, 45, 500),document.getElementById('is_vacation').checked);
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
                        submit_vacation(new Date(year, month, starting, 12, 30, 45, 500),new Date(year, month, ending, 12, 30, 45, 500),document.getElementById('is_vacation').checked);
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
                    submit_vacation(new Date(year, month, starting, 12, 30, 45, 500),new Date(year, month, ending, 12, 30, 45, 500),document.getElementById('is_vacation').checked);
                }
            }
        });

        document.getElementById('start_time').addEventListener('change',reset_vacation);
        document.getElementById('end_time').addEventListener('change',reset_vacation);
        document.getElementById('is_vacation').addEventListener('change',reset_vacation);
    }

});