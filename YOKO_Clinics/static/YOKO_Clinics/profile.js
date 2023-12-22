document.addEventListener('DOMContentLoaded', function (){
    let countrySelect = document.querySelector('.country'),
    stateSelect = document.querySelector('.state'),
    citySelect = document.querySelector('.city');
    let countries,specialties;
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
            if(document.getElementById('start_time').value.length == 5){
                document.getElementById('start_time').value += ":00";
            }
            if(document.getElementById('end_time').value.length == 5){
                document.getElementById('end_time').value += ":00";
            }
            if(document.getElementById('start_time').value == "" || document.getElementById('end_time').value == "" || country_select.value == "Select Country" || state_select.value == "Select State" || city_select.value == "Select City" || country_select.value == "" || state_select.value == "" || city_select.value == "" || document.getElementById('address').value == "" || subs_list.length == 0 || day_selected == false){
                document.getElementById('beep1').classList.value="alert alert-danger";
                document.getElementById('beep1').innerHTML = '<a class="close" data-dismiss="alert" href="#" onclick="hide1()">×</a>Please fill in all fields.';
                document.getElementById('beep1').style.display = "block";
                document.getElementById("error_msgs").innerHTML = "";
            }
            else if(document.getElementById("start_time").value == document.getElementById("end_time").value){
                document.getElementById('beep1').classList.value="alert alert-danger";
                document.getElementById("beep1").style.display='block';
                document.getElementById("error_msgs").innerHTML = "";
                document.getElementById("beep1").innerHTML = '<a class="close" data-dismiss="alert" href="#" onclick="hide1()">×</a>Start time cannot be the same as end time.';
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
    if(document.getElementById("back_thing") != undefined){
        document.getElementById("back_thing").addEventListener('click',function(){
            window.history.back();
        });
        document.getElementById("back_arrow").addEventListener('click',function(){
            window.history.back();
        });
    }
});