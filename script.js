document.addEventListener('DOMContentLoaded', function () {
  // Initialize all modules
  initializeModules();
  initializeClock(); // Initialize clock
});

// Initialize all modules
function initializeModules() {
  habitTrackerModule();
  mealsModule();
  themeToggleModule();
  groceryModule();
  taskModule();
}

// Initialize Clock
function initializeClock() {
  const clockElement = document.getElementById('clock');
  if (!clockElement) return;

  function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
  }

  updateClock(); // Set initial time
  setInterval(updateClock, 1000); // Update every second
}

// Theme Toggle Module
function themeToggleModule() {
  const themeToggleButton = document.getElementById('theme-toggle');
  if (!themeToggleButton) return;

  // Apply the theme
  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    themeToggleButton.textContent = theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme';
    localStorage.setItem('theme', theme);
  }

  // Initialize theme based on preference or time
  function initializeTheme() {
    const currentHour = new Date().getHours();
    const defaultTheme = currentHour >= 6 && currentHour < 18 ? 'light' : 'dark';
    const savedTheme = localStorage.getItem('theme') || defaultTheme;
    applyTheme(savedTheme);
  }

  // Initialize and toggle theme
  initializeTheme();
  themeToggleButton.addEventListener('click', function () {
    const currentTheme = document.body.getAttribute('data-theme');
    applyTheme(currentTheme === 'light' ? 'dark' : 'light');
  });
}

// Grocery Module
function groceryModule() {
  const groceryForm = document.getElementById('grocery-form');
  const groceryList = document.getElementById('grocery-list');
  const groceryArchive = document.getElementById('grocery-archive');

  if (!groceryForm) return;

  // Load groceries from localStorage
  const groceries = loadFromLocalStorage('groceries', []);
  groceries.forEach(groceryItem => {
    groceryItem.completed ? addGroceryToArchive(groceryItem) : addGroceryToList(groceryItem);
  });

  // Handle form submission
  groceryForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get grocery data
    const groceryItemName = document.getElementById('grocery-item').value.trim();
    const groceryQuantity = document.getElementById('grocery-quantity').value.trim();
    const groceryLocation = document.getElementById('grocery-location').value.trim();
    const groceryCategory = document.getElementById('grocery-category').value;

    if (!groceryItemName || !groceryQuantity || !groceryLocation || !groceryCategory) {
      alert('Please fill out all fields.');
      return;
    }

    const groceryItem = {
      itemName: groceryItemName,
      quantity: groceryQuantity,
      location: groceryLocation,
      category: groceryCategory,
      completed: false,
    };

    saveToLocalStorage('groceries', groceryItem);
    addGroceryToList(groceryItem);
    groceryForm.reset();
  });

  // Add grocery to active list
  function addGroceryToList(groceryItem) {
    const listItem = createGroceryListItem(groceryItem, false);
    groceryList.appendChild(listItem);
  }

  // Add grocery to archive
  function addGroceryToArchive(groceryItem) {
    const listItem = createGroceryListItem(groceryItem, true);
    groceryArchive.appendChild(listItem);
  }

  // Create a grocery list item
  function createGroceryListItem(groceryItem, isArchived) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <span>${groceryItem.quantity} x ${groceryItem.itemName} (${groceryItem.category}) @ ${groceryItem.location}</span>
      <div>
        <button class="${isArchived ? 'rebuy-grocery' : 'bought-grocery'}">
          ${isArchived ? 'Rebuy' : 'Bought'}
        </button>
        <button class="delete-grocery">Delete</button>
      </div>
    `;

    // Handle bought or rebuy button
    listItem.querySelector(`.${isArchived ? 'rebuy-grocery' : 'bought-grocery'}`).addEventListener('click', function () {
      groceryItem.completed = !isArchived;
      updateGroceryInLocalStorage(groceryItem);

      listItem.remove();
      groceryItem.completed ? addGroceryToArchive(groceryItem) : addGroceryToList(groceryItem);
    });

    // Handle delete button
    listItem.querySelector('.delete-grocery').addEventListener('click', function () {
      listItem.remove();
      deleteFromLocalStorage('groceries', groceryItem);
    });

    return listItem;
  }
}

// Utility Functions
function loadFromLocalStorage(key, defaultValue) {
  try {
    return JSON.parse(localStorage.getItem(key)) || defaultValue;
  } catch (e) {
    console.error(`Error loading key "${key}" from localStorage`, e);
    return defaultValue;
  }
}

function saveToLocalStorage(key, item) {
  const items = loadFromLocalStorage(key, []);
  items.push(item);
  localStorage.setItem(key, JSON.stringify(items));
}

function deleteFromLocalStorage(key, itemToDelete) {
  const items = loadFromLocalStorage(key, []);
  const updatedItems = items.filter(item => JSON.stringify(item) !== JSON.stringify(itemToDelete));
  localStorage.setItem(key, JSON.stringify(updatedItems));
}

function updateGroceryInLocalStorage(updatedItem) {
  const groceries = loadFromLocalStorage('groceries', []);
  const updatedGroceries = groceries.map(item =>
    JSON.stringify(item) === JSON.stringify(updatedItem) ? updatedItem : item
  );
  localStorage.setItem('groceries', JSON.stringify(updatedGroceries));
}