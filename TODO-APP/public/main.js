$(document).ready(function () {
    const $loginBox = $('#login-box');
    const $registerBox = $('#register-box');
    const $authSection = $('#auth-section');
    const $todoSection = $('#todo-section');
    const $todoList = $('#todo-list');
    const $userEmail = $('#user-email');

    // Switch between login/register
    $('#show-register').on('click', function (e) {
        e.preventDefault();
        $loginBox.addClass('hidden');
        $registerBox.removeClass('hidden');
    });

    $('#show-login').on('click', function (e) {
        e.preventDefault();
        $registerBox.addClass('hidden');
        $loginBox.removeClass('hidden');
    });

    // Load current user on page load
    checkCurrentUser();

    function checkCurrentUser() {
        $.get('/api/me')
            .done(function (res) {
                if (res.user) {
                    showTodoSection(res.user.email);
                    loadTodos();
                } else {
                    showAuthSection();
                }
            })
            .fail(function () {
                showAuthSection();
            });
    }

    function showAuthSection() {
        $authSection.removeClass('hidden');
        $todoSection.addClass('hidden');
        $userEmail.text('');
    }

    function showTodoSection(email) {
        $userEmail.text(email);
        $authSection.addClass('hidden');
        $todoSection.removeClass('hidden');
    }

    // --------- LOGIN ----------
    $('#login-form').on('submit', function (e) {
        e.preventDefault();
        const data = {
            email: $(this).find('input[name="email"]').val(),
            password: $(this).find('input[name="password"]').val()
        };

        $('#login-message').text('');

        $.ajax({
            url: '/api/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data)
        })
            .done(function (res) {
                $('#login-message').text('');
                showTodoSection(res.user.email);
                loadTodos();
            })
            .fail(function (xhr) {
                const err = xhr.responseJSON?.error || 'Login failed';
                $('#login-message').text(err);
            });
    });

    // --------- REGISTER ----------
    $('#register-form').on('submit', function (e) {
        e.preventDefault();
        const data = {
            email: $(this).find('input[name="email"]').val(),
            password: $(this).find('input[name="password"]').val()
        };

        $('#register-message').text('');

        $.ajax({
            url: '/api/register',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data)
        })
            .done(function (res) {
                $('#register-message').text('Registered and logged in!');
                showTodoSection(res.user.email);
                loadTodos();
            })
            .fail(function (xhr) {
                const err = xhr.responseJSON?.error || 'Registration failed';
                $('#register-message').text(err);
            });
    });

    // --------- LOGOUT ----------
    $('#logout-btn').on('click', function () {
        $.post('/api/logout')
            .done(function () {
                showAuthSection();
                $todoList.empty();
            })
            .fail(function () {
                alert('Logout failed');
            });
    });

    // --------- LOAD TODOS ----------
    function loadTodos() {
        $('#todo-message').text('');
        $.get('/api/todos')
            .done(function (res) {
                renderTodos(res.todos || []);
            })
            .fail(function (xhr) {
                if (xhr.status === 401) {
                    showAuthSection();
                } else {
                    $('#todo-message').text('Error loading todos');
                }
            });
    }

    function renderTodos(todos) {
        $todoList.empty();
        if (!todos.length) {
            $todoList.append('<li class="empty">No todos yet. Add one!</li>');
            return;
        }

        todos.forEach(function (todo) {
            const li = $('<li>').attr('data-id', todo._id);

            const checkbox = $('<input type="checkbox" class="todo-toggle">')
                .prop('checked', todo.completed);

            const span = $('<span class="todo-text">').text(todo.text);
            if (todo.completed) {
                span.addClass('completed');
            }

            const deleteBtn = $('<button class="delete-btn">Delete</button>');

            li.append(checkbox).append(span).append(deleteBtn);
            $todoList.append(li);
        });
    }

    // --------- ADD NEW TODO ----------
    $('#new-todo-form').on('submit', function (e) {
        e.preventDefault();
        const text = $('#new-todo-text').val().trim();
        if (!text) return;

        $('#todo-message').text('');

        $.ajax({
            url: '/api/todos',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ text })
        })
            .done(function (res) {
                $('#new-todo-text').val('');
                loadTodos();
            })
            .fail(function (xhr) {
                const err = xhr.responseJSON?.error || 'Error adding todo';
                $('#todo-message').text(err);
            });
    });

    // --------- TOGGLE COMPLETE ----------
    $todoList.on('change', '.todo-toggle', function () {
        const li = $(this).closest('li');
        const id = li.data('id');
        const completed = $(this).is(':checked');

        $.ajax({
            url: '/api/todos/' + id,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ completed })
        })
            .done(function () {
                loadTodos();
            })
            .fail(function () {
                $('#todo-message').text('Error updating todo');
            });
    });

    // --------- DELETE TODO ----------
    $todoList.on('click', '.delete-btn', function () {
        const li = $(this).closest('li');
        const id = li.data('id');

        $.ajax({
            url: '/api/todos/' + id,
            method: 'DELETE'
        })
            .done(function () {
                li.remove();
            })
            .fail(function () {
                $('#todo-message').text('Error deleting todo');
            });
    });
});
