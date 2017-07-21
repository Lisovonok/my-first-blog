const FILTER_ACTIVE = 0x1;
const FILTER_DONE = 0x0;
const FILTER_ALL = 0x2;

let curFilter = FILTER_ALL;
let isCompleted;
let curPage = 1;
let i = 0;

$("#total-count").html('0');
$("#completed-count").html('0');
$("#active-count").html('0');


class todoTodo {
  constructor({element, perPage, pagination, view}) {
    this.element = element;
    this.perPage = perPage;
    this.pagination = pagination;
    this.view = view;
    this.todoItems = [];
    this.active = 0;
  }

  addTodoItems(str) {
    const {todoItems} = this;

    let todoId = Math.floor(Math.random() * Date.now()).toString(16);
    let newObject = {todos: str, id: todoId, checked: false};
    todoItems.push(newObject);

    this.renderList(curPage);
    $("#new-todo").val(null);
    this.updateCounters();
  }

  updateCounters() {
    let count = 0;
    const {todoItems} = this;
    todoItems.forEach(item => {
      if (item.checked === true)
        count++;
    });

    let completedtodos = count;
    let alltodos = todoItems.length;
    $("#total-count").html(alltodos);
    $("#completed-count").html(completedtodos);
    $("#active-count").html(alltodos - completedtodos);
  }

  renderList(pageNo) {
    const {todoItems, perPage} = this;
    todoItems.forEach(item => {
      if (item.todos === '') todoItems.remove(item);
    });

    let filteredArray = todoItems.filter(e => {
      switch (curFilter) {
        case FILTER_DONE:
          return !!e.checked;
        case FILTER_ACTIVE:
          return !e.checked;
        default:
          return true;
      }
    });
    let sliced = filteredArray.slice((pageNo - 1) * perPage, pageNo * perPage);
    this.renderPages(sliced, filteredArray.length);
  }

  renderPages(sliced, totalCount) {
    const {element} = this;
    element.empty();

    let $newList = $('<div>');

    sliced.forEach(item => {

        let listItem = $("<li></li>");
        listItem.addClass("todo");
        listItem.attr('id', item.id);

        let checkbox = $('<input>');
        checkbox.attr('type', 'checkbox');
        checkbox.attr('id', item.id);

        let space = document.createTextNode(" ");

        let label = $('<label></label>');
        label.html(item.todos);
        checkbox.attr('checked', item.checked);
        if (item.state === 'completed') label.addClass("completed");
        listItem.append(checkbox);
        listItem.append(space);
        listItem.append(label);
        $newList.append(listItem);
      });
    element.html($newList.html());
    this.renderButtons(totalCount);
    this.updateCounters();
  }

  renderButtons(totalCount) {
    const {active, pagination, view, perPage} = this;
    pagination.empty();
    let
      start = (curPage > view) ? curPage - view : 1;
    let end = (curPage + view > Math.floor(totalCount / perPage)) ? Math.floor(totalCount / perPage) + 2 : curPage + view + 1;

    for (let i = start; i < end; i++) {
      const elem = $("<div>").html(i);
      if (i === curPage) elem.addClass('active');
      elem.click(() => {
        curPage = i;
        this.renderList(curPage);
      });
      pagination.append(elem);
    }

    const prev = $("<div>").html('<'), next = $("<div>").html('>');

    prev.click(() => {
      curPage = (curPage > 1) ? curPage - 1 : Math.floor(totalCount / perPage) + 1;
      this.renderList(curPage);
    });

    next.click(() => {
      curPage = (curPage < totalCount / perPage) ? curPage + 1 : 1;
      this.renderList(curPage);
    });
    pagination.prepend(prev);
    pagination.append(next);
  }

  selectAll() {
    const {todoItems} = this;

    $("input[type=checkbox]").prop('checked', true);
    $("input[type=checkbox]").parent().addClass("completed");
    todoItems.forEach(item => {
      item.checked = true;
    });
    this.renderList(curPage);
  }

  selectNone() {
    const {todoItems} = this;

    $("input[type=checkbox]").prop('checked', false);
    $("input[type=checkbox]").parent().removeClass("completed");
    todoItems.forEach(item => {
      item.checked = false;
    });
    this.renderList(curPage);
  }

  newDone(id) {
    const {todoItems} = this;

    let todo = todoItems.find(item => {
      return item.id === id;
    });
    todo.checked = !todo.checked;
    this.renderList(curPage);
  }

  updateItem(originContent, newContent) {
    this.todoItems.forEach(item => {
      if (item.todos === originContent)
        item.todos = newContent;
    });
    this.renderList(curPage);
  }

  deleteSelected() {
    const {todoItems} = this;
    let tmp = _.remove(todoItems, item => item.checked === true);
    this.renderList(curPage);
  }
}

const newOne = new todoTodo({
  element: $('#todolist'),
  pagination: $('.pagination'),
  perPage: 3,
  view: 2
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


$("form").on("submit", (event) => {
  event.preventDefault();
  newOne.addTodoItems(input.val());
});

$(document).ready(() => {
  $('#todolist').on('change', 'input[type=checkbox]', addDone);
});


function addDone() {
  let id = $(this).prop('id');
  newOne.newDone(id);
}


function showDone() {
  $(".show").removeClass('active');
  $('#show-completed').addClass("active");

  curFilter = FILTER_DONE;
  curPage = 1;
  newOne.renderList(curPage);
}
function showUndone() {
  $(".show").removeClass('active');
  $('#show-active').addClass("active");

  curFilter = FILTER_ACTIVE;
  curPage = 1;
  newOne.renderList(curPage);
}
function showAll() {
  $(".show").removeClass('active');
  $('#show-all').addClass("active");

  curFilter = FILTER_ALL;
  curPage = 1;
  newOne.renderList(curPage);
}


$(function () {
  $('#todolist').on('dblclick', 'label', function () {

    let originContent = $(this).text();
    $(this).html("<input type='text' value='" + originContent + "' />");
    $(this).children().first().focus();
    $(this).children().first().keypress(function (e) {
      if (e.which === 13) {
        let newContent = $(this).val();
        $(this).parent().text(newContent);
        newOne.updateItem(originContent, newContent);
      }
    });
    $(this).children().first().keydown(function (e) {
      if (e.which === 27) {
        $(this).children().first().blur(function () {
          $(this).parent().text(originContent);
        });
      }
    });
    $(this).children().first().blur(function () {
      $(this).parent().text(originContent);
    });
  });
});
