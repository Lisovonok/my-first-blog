
let okButton = $("input[type='text']");
let curFilter = showAll;
let ifDone;

$(() => {
    $(".fa-check").fadeOut();
});

okButton.on("focus", () => {
    $(".fa-check").fadeIn();
});
okButton.on("blur", () => {
    $(".fa-check").fadeOut();
});

$("#total-count").html('0');
$("#completed-count").html('0');
$("#active-count").html('0');

class todoTodo {
    constructor({element, perPage, pagination, view}) {
        this.element = element;
        this.perPage = perPage;
        this.pagination = pagination;
        this.view = view;
        this.todoItems = [[]];
        this.active = 0;
    }
    addTodoItems(str) {

        const {todoItems, perPage} = this;
        const lastLen = todoItems[todoItems.length - 1].length;
        let todoId = Math.floor(Math.random() * Date.now()).toString(16);
        let newObject = {todos: str, id: todoId, checked: false, state: 'uncompleted'};
        if (lastLen < perPage) {
            todoItems[todoItems.length - 1].push(newObject);
        }
        else todoItems.push([newObject]);
        this.renderPages();
        $("#new-todo").val(null);
        $(".fa-check").fadeOut();
        this.updateCounters();
    }
    updateCounters() {
        const {todoItems} = this;
        const arraySum = (a) => a.reduce((prev, now) => {
            return prev + now;
        }, 0);
        const getCount = (o) => o.reduce((prev, now) => prev + now.length, 0);
        const getChecked = (o) => arraySum(o.map(item => {
                return item.reduce((prev, now) => (now.checked === true) ? prev + 1 : prev, 0);
            }
        ));
        let completedtodos = getChecked(todoItems);
        let alltodos = getCount(todoItems);
        $("#total-count").html(alltodos);
        $("#completed-count").html(completedtodos);
        $("#active-count").html(alltodos - completedtodos);
        showNew();
    }
    renderPages() {
        const {todoItems, element, active} = this;
        element.empty();

        if (!todoItems[active]) { //noinspection JSAnnotator
            active = this.active = todoItems.length - 1;
        }

        todoItems[active].forEach(item => {
                let listItem = $("<li></li>");
                listItem.addClass("todo");
                listItem.attr('id', item.id);

                let checkbox = $('<input>');
                checkbox.attr('type', 'checkbox');
                checkbox.attr('id', item.id);
                checkbox.val(1);

                let space = document.createTextNode(" ");

                let label = $('<label></label>');
                label.html(item.todos);
                if (item.checked === true) checkbox.prop('checked', true);
                listItem.append(checkbox);
                listItem.append(space);
                listItem.append(label);
                $("#todolist").append(listItem);
            }
        );
        if (todoItems.length > 1) this.renderButtons();
        this.updateCounters();
    }
    renderButtons() {
        const {todoItems, active, pagination, view} = this;
        pagination.empty();
        const perPage = todoItems.length;

        let
            start = (active - view > 0) ? active - view + 1 : 0,
            end = (active + view < perPage) ? active + view : perPage;

        for (let i = start; i < end; i++) {
            const elem = $("<div>").html(i + 1);
            if (i === active) elem.addClass('active');
            elem.click(() => {
                this.active = i;
                this.renderPages();
                showNew();

            });
            pagination.append(elem);
        }
        const prev = $("<div>").html('<'), next = $("<div>").html('>');
        prev.click(() => {
            this.active = (this.active > 0) ? this.active - 1 : 0;
            this.renderPages();
            showNew();
        });
        next.click(() => {
            this.active = (this.active < perPage) ? this.active + 1 : perPage - 1;
            this.renderPages();
            showNew();
        });
        pagination.prepend(prev);
        pagination.append(next);
    }
    selectAll() {
        const {todoItems, active} = this;

        if (!todoItems[active]) { //noinspection JSAnnotator
            active = this.active = todoItems.length - 1;
        }
        $("input[type=checkbox]").prop('checked', true);
        $("input[type=checkbox]").parent().addClass("completed");
        todoItems[active].forEach(item => {
            item.checked = true;
        });
        this.renderPages();
    }
    selectNone() {
        const {todoItems, active} = this;

        if (!todoItems[active]) { //noinspection JSAnnotator
            active = this.active = todoItems.length - 1;
        }
        $("input[type=checkbox]").prop('checked', false);
        $("input[type=checkbox]").parent().removeClass("completed");
        todoItems[active].forEach(item => {
            item.checked = false;
        });
        this.renderPages();
    }
    newDone() {
        const {todoItems, active} = this;
        todoItems[active].forEach(item => {
            if (item.id === ifDone)
                item.checked = true;
        });
        this.renderPages();
    }
    updateItem(originContent, newContent) {
        const {todoItems, active} = this;
        newOne.todoItems[active].forEach(item => {
            if (item.todos === originContent)
                item.todos = newContent;
        });
    }
    deleteSelected () {
        const {todoItems, active} = this;
        todoItems[active].forEach(item => {
            if (item.checked === true)
                todoItems[active].remove(item);
        });
        this.renderPages();
    }
}

const newOne = new todoTodo({
    element: $('#todolist'),
    pagination: $('.pagination'),
    perPage: 3,
    view: 4
});

const
    input = $('#new-todo'),
    submitButton = $('i'),
    selAllButton = $('#select-all'),
    selNoneButton = $('#select-none'),
    deleteButton = $('#delete-checked')
;

selAllButton.click(() => {
    newOne.selectAll();
});
selNoneButton.click(() => {
    newOne.selectNone();
});
deleteButton.click(() => {
    newOne.deleteSelected();
});
submitButton.click(() => {
    newOne.addTodoItems(input.val());
});

$(document).ready(() => {
    $('#todolist').on('change', 'input[type=checkbox]', addDone);
    //$("form").bind('submit', submitTodo);
    // $('#delete-checked').bind('click', deleteDone);
});


function addDone() {
    let checkbox = this;
    ifDone = $(this).parents('li.todo').prop('id');
    newOne.newDone();
    $(checkbox).parent().addClass("completed");
}

function showDone() {
    curFilter=showDone;
    $("input[type=checkbox]").parent().hide();
    $("input:checked").parent().show();
}
function showUndone() {
    curFilter=showUndone;
    $("input[type=checkbox]").parent().show();
    $("input:checked").parent().hide();
}
function showAll() {
    curFilter=showAll;
    $("input[type=checkbox]").parent().show();
}
function showNew() {
    curFilter();
}

$(function () {
    $('#todolist').on('dblclick', 'label', function(){
        let originContent = $(this).text();

        $(this).addClass("beginEditing");
        $(this).html("<input type='text' value='" + originContent + "' />");
        $(this).children().first().focus();
        $(this).children().first().keypress(function (e) {
            if (e.which === 13) {
                let newContent = $(this).val();
                $(this).parent().text(newContent);
                $(this).parent().removeClass("beginEditing");
                newOne.updateItem(originContent,newContent);
            }
        });
        $(this).children().first().blur(function () {
            $(this).parent().text(originContent);
            $(this).parent().removeClass("beginEditing");
        });
    });
});

Array.prototype.remove = function(value) {
    let idx = this.indexOf(value);
    if (idx !== -1) {
        return this.splice(idx, 1);
    }
    return false;
};
