import assert from 'assert';
import {
    createTask,
    addTaskToArray,
    deleteTaskAt,
    toggleCompleteAt,
    updateTaskAt,
    moveTask,
    sortTasks,
    filterTasks,
    saveTasks,
    loadTasks,
} from '../tasks.js';

function fakeStorage() {
    const store = {};
    return {
        getItem(key) { return store[key] ?? null; },
        setItem(key, value) { store[key] = String(value); },
    };
}

// helper to set createdAt for deterministic tests
function patchCreatedAt(task, ts) {
    return { ...task, createdAt: ts };
}

// Tests
console.log('Running tasks.js tests...');

// Test createTask
const t1 = createTask('Task 1', 'High', '2025-12-31');
assert.strictEqual(t1.text, 'Task 1');
assert.strictEqual(t1.priority, 'High');
assert.strictEqual(t1.priorityValue, 2);
assert.strictEqual(t1.dueDate, '2025-12-31');
assert.strictEqual(t1.completed, false);

// Test addTaskToArray
let arr = [];
arr = addTaskToArray(arr, t1);
assert.strictEqual(arr.length, 1);

// Test deleteTaskAt
arr = addTaskToArray(arr, createTask('Task 2'));
assert.strictEqual(arr.length, 2);
arr = deleteTaskAt(arr, 0);
assert.strictEqual(arr.length, 1);
assert.strictEqual(arr[0].text, 'Task 2');

// Test toggleCompleteAt
arr = toggleCompleteAt(arr, 0);
assert.strictEqual(arr[0].completed, true);
arr = toggleCompleteAt(arr, 0);
assert.strictEqual(arr[0].completed, false);

// Test updateTaskAt
arr = updateTaskAt(arr, 0, { text: 'Task 2 edited' });
assert.strictEqual(arr[0].text, 'Task 2 edited');

// Test sorting: set createdAt values
const now = Date.now();
const tasks = [
    patchCreatedAt(createTask('A', 'Low', null), now - 2000),
    patchCreatedAt(createTask('B', 'High', '2025-01-01'), now - 1000),
    patchCreatedAt(createTask('C', 'Medium', '2024-12-31'), now - 3000),
];

let sorted = sortTasks(tasks, 'created');
// created sort: newest first => B (now -1000), A (now -2000), C (now -3000)
assert.strictEqual(sorted[0].text, 'B');
assert.strictEqual(sorted[1].text, 'A');
assert.strictEqual(sorted[2].text, 'C');

// Test moveTask
const mv = [
    patchCreatedAt(createTask('1'), now - 3000),
    patchCreatedAt(createTask('2'), now - 2000),
    patchCreatedAt(createTask('3'), now - 1000),
];
let moved = moveTask(mv, 2, 0);
assert.strictEqual(moved[0].text, '3');
assert.strictEqual(moved[1].text, '1');
assert.strictEqual(moved[2].text, '2');

// boundary cases: moving first up or last down should keep order
let movedTop = moveTask(mv, 0, 0);
assert.strictEqual(movedTop[0].text, '1');
let movedBottom = moveTask(mv, 2, 2);
assert.strictEqual(movedBottom[2].text, '3');

sorted = sortTasks(tasks, 'priority');
// priority order: High (B), Medium (C), Low (A)
assert.strictEqual(sorted[0].text, 'B');
assert.strictEqual(sorted[1].text, 'C');
assert.strictEqual(sorted[2].text, 'A');

sorted = sortTasks(tasks, 'due');
// due earliest first: C (2024-12-31), B (2025-01-01), A (no due)
assert.strictEqual(sorted[0].text, 'C');
assert.strictEqual(sorted[1].text, 'B');
assert.strictEqual(sorted[2].text, 'A');

sorted = sortTasks(tasks, 'text');
// text alphabetical: A, B, C
assert.strictEqual(sorted[0].text, 'A');
assert.strictEqual(sorted[1].text, 'B');
assert.strictEqual(sorted[2].text, 'C');

// Test filterTasks
let mixed = [
    { text: 'a', completed: false },
    { text: 'b', completed: true },
];
assert.strictEqual(filterTasks(mixed, 'all').length, 2);
assert.strictEqual(filterTasks(mixed, 'completed').length, 1);
assert.strictEqual(filterTasks(mixed, 'pending').length, 1);

// Test save/load with fake storage
const storage = fakeStorage();
const toSave = [createTask('x'), createTask('y')];
saveTasks(toSave, storage);
const loaded = loadTasks(storage);
assert.strictEqual(loaded.length, 2);
assert.strictEqual(loaded[0].text, 'x');

console.log('All tasks.js tests passed.');
