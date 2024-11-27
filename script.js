document.addEventListener('DOMContentLoaded', function () {
  // Initialize all modules
  initializeModules();
});

// Initialize all modules
function initializeModules() {
  habitTrackerModule();
  mealsModule();
  themeToggleModule();
  groceryModule();
}

// Habit Tracker Module
function habitTrackerModule() {
  const habitForm = document.getElementById('habit-form');
  const habitTable = document.querySelector('#habit-table tbody');

  if (!habitForm) return;

  // Load habits from localStorage
  const habits = loadFromLocalStorage('habits', []);
  habits.forEach(addHabitToTable);

  // Handle form submission
  habitForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const habit = getFormData(habitForm, ['habit-title', 'habit-date', 'habit-time', 'habit-comment']);
    if (!habit.title || !habit.date || !habit.time) {
      alert('Please fill out all required fields.');
      return;
    }
    saveToLocalStorage('habits', habit);
    addHabitToTable(habit);
    habitForm.reset();
  });

  // Add a habit to the table
  function addHabitToTable(habit) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${habit.title}</td>
      <td>${habit.date}</td>
      <td>${habit.time}</td>
      <td>${habit.comment || 'N/A'}</td>
      <td><button class="delete-btn">Delete</button></td>
    `;
    habitTable.appendChild(row);

    row.querySelector('.delete-btn').addEventListener('click', function () {
      row.remove();
      deleteFromLocalStorage('habits', habit);
    });
  }
}

// Meals Module
function mealsModule() {
  const mealsForm = document.getElementById('meals-form');
  const mealsList = document.getElementById('meals-list');

  if (!mealsForm) return;

  // Load meals from localStorage
  const meals = loadFromLocalStorage('meals', []);
  meals.forEach(addMealToList);

  // Handle form submission
  mealsForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get meal data directly using specific IDs
    const mealInput = document.getElementById('meal-input').value.trim();
    const mealDay = document.getElementById('meal-day').value;

    if (!mealInput || !mealDay) {
      alert('Please fill out all fields.');
      return;
    }

    const meal = {
      name: mealInput,
      day: mealDay,
    };

    saveToLocalStorage('meals', meal);
    addMealToList(meal);
    mealsForm.reset();
  });

  // Add meal to the list
  function addMealToList(meal) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <span>${meal.day}: ${meal.name}</span>
      <button class="delete-meal">Delete</button>
    `;
    mealsList.appendChild(listItem);

    listItem.querySelector('.delete-meal').addEventListener('click', function () {
      listItem.remove();
      deleteFromLocalStorage('meals', meal);
    });
  }
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

  // Set theme based on time or saved preference
  function setThemeBasedOnTime() {
    const currentHour = new Date().getHours();
    const defaultTheme = currentHour >= 6 && currentHour < 18 ? 'light' : 'dark';
    const savedTheme = localStorage.getItem('theme') || defaultTheme;
    applyTheme(savedTheme);
  }

  setThemeBasedOnTime();

  // Toggle theme manually
  themeToggleButton.addEventListener('click', function () {
    const currentTheme = document.body.getAttribute('data-theme');
    applyTheme(currentTheme === 'light' ? 'dark' : 'light');
  });
}

