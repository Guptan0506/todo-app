function addTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    const li = document.createElement("li");
    li.textContent = taskText;

    // clicking a task removes it from the list
    li.addEventListener('click', function () {
        li.remove();
    });

    document.getElementById("taskList").appendChild(li);
    input.value = "";
}

// allow adding the task by pressing Enter in the input
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('taskInput');
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addTask();
    });
});