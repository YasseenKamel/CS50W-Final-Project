document.addEventListener('DOMContentLoaded', function () {
    let booking_frames = document.querySelectorAll('.address_div');
    booking_frames.forEach(booking => {
        let cur = booking.children[0];
        let customDatetime = parseCustomDatetime(cur.textContent);
        cur.textContent = 'Date created: ' + customDatetime.toLocaleString();
    });

});