// Grocery Module
function groceryModule() {
  const groceryForm = document.getElementById('grocery-form');
  const groceryList = document.getElementById('grocery-list');

  if (!groceryForm) return;

  // Load groceries from localStorage
  const groceries = loadFromLocalStorage('groceries', []);
  groceries.forEach(addGroceryToList);

  // Handle form submission
  groceryForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get grocery data directly using specific IDs
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
    };

    saveToLocalStorage('groceries', groceryItem);
    addGroceryToList(groceryItem);
    groceryForm.reset();
  });

  // Add grocery to the list
  function addGroceryToList(groceryItem) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <span>${groceryItem.quantity} x ${groceryItem.itemName} (${groceryItem.category}) @ ${groceryItem.location}</span>
      <button class="delete-grocery">Delete</button>
    `;
    groceryList.appendChild(listItem);

    listItem.querySelector('.delete-grocery').addEventListener('click', function () {
      listItem.remove();
      deleteFromLocalStorage('groceries', groceryItem);
    });
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

function getFormData(form, fields) {
  const data = {};
  fields.forEach(field => {
    const element = form.querySelector(`#${field}`);
    data[field.replace('-', '_')] = element ? element.value.trim() : '';
  });
  return data;
}
function taskModule() {
  const taskForm = document.getElementById('task-form');
  const tasksEllie = document.getElementById('tasks-ellie');
  const tasksAlexie = document.getElementById('tasks-alexie');

  if (!taskForm) return;

  // Load tasks from localStorage
  const tasks = loadFromLocalStorage('tasks', []);
  tasks.forEach(addTaskToList);

  // Handle form submission
  taskForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get task data directly using specific IDs
    const taskTitle = document.getElementById('task-title').value.trim();
    const taskAssignedTo = document.getElementById('task-assigned-to').value;
    const taskReward = document.getElementById('task-reward').value.trim();

    if (!taskTitle || !taskAssignedTo || !taskReward) {
      alert('Please fill out all fields.');
      return;
    }

    // Create the task object
    const task = {
      title: taskTitle,
      assignedTo: taskAssignedTo,
      reward: `$${taskReward}`,
      completed: false,
    };

    // Save the task to localStorage
    saveToLocalStorage('tasks', task);

    // Add the task to the list
    addTaskToList(task);

    // Reset the form
    taskForm.reset();
  });

  // Add a task to the appropriate list
  function addTaskToList(task) {
    const taskList = task.assignedTo === 'Éllie' ? tasksEllie : tasksAlexie;

    const listItem = document.createElement('li');
    listItem.classList.toggle('completed', task.completed); // Add 'completed' class if task is done

    listItem.innerHTML = `
      <span>${task.title} - ${task.reward}</span>
      <div>
        <input type="checkbox" ${task.completed ? 'checked' : ''}>
        <button>Delete</button>
      </div>
    `;

    // Add checkbox toggle functionality
    listItem.querySelector('input[type="checkbox"]').addEventListener('change', function () {
      task.completed = this.checked;
      listItem.classList.toggle('completed', task.completed);
      updateTaskInLocalStorage(task);
    });

    // Add delete button functionality
    listItem.querySelector('button').addEventListener('click', function () {
      listItem.remove();
      deleteFromLocalStorage('tasks', task);
    });

    taskList.appendChild(listItem);
  }
}
// Load items from localStorage
function loadFromLocalStorage(key, defaultValue) {
  try {
    return JSON.parse(localStorage.getItem(key)) || defaultValue;
  } catch (e) {
    console.error(`Error loading key "${key}" from localStorage`, e);
    return defaultValue;
  }
}

// Save item to localStorage
function saveToLocalStorage(key, item) {
  const items = loadFromLocalStorage(key, []);
  items.push(item);
  localStorage.setItem(key, JSON.stringify(items));
}

// Delete item from localStorage
function deleteFromLocalStorage(key, itemToDelete) {
  const items = loadFromLocalStorage(key, []);
  const updatedItems = items.filter(item => JSON.stringify(item) !== JSON.stringify(itemToDelete));
  localStorage.setItem(key, JSON.stringify(updatedItems));
}

// Update task in localStorage
function updateTaskInLocalStorage(updatedTask) {
  const tasks = loadFromLocalStorage('tasks', []);
  const updatedTasks = tasks.map(task =>
    JSON.stringify(task) === JSON.stringify(updatedTask) ? updatedTask : task
  );
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}
document.addEventListener('DOMContentLoaded', function () {
  // Initialize all modules
  initializeModules();
  initializeClock(); // Add clock initialization
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