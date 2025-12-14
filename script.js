import {
    createTask,
    addTaskToArray,
    deleteTaskAt,
    toggleCompleteAt,
    sortTasks,
    filterTasks,
    saveTasks as saveTasksToStorage,
    loadTasks as loadTasksFromStorage,
} from './tasks.js';

let tasks = [];
let sortMethod = 'created';
let filterMethod = 'all';

function saveTasks() {
    return saveTasksToStorage(tasks);
}

function loadTasks() {
    tasks = loadTasksFromStorage();
}

function renderTasks() {
    const ul = document.getElementById('taskList');
    ul.innerHTML = '';

    // apply filter and sort
    let toRender = filterTasks(tasks, filterMethod);
    toRender = sortTasks(toRender, sortMethod);

    toRender.forEach((task) => {
        const li = document.createElement('li');
        const idx = tasks.findIndex(t => t.id === task.id);
        li.dataset.index = idx;
        li.className = task.completed ? 'completed' : '';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.setAttribute('aria-label', `Mark task ${task.text} as complete`);
        checkbox.addEventListener('change', () => {
            tasks = toggleCompleteAt(tasks, idx);
            saveTasks();
            renderTasks();
        });

        const textWrap = document.createElement('div');
        textWrap.className = 'task-wrapper';

        const span = document.createElement('span');
        span.textContent = task.text;
        span.className = 'task-text';

        const meta = document.createElement('span');
        meta.className = 'task-meta';
        let metaParts = [];
        if (task.dueDate) metaParts.push(`Due: ${task.dueDate}`);
        if (task.priority) metaParts.push(`Priority: ${task.priority}`);
        meta.textContent = metaParts.join(' • ');

        textWrap.appendChild(span);
        textWrap.appendChild(meta);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete';
        deleteBtn.textContent = '×';
        deleteBtn.title = 'Delete task';
        deleteBtn.addEventListener('click', () => {
            tasks = deleteTaskAt(tasks, idx);
            saveTasks();
            renderTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(textWrap);
        li.appendChild(deleteBtn);
        ul.appendChild(li);
    });
}

function addTaskHandler() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();
    if (taskText === '') {
        alert('Please enter a task');
        return;
    }
    const priority = document.getElementById('prioritySelect').value;
    const dueDate = document.getElementById('dueDateInput').value || null;
    const task = createTask(taskText, priority, dueDate);
    tasks = addTaskToArray(tasks, task);
    saveTasks();
    renderTasks();
    input.value = '';
    input.focus();
}

function clearAll() {
    if (!tasks.length) return;
    if (!confirm('Clear all tasks?')) return;
    tasks = [];
    saveTasks();
    renderTasks();
}

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();

    const input = document.getElementById('taskInput');
    const addButton = document.getElementById('addButton');
    const clearAllButton = document.getElementById('clearAllButton');
    const sortSelect = document.getElementById('sortSelect');
    const filterSelect = document.getElementById('filterSelect');

    addButton.addEventListener('click', addTaskHandler);
    clearAllButton.addEventListener('click', clearAll);

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addTaskHandler();
    });

    sortSelect.addEventListener('change', (e) => {
        sortMethod = e.target.value;
        renderTasks();
    });

    filterSelect.addEventListener('change', (e) => {
        filterMethod = e.target.value;
        renderTasks();
    });
});