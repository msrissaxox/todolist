//When I input text and click add, it would save it 
//locally and to the site

//Variables

//This is the variable storing the button element.

//map of functions
//getInput();
//This function adds an event listener to the input Box. 
//variable called inputted is redeclared as the value of what is in the input box
// and then listens for keystroke Enter. When that happens, it should run 
//the function called addItem(inputted). This function takes the value of inputted and 
//runs the function that adds item. Then, we turn the value of the text to '' and return
//the inputted variable value

// function getInput(){
//
//     document.getElementById("inputBox").addEventListener("keydown", function(event) {
//       
//         inputted = document.getElementById("inputBox").value;
//       
//         if (event.key === 'Enter'){
//         addItem(inputted);
// textOnList.value = "";
// return inputted;
//         }})};

//addItem function 

// function addItem(itemAdded){
//     let newElement = document.createElement("li");
//     newElement.style.display = "flex";  // This ensures the children of the <li> are inline like flex items
//     newElement.style.alignItems = "center";  // Centers items vertically
//     newElement.innerHTML = `<input type="checkbox" class="checkBox"><p class="textOnList">${itemAdded}</p>`
//     parentElement.appendChild(newElement);
//     console.log(newElement.textContent);
//     //Add strikethrough to each item added
//     newElement.addEventListener("click", strikethrough);
//  }

//takes an input that is used in the function
//Creates a new li element 
//Gives this element a flexbox and sets it center
//Set the inner HTML to give this element a checkbox, and p element. inside the P, we put the variable from itemAdded
//itemAdded is the input for this function
//this input would need to be the variable that stores the value of the inputted text.
//This is from the getInput function. 



//strikethrough function

const addBtn = document.getElementById("addBtn");
const parentElement = document.getElementById("todoelement");
// let eachItem = document.getElementsByClassName("eachItem");
let textOnList = document.getElementById("inputBox");

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
function addItem(itemAdded){
    if (!itemAdded) return;

    let newElement = document.createElement("li");
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

