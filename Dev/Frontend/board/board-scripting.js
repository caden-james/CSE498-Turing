import createModule from '../ras.js';
let RAS;

createModule().then((Module) => {
  RAS = new Module.RandomAccessSetInt();
  console.log("Emscripten RAS module loaded");

  // Example usage:
  RAS.add(929292929);
  console.log(RAS.get(0));

  setupBoard(); // starts the rest of the app logic
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

  // INITIALIZE
  reloadCardListeners();
}

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