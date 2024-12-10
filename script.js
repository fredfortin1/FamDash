// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAASy_RNNlpPMGiFYDEaYGppMAVpUYBRL8",
  authDomain: "db---dashboard-famille.firebaseapp.com",
  databaseURL: "https://db---dashboard-famille-default-rtdb.firebaseio.com",
  projectId: "db---dashboard-famille",
  storageBucket: "db---dashboard-famille.firebasestorage.app",
  messagingSenderId: "1042615306170",
  appId: "1:1042615306170:web:2e17ef57dc964f6e537f83",
  measurementId: "G-7TBK3PMXVG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Test writing data to Firebase
const testRef = database.ref('test/');
testRef.set({ message: "Hello Firebase" }, (error) => {
  if (error) {
    console.error("Error writing to database:", error);
  } else {
    console.log("Data written successfully.");
  }
});
// Initialize all modules when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  initializeModules();
  loadTasksFromFirebase();
  loadGroceriesFromFirebase();
  loadMealsFromFirebase();
  initializeClock();
});

// **Task Module**
function saveTaskToFirebase(task) {
  const tasksRef = database.ref("tasks/");
  tasksRef.push(task, (error) => {
    if (error) {
      console.error("Error saving task:", error);
    } else {
      console.log("Task saved successfully!");
    }
  });
}

function loadTasksFromFirebase() {
  const tasksRef = database.ref("tasks/");
  tasksRef.on("value", (snapshot) => {
    const tasks = snapshot.val();
    if (tasks) {
      document.getElementById("tasks-ellie").innerHTML = "";
      document.getElementById("tasks-alexie").innerHTML = "";

      Object.values(tasks).forEach((task) => addTaskToList(task));
    }
  });
}

function addTaskToList(task) {
  const list =
    task.task_assigned_to === "Éllie"
      ? document.getElementById("tasks-ellie")
      : document.getElementById("tasks-alexie");

  const listItem = document.createElement("li");
  listItem.innerHTML = `
    ${task.task_title} - $${task.task_reward}
    <button class="delete-task">Delete</button>
  `;
  list.appendChild(listItem);

  listItem.querySelector(".delete-task").addEventListener("click", function () {
    listItem.remove();
    console.log("Task deletion not yet implemented for Firebase.");
  });
}

document.getElementById("task-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const task = {
    task_title: document.getElementById("task-title").value.trim(),
    task_assigned_to: document.getElementById("task-assigned-to").value,
    task_reward: document.getElementById("task-reward").value.trim(),
  };
// Debugging: Log the task object to verify the data
  console.log("Task Submitted:", task);
  
  if (!task.task_title || !task.task_assigned_to || task.task_reward === "") {
    alert("Please fill out all required fields.");
    return;
  }

  saveTaskToFirebase(task);
  document.getElementById("task-form").reset();
});

// **Grocery Module**
function saveGroceryToFirebase(groceryItem) {
  const groceriesRef = database.ref("groceries/");
  groceriesRef.push(groceryItem, (error) => {
    if (error) {
      console.error("Error saving grocery:", error);
    } else {
      console.log("Grocery saved successfully!");
    }
  });
}

function loadGroceriesFromFirebase() {
  const groceriesRef = database.ref("groceries/");
  groceriesRef.on("value", (snapshot) => {
    const groceries = snapshot.val();
    if (groceries) {
      document.getElementById("grocery-list").innerHTML = "";
      document.getElementById("grocery-archive").innerHTML = "";

      Object.values(groceries).forEach((groceryItem) => {
        groceryItem.completed
          ? addGroceryToArchive(groceryItem)
          : addGroceryToList(groceryItem);
      });
    }
  });
}

function addGroceryToList(groceryItem) {
  const listItem = createGroceryListItem(groceryItem, false);
  document.getElementById("grocery-list").appendChild(listItem);
}

function addGroceryToArchive(groceryItem) {
  const listItem = createGroceryListItem(groceryItem, true);
  document.getElementById("grocery-archive").appendChild(listItem);
}

function createGroceryListItem(groceryItem, isArchived) {
  const listItem = document.createElement("li");
  listItem.innerHTML = `
    <span>${groceryItem.quantity} x ${groceryItem.itemName} (${groceryItem.category}) @ ${groceryItem.location}</span>
    <div>
      <button class="${isArchived ? "rebuy-grocery" : "bought-grocery"}">
        ${isArchived ? "Rebuy" : "Bought"}
      </button>
      <button class="delete-grocery">Delete</button>
    </div>
  `;

  listItem.querySelector(`.${isArchived ? "rebuy-grocery" : "bought-grocery"}`).addEventListener("click", function () {
    groceryItem.completed = !isArchived;
    saveGroceryToFirebase(groceryItem); // Save updated state
    listItem.remove();
    groceryItem.completed
      ? addGroceryToArchive(groceryItem)
      : addGroceryToList(groceryItem);
  });

  listItem.querySelector(".delete-grocery").addEventListener("click", function () {
    listItem.remove();
    console.log("Deletion for groceries in Firebase not yet implemented.");
  });

  return listItem;
}

document.getElementById("grocery-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const groceryItem = {
    itemName: document.getElementById("grocery-item").value.trim(),
    quantity: document.getElementById("grocery-quantity").value.trim(),
    location: document.getElementById("grocery-location").value.trim(),
    category: document.getElementById("grocery-category").value,
    completed: false,
  };
 // Debugging: Log the grocery item to verify the data
  console.log("Grocery Item Submitted:", groceryItem);
  
  if (!groceryItem.itemName || !groceryItem.quantity || !groceryItem.location || !groceryItem.category) {
    alert("Please fill out all fields.");
    return;
  }

  saveGroceryToFirebase(groceryItem);
  document.getElementById("grocery-form").reset();
});

// **Meals Module**
function saveMealToFirebase(meal) {
  const mealsRef = database.ref("meals/");
  mealsRef.push(meal, (error) => {
    if (error) {
      console.error("Error saving meal:", error);
    } else {
      console.log("Meal saved successfully!");
    }
  });
}

function loadMealsFromFirebase() {
  const mealsRef = database.ref("meals/");
  mealsRef.on("value", (snapshot) => {
    const meals = snapshot.val();
    if (meals) {
      document.getElementById("meals-list").innerHTML = "";
      Object.values(meals).forEach((meal) => addMealToList(meal));
    }
  });
}

function addMealToList(meal) {
  const listItem = document.createElement("li");
  listItem.textContent = `${meal.day}: ${meal.name}`;
  document.getElementById("meals-list").appendChild(listItem);
}

document.getElementById("meals-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const meal = {
    name: document.getElementById("meal-input").value.trim(),
    day: document.getElementById("meal-day").value,
  };
 // Debugging: Log the meal object to verify the data
  console.log("Meal Submitted:", meal);
  
  if (!meal.name || !meal.day) {
    alert("Please fill out all fields.");
    return;
  }

  saveMealToFirebase(meal);
  document.getElementById("meals-form").reset();
});

// **Clock, Theme, and Utility Functions**
// (These remain unchanged, refer to the previous script for details)
