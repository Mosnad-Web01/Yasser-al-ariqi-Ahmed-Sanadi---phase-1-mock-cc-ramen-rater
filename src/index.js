// Constants
const BASE_URL = "http://localhost:3000";
const ramenMenu = document.getElementById("ramen-menu");
const newRamenForm = document.getElementById("new-ramen");
const nameError = document.getElementById("name-error");
const editDeleteBtns = document.querySelector(".edit-delete-btns");
const ramenDetailElements = {
  image: document.querySelector(".detail-image"),
  name: document.querySelector(".name"),
  restaurant: document.querySelector(".restaurant"),
  rating: document.querySelector("#rating-display"),
  comment: document.querySelector("#comment-display"),
};
const editForm = document.getElementById("edit-ramen");

// Event Listeners
document.addEventListener("DOMContentLoaded", fetchAndRenderRamen);
newRamenForm.addEventListener("submit", handleNewRamenSubmit);

// Fetch and Render Functions
async function fetchAndRenderRamen() {
  try {
    const ramenData = await fetchRamenData();
    renderRamenMenu(ramenData);
    // Optionally, display the first ramen's details by default
    if (ramenData.length) {
      displayRamenDetails(ramenData[0]);
    }
  } catch (error) {
    console.error("Failed to fetch ramen data:", error);
  }
}

async function fetchRamenData() {
  const response = await fetch(`${BASE_URL}/ramens`);
  return response.json();
}

function renderRamenMenu(ramens) {
  ramenMenu.innerHTML = ""; 
  editDeleteBtns.innerHTML = ""; 

  ramens.forEach((ramen) => {
    const img = document.createElement("img");
    img.src = ramen.image;
    ramenMenu.appendChild(img);

    img.addEventListener("click", () => {
      displayRamenDetails(ramen);
      setupEditDeleteButtons(ramen);
    });
  });
}

function displayRamenDetails(ramen) {
  ramenDetailElements.image.src = ramen.image;
  ramenDetailElements.name.textContent = ramen.name;
  ramenDetailElements.restaurant.textContent = ramen.restaurant;
  ramenDetailElements.rating.textContent = ramen.rating;
  ramenDetailElements.comment.textContent = ramen.comment;


  editForm.style.display = "none";
  newRamenForm.style.display = "block";
}

function setupEditDeleteButtons(ramen) {
  editDeleteBtns.innerHTML = ""; 

  const editBtn = createButton("Edit", "edit-btn", () => {
    showEditForm(ramen);
  });

  const deleteBtn = createButton("Delete", "delete-btn", async () => {
    await deleteRamen(ramen.id);
    alert(`${ramen.name} has been deleted successfully.`);
    fetchAndRenderRamen();
  });

  editDeleteBtns.append(editBtn, deleteBtn);
}


async function handleNewRamenSubmit(event) {
  event.preventDefault();
  const ramenData = getFormData(newRamenForm);

  if (await isRamenExisting(ramenData)) {
    showErrorMessage("Ramen already exists");
  } else {
    await postRamenData(ramenData);
    resetForm(newRamenForm);
    alert(`${ramenData.name} has been added successfully.`);
    fetchAndRenderRamen();
  }
}

function showEditForm(ramen) {
  populateEditForm(ramen);
  editForm.style.display = "block";
  editForm.scrollIntoView({ behavior: "smooth" });
  newRamenForm.style.display = "none";
}

function populateEditForm(ramen) {
  editForm.elements["name"].value = ramen.name;
  editForm.elements["restaurant"].value = ramen.restaurant;
  editForm.elements["image"].value = ramen.image;
  editForm.elements["rating"].value = ramen.rating;
  editForm.elements["comment"].value = ramen.comment;
}

async function isRamenExisting(ramenData) {
  const existingRamen = await fetchRamenData();
  return existingRamen.some((ramen) => ramen.name === ramenData.name);
}

function getFormData(form) {
  const formData = new FormData(form);
  return Object.fromEntries(formData.entries());
}

function resetForm(form) {
  form.reset();
  nameError.textContent = "";
}

function showErrorMessage(message) {
  nameError.textContent = message;
}


async function postRamenData(ramenData) {
  try {
    const response = await fetch(`${BASE_URL}/ramens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ramenData),
    });
    if (!response.ok) throw new Error("Failed to post ramen data");
  } catch (error) {
    console.error("Error:", error);
  }
}

async function deleteRamen(ramenId) {
  try {
    const response = await fetch(`${BASE_URL}/ramens/${ramenId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete ramen");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Utility Functions ( Button )
function createButton(text, className, onClick) {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add(className);
  button.addEventListener("click", onClick);
  return button;
}
