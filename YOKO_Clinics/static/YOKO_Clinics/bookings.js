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

});