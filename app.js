// 1. Select the HTML elements we need to interact with
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

// 2. Define the function that adds a new task
function addTask() {
    const taskText = taskInput.value.trim();
    
    // Check if the input is empty
    if (taskText === '') {
        alert('Please enter a task first!');
        return;
    }

    // Create the <li> element that holds our task
    const li = document.createElement('li');
    li.className = 'task-item';

    // Create a <span> to hold the task's text
    const span = document.createElement('span');
    span.textContent = taskText;

    // When the user clicks the task text, toggle the 'completed' line-through style
    span.addEventListener('click', () => {
        li.classList.toggle('completed');
    });

    // Create the 'Delete' button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';

    // When the user clicks 'Delete', remove the entire list item
    deleteBtn.addEventListener('click', () => {
        taskList.removeChild(li);
    });

    // Put the text and the delete button inside our list item
    li.appendChild(span);
    li.appendChild(deleteBtn);

    // Put our completed list item into the <ul> list on the page
    taskList.appendChild(li);

    // Clear the input box and put the cursor back inside it
    taskInput.value = '';
    taskInput.focus();
}

// 3. Listen for the click event on the "Add Task" button
addBtn.addEventListener('click', addTask);

// 4. Also listen for the "Enter" key being pressed inside the input field
taskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});console.log('App Initialized');
