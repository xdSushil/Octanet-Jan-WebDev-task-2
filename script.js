function addTask() {
    const taskName = document.getElementById('taskName').value;
    const deadline = document.getElementById('deadline').value;
    const priority = document.getElementById('priority').value;
    const labels = document.getElementById('labels').value;

    const taskList = document.getElementById('taskList');

    const listItem = document.createElement('li');
    listItem.dataset.priority = priority; // Set priority as a data attribute
    listItem.innerHTML = `
        <div>
            <strong>${taskName}</strong>
            <br>Deadline: ${deadline}
            <br>Priority: ${priority}
            <br>Labels: ${labels}
            <br>
            <span class="days-left" id="daysLeft_${Date.now()}"></span>
            <br>
            <span class="task-deadline-reached" id="deadlineMessage_${Date.now()}"></span>
            <br>
            <progress value="0" max="100" id="progress_${Date.now()}"></progress>
            <br>
            <button onclick="increaseProgress(this, 5)">Increase Progress</button>
            <span id="progressValue_${Date.now()}">0%</span>
        </div>
        <div class="task-actions">
            <button onclick="editTask(this)">Edit</button>
            <button onclick="deleteTask(this)">Delete</button>
            <button class="task-done" onclick="markTaskDone(this)">Done</button>
        </div>
    `;

    taskList.appendChild(listItem);

    // Sort tasks based on priority
    sortTasksByPriority();

    // Check if the deadline is reached
    checkDeadlineReached(deadline, listItem);

    // Calculate and display days left
    calculateDaysLeft(deadline, listItem);

    // Clear form fields
    document.getElementById('taskForm').reset();
}

function markTaskDone(button) {
    const listItem = button.closest('li');
    listItem.style.textDecoration = 'line-through';

    // Update progress to 100 when a task is marked as done
    updateTaskProgress(listItem, 100);
}

function updateTaskProgress(listItem, progressValue) {
    const progressElement = listItem.querySelector('progress');
    const progressValueElement = listItem.querySelector('span[id^="progressValue_"]');

    progressElement.value = progressValue;
    progressValueElement.innerText = `${progressValue}%`;
}

function increaseProgress(button, amount) {
    const listItem = button.closest('li');
    const progressElement = listItem.querySelector('progress');
    const progressValueElement = listItem.querySelector('span[id^="progressValue_"]');
    
    let currentProgress = parseInt(progressElement.value);
    currentProgress += amount;

    if (currentProgress > 100) {
        currentProgress = 100;
    }

    progressElement.value = currentProgress;
    progressValueElement.innerText = `${currentProgress}%`;
}

function editTask(button) {
    const listItem = button.closest('li');
    const taskName = prompt('Edit task name:', listItem.querySelector('strong').innerText);
    if (taskName !== null) {
        listItem.querySelector('strong').innerText = taskName;
    }
}

function deleteTask(button) {
    const listItem = button.closest('li');
    listItem.remove();
}

function checkDeadlineReached(deadline, listItem) {
    const currentDate = new Date();
    const taskDeadline = new Date(deadline);

    if (currentDate > taskDeadline) {
        const deadlineMessage = listItem.querySelector('.task-deadline-reached');
        deadlineMessage.innerText = 'Task deadline reached!';
    }
}

function calculateDaysLeft(deadline, listItem) {
    const currentDate = new Date();
    const taskDeadline = new Date(deadline);
    const timeDifference = taskDeadline.getTime() - currentDate.getTime();
    const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    const daysLeftElement = listItem.querySelector('.days-left');
    daysLeftElement.innerText = `Days Left: ${daysLeft}`;
}

function sortTasksByPriority() {
    const taskList = document.getElementById('taskList');
    const tasks = Array.from(taskList.children);

    tasks.sort((a, b) => {
        const priorityA = a.dataset.priority;
        const priorityB = b.dataset.priority;

        if (priorityA === priorityB) {
            return 0;
        } else if (priorityA === 'High') {
            return -1;
        } else {
            return 1;
        }
    });

    // Clear existing tasks
    taskList.innerHTML = '';

    // Append sorted tasks
    tasks.forEach(task => taskList.appendChild(task));
}
