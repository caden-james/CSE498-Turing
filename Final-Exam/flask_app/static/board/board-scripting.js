// Make the DIV element draggable:
// const draggables = document.querySelectorAll('.card-wrapper');
// draggables.forEach(panel => {
//     dragElement(panel);
// });

// function dragElement(elmnt) {
//   var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
//   if (document.getElementById(elmnt.id + "header")) {
//     // if present, the header is where you move the DIV from:
//     document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
//   } else {
//     // otherwise, move the DIV from anywhere inside the DIV:
//     elmnt.onmousedown = dragMouseDown;
//   }

//   function dragMouseDown(e) {
//     e = e || window.event;
//     e.preventDefault();
//     // get the mouse cursor position at startup:
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     document.onmouseup = closeDragElement;
//     // call a function whenever the cursor moves:
//     document.onmousemove = elementDrag;
//     elmnt.style.position = 'absolute';
//   }

//   function elementDrag(e) {
//     e = e || window.event;
//     e.preventDefault();
//     // calculate the new cursor position:
//     pos1 = pos3 - e.clientX;
//     pos2 = pos4 - e.clientY;
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     // set the element's new position:
//     elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
//     elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
//   }

//   function closeDragElement() {
//     // stop moving when mouse button is released:
//     document.onmouseup = null;
//     document.onmousemove = null;

//     let panel = elmnt.closest('.todoList');
//     console.log(panel.classList[2]);
//     let card_id = panel.classList[1];
//     console.log('card_id', card_id);

//     // deleteCard(card.id);

//     console.log('card', card);
//   }
// }

var boardSocket;

$(document).ready(function () {
    boardSocket = io.connect(
      "https://" + document.domain + ":" + location.port + "/openboard"

    );
    boardSocket.on("connect", function () {
        boardSocket.emit("openBoard");
    });


    boardSocket.on('card_created', (data) => {
        console.log('Card createddddddd:', data);
        console.log(`#slider > div.todoList.panel.\\3${data.panel_id} .dropzone`);

        // Add the new card to the board
        const newCard = document.createElement('div');
        // newCard.classList.add('card-wrapper', `card-id-${data.card_id}`);
        newCard.innerHTML = `
            <div class="card-wrapper draggable ${data.card_id}" draggable="true">
                <div class="panel-card card-id ${data.card_id}">
                    <p class="panel-card-text">
                        ${data.card_name}
                    </p>
                    <div class="card-buttons">
                        <button class="edit-button">Edit</button>
                        <button class="delete-button ${data.card_id}">Delete</button>
                    </div>
        
                </div>
                <div class="panel-card input-card">
                    <input maxlength="25" class="panel-card-text">
                    
                    <div class="edit-buttons">
                        <button class="save-button" disabled>Save</button>
                    </div>
    
                </div>
            </div>
        `;
        
        let stack = document.querySelector(`#slider > div.todoList.panel.\\3${data.panel_id} .dropzone`);
        let panel = stack.querySelector(".panel-cards");

        if (panel) {
            panel.appendChild(newCard);
            reloadCardListeners();

        }

    });


    boardSocket.on('card_deleted', (data) => {
        console.log('Card deletedffff:', data);
        let card = document.querySelector(`.card-wrapper.${CSS.escape(data.card_id)}`);


        if (card) {
            card.remove();

        }

    });





    boardSocket.on('lock_status', function (data) {
        console.log("lock");
        const card = document.querySelector(`.card-wrapper.${data.card_id}`);
        if (data.status === 'locked') {
          if (data.by !== userId) {
            // Disable the card for other users
            card.classList.add('locked');
            card.querySelector('.panel-card').setAttribute('contenteditable', 'false');
          }
        } else if (data.status === 'unlocked') {
          // Unlock the card
          card.classList.remove('locked');
          card.querySelector('.panel-card').setAttribute('contenteditable', 'true');
        }
      });




  });

  function createCard(element) {
    let panel = element.closest(".panel");
    let panel_id = panel.classList[2];
    // console.log('panel', panel);
    let cardTitle = element.querySelector(".input-create").value;
    let cardDesc = "Add this Later";
  
    var formData = {
      panel_id: panel_id,
      card_name: cardTitle,
      card_description: cardDesc,
    };
  
    jQuery.ajax({
      url: "/createcard",
      data: formData,
      traditional: true,
      type: "POST",
      success: function (returned_data) {
        if (returned_data["success"]) {
          // window.location.href = "/openboard";
          console.log("card created", returned_data);
          boardSocket.emit("newcard",{data: formData});
        }
      },
    });
    // let card = event.target.closest('.panel');
  }
  
  function deleteCard(id) {
    var formData = { card_id: id };
  
    jQuery.ajax({
      url: "/deletecard",
      data: formData,
      type: "POST",
      success: function (returned_data) {
        if (returned_data["success"]) {
            boardSocket.emit("deletecard",{data: formData});
        //   window.location.href = "/openboard";
        }
      },
    });
  }
  
  function updateCard(id, content, panel_id) {
    var formData = { card_id: id, card_name: content };
    var formData_ADD = { panel_id: panel_id, card_id: id, card_name: content};
    console.log(formData_ADD)
    var formData_DEL = { card_id: id};

  
    jQuery.ajax({
      url: "/updatecard",
      data: formData,
      type: "POST",
      success: function (returned_data) {
        if (returned_data["success"]) {
            // window.location.href = "/openboard";
            boardSocket.emit("deletecard",{data: formData_DEL});
            boardSocket.emit("newcard",{data: formData_ADD});
        }
      },
    });
  }

  function moveCard(card_id, panel_id, card_name) {
    var formData = { card_id: card_id, panel_id: panel_id };
    var formData_ADD = { panel_id: panel_id, card_id: card_id, card_name: card_name};
    var formData_DEL = { card_id: card_id};
  
    jQuery.ajax({
      url: "/movecard",
      data: formData,
      type: "POST",
      success: function (returned_data) {
        if (returned_data["success"]) {
            boardSocket.emit("deletecard",{data: formData_DEL});
            boardSocket.emit("newcard",{data: formData_ADD});
        }
      },
    });
  }












