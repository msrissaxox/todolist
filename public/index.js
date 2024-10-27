//SqlLite clientInformation
//sqlite> PRAGMA table_info(todos);
//0|id|INTEGER|0||1
//1|item|TEXT|0||0
//2|completed|BOOLEAN|0||0
//3|user_id|INTEGER|0||0

//strikethrough function

const addBtn = document.getElementById("addBtn");
const parentElement = document.getElementById("todoelement");
// let eachItem = document.getElementsByClassName("eachItem");
let textOnList = document.getElementById("inputBox");

//delete buttons iteration and addEventListener
const deleteButtons = document.querySelectorAll('.delete');

for (let i = 0; i < deleteButtons.length; i++) {
  deleteButtons[i].addEventListener("click", function(){
    console.log('Deleting item with ID:', id);
    console.log("i was clicked");

// Get the ID from the button's dataset or from a parent element (like li)
const id = this.dataset.id; // Assuming the button has a data-id attribute

// Optional: Send a DELETE request to the server


const todoId = req.params.id;
fetch(`/delete/${id}`, {
  method: 'DELETE'
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    // Remove the item from the DOM
    const todoItem = this.closest('li'); // Assuming the button is inside an <li>
    todoItem.remove(); // Remove the entire todo item (li)
  } else {
    console.error('Error deleting todo item:', data.message);
  }
})
.catch(err => console.error('Error:', err));
});
}

//Delete Function

// const deleteFunction = () => {
// app
// };


let inputted = '';
//Modal
// Get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

//getInput function stores the value enterred in input area in a variable called 
//inputted and also listens for keystroke Enter. When that happens, it should run 
//the function called addItem(inputted). This function takes 
function getInput(){
    //add an event listener to the inputBox when the enter button is pressed
    document.getElementById("inputBox").addEventListener("keydown", function(event) {
        //This stores the value in a variable
        const inputted = this.value.trim(); // Trim whitespace
        // Check if the pressed key is 'Enter'
        if (event.key === 'Enter' && inputted){
        addItem(inputted);
    this.value = "";
// return inputted;
        }
    })
};

//This function creates a strikethrough in the text once clicked
function strikethrough(checkBox) {
    const currentText = checkBox.nextElementSibling; // The text element after the checkbox

    // Toggle the strikethrough style based on checkbox state
    if (checkBox.checked) {
        currentText.style.textDecoration = "line-through";
        currentText.style.color = "gray";
    } else {
        currentText.style.textDecoration = "none";
        currentText.style.color = "black";
    }
}

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


//The getInput function is called when this button is clicked. 


addBtn.addEventListener("click", function(){
    const inputted = textOnList.value.trim(); // Get trimmed input value
    addItem(inputted); // Call addItem with the input value
    textOnList.value = ""; // Clear input field
});
    
getInput(); 

//
function addItem(itemAdded, id){
    if (!itemAdded) return;

    let newElement = document.createElement("li");
    newTodoItem.setAttribute('data-id', id); // Assign unique id to each item
    newElement.style.display = "flex";  // This ensures the children of the <li> are inline like flex items
    newElement.style.alignItems = "center";  // Centers items vertically
    newElement.innerHTML = `<input type="checkbox" class="checkBox"><p class="textOnList">${itemAdded}</p>`
    parentElement.appendChild(newElement);

  // Store the item with its initial state (unchecked)
  const itemData = { text: itemAdded, checked: false };

    //Send the to-do item to the server
    fetch('/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item: itemAdded }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Item added to database:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    //Add strikethrough to each item added
    // newElement.addEventListener("click", strikethrough);
    const checkBox = newElement.querySelector('.checkBox');
    checkBox.addEventListener("change", function (){
        strikethrough(checkBox);
        // Update the checked state in the database
        itemData.checked = checkBox.checked;  // Update the local state
        fetch('/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(itemData), // Send updated item state
        })
        .then(response => response.json())
        .then(data => {
            console.log('Item updated in database:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
};


//Will need to implement code so that if nothing is inputted when you press enter
//or add item, nothing happens

