document.addEventListener('DOMContentLoaded', function () {
    let idx = 0;
    function create_review(pat,rate,descr){
        let container = document.createElement('div');
        container.classList.add('review_frame');
        container.style.width = "100%";
        let name = document.createElement('h4');
        name.textContent = pat;
        let rating_div = document.createElement('div');
        rating_div.classList.add('no_wrap1');
        rating_div.classList.add('rating_stars');
        for(let i = 0 ; i < 5 ; i ++){
            let star = document.createElement("p");
            star.textContent = "★";
            star.classList.add("lil_star");
            star.style.cursor = "auto";
            if(rate > i){
                star.style.color = "orange";
            }
            rating_div.appendChild(star);
        }
        let desc = document.createElement("p");
        desc.textContent = descr;
        container.appendChild(rating_div);
        container.appendChild(name);
        container.appendChild(desc);
        return container;
    }
    function get_reviews(){
        fetch('get_reviews',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token,
            },
            body: JSON.stringify({
                id: doctors_id,
                idx: idx
            })
        })
        .then(response => response.json())
        .then(data => {
            data['data'].forEach(dat => {
                document.getElementById("reviews_main").appendChild(create_review(dat['name'],dat['rate'],dat['desc']));    
            });
            idx ++;
            if(!data['more']){
                document.getElementById("load_more").remove()
            }
        });
    }
    get_reviews();
    if(document.getElementById("load_btn") != undefined){
        document.getElementById("load_btn").addEventListener('click',get_reviews);
    }
});