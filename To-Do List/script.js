document.addEventListener('DOMContentLoaded', function() {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const errorMessage = document.getElementById('error-message');
    const taskCounter = document.getElementById('task-counter');
    const filterButtons = document.querySelectorAll('.filters button');
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Päivitä tehtävät localStoragesta
    function renderTodos(filter = 'all') {
        todoList.innerHTML = '';
        const filteredTodos = todos.filter(todo => {
            if (filter === 'active') return !todo.completed;
            if (filter === 'completed') return todo.completed;
            return true;
        });

        filteredTodos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = todo.completed ? 'completed' : '';
            li.innerHTML = `
                <span>${todo.text}</span>
                <div>
                    <button class="complete-btn">${todo.completed ? 'Cancel' : 'Done'}</button>
                    <button class="delete-btn">Remove</button>
                </div>
            `;
            todoList.appendChild(li);

            // Merkitse tehtävä tehdyksi
            li.querySelector('.complete-btn').addEventListener('click', function() {
                todos[index].completed = !todos[index].completed;
                updateTodos();
            });

            // Poista tehtävä
            li.querySelector('.delete-btn').addEventListener('click', function() {
                todos.splice(index, 1);
                updateTodos();
            });
        });

        // Päivitä tehtävien laskuri
        const activeTasks = todos.filter(todo => !todo.completed).length;
        taskCounter.textContent = `Tasks remaining: ${activeTasks}`;
    }

    // Päivitä localStorage ja renderöi tehtävät
    function updateTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    }

    // Lomakkeen käsittely
    todoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const todoText = todoInput.value.trim();

        if (todoText.length < 3) {
            errorMessage.textContent = 'Task needs to be at least 3 characters long.';
            todoInput.classList.add('error');
            return;
        }

        todos.push({ text: todoText, completed: false });
        todoInput.value = '';
        errorMessage.textContent = '';
        todoInput.classList.remove('error');
        updateTodos();
    });

    // Suodattimien käsittely
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.id.split('-')[0];
            renderTodos(filter);
        });
    });

    renderTodos();
});
