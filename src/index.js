// Constants
const BASE_URL = "http://localhost:3000";
const ramen_menu = document.getElementById("ramen-menu");
const new_ramen_form = document.getElementById("new-ramen");
const name_error = document.getElementById("name-error");
const edit_delete_btns = document.querySelector(".edit-delete-btns");

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  fetchRamen();
});

new_ramen_form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(new_ramen_form);
  const ramenData = Object.fromEntries(formData.entries());

  const existingStatus = await checkRamenExistingStatus(ramenData);
  if (existingStatus) {
    alert("Ramen already exists");
    name_error.textContent = "Ramen already exists";
  } else {
    postData(`${BASE_URL}/ramens`, ramenData);
  }
});

// Fetch and Render Functions
async function fetchRamen() {
  try {
    const response = await fetch(`${BASE_URL}/ramens`);
    const data = await response.json();
    renderRamen(data);
  } catch (error) {
    console.log(error);
  }
}

function renderRamen(ramens) {
  const ramen_detailed_img = document.querySelector(".detail-image");
  const ramen_name = document.querySelector(".name");
  const ramen_restaurant = document.querySelector(".restaurant");
  const ramen_rating_display = document.querySelector("#rating-display");
  const ramen_comment_display = document.querySelector("#comment-display");
  const editForm = document.getElementById("edit-ramen");

  // Clear existing buttons
  edit_delete_btns.innerHTML = "";

  ramens.forEach((ramen) => {
    const img = document.createElement("img");
    img.src = ramen.image;
    ramen_menu.appendChild(img);

    img.addEventListener("click", () => {
      // Hide edit form and show new ramen form
      editForm.style.display = "none";
      new_ramen_form.style.display = "block";

      // Update details section
      ramen_detailed_img.src = ramen.image;
      ramen_name.textContent = ramen.name;
      ramen_restaurant.textContent = ramen.restaurant;
      ramen_rating_display.textContent = ramen.rating;
      ramen_comment_display.textContent = ramen.comment;

      // Clear existing buttons
      edit_delete_btns.innerHTML = "";

      // Create and add Edit button
      const show_edit_form_btn = document.createElement("button");
      show_edit_form_btn.textContent = "Edit";
      show_edit_form_btn.classList.add("edit-btn");
      show_edit_form_btn.addEventListener("click", () => {
        // Show edit form and hide new ramen form
        editForm.style.display = "block";
        editForm.scrollIntoView({ behavior: "smooth" });
        new_ramen_form.style.display = "none";
        populateEditForm(ramen);
      });
      edit_delete_btns.appendChild(show_edit_form_btn);

      // Create and add Delete button
      const delete_btn = document.createElement("button");
      delete_btn.textContent = "Delete";
      delete_btn.classList.add("delete-btn");
      delete_btn.addEventListener("click", async () => {
        await deleteRamen(`${BASE_URL}/ramens/${ramen.id}`);
      });
      edit_delete_btns.appendChild(delete_btn);
    });
  });
}

// Form Handling Functions
function populateEditForm(ramen) {
  document.getElementById("edit-name").value = ramen.name;
  document.getElementById("edit-restaurant").value = ramen.restaurant;
  document.getElementById("edit-image").value = ramen.image;
  document.getElementById("edit-rating").value = ramen.rating;
  document.getElementById("edit-comment").value = ramen.comment;
}

async function checkRamenExistingStatus(ramenData) {
  const response = await fetch(`${BASE_URL}/ramens`);
  const data = await response.json();
  return data.some((ramen) => ramen.name === ramenData.name);
}

async function postData(url, ramenDataObject) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ramenDataObject),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    fetchRamen();
  } catch (error) {
    console.log(error);
  }
}

async function updateRamen(url, ramenDataObject) {
  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ramenDataObject),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    fetchRamen();
    document.getElementById("edit-ramen").style.display = "none";
  } catch (error) {
    console.log(error);
  }
}

async function deleteRamen(url) {
  try {
    const response = await fetch(url, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    fetchRamen();
  } catch (error) {
    console.log(error);
  }
}
