// write your code here 
const BASE_URL = 'http://localhost:3000';
const ramen_menu = document.getElementById('ramen-menu');

async function fetchRamen() {
   
  try {
            const response = await fetch(`${BASE_URL}/ramens`);
            const data = await response.json();
            //console.log(data);
            renderRamen(data);
           
    } catch (error) {
        console.log(error);
    }
  }
function renderRamen(ramens) {

  const ramen_detailed_img = document.querySelector('.detail-image');
  const ramen_name = document.querySelector('.name');
  const ramen_restaurant = document.querySelector('.restaurant');
  const ramen_rating_display = document.querySelector('#rating-display');
  const ramen_comment_display = document.querySelector('#comment-display');



  ramens.forEach(ramen => {
    const img = document.createElement('img');
    img.src =ramen.image;
    ramen_menu.appendChild(img);

    img.addEventListener('click' , ()=> {

        ramen_detailed_img.src = ramen.image;
        ramen_name.textContent = ramen.name;
        ramen_restaurant.textContent = ramen.restaurant;
        ramen_rating_display.textContent = ramen.rating;
        ramen_comment_display.textContent = ramen.comment;


    });
    
  });




}




document.addEventListener('DOMContentLoaded', () => {
  fetchRamen();
});