let dragged = null;
let dragedoverlast = "";
let dragged_home = "";

let userId = "currentUser123"; // Example user ID, should be unique for each user

// Function to lock a card
function lockCard(cardId) {
    boardSocket.emit('lock_card', { card_id: cardId, user_id: userId });
}

// Function to unlock a card
function unlockCard(cardId) {
    boardSocket.emit('unlock_card', { card_id: cardId, user_id: userId });
}





const newCard = document.querySelectorAll(".dynamic-add");
newCard.forEach((stackCard) => {
  stackCard.addEventListener("click", function (event) {
    let card = event.target.closest(".panel");

    const inputEntry = card.querySelector(".input");
    if (inputEntry) {
      toggleDisplay(inputEntry);
    }
  });
});

function toggleDisplay(element) {
  let inputArea = element.querySelector(".input-create");
  if (element.style.display === "flex") {
    element.style.display = "none";
    inputArea.value = "";
  } else {
    element.style.display = "flex";

    let submitButton = element.querySelector(".create-button");

    inputArea.addEventListener("input", function (event) {
      if (inputArea.value.trim() === "") {
        submitButton.disabled = true;
        submitButton.classList.add("disabled");
        submitButton.classList.remove("enabled");
      } else {
        submitButton.disabled = false;
        submitButton.classList.remove("disabled");
        submitButton.classList.add("enabled");
      }
    });

    submitButton.addEventListener("click", function () {
      createCard(element);

      inputArea.value = "";
      element.style.display = "none";
    });
  }
}

const stackInput = document.getElementById("stack-title");
const stack = document.getElementById("input-stack");
stackInput.addEventListener("click", revealStackInput);

function revealStackInput() {
  if (stack.style.display === "flex") {
    stack.style.display = "none";
  } else {
    stack.style.display = "flex";
  }
}



document.querySelectorAll(".dropzone").forEach((zone) => {
  zone.addEventListener("dragover", (event) => {
    if (dragedoverlast != zone) {
      dragedoverlast = zone;
    }
  });
});



