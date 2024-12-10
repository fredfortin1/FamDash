const airtableApiKey = "patE0muNfUazAzy2b.213d50dd597994c09fae3386d5adf6dcaf15ece626ad694492e8f9782b74854a"; // Your Airtable API key
const baseId = "appXrtBBjZD2b3OQO"; // Your Airtable Base ID
const airtableUrl = `https://api.airtable.com/v0/${baseId}`;

// Helper function to make Airtable API requests
async function airtableRequest(endpoint, method = "GET", body = null) {
  const response = await fetch(`${airtableUrl}/${endpoint}`, {
    method: method,
    headers: {
      Authorization: `Bearer ${airtableApiKey}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    console.error("Airtable API Error:", response.statusText);
    throw new Error(response.statusText);
  }

  return response.json();
}

//
// TASKS MODULE
//

// Add a Task to Airtable
async function addTask(taskTitle, assignedTo, reward) {
  const newTask = {
    fields: {
      "Task Title": taskTitle,
      "Assigned To": assignedTo,
      Reward: parseFloat(reward),
    },
  };

  try {
    const result = await airtableRequest("Tasks", "POST", newTask);
    console.log("Task added:", result);
  } catch (error) {
    console.error("Error adding task:", error);
  }
}

// Fetch and display tasks from Airtable
async function fetchTasks() {
  try {
    const result = await airtableRequest("Tasks", "GET");
    console.log("Tasks:", result.records);

    const ellieTasks = document.getElementById("tasks-ellie");
    const alexieTasks = document.getElementById("tasks-alexie");

    ellieTasks.innerHTML = "";
    alexieTasks.innerHTML = "";

    result.records.forEach((record) => {
      const task = record.fields;
      const list =
        task["Assigned To"] === "Éllie"
          ? ellieTasks
          : alexieTasks; // Extend logic if there are more users

      const listItem = document.createElement("li");
      listItem.textContent = `${task["Task Title"]} - $${task.Reward}`;
      list.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}

// Task form submission handler
document.getElementById("task-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const taskTitle = document.getElementById("task-title").value.trim();
  const assignedTo = document.getElementById("task-assigned-to").value;
  const reward = document.getElementById("task-reward").value.trim();

  if (!taskTitle || !assignedTo || reward === "") {
    alert("Please fill out all required fields.");
    return;
  }

  addTask(taskTitle, assignedTo, reward);
  document.getElementById("task-form").reset();
});

// Load tasks on page load
document.addEventListener("DOMContentLoaded", fetchTasks);

//
// MEALS MODULE
//

// Add a Meal to Airtable
async function addMeal(mealName, day) {
  const newMeal = {
    fields: {
      "Meal Name": mealName,
      Day: day,
    },
  };

  try {
    const result = await airtableRequest("Meals", "POST", newMeal);
    console.log("Meal added:", result);
  } catch (error) {
    console.error("Error adding meal:", error);
  }
}

// Fetch and display meals from Airtable
async function fetchMeals() {
  try {
    const result = await airtableRequest("Meals", "GET");
    console.log("Meals:", result.records);

    const mealsList = document.getElementById("meals-list");
    mealsList.innerHTML = "";

    result.records.forEach((record) => {
      const meal = record.fields;
      const listItem = document.createElement("li");
      listItem.textContent = `${meal["Meal Name"]} - ${meal.Day}`;
      mealsList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error fetching meals:", error);
  }
}

// Meal form submission handler
document.getElementById("meals-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const mealName = document.getElementById("meal-input").value.trim();
  const day = document.getElementById("meal-day").value;

  if (!mealName || !day) {
    alert("Please fill out all required fields.");
    return;
  }

  addMeal(mealName, day);
  document.getElementById("meals-form").reset();
});

// Load meals on page load
document.addEventListener("DOMContentLoaded", fetchMeals);

//
// GROCERY LIST MODULE
//

// Add a Grocery Item to Airtable
async function addGroceryItem(itemName, qty, location, category) {
  const newItem = {
    fields: {
      "Item Name": itemName,
      Qty: parseInt(qty),
      Location: location,
      Category: category,
    },
  };

  try {
    const result = await airtableRequest("Grocery List", "POST", newItem);
    console.log("Grocery item added:", result);
  } catch (error) {
    console.error("Error adding grocery item:", error);
  }
}

// Fetch and display grocery items from Airtable
async function fetchGroceries() {
  try {
    const result = await airtableRequest("Grocery List", "GET");
    console.log("Grocery List:", result.records);

    const groceryList = document.getElementById("grocery-list");
    groceryList.innerHTML = "";

    result.records.forEach((record) => {
      const item = record.fields;
      const listItem = document.createElement("li");
      listItem.textContent = `${item.Qty} x ${item["Item Name"]} (${item.Category}) @ ${item.Location}`;
      groceryList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error fetching grocery items:", error);
  }
}

// Grocery form submission handler
document.getElementById("grocery-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const itemName = document.getElementById("grocery-item").value.trim();
  const qty = document.getElementById("grocery-quantity").value.trim();
  const location = document.getElementById("grocery-location").value.trim();
  const category = document.getElementById("grocery-category").value;

  if (!itemName || !qty || !location || !category) {
    alert("Please fill out all required fields.");
    return;
  }

  addGroceryItem(itemName, qty, location, category);
  document.getElementById("grocery-form").reset();
});

// Load grocery list on page load
document.addEventListener("DOMContentLoaded", fetchGroceries);

// **Clock, Theme, and Utility Functions**
// (These remain unchanged, refer to the previous script for details)
