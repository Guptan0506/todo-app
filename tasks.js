// Lightweight task management helpers — pure functions
// Exports are ES module style to enable browser import and Node tests

export const STORAGE_KEY = 'todoApp.tasks';

export function createTask(text, priority = 'Medium', dueDate = null) {
    const priorityValue = priority === 'High' ? 2 : priority === 'Medium' ? 1 : 0;
    const createdAt = Date.now();
    const id = `${createdAt}-${Math.random().toString(36).slice(2, 9)}`;
    return {
        id,
        text: String(text || ''),
        completed: false,
        createdAt,
        dueDate: dueDate || null, // YYYY-MM-DD string or null
        priority,
        priorityValue,
    };
}

export function addTaskToArray(tasks, task) {
    return [...tasks, task];
}

export function deleteTaskAt(tasks, index) {
    return tasks.filter((_, i) => i !== index);
}

export function toggleCompleteAt(tasks, index) {
    return tasks.map((t, i) => i === index ? { ...t, completed: !t.completed } : t);
}

export function sortTasks(tasks, method = 'created') {
    const copy = [...tasks];
    switch (method) {
        case 'priority':
            return copy.sort((a, b) => b.priorityValue - a.priorityValue || a.createdAt - b.createdAt);
        case 'due':
            return copy.sort((a, b) => {
                if (!a.dueDate && !b.dueDate) return a.createdAt - b.createdAt;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return (new Date(a.dueDate)) - (new Date(b.dueDate)) || a.createdAt - b.createdAt;
            });
        case 'text':
            return copy.sort((a, b) => a.text.localeCompare(b.text));
        case 'created':
        default:
            return copy.sort((a, b) => b.createdAt - a.createdAt); // newest first
    }
}

export function filterTasks(tasks, filter = 'all') {
    switch (filter) {
        case 'completed':
            return tasks.filter(t => t.completed);
        case 'pending':
            return tasks.filter(t => !t.completed);
        default:
            return tasks;
    }
}

export function saveTasks(tasks, storage = (typeof localStorage !== 'undefined' ? localStorage : null)) {
    if (!storage) return false;
    storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
}

export function loadTasks(storage = (typeof localStorage !== 'undefined' ? localStorage : null)) {
    if (!storage) return [];
    try {
        const raw = storage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (err) {
        return [];
    }
}