function reloadCardListeners() {
  const stackCards = document.querySelectorAll(".panel-card");
  stackCards.forEach((card) => {
    card.addEventListener("mouseover", function (event) {
      const cardButtons = card.querySelector(".card-buttons");
      if (cardButtons) {
        cardButtons.style.display = "flex";
      }
      card.addEventListener("mouseout", function () {
        if (cardButtons) {
          cardButtons.style.display = "none";
        }
      });
    });
  });

  const panelCards = document.querySelectorAll(".panel");
  panelCards.forEach((panelCard) => {
    panelCard.addEventListener("click", function (event) {
      let card = event.target.closest(".panel");
    });
  });

  const newStackInput = document.getElementById("input-field-stack");
  const submitStackButton = document.getElementById("create-button");
  newStackInput.addEventListener("input", () => {
    if (newStackInput.value.trim() === "") {
      submitStackButton.disabled = true;
      submitStackButton.classList.add("disabled");
      submitStackButton.classList.remove("enabled");
    } else {
      submitStackButton.disabled = false;
      submitStackButton.classList.remove("disabled");
      submitStackButton.classList.add("enabled");
    }
  });

  submitStackButton.addEventListener("click", () => {
    console.log("add this functionality later");
    newStackInput.value = "";
    revealStackInput();
  });

  const source = document.getElementById("draggable");

  document.querySelectorAll(".draggable").forEach((draggable) => {
    draggable.addEventListener("dragstart", (event) => {
      dragged = event.target;
      console.log("dragged");
      dragged_home = event.target.closest(".todoList").classList[2];
    });

    draggable.addEventListener("dragend", (event) => {
      event.preventDefault();

      dragged_card_id = dragged.classList[2];
      dragedoverlast_panel_id = dragedoverlast.classList[2];

      if (dragedoverlast_panel_id != dragged_home) {
        moveCard(dragged_card_id, dragedoverlast_panel_id, dragged.querySelector(".panel-card-text").textContent.trim());
      }

      dragged = null;
      dragedoverlast = "";
      dragged_home = "";
    });
  });

  const editButton = document.querySelectorAll(".edit-button");
  editButton.forEach((button) => {
    button.addEventListener("click", function (event) {
      let panel = event.target.closest(".dropzone");
      panel_id = panel.classList[2];
      console.log(panel);
      let wrapper = event.target.closest(".card-wrapper");
      let text = wrapper.querySelector("input.panel-card-text");
      let inputWrapper = wrapper.querySelector(".input-card");
      let card_id = event.target.closest(".card-id").classList[2];

      let content = wrapper.querySelector(".panel-card-text").textContent;

      wrapper.querySelector(".panel-card").style.display = "none";
      let input = wrapper.querySelector(".input-card");
      input.style.display = "flex";
      text.placeholder = content.trim();

      let saveButton = inputWrapper.querySelector(".save-button");
      console.log("saveButton", saveButton);
      text.addEventListener("input", function () {
        if (text.value.trim() === "") {
          saveButton.disabled = true;
        } else {
          saveButton.disabled = false;

          saveButton.addEventListener("click", function () {
            if (text.value.trim() != "") {
              wrapper.querySelector(".panel-card").style.display = "flex";
              input.style.display = "none";

              updateCard(card_id, text.value, panel_id);

              text.value = "";
            }
          });

          input.addEventListener("keydown", (e) => {
            if (e.keyCode === 13 && text.value.trim() != "") {
                wrapper.querySelector(".panel-card").style.display = "flex";
                input.style.display = "none";
  
                updateCard(card_id, text.value, panel_id);
  
                text.value = "";
            }
          });



        }
      });



    });
  });

  const deleteButton = document.querySelectorAll(".delete-button");
  deleteButton.forEach((button) => {
    button.addEventListener("click", function (event) {
      card_id = event.target.closest(".delete-button").classList[1];
      deleteCard(card_id);
    });
  });




  document.querySelectorAll('.panel-card').forEach(card => {
    card.addEventListener('focus', () => {
      const cardId = card.closest('.card-wrapper').classList[1]; // Get the card ID from the class
      lockCard(cardId);
    });
  
    card.addEventListener('blur', () => {
      const cardId = card.closest('.card-wrapper').classList[1]; // Get the card ID from the class
      unlockCard(cardId);
    });
  });
}

reloadCardListeners();

// function reloadCardListeners() {

//     const stackCards = document.querySelectorAll(".panel-card");
// stackCards.forEach((card) => {
//   card.addEventListener("mouseover", function (event) {
//     const cardButtons = card.querySelector(".card-buttons");
//     if (cardButtons) {
//       cardButtons.style.display = "flex";
//     }
//     card.addEventListener("mouseout", function () {
//       if (cardButtons) {
//         cardButtons.style.display = "none";
//       }
//     });
//   });
// });

// const panelCards = document.querySelectorAll(".panel");
// panelCards.forEach((panelCard) => {
//   panelCard.addEventListener("click", function (event) {
//     let card = event.target.closest(".panel");
//   });
// });

