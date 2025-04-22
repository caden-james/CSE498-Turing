import createModule from '../CapstoneProject.js';
let RAS;
let wrapper;
let tagManager;
let dynamicString;
let Card;
let ap;
let board;
let nextId = 1;

createModule().then((Module) => {
  RAS = new Module.RandomAccessSetInt();
  wrapper = new Module.AnnotatedWrapperString();
  ap = new Module.AuditedPointerInt();
  tagManager = new Module.TagManager();
  dynamicString = new Module.DynamicString();
  board = new Module.Board();

  Card = Module.Card;

  const ds = Module.makeDynamicFromString("hello");
  console.log(ds.toString()); // should be "hello"
  ds.delete();

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
  setupAllDynamicAddButtons();

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
      const dateObj = new Date(year, month, day);
      const formattedDate = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
    
      cell.textContent = day;
      cell.classList.add("calendar-day");
      cell.dataset.date = formattedDate;
    
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();
    
      if (isToday) {
        cell.classList.add("today");
      }
    
      cell.addEventListener("click", () => {
        document.querySelectorAll(".calendar-day").forEach(el => el.classList.remove("selected"));
        cell.classList.add("selected");
        loadNotesForDate(formattedDate);
      });
    
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
  const dateEl = document.getElementById("current-date");
  const downloadBtn = document.getElementById("download-notes");
  const calendar = document.getElementById("monthly-calendar");
  const monthLabel = document.getElementById("month-label");

  let selectedDate = new Date().toISOString().split("T")[0];
  let today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();

  function loadNotesForDate(date) {
    selectedDate = date;
    const notesKey = `notes-${date}`;
    const timeKey = `notes-time-${date}`;
    const savedNotes = localStorage.getItem(notesKey);
    const savedTime = localStorage.getItem(timeKey);

    notesArea.value = savedNotes || "";
    saveStatus.textContent = savedTime ? `Last saved: ${savedTime}` : "";
  }

  function renderCalendar(month, year) {
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
      const dateObj = new Date(year, month, day);
      const formattedDate = dateObj.toISOString().split("T")[0];

      cell.textContent = day;
      cell.classList.add("calendar-day");
      cell.dataset.date = formattedDate;

      const isToday = day === today.getDate() &&
                      month === today.getMonth() &&
                      year === today.getFullYear();

      if (isToday) cell.classList.add("today");

      if (localStorage.getItem(`notes-${formattedDate}`)) {
        cell.classList.add("has-notes"); // Add style if notes exist for that day
      }

      cell.addEventListener("click", () => {
        document.querySelectorAll(".calendar-day").forEach(el => el.classList.remove("selected"));
        cell.classList.add("selected");
        loadNotesForDate(formattedDate);
      });

      calendar.appendChild(cell);
    }
  }

  notesArea.addEventListener("input", () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    localStorage.setItem(`notes-${selectedDate}`, notesArea.value);
    localStorage.setItem(`notes-time-${selectedDate}`, timeString);
    saveStatus.textContent = `Last saved: ${timeString}`;

    // Re-render to apply "has-notes" class
    renderCalendar(currentMonth, currentYear);
  });

  downloadBtn.addEventListener("click", () => {
    const notesText = notesArea.value || "No notes written yet.";
    const blob = new Blob([notesText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `notes-${selectedDate}.txt`;
    link.click();

    URL.revokeObjectURL(url);
  });

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

  // Show today's date and notes
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateEl.textContent = today.toLocaleDateString(undefined, options);

  renderCalendar(currentMonth, currentYear);
  loadNotesForDate(selectedDate);
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
  document.querySelector(".top-bar .add-button").addEventListener("click", () => {
    const slider = document.getElementById("slider");
    const uniqueId = `task-${Date.now()}`;
  
    const newColumn = document.createElement("div");
    newColumn.className = "todoList panel dropzone";
  
    newColumn.innerHTML = `
      <h2 class="todo-text ignore">NAME</h2>
      <p class="panel-card-descr">Description</p>
  
      <div class="panel-cards"></div>
  
      <div class="panel-card-add">
        <div class="input" id="input-stack-${uniqueId}">
          <input type="text" placeholder="Tag Name" class="input-create" />
        </div>
        <button class="add-button dynamic-add">
          <span class="add-button-text">+ Add a Tag</span>
        </button>
      </div>
    `;
  
    const allStacks = document.querySelectorAll('.todoList.panel');
    const newStackIndex = allStacks.length;
    slider.appendChild(newColumn);
    enableEditableTitleAndDesc(newColumn, newStackIndex);
  
    // manually re-bind dynamic-add to this specific column
    const input = newColumn.querySelector(".input-create");
    const panelCards = newColumn.querySelector(".panel-cards");
    const button = newColumn.querySelector(".dynamic-add");
  
    button.addEventListener("click", () => {
      const cardName = input.value.trim() || "New Tag";
      const cardId = Date.now(); // Use a safe ID
  
      const card = new Card(cardId % 2147483647, cardName);
      board.addCard(card);
      card.addTag(cardName);
  
      const newCard = document.createElement("div");
      newCard.className = "card-wrapper draggable";
      newCard.draggable = true;
      newCard.dataset.cardId = cardId;
  
      newCard.innerHTML = `
        <div class="panel-card">
          <p class="panel-card-text" contenteditable="true">${card.getContent()}</p>
          <div class="card-buttons">
            <button class="delete-button">
              <img src="./icons/trash.png" alt="Delete" class="card-icon">
            </button>
          </div>
        </div>
      `;
  
      panelCards.appendChild(newCard);
      input.value = "";
      reloadCardListeners();
    });
  
    reloadCardListeners(); // Make sure it's draggable
  });
  
  // INITIALIZE
  reloadCardListeners();

  // Enable Editing
  editCard();

    // Enabled tag editing
    editTag();

    // Enable Status + Due date feature
    initStatusBar();

// SEARCH FUNCTIONALITY
function performSearch() {
  const searchTerm = document.querySelector(".search-input").value.trim().toLowerCase();
  const resultsContainer = document.querySelector(".search-results");
  
  resultsContainer.innerHTML = '';
  
  if (!searchTerm) {
    resultsContainer.style.display = 'none';
    return;
  }
  
  const results = new Map();
  
  document.querySelectorAll(".card-wrapper").forEach(card => {
    const cardId = card.dataset.cardId;
    const cardName = card.querySelector(".panel-card-text").textContent;
    
    if (cardName.toLowerCase().includes(searchTerm)) {
      results.set(cardId, cardName);
    }
    
    if (typeof tagManager !== 'undefined') {
      try {
        const tags = tagManager.getTags(cardId);
        for (let i = 0; i < tags.size(); i++) {
          if (tags.get(i).toLowerCase().includes(searchTerm)) {
            results.set(cardId, cardName);
            break;
          }
        }
      } catch (e) {
        console.error("Search error:", e);
      }
    }
  });
  
  if (results.size > 0) {
    results.forEach((name, id) => {
      const resultItem = document.createElement("div");
      resultItem.className = "search-result-item";
      resultItem.textContent = name;
      
      resultItem.addEventListener("click", () => {
        const card = document.querySelector(`[data-card-id="${id}"]`);
        card.scrollIntoView({behavior: "smooth", block: "center"});
        card.style.outline = "2px solid #4285f4";
        setTimeout(() => card.style.outline = "", 2000);
        resultsContainer.style.display = 'none';
      });
      
      resultsContainer.appendChild(resultItem);
    });
  } else {
    const noResults = document.createElement("div");
    noResults.className = "search-result-item";
    noResults.textContent = "No results found";
    resultsContainer.appendChild(noResults);
  }
  
  resultsContainer.style.display = results.size ? 'block' : 'none';
}

// Set up event listeners
document.querySelector(".search-button").addEventListener("click", performSearch);
document.querySelector(".search-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    performSearch();
  }
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-container")) {
    document.querySelector(".search-results").style.display = 'none';
  }
});
}

