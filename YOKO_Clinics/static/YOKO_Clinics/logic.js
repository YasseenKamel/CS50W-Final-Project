function convertTo24HourFormat(twelveHourTime) {
    let date = new Date("2000-01-01 " + twelveHourTime);
    let twentyFourHourTime = date.toLocaleTimeString('en-US', {hour12: false});
    return twentyFourHourTime;
}
function convertTo12HourFormat(twentyFourHourTime) {
    let splitTime = twentyFourHourTime.split(":");
    let hours = parseInt(splitTime[0], 10);
    let minutes = splitTime[1];

    let period = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (00:00)

    return hours + ':' + minutes + ' ' + period;
}

function validateTime(id) {
    let timeInput = document.getElementById(id);
    if (timeInput.value.trim() === '') {
        return false;
    }

    let isValidTime = isValidTimeFormat(timeInput.value);

    if (isValidTime) {
        return true;
    } else {
        return false;
    }
}

function isValidTimeFormat(time) {
    let timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
}

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

    if(document.getElementById('timezoneOffset') != undefined){
        document.getElementById('timezoneOffset').value = new Date().getTimezoneOffset();
    }

    if(document.getElementById('start_time_display') != undefined){
        let user_time = new Date('2000-01-01T' + convertTo24HourFormat(document.getElementById('start_time_display').innerHTML) + "Z");
        document.getElementById('start_time_display').innerHTML = user_time.toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          });
    }
    if(document.getElementById('end_time_display') != undefined){
        let user_time = new Date('2000-01-01T' + convertTo24HourFormat(document.getElementById('end_time_display').innerHTML) + "Z");
        document.getElementById('end_time_display').innerHTML = user_time.toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          });
    }

});