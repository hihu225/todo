// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const errorMessage = document.getElementById('errorMessage');
const totalTasksElement = document.getElementById('totalTasks');
const completedTasksElement = document.getElementById('completedTasks');

// Initialize tasks array from localStorage or empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Function to update the tasks in localStorage
function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTaskCounters();
}

// Function to update the task counters
function updateTaskCounters() {
    totalTasksElement.textContent = tasks.length;
    const completedCount = tasks.filter(task => task.completed).length;
    completedTasksElement.textContent = completedCount;
}

// Function to render tasks
function renderTasks() {
    taskList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        
        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskComplete(index));
        
        // Create task text
        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;
        if (task.completed) {
            taskText.classList.add('completed');
        }
        
        // Create edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => editTask(index));
        
        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTask(index));
        
        // Create actions container
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'task-actions';
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        
        // Append all elements to task item
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(actionsDiv);
        
        // Append task item to task list
        taskList.appendChild(taskItem);
    });
    
    updateTaskCounters();
}

// Function to add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        errorMessage.textContent = 'Please enter a task';
        return;
    }
    
    errorMessage.textContent = '';
    
    tasks.push({
        text: taskText,
        completed: false
    });
    
    taskInput.value = '';
    updateLocalStorage();
    renderTasks();
}

// Function to toggle task completion status
function toggleTaskComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    updateLocalStorage();
    renderTasks();
}

// Function to edit a task
function editTask(index) {
    const currentTask = tasks[index];
    const newTaskText = prompt('Edit your task:', currentTask.text);
    
    if (newTaskText !== null && newTaskText.trim() !== '') {
        tasks[index].text = newTaskText.trim();
        updateLocalStorage();
        renderTasks();
    } else if (newTaskText !== null) {
        alert('Task cannot be empty!');
    }
}

// Function to delete a task
function deleteTask(index) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks.splice(index, 1);
        updateLocalStorage();
        renderTasks();
    }
}

// Event Listeners
addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initialize the app
renderTasks();