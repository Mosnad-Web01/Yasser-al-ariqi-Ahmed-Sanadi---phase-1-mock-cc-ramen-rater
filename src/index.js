// write your code here 
const BASE_URL = 'http://localhost:3000';
const ramen_menu = document.getElementById('ramen-menu');
const new_ramen_form = document.getElementById('new-ramen');

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

//------Post data Starts here ----------------------------------------------------------------------------
new_ramen_form.addEventListener('submit', async (event) => {
  
  event.preventDefault();
  
  const formData = new FormData(new_ramen_form);
  const ramenData = Object.fromEntries(formData.entries());//get all input values from form and convert them into an object                 
  postData(`${BASE_URL}/ramens` , ramenData);

});

async function postData(url , ramenDataObject) {

  try {
    const response = await fetch(url , {
      method : 'POST',
      headers :{
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify(ramenDataObject),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    //console.log(data);
    fetchRamen();



  } catch (error) {
    console.log(error);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  fetchRamen();
});
