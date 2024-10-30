class Todo {
    constructor() {
        this.tasks = [];
        this.term = '';
        this.loadFromLocalStorage();
        this.initEventListeners();
        this.draw();
    }

    initEventListeners() {
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', () => {
            this.term = searchInput.value;
            this.draw();
        });

        const addTaskButton = document.getElementById('addTaskButton');
        addTaskButton.addEventListener('click', () => this.addTask());

        document.addEventListener('click', (event) => {
            if (
                !event.target.classList.contains('edit-input') &&
                !event.target.classList.contains('edit-date')
            ) {
                this.saveAllEdits();
            }
        });
    }

    loadFromLocalStorage() {
        const tasksArray = JSON.parse(localStorage.getItem('tasks'));
        if (tasksArray) {
            this.tasks = tasksArray.map(taskArr => ({
                text: taskArr[0],
                date: taskArr[1],
                isEditingName: taskArr[2],
                isEditingDate: taskArr[3],
                completed: taskArr[4],
            }));
        }
    }

    saveToLocalStorage() {
        const tasksArray = this.tasks.map(task => [
            task.text,
            task.date,
            task.isEditingName,
            task.isEditingDate,
            task.completed,
        ]);
        localStorage.setItem('tasks', JSON.stringify(tasksArray));
    }

    get filteredTasks() {
        if (this.term.length < 2) {
            return this.tasks;
        }
        return this.tasks.filter((task) =>
            task.text.toLowerCase().includes(this.term.toLowerCase())
        );
    }

    draw() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        this.filteredTasks.forEach((task, index) => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'task-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed || false;
            checkbox.addEventListener('change', () => this.toggleComplete(index));
            taskDiv.appendChild(checkbox);

            const taskContentDiv = document.createElement('div');
            taskContentDiv.className = 'task-content';

            if (task.isEditingName) {
                const editInput = document.createElement('input');
                editInput.type = 'text';
                editInput.value = task.text;
                editInput.className = 'edit-input';
                editInput.addEventListener('blur', () => this.saveEditName(index, editInput.value));
                editInput.addEventListener('click', (event) => {
                    event.stopPropagation();
                });
                taskContentDiv.appendChild(editInput);
                editInput.focus();
            } else {
                const taskText = document.createElement('span');
                taskText.innerHTML = this.highlightTerm(task.text);
                taskText.addEventListener('click', (event) => {
                    event.stopPropagation(); 
                    this.editTaskName(index);
                });
                if (task.completed) {
                    taskText.classList.add('completed');
                }
                taskContentDiv.appendChild(taskText);
            }

            if (task.isEditingDate) {
                const dateInput = document.createElement('input');
                dateInput.type = 'date';
                dateInput.value = task.date || '';
                dateInput.className = 'edit-date';
                dateInput.addEventListener('blur', () => this.saveEditDate(index, dateInput.value));
                dateInput.addEventListener('click', (event) => {
                    event.stopPropagation();
                });
                taskContentDiv.appendChild(dateInput);
                dateInput.focus();
            } else if (task.date) {
                const dateSpan = document.createElement('span');
                dateSpan.textContent = ` (${task.date})`;
                dateSpan.className = 'task-date';
                dateSpan.addEventListener('click', (event) => {
                    event.stopPropagation(); 
                    this.editTaskDate(index);
                });
                if (task.completed) {
                    dateSpan.classList.add('completed');
                }
                taskContentDiv.appendChild(dateSpan);
            } else {
                const dateSpan = document.createElement('span');
                dateSpan.className = 'task-date';
                dateSpan.innerHTML = '&nbsp;';
                taskContentDiv.appendChild(dateSpan);
            }

            taskDiv.appendChild(taskContentDiv);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Usuń';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', () => this.deleteTask(index));
            taskDiv.appendChild(deleteButton);

            taskList.appendChild(taskDiv);
        });
    }

    highlightTerm(text) {
        if (this.term.length < 2) {
            return text;
        }
        const regex = new RegExp(`(${this.term})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    addTask() {
        const newTaskInput = document.getElementById('newTaskInput');
        const newTaskDate = document.getElementById('newTaskDate');
        const text = newTaskInput.value.trim();
        const date = newTaskDate.value;

        if (text.length < 3 || text.length > 255) {
            alert('Tekst zadania musi mieć od 3 do 255 znaków.');
            return;
        }

        if (date) {
            const taskDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0); 
            if (taskDate < today) {
                alert('Data musi być dzisiejsza lub w przyszłości.');
                return;
            }
        }

        this.tasks.push({
            text: text,
            date: date,
            isEditingName: false,
            isEditingDate: false,
            completed: false,
        });

        this.saveToLocalStorage();
        this.draw();

        newTaskInput.value = '';
        newTaskDate.value = '';
    }

    editTaskName(index) {
        this.saveAllEdits();
        this.tasks[index].isEditingName = true;
        this.draw();
    }

    editTaskDate(index) {
        this.saveAllEdits();
        this.tasks[index].isEditingDate = true;
        this.draw();
    }

    saveEditName(index, newText) {
        if (newText.trim().length < 3 || newText.trim().length > 255) {
            alert('Tekst zadania musi mieć od 3 do 255 znaków.');
            return;
        }
        this.tasks[index].text = newText.trim();
        this.tasks[index].isEditingName = false;
        this.saveToLocalStorage();
        this.draw();
    }

    saveEditDate(index, newDate) {
        
        if (newDate) {
            const taskDate = new Date(newDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (taskDate < today) {
                alert('Data musi być dzisiejsza lub w przyszłości.');
                return;
            }
        }
        this.tasks[index].date = newDate || '';
        this.tasks[index].isEditingDate = false;
        this.saveToLocalStorage();
        this.draw();
    }

    saveAllEdits() {
        this.tasks.forEach((task, index) => {
            const taskItem = document.querySelectorAll('.task-item')[index];

            if (task.isEditingName) {
                const editInput = taskItem.querySelector('.edit-input');
                if (editInput) {
                    this.saveEditName(index, editInput.value);
                }
            }

            if (task.isEditingDate) {
                const editDate = taskItem.querySelector('.edit-date');
                if (editDate) {
                    this.saveEditDate(index, editDate.value);
                }
            }
        });
    }

    deleteTask(index) {
        this.tasks.splice(index, 1);
        this.saveToLocalStorage();
        this.draw();
    }

    toggleComplete(index) {
        this.tasks[index].completed = !this.tasks[index].completed;
        this.saveToLocalStorage();
        this.draw();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const todoApp = new Todo();
});
