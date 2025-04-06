let dragged = null;

// DRAG & DROP HANDLERS
document.querySelectorAll(".draggable").forEach((card) => {
  card.addEventListener("dragstart", (e) => {
    dragged = e.target;
  });

  card.addEventListener("dragend", (e) => {
    e.preventDefault();
    if (dragged && dragged !== e.target) {
      dragged = null;
    }
  });
});

document.querySelectorAll(".dropzone").forEach((zone) => {
  zone.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    if (dragged) {
      const panelCards = zone.querySelector(".panel-cards");
      panelCards.appendChild(dragged);
    }
  });
});

// CREATE A NEW CARD
document.querySelectorAll(".dynamic-add").forEach((button) => {
  button.addEventListener("click", () => {
    const panel = button.closest(".todoList");
    const panelCards = panel.querySelector(".panel-cards");

    const newCard = document.createElement("div");
    newCard.className = "card-wrapper draggable";
    newCard.draggable = true;

    newCard.innerHTML = `
      <div class="panel-card">
        <p contenteditable="true" class="panel-card-text">New Card</p>
        <div class="card-buttons">
          <button class="delete-button">Delete</button>
        </div>
      </div>
    `;

    panelCards.appendChild(newCard);
    reloadCardListeners(); // so new card gets listeners
  });
});

// DELETE A CARD
function reloadCardListeners() {
  document.querySelectorAll(".delete-button").forEach((button) => {
    button.onclick = (e) => {
      const card = e.target.closest(".card-wrapper");
      card.remove();
    };
  });

  // Allow new cards to be draggable
  document.querySelectorAll(".draggable").forEach((card) => {
    card.addEventListener("dragstart", (e) => {
      dragged = e.target;
    });

    card.addEventListener("dragend", (e) => {
      e.preventDefault();
      dragged = null;
    });
  });
}

// INITIALIZE
reloadCardListeners();