function setupAllDynamicAddButtons() {
  document.querySelectorAll(".dynamic-add").forEach(button => {
    const column = button.closest(".todoList");
    const input = column.querySelector(".input-create");
    const panelCards = column.querySelector(".panel-cards");

    button.addEventListener("click", () => {
      const cardName = input.value.trim() || "New Tag";
      const cardId = Date.now();

      const card = new Card(cardId % 2147483647, cardName);
      board.addCard(card);
      card.addTag(cardName);

      const newCard = document.createElement("div");
      newCard.className = "card-wrapper draggable";
      newCard.draggable = true;
      newCard.dataset.cardId = cardId;

      newCard.innerHTML = `
        <div class="panel-card">
          <p class="panel-card-text" contenteditable="true">${card.getContent()}</p>
          <div class="card-buttons">
            <button class="delete-button">
              <img src="./icons/trash.png" alt="Delete" class="card-icon">
            </button>
          </div>
        </div>
      `;

      panelCards.appendChild(newCard);
      input.value = "";
      reloadCardListeners();
    });
  });
}

// DELETE A CARD
function reloadCardListeners() {
  document.querySelectorAll(".delete-button").forEach((button) => {
    button.onclick = (e) => {
      const card = e.target.closest(".card-wrapper");
      if (typeof tagManager !== 'undefined' && card.dataset.cardId) {
        tagManager.clearTagsForTask(card.dataset.cardId);
      }
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

// Edit Card Name + Description
function editCard() {
    //  Enable editing for NAME/Description
    document.querySelectorAll('.todoList.panel').forEach((stackEl, stackIdx) => {
      const titleEl = stackEl.querySelector('h2.todo-text');
      const descEl  = stackEl.querySelector('p.panel-card-descr');
  
      // Turn on editing (in place)
      titleEl.contentEditable = true;
      descEl .contentEditable = true;
  
      // Load saved values
      const savedTitle = localStorage.getItem(`stack-${stackIdx}-title`);
      if (savedTitle  != null) titleEl.textContent = savedTitle;
      const savedDesc  = localStorage.getItem(`stack-${stackIdx}-desc`);
      if (savedDesc   != null) descEl.textContent  = savedDesc;
  
      // Save on blur or Enter
      [ [titleEl, 'title'], [descEl, 'desc'] ].forEach(([el, kind]) => {
        el.addEventListener('keydown', e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            el.blur();
          }
        });
        el.addEventListener('blur', () => {
          const text = el.textContent.trim();
          localStorage.setItem(`stack-${stackIdx}-${kind}`, text);
        });
      });
    });
}

function editTag() {
  document.querySelectorAll('.card-wrapper').forEach(wrapper => {
    const displayCard = wrapper.querySelector('.panel-card.card-id');
    const textP       = displayCard.querySelector('.panel-card-text');
    const inputCard   = wrapper.querySelector('.panel-card.input-card');
    const inputEl     = inputCard.querySelector('input');
    const saveBtn     = inputCard.querySelector('.save-button');
    const editBtn     = displayCard.querySelector('.edit-button');

    // 1) On edit button click, show the input and prefill it
    editBtn.onclick = () => {
      displayCard.style.display = 'none';      // hide the normal view
      inputCard.style.display   = 'flex';      // show the input
      inputEl.value             = textP.textContent;
      inputEl.focus();
    };

    // 2) Enable Save only when there’s text
    inputEl.oninput = () => {
      saveBtn.disabled = inputEl.value.trim()==='';
    };

    // 3) On Save, write value everywhere and hide the input
    saveBtn.onclick = () => {
      const newName = inputEl.value.trim();
      if (!newName) return;

      // a) Update the DOM
      textP.textContent = newName;
      displayCard.style.display = 'flex';
      inputCard.style.display   = 'none';

      // b) Update your C++ TagManager (if you have a cardId on the wrapper):
      const cardId = wrapper.dataset.cardId;
      if (tagManager && cardId) {
        // Remove the old tag then re-add with new name:
        tagManager.removeTag(cardId, textP.textContent);
        tagManager.addTag   (cardId, newName);
      }

      saveBtn.disabled = true;
    };
  });
}


function initStatusBar() {
  document.querySelectorAll('.panel-card-footer').forEach(footer => {
    // find the enclosing column and its index
    const cardEl    = footer.closest('.todoList.panel');
    const cardIdx   = Array.from(cardEl.parentNode.children).indexOf(cardEl);
    const statusSel = footer.querySelector('.task-status');
    const dueInput  = footer.querySelector('.task-due');

    // Hydrate from storage
    const savedStatus = localStorage.getItem(`card-${cardIdx}-status`);
    if (savedStatus) statusSel.value = savedStatus;

    const savedDue = localStorage.getItem(`card-${cardIdx}-due`);
    if (savedDue) dueInput.value = savedDue;

    // Persist changes
    statusSel.addEventListener('change', () => {
      localStorage.setItem(`card-${cardIdx}-status`, statusSel.value);
      console.log(`Card ${cardIdx} status ->`, statusSel.value);
      // Optionally: Module.Card.setStatus(...)
    });
    dueInput.addEventListener('change', () => {
      localStorage.setItem(`card-${cardIdx}-due`, dueInput.value);
      console.log(`Card ${cardIdx} due ->`, dueInput.value);
      // Optionally: Module.Card.setDueDate(...)
    });
  });
}


