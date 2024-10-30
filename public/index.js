//SqlLite clientInformation
//sqlite> PRAGMA table_info(todos);
//0|id|INTEGER|0||1
//1|item|TEXT|0||0
//2|completed|BOOLEAN|0||0
//3|user_id|INTEGER|0||0

//strikethrough function

//10/28 new errors identified:

//continue to work on delete effect and making sure that it's being processed on the back end
//note that the delete route IS WORKING PROPERLY
//continue to work on strikethrough effect. May need to dive into react state


"use strict";
const addBtn = document.getElementById("addBtn");
const parentElement = document.getElementById("todoelement");
let textOnList = document.getElementById("inputBox");

//getInput function stores the value enterred in input area in a variable called
//inputted and also listens for keystroke Enter. When that happens, it should run
//the function called addItem(inputted). This function takes
function getInput() {
  //add an event listener to the inputBox when the enter button is pressed
  textOnList.addEventListener("keydown", function (event) {
    //This stores the value in a variable
    const inputted = this.value; // Trim whitespace
    // Check if the pressed key is 'Enter'
    if (event.key === "Enter" && inputted) {
      addItem(inputted);
      this.value = "";
      console.log("added text");

      // return inputted;
    }
  });
}

//The getInput function is called when this button is clicked.

addBtn.addEventListener("click", function () {
  const inputted = textOnList.value; // Get trimmed input value
  if (inputted) {
    addItem(inputted); // Call addItem with the input value
    textOnList.value = ""; // Clear input field
  }
});

function addItem(itemAdded, id) {
  if (!itemAdded) return;


  //Send the new item to the server
  fetch('/add', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ item: itemAdded })
})
.then(response => response.json())
.then(data => {

  let newElement = document.createElement("li");
  newElement.style.display = "flex";
  newElement.style.alignItems = "center";
  newElement.dataset.id = id; // Store the item's ID in the element

  const isCompleted = false; // For new items
  newElement.innerHTML = `
    <input type="checkbox" class="checkBox" ${isCompleted ? "checked" : ""}>
        <p class="textOnList" style="text-decoration: ${isCompleted ? "line-through" : "none"}; 
           color: ${isCompleted ? "gray" : "black"}">${itemAdded}</p>
        <button class="delete" data-id="${id}">-</button>
    `;
  parentElement.appendChild(newElement);
  // Call to update listeners for new checkboxes
//   setupCheckboxListeners();

  console.log("Item added with ID:", data.id);
})
.catch(error => {
    console.error('Error adding item:', error);
}
  // setupDeleteButtonListeners();
)};

// Add event listener to all checkboxes
// function setupCheckboxListeners() {
//   const checkboxes = document.querySelectorAll(".checkBox");
//   checkboxes.forEach((checkbox) => {
//     // Remove any existing listeners
//     checkbox.removeEventListener("change", checkboxChangeHandler);
//     // Add new listener
//     checkbox.addEventListener("change", checkboxChangeHandler);
//   });

//   function checkboxChangeHandler(event) {
//     const todoItem = event.target.closest("li");
//     const todoId = todoItem.dataset.id;
//     const completed = event.target.checked;

    // Update UI immediately
    // strikethrough(event.target);

    // Send PUT request to update completion status in the database
    fetch(`/todo/${todoId}/toggle`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    })
      .then((response) => {
        if (response.ok) {
          throw new Error("Failed to update completion status");
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Error:", error);
        // Revert UI change if server update failed
        event.target.checked = !completed;
        strikethrough(event.target);
      });
  

  // Setup listeners for delete buttons
//   function setupDeleteButtonListeners() {
//     const deleteButtons = document.querySelectorAll(".delete");
//     deleteButtons.forEach((button) => {
//       button.addEventListener("click", function (event) { 
//       const id = 

// console.log('button was clicked"')
//      })})};



// const deleteButtons = document.querySelectorAll(".delete");

// for (let i = 0; i < deleteButtons.length; i++) {
//     const deleted = deleteButtons[i];
//     deleted.addEventListener("click", deleteFunction)
//}
const deleteButtons = document.querySelectorAll(".delete");
deleteButtons.forEach(button => {
    button.addEventListener("click", deleteFunction);
});

function deleteFunction (event){

    console.log("this button was clicked");
    console.log(event.currentTarget);
        
}









//         fetch(`/delete/${id}`, {
//           method: "DELETE",
//         })
//           .then((response) => response.json())
//           .then((data) => {
//             if (data.success) {
//               const todoItem = event.currentTarget.closest("li"); // Use closest to find the <li>
//               if (todoItem) {
//                 todoItem.remove(); // Remove the entire todo item (li)
//               } else {
//                 console.error("Todo item not found in DOM.");
//               }
//             } else {
//               console.error("Error deleting todo item:", data.message);
//             }
//           })
//           .catch((err) => console.error("Error:", err));
//       });
//     });
//   }

  // Get the ID from the button's dataset or from a parent element (like li)

  // Optional: Send a DELETE request to the server

  //Delete Function

  // const deleteFunction = () => {
  // app
  // };

  let inputted = "";
  //Modal
  // Get the modal
  var modal = document.getElementById("id01");

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // This function creates a strikethrough in the text once clicked
  function strikethrough(checkBox) {
    const currentText = checkBox.nextElementSibling; // The text element after the checkbox
    if (checkBox.checked) {
      currentText.style.textDecoration = "line-through";
      currentText.style.color = "gray";
    } else {
      currentText.style.textDecoration = "none";
      currentText.style.color = "black";
    }
  }

  // Call this function to initialize listeners on page load
  getInput();

// const text = document.getElementsByClassName("textOnList");
// const checkBox = document.getElementsByClassName("checkBox");
// for (let i = 0; i < checkBox.length; i++) {
//     const currentText = text[i];
//     const currentCheckBox = checkBox[i];
//     if (currentCheckBox.checked){
//         currentText.style.textDecoration = "line-through";
//         currentText.style.color = "gray";
//     } else {
//         currentText.style.textDecoration = "none";
//         currentText.style.color = "black";
//     }
// }

// Assuming you're using Express and have a database instance called `db`

function checkIds() {
  const todos = document.querySelectorAll("#todoelement li");
  todos.forEach((todo) => {
    const text = todo.querySelector(".textOnList").textContent;
    console.log(`Todo: "${text}" has ID: ${todo.dataset.id}`);
  });
}
