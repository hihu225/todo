document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const errorMessage = document.getElementById('errorMessage');
    const totalTasksElement = document.getElementById('totalTasks');
    const completedTasksElement = document.getElementById('completedTasks');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');

    // Modal Elements
    const editModal = document.getElementById('editModal');
    const deleteModal = document.getElementById('deleteModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const closeModalBtn = document.querySelector('.close-btn');
    const editTaskInput = document.getElementById('editTaskInput');
    const saveEditBtn = document.getElementById('saveEditBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

    // State
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let taskToEditIndex = null;
    let taskToDeleteIndex = null;

    // Functions

    const updateLocalStorage = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    const updateTaskCounters = () => {
        totalTasksElement.textContent = tasks.length;
        const completedCount = tasks.filter(task => task.completed).length;
        completedTasksElement.textContent = completedCount;
    };

    const renderTasks = () => {
        taskList.innerHTML = '';
        if (tasks.length === 0) {
            taskList.innerHTML = '<p class="no-tasks-message">Your to-do list is empty!</p>';
        } else {
            tasks.forEach((task, index) => {
                const taskItem = document.createElement('li');
                taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
                
                taskItem.innerHTML = `
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-index="${index}">
                    <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                    <div class="task-actions">
                        <button class="edit-btn" data-index="${index}"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                taskList.appendChild(taskItem);
            });
        }
        updateTaskCounters();
    };

    const addTask = (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        
        if (taskText === '') {
            errorMessage.textContent = 'Please enter a task.';
            return;
        }
        
        errorMessage.textContent = '';
        tasks.push({ text: taskText, completed: false });
        taskInput.value = '';
        updateLocalStorage();
    };

    const handleTaskListClick = (e) => {
        const index = e.target.closest('button')?.dataset.index || e.target.dataset.index;

        if (e.target.matches('.task-checkbox')) {
            toggleTaskComplete(index);
        }
        if (e.target.closest('.edit-btn')) {
            openEditModal(index);
        }
        if (e.target.closest('.delete-btn')) {
            openDeleteModal(index);
        }
    };
    
    const toggleTaskComplete = (index) => {
        tasks[index].completed = !tasks[index].completed;
        updateLocalStorage();
    };

    // Modal Handling
    const openEditModal = (index) => {
        taskToEditIndex = index;
        editTaskInput.value = tasks[index].text;
        editModal.style.display = 'flex';
        modalBackdrop.style.display = 'block';
    };

    const openDeleteModal = (index) => {
        taskToDeleteIndex = index;
        deleteModal.style.display = 'flex';
        modalBackdrop.style.display = 'block';
    };

    const closeModal = () => {
        editModal.style.display = 'none';
        deleteModal.style.display = 'none';
        modalBackdrop.style.display = 'none';
    };

    const saveTask = () => {
        const newTaskText = editTaskInput.value.trim();
        if (newTaskText) {
            tasks[taskToEditIndex].text = newTaskText;
            updateLocalStorage();
            closeModal();
        } else {
            alert('Task cannot be empty!');
        }
    };

    const deleteTask = () => {
        tasks.splice(taskToDeleteIndex, 1);
        updateLocalStorage();
        closeModal();
    };

    const clearCompletedTasks = () => {
        tasks = tasks.filter(task => !task.completed);
        updateLocalStorage();
    };

    // Event Listeners
    taskForm.addEventListener('submit', addTask);
    taskList.addEventListener('click', handleTaskListClick);
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);

    // Modal Listeners
    closeModalBtn.addEventListener('click', closeModal);
    saveEditBtn.addEventListener('click', saveTask);
    confirmDeleteBtn.addEventListener('click', deleteTask);
    cancelDeleteBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Initial Render
    renderTasks();
});