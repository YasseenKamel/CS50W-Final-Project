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