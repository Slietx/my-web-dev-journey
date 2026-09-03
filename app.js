// 1. Select the HTML elements we need to interact with
const taskInput = document.getElementById('task-input');
const taskDeadline = document.getElementById('task-deadline');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const themeToggle = document.getElementById('theme-toggle');

// Selecting New Elements for Progress and Filters
const progressText = document.getElementById('progress-text');
const progressBarFill = document.getElementById('progress-bar-fill');
const filterBtns = document.querySelectorAll('.filter-btn');

// 2. Load saved tasks and theme preference from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const savedTheme = localStorage.getItem('theme');
let currentFilter = 'all'; // Default active filter

// Apply saved theme on page load
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggle.textContent = '☀️';
} else {
    themeToggle.textContent = '🌙';
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

// NEW FUNCTION: Calculate stats and update progress bar
function updateProgressBar() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    
    // Update text counter
    if (totalTasks === 0) {
        progressText.textContent = "No tasks yet! Add one below.";
        progressBarFill.style.width = '0%';
    } else {
        const percentage = Math.round((completedTasks / totalTasks) * 100);
        progressText.textContent = `${completedTasks} of ${totalTasks} tasks completed (${percentage}%)`;
        progressBarFill.style.width = `${percentage}%`;
    }
}

// 4. Function to render (draw) the tasks on the screen
function renderTasks() {
    // A) Clear the current list in HTML so we don't get duplicates
    taskList.innerHTML = '';

    // B) Calculate the overall stats BEFORE we filter the visual view
    updateProgressBar();

    // C) Filter our tasks based on the active button
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true; // 'all'
    });

    // D) Loop through our filtered array and build the HTML for each task
    filteredTasks.forEach((task) => {
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

        // Create the 'Created Date' tag
        const createdTag = document.createElement('span');
        createdTag.className = 'created-date-tag';
        const dateToShow = task.createdDate || 'Added: Previously';
        createdTag.textContent = `Added: ${dateToShow}`;
        metaContainer.appendChild(createdTag);

        // Create the 'Deadline' tag if one exists
        if (task.deadline) {
            const deadlineTag = document.createElement('span');
            deadlineTag.className = 'task-deadline-tag';
            deadlineTag.textContent = `Due: ${task.deadline}`;
            metaContainer.appendChild(deadlineTag);
        }

        // Put our meta tags under the main task text
        span.appendChild(metaContainer);

        // When clicked, toggle the completed status
        span.addEventListener('click', () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks(); // Redraw
        });

        // Create the 'Delete' button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';

        // When clicked, delete by finding the actual object in our original tasks array
        deleteBtn.addEventListener('click', () => {
            const originalIndex = tasks.indexOf(task);
            if (originalIndex > -1) {
                tasks.splice(originalIndex, 1);
                saveTasks();
                renderTasks(); // Redraw
            }
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

    if (taskText === '') {
        alert('Please enter a task first!');
        return;
    }

    const today = new Date();
    const formattedCreatedDate = today.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });

    const newTask = {
        text: taskText,
        deadline: deadlineText,
        createdDate: formattedCreatedDate,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    // Clear input fields
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

// NEW: Event Listeners for Filter Buttons
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove 'active' class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        
        // Add 'active' class to the clicked button
        btn.classList.add('active');
        
        // Set the active filter and redraw the tasks
        currentFilter = btn.getAttribute('data-filter');
        renderTasks();
    });
});

// 7. Render tasks automatically when the page first loads
renderTasks();
