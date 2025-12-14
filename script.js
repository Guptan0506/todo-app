import {
    createTask,
    addTaskToArray,
    deleteTaskAt,
    toggleCompleteAt,
    sortTasks,
    filterTasks,
    saveTasks as saveTasksToStorage,
    loadTasks as loadTasksFromStorage,
    updateTaskAt,
    moveTask,
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
        li.draggable = true;

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

        const actions = document.createElement('div');
        actions.className = 'task-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'edit small-btn';
        editBtn.title = 'Edit task';
        editBtn.setAttribute('aria-label', 'Edit task');
        editBtn.textContent = 'Edit';

        const upBtn = document.createElement('button');
        upBtn.className = 'up small-btn';
        upBtn.title = 'Move up';
        upBtn.setAttribute('aria-label', 'Move task up');
        upBtn.textContent = '↑';

        const downBtn = document.createElement('button');
        downBtn.className = 'down small-btn';
        downBtn.title = 'Move down';
        downBtn.setAttribute('aria-label', 'Move task down');
        downBtn.textContent = '↓';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete';
        deleteBtn.textContent = '×';
        deleteBtn.title = 'Delete task';
        deleteBtn.addEventListener('click', () => {
            tasks = deleteTaskAt(tasks, idx);
            saveTasks();
            renderTasks();
        });

        // edit button
        editBtn.addEventListener('click', () => {
            // reuse dblclick editing logic
            const input = document.createElement('input');
            input.type = 'text';
            input.value = span.textContent;
            input.className = 'edit-input';
            span.replaceWith(input);
            input.focus();
            function finish() {
                const value = input.value.trim();
                if (value === '') { renderTasks(); return; }
                tasks = updateTaskAt(tasks, idx, { text: value });
                saveTasks();
                renderTasks();
            }
            input.addEventListener('blur', finish);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') input.blur();
                if (e.key === 'Escape') renderTasks();
            });
        });

        // up/down handlers
        upBtn.addEventListener('click', () => {
            if (idx <= 0) return;
            tasks = moveTask(tasks, idx, idx - 1);
            saveTasks();
            renderTasks();
        });
        downBtn.addEventListener('click', () => {
            if (idx >= tasks.length - 1) return;
            tasks = moveTask(tasks, idx, idx + 1);
            saveTasks();
            renderTasks();
        });

        // double-click to edit
        span.addEventListener('dblclick', () => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = span.textContent;
            input.className = 'edit-input';
            span.replaceWith(input);
            input.focus();
            function finish() {
                const value = input.value.trim();
                if (value === '') {
                    // if empty, keep old value
                    renderTasks();
                    return;
                }
                tasks = updateTaskAt(tasks, idx, { text: value });
                saveTasks();
                renderTasks();
            }
            input.addEventListener('blur', finish);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    input.blur();
                } else if (e.key === 'Escape') {
                    renderTasks();
                }
            });
        });

        // drag & drop to reorder
        li.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', task.id);
            e.dataTransfer.effectAllowed = 'move';
        });
        li.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        li.addEventListener('drop', (e) => {
            e.preventDefault();
            const fromId = e.dataTransfer.getData('text/plain');
            const fromIndex = tasks.findIndex(t => t.id === fromId);
            const toIndex = tasks.findIndex(t => t.id === task.id);
            if (fromIndex >= 0 && toIndex >= 0 && fromIndex !== toIndex) {
                tasks = moveTask(tasks, fromIndex, toIndex);
                saveTasks();
                renderTasks();
            }
        });

        actions.appendChild(editBtn);
        actions.appendChild(upBtn);
        actions.appendChild(downBtn);
        actions.appendChild(deleteBtn);
        li.appendChild(checkbox);
        li.appendChild(textWrap);
        li.appendChild(actions);
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