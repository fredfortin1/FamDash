const airtableApiKey = "patE0muNfUazAzy2b.213d50dd597994c09fae3386d5adf6dcaf15ece626ad694492e8f9782b74854a"; // Your Airtable API key
const baseId = "appXrtBBjZD2b3OQO"; // Your Airtable Base ID
const airtableUrl = `https://api.airtable.com/v0/${baseId}`;

// Helper function for making API requests
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
// **Task Module**
async function addTask(taskTitle, assignedTo, reward) {
  const newTask = {
    fields: {
      "Task Title": taskTitle,
      "Assigned To": assignedTo,
      "Reward": parseFloat(reward),
    },
  };

  try {
    const result = await airtableRequest("Tasks", "POST", newTask);
    console.log("Task added:", result);
  } catch (error) {
    console.error("Error adding task:", error);
  }
}

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
      const list = task["Assigned To"] === "Éllie" ? ellieTasks : alexieTasks;

      const listItem = document.createElement("li");
      listItem.textContent = `${task["Task Title"]} - $${task.Reward}`;
      list.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}

// Load tasks on page load
document.addEventListener("DOMContentLoaded", fetchTasks);

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
// **END Task module**

// **Meals Module**
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

// Load meals on page load
document.addEventListener("DOMContentLoaded", fetchMeals);


function addGroceryToList(groceryItem) {
  const listItem = createGroceryListItem(groceryItem, false);
  document.getElementById("grocery-list").appendChild(listItem);
}

function addGroceryToArchive(groceryItem) {
  const listItem = createGroceryListItem(groceryItem, true);
  document.getElementById("grocery-archive").appendChild(listItem);
}

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
// ** END Meals Module **

// ** Grocery Module **
async function addGroceryItem(itemName, quantity, category) {
  const newItem = {
    fields: {
      "Item Name": itemName,
      Quantity: parseInt(quantity),
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

async function fetchGroceries() {
  try {
    const result = await airtableRequest("Grocery List", "GET");
    console.log("Grocery List:", result.records);

    const groceryList = document.getElementById("grocery-list");
    groceryList.innerHTML = "";

    result.records.forEach((record) => {
      const item = record.fields;
      const listItem = document.createElement("li");
      listItem.textContent = `${item["Quantity"]} x ${item["Item Name"]} (${item.Category})`;
      groceryList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error fetching grocery items:", error);
  }
}

// Load grocery list on page load
document.addEventListener("DOMContentLoaded", fetchGroceries);

function addMealToList(meal) {
  const listItem = document.createElement("li");
  listItem.textContent = `${meal.day}: ${meal.name}`;
  document.getElementById("meals-list").appendChild(listItem);
}

document.getElementById("meals-form").addEventListener("submit", function (e) {
  e.preventDefault();

document.getElementById("grocery-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const itemName = document.getElementById("grocery-item").value.trim();
  const quantity = document.getElementById("grocery-quantity").value.trim();
  const category = document.getElementById("grocery-category").value;

  if (!itemName || !quantity || !category) {
    alert("Please fill out all required fields.");
    return;
  }

  addGroceryItem(itemName, quantity, category);
  document.getElementById("grocery-form").reset();
});

// **Clock, Theme, and Utility Functions**
// (These remain unchanged, refer to the previous script for details)
