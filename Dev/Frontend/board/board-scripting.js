import createModule from '../CapstoneProject.js';
let RAS;
let wrapper;
let tagManager;

createModule().then((Module) => {
  RAS = new Module.RandomAccessSetInt();
  wrapper = new Module.AnnotatedWrapperString();
  tagManager = new Module.TagManager();

  Card = Module.Card;

  // Test - create a new card
  const myCard = new Card(1, "Finish Homework");

  console.log("Card ID:", myCard.getId());
  console.log("Card Content:", myCard.getContent());

  myCard.setContent("Updated Task");
  console.log("New Content:", myCard.getContent());

  myCard.clearContent();
  console.log("After Clear:", myCard.getContent());
  // Debugging and testing purposes
  RAS.add(929292929);
  console.log("RAS value test:", RAS.get(0));

  wrapper.addAnnotation("label", "important");
  console.log("Annotation label test:", wrapper.getAnnotation("label"));

  // starts the rest of the app logic
  setupBoard();
});

let dragged = null;

// CALENDAR DATE
document.addEventListener("DOMContentLoaded", () => {
  const dateEl = document.getElementById("current-date");
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateEl.textContent = today.toLocaleDateString(undefined, options);

  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();

  function renderCalendar(month, year) {
    const calendar = document.getElementById("monthly-calendar");
    const monthLabel = document.getElementById("month-label");
    calendar.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthName = new Date(year, month).toLocaleString(undefined, { month: 'long', year: 'numeric' });
    monthLabel.textContent = monthName;

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayNames.forEach(day => {
      const dayEl = document.createElement("div");
      dayEl.className = "header";
      dayEl.textContent = day;
      calendar.appendChild(dayEl);
    });

    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.innerHTML = "&nbsp;";
      calendar.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement("div");
      cell.textContent = day;

      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      if (isToday) {
        cell.classList.add("today");
      }

      calendar.appendChild(cell);
    }
  }

  document.getElementById("prev-month").addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
  });

  document.getElementById("next-month").addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
  });

  renderCalendar(currentMonth, currentYear);
});

// SAVE NOTES LOCALLY
document.addEventListener("DOMContentLoaded", () => {
  const notesArea = document.getElementById("notes-area");
  const saveStatus = document.getElementById("save-status");

  // Load saved notes
  const savedNotes = localStorage.getItem("sidebar-notes");
  const savedTime = localStorage.getItem("notes-saved-time");

  if (savedNotes) {
    notesArea.value = savedNotes;
    if (savedTime) {
      saveStatus.textContent = `Last saved: ${savedTime}`;
    }
  }

  // Save notes and timestamp
  notesArea.addEventListener("input", () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    localStorage.setItem("sidebar-notes", notesArea.value);
    localStorage.setItem("notes-saved-time", timeString);

    saveStatus.textContent = `Last saved: ${timeString}`;
  });

  const downloadBtn = document.getElementById("download-notes");

downloadBtn.addEventListener("click", () => {
  const notesText = notesArea.value || "No notes written yet.";
  const blob = new Blob([notesText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "my-notes.txt";
  link.click();

  URL.revokeObjectURL(url); // Clean up
});

});


// CALENDAR DATE
document.addEventListener("DOMContentLoaded", () => {
  const dateEl = document.getElementById("current-date");
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateEl.textContent = today.toLocaleDateString(undefined, options);

  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();

  function renderCalendar(month, year) {
    const calendar = document.getElementById("monthly-calendar");
    const monthLabel = document.getElementById("month-label");
    calendar.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthName = new Date(year, month).toLocaleString(undefined, { month: 'long', year: 'numeric' });
    monthLabel.textContent = monthName;

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayNames.forEach(day => {
      const dayEl = document.createElement("div");
      dayEl.className = "header";
      dayEl.textContent = day;
      calendar.appendChild(dayEl);
    });

    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.innerHTML = "&nbsp;";
      calendar.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement("div");
      cell.textContent = day;

      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      if (isToday) {
        cell.classList.add("today");
      }

      calendar.appendChild(cell);
    }
  }

  document.getElementById("prev-month").addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
  });

  document.getElementById("next-month").addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
  });

  renderCalendar(currentMonth, currentYear);
});

