// 1. Select the HTML elements we need to interact with
const taskInput = document.getElementById('task-input');
const taskDeadline = document.getElementById('task-deadline');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

// 2. Load tasks from localStorage (or start with an empty array if none exist)
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// 3. Function to save the tasks array to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 4. Function to render (draw) the tasks on the screen
function renderTasks() {
    // Clear the current list in HTML so we don't get duplicates
    taskList.innerHTML = '';

    // Loop through our tasks array and build the HTML for each task
    tasks.forEach((task, index) => {
        // Create the <li> element
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.completed) {
            li.classList.add('completed');
        }

        // Create a <span> to hold the task's text
        const span = document.createElement('span');
        span.textContent = task.text;

        // If the task has a deadline, build and attach the badge
        if (task.deadline) {
            const deadlineTag = document.createElement('span');
            deadlineTag.className = 'task-deadline-tag';
            deadlineTag.textContent = `Due: ${task.deadline}`;
            span.appendChild(deadlineTag);
        }

        // When the user clicks the task text, toggle the completed state
        span.addEventListener('click', () => {
            tasks[index].completed = !tasks[index].completed; // Switch true to false, or false to true
            saveTasks();
            renderTasks(); // Redraw the updated list
        });

        // Create the 'Delete' button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';

        // When the user clicks 'Delete', remove the task from our array
        deleteBtn.addEventListener('click', () => {
            tasks.splice(index, 1); // Remove 1 item at the current position
            saveTasks();
            renderTasks(); // Redraw the updated list
        });

        // Assemble the list item and insert it into the <ul>
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// 5. Define the function to add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    const deadlineText = taskDeadline.value;

    // Check if the input is empty
    if (taskText === '') {
        alert('Please enter a task first!');
        return;
    }

    // Create a new task object
    const newTask = {
        text: taskText,
        deadline: deadlineText,
        completed: false
    };

    // Add our new task object to the array
    tasks.push(newTask);

    // Save to localStorage and redraw the list
    saveTasks();
    renderTasks();

    // Clear the input fields and return focus to the text input
    taskInput.value = '';
    taskDeadline.value = '';
    taskInput.focus();
}

// 6. Set up event listeners for user interactions
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});

// 7. Render tasks automatically when the page first loads
renderTasks();