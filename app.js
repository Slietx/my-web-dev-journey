// 1. Select the HTML elements we need to interact with
const taskInput = document.getElementById('task-input');
const taskDeadline = document.getElementById('task-deadline');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const themeToggle = document.getElementById('theme-toggle');

// 2. Load saved tasks and theme preference from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const savedTheme = localStorage.getItem('theme');

// Apply saved theme on page load
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggle.textContent = '☀️'; // Switch toggle symbol to Sun
} else {
    themeToggle.textContent = '🌙'; // Keep toggle symbol as Moon
}

// Set up the theme toggle click behavior
themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
});

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
        
        // Add the main task text node
        const textNode = document.createTextNode(task.text);
        span.appendChild(textNode);

        // Create a horizontal container for metadata badges
        const metaContainer = document.createElement('div');
        metaContainer.className = 'task-meta';

        // A) Create the 'Created Date' tag
        const createdTag = document.createElement('span');
        createdTag.className = 'created-date-tag';
        // Provide a fallback date if checking old tasks created before this feature
        const dateToShow = task.createdDate || 'Added: Previously';
        createdTag.textContent = `Added: ${dateToShow}`;
        metaContainer.appendChild(createdTag);

        // B) Create the 'Deadline' tag if one exists
        if (task.deadline) {
            const deadlineTag = document.createElement('span');
            deadlineTag.className = 'task-deadline-tag';
            deadlineTag.textContent = `Due: ${task.deadline}`;
            metaContainer.appendChild(deadlineTag);
        }

        // Put our meta tags under the main task text
        span.appendChild(metaContainer);

        // When the user clicks the task text, toggle the completed state
        span.addEventListener('click', () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks(); // Redraw the updated list
        });

        // Create the 'Delete' button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';

        // When the user clicks 'Delete', remove the task from our array
        deleteBtn.addEventListener('click', () => {
            tasks.splice(index, 1);
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

    // Capture current date in a short human-readable layout (e.g., "Sep 3, 2026")
    const today = new Date();
    const formattedCreatedDate = today.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });

    // Create a new task object with our new createdDate property!
    const newTask = {
        text: taskText,
        deadline: deadlineText,
        createdDate: formattedCreatedDate,
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