// SAVE NOTES LOCALLY
document.addEventListener("DOMContentLoaded", () => {
  const notesArea = document.getElementById("notes-area");
  const saveStatus = document.getElementById("save-status");

  // Load saved notes
  const savedNotes = localStorage.getItem("sidebar-notes");
  const savedTime = localStorage.getItem("notes-saved-time");

  if (savedNotes) {
    notesArea.value = savedNotes;
    if (savedTime) {
      saveStatus.textContent = `Last saved: ${savedTime}`;
    }
  }

  // Save notes and timestamp
  notesArea.addEventListener("input", () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    localStorage.setItem("sidebar-notes", notesArea.value);
    localStorage.setItem("notes-saved-time", timeString);

    saveStatus.textContent = `Last saved: ${timeString}`;
  });

  const downloadBtn = document.getElementById("download-notes");

downloadBtn.addEventListener("click", () => {
  const notesText = notesArea.value || "No notes written yet.";
  const blob = new Blob([notesText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "my-notes.txt";
  link.click();

  URL.revokeObjectURL(url); // Clean up
});

});


function setupBoard() {
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
      const input = panel.querySelector(".input-create");
      const tagName = input.value.trim();
      
      if (!tagName) return; // Don't add empty tags
      
      const panelCards = panel.querySelector(".panel-cards");
      const newCard = createNewCard(tagName);
      panelCards.appendChild(newCard);
      
      input.value = ""; // Clear input
      
      // Set up delete button
      newCard.querySelector(".delete-button").addEventListener("click", () => {
        if (typeof tagManager !== 'undefined') {
          tagManager.clearTagsForTask(newCard.id);
        }
        newCard.remove();
      });
    });
  });

  // DELETE A CARD
  function reloadCardListeners() {
    document.querySelectorAll(".delete-button").forEach((button) => {
      button.onclick = (e) => {
        const card = e.target.closest(".card-wrapper");
        if (typeof tagManager !== 'undefined' && card.id) {
          const tags = emscriptenVectorToArray(tagManager.getTags(card.id));
          tags.forEach(tag => tagManager.removeTag(card.id, tag));
        }
        card.remove();
      };
    });
  }

  // Edit functionality
  document.querySelectorAll(".panel-card-text").forEach(textElement => {
    textElement.closest(".panel-card").querySelector(".edit-button")
      .addEventListener("click", (e) => {
        textElement.contentEditable = true;
        textElement.focus();
      });
    
    // Handle saving edits
    textElement.addEventListener("blur", () => {
      textElement.contentEditable = false;
      const newName = textElement.textContent.trim();
      const card = textElement.closest(".card-wrapper");
      
      if (typeof tagManager !== 'undefined' && card.id) {
        const oldName = textElement.dataset.originalText || newName;
        tagManager.removeTag(card.id, oldName);
        tagManager.addTag(card.id, newName);
        textElement.dataset.originalText = newName;
      }
    });
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

  // Search Functionality
  document.querySelector(".search-button").addEventListener("click", () => {
    const searchTerm = document.querySelector(".search-input").value.trim().toLowerCase();
    
    if (searchTerm === '') {
      // Show all if empty search
      document.querySelectorAll(".card-wrapper").forEach(card => {
        card.style.display = "flex";
      });
      return;
    }
    
    if (typeof tagManager !== 'undefined') {
      document.querySelectorAll(".card-wrapper").forEach(card => {
        const tags = tagManager.getTags(card.id);
        let hasMatch = false;
        
        // Check each tag for match
        for (let i = 0; i < tags.size(); i++) {
          if (tags.get(i).toLowerCase().includes(searchTerm)) {
            hasMatch = true;
            break;
          }
        }
        
        card.style.display = hasMatch ? "flex" : "none";
      });
    }
  });
}

function createNewCard(cardName = "New Card") {
  const cardId = 'card-' + Date.now(); 
  const newCard = document.createElement("div");
  newCard.className = "card-wrapper draggable";
  newCard.draggable = true;
  newCard.id = cardId;
  
  newCard.innerHTML = `
    <div class="panel-card">
      <p contenteditable="true" class="panel-card-text">${cardName}</p>
      <div class="card-buttons">
        <button class="edit-button">
          <img src="./icons/edit.png" alt="Edit" class="card-icon">
        </button>
        <button class="delete-button">
          <img src="./icons/trash.png" alt="Delete" class="card-icon">
        </button>
      </div>
    </div>
  `;
  
  if (typeof tagManager !== 'undefined') {
    tagManager.addTag(cardId, cardName);
  }
  
  return newCard;
}