// const stackInput = document.getElementById("stack-title");
// const stack = document.getElementById("input-stack");
// stackInput.addEventListener("click", revealStackInput);

// function revealStackInput() {
//   if (stack.style.display === "flex") {
//     stack.style.display = "none";
//   } else {
//     stack.style.display = "flex";
//   }
// }
// const newStackInput = document.getElementById("input-field-stack");
// const submitStackButton = document.getElementById("create-button");
// newStackInput.addEventListener("input", () => {
//   if (newStackInput.value.trim() === "") {
//     submitStackButton.disabled = true;
//     submitStackButton.classList.add("disabled");
//     submitStackButton.classList.remove("enabled");
//   } else {
//     submitStackButton.disabled = false;
//     submitStackButton.classList.remove("disabled");
//     submitStackButton.classList.add("enabled");
//   }
// });

// submitStackButton.addEventListener("click", () => {
//   console.log("add this fucntionality later");
//   newStackInput.value = "";
//   revealStackInput();
// });

// const source = document.getElementById("draggable");

// document.querySelectorAll(".draggable").forEach((draggable) => {
//   draggable.addEventListener("dragstart", (event) => {
//     dragged = event.target;
//     dragged_home = event.target.closest(".todoList").classList[2];
//   });

//   draggable.addEventListener("dragend", (event) => {
//     event.preventDefault();

//     dragged_card_id = dragged.classList[2];
//     dragedoverlast_panel_id = dragedoverlast.classList[2];

//     if (dragedoverlast_panel_id != dragged_home) {
//       moveCard(dragged_card_id, dragedoverlast_panel_id);
//     }

//     dragged = null;
//     dragedoverlast = "";
//     dragged_home = "";
//   });
// });

// const editButton = document.querySelectorAll(".edit-button");
// editButton.forEach((button) => {
//   button.addEventListener("click", function (event) {
//     let panel = event.target.closest(".panel-card");
//     let wrapper = event.target.closest(".card-wrapper");
//     let text = wrapper.querySelector("input.panel-card-text");
//     let inputWrapper = wrapper.querySelector(".input-card");
//     let card_id = event.target.closest(".card-id").classList[2];

//     let content = wrapper.querySelector(".panel-card-text").textContent;

//     wrapper.querySelector(".panel-card").style.display = "none";
//     let input = wrapper.querySelector(".input-card");
//     input.style.display = "flex";
//     text.placeholder = content.trim();

//     let saveButton = inputWrapper.querySelector(".save-button");
//     console.log("saveButton", saveButton);
//     text.addEventListener("input", function () {
//       if (text.value.trim() === "") {
//         saveButton.disabled = true;
//       } else {
//         saveButton.disabled = false;

//         saveButton.addEventListener("click", function () {
//           if (text.value.trim() != "") {
//             wrapper.querySelector(".panel-card").style.display = "flex";
//             input.style.display = "none";

//             updateCard(card_id, text.value);

//             text.value = "";
//           }
//         });
//       }
//     });
//   });
// });

// const deleteButton = document.querySelectorAll(".delete-button");
// deleteButton.forEach((button) => {
//   button.addEventListener("click", function (event) {
//     card_id = event.target.closest(".delete-button").classList[1];
//     deleteCard(card_id);
//   });
// });

// const newCard = document.querySelectorAll(".dynamic-add");
// newCard.forEach((stackCard) => {
//   stackCard.addEventListener("click", function (event) {
//     let card = event.target.closest(".panel");

//     const inputEntry = card.querySelector(".input");
//     if (inputEntry) {
//       toggleDisplay(inputEntry);
//     }

//   });
// });

// function toggleDisplay(element) {
//   let inputArea = element.querySelector(".input-create");
//   if (element.style.display === "flex") {
//     element.style.display = "none";
//     inputArea.value = "";
//   } else {
//     element.style.display = "flex";

//     let submitButton = element.querySelector(".create-button");

//     inputArea.addEventListener("input", function (event) {
//       if (inputArea.value.trim() === "") {
//         submitButton.disabled = true;
//         submitButton.classList.add("disabled");
//         submitButton.classList.remove("enabled");
//       } else {
//         submitButton.disabled = false;
//         submitButton.classList.remove("disabled");
//         submitButton.classList.add("enabled");
//       }
//     });

//     submitButton.addEventListener("click", function () {
//       createCard(element);

//       inputArea.value = "";
//       element.style.display = "none";
//     });
//   }
// }

// }











