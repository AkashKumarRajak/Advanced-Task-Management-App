document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromLocalStorage(); // Load tasks from Local Storage
    const addTaskBtn = document.getElementById('addTaskBtn');
    addTaskBtn.addEventListener('click', addTask);

    const filters = document.querySelectorAll('.task-filters button');
    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            const filterType = filter.id;
            filterTasks(filterType);
        });
    });
});

let tasks = [];

// Load tasks from Local Storage
const loadTasksFromLocalStorage = () => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
};

// Save tasks to Local Storage
const saveTasksToLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Render tasks
const renderTasks = () => {
    const taskContainer = document.getElementById('taskContainer');
    taskContainer.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskElement = document.createElement('li');
        taskElement.classList.add('task-item');
        taskElement.setAttribute('draggable', 'true');
        taskElement.dataset.index = index;
        taskElement.innerHTML = `
            <div class="task-details">
                <span class="task-title">${task.title}</span>
                <span class="task-deadline">${task.deadline}</span>
            </div>
            <span class="task-priority ${task.priority}">${task.priority}</span>
        `;
        taskElement.addEventListener('dragstart', handleDragStart);
        taskElement.addEventListener('dragover', handleDragOver);
        taskElement.addEventListener('drop', handleDrop);
        taskContainer.appendChild(taskElement);
    });
};

// Add a new task
const addTask = () => {
    const title = document.getElementById('taskInput').value.trim();
    if (title) {
        const deadline = prompt('Enter deadline (YYYY-MM-DD):');
        const priority = prompt('Enter priority (high, medium, low):').toLowerCase();
        tasks.push({ title, deadline, priority });
        document.getElementById('taskInput').value = '';
        saveTasksToLocalStorage();
        renderTasks();
    }
};

// Handle drag start
const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', e.target.dataset.index);
};

// Handle drag over
const handleDragOver = (e) => {
    e.preventDefault();
};

// Handle drop
const handleDrop = (e) => {
    e.preventDefault();
    const fromIndex = e.dataTransfer.getData('text/plain');
    const toIndex = e.target.dataset.index;
    if (fromIndex !== toIndex) {
        const movedTask = tasks[fromIndex];
        tasks.splice(fromIndex, 1);
        tasks.splice(toIndex, 0, movedTask);
        saveTasksToLocalStorage();
        renderTasks();
    }
};

// Filter tasks based on priority
const filterTasks = (filterType) => {
    const taskContainer = document.getElementById('taskContainer');
    taskContainer.innerHTML = '';
    const filteredTasks = filterType === 'allTasks' ? tasks : tasks.filter(task => task.priority === filterType.replace('Priority', '').toLowerCase());
    filteredTasks.forEach((task, index) => {
        const taskElement = document.createElement('li');
        taskElement.classList.add('task-item');
        taskElement.setAttribute('draggable', 'true');
        taskElement.dataset.index = index;
        taskElement.innerHTML = `
            <div class="task-details">
                <span class="task-title">${task.title}</span>
                <span class="task-deadline">${task.deadline}</span>
            </div>
            <span class="task-priority ${task.priority}">${task.priority}</span>
        `;
        taskElement.addEventListener('dragstart', handleDragStart);
        taskElement.addEventListener('dragover', handleDragOver);
        taskElement.addEventListener('drop', handleDrop);
        taskContainer.appendChild(taskElement);
    });
};
