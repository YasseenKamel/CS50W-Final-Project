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
});