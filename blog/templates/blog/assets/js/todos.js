

//About submit button
$(function() {
    $(".fa-check").fadeOut();
});

$("input[type='text']").on("focus blur", function() {
    $(".fa-check").fadeIn();
});




var todoItems = [];
var itemNum = todoItems.length;
var curPage = 1;
var curFilter = showAll;


//About submitting
function submitTodo(event) {
    event.preventDefault();
    var title = $("#new-todo").val();
    createTodo(title);
    $("#new-todo").val(null);
    updateCounters();

    $(".fa-check").fadeOut();
}
function createTodo(title) {

    todoItems.push(title);
    var checkboxId = "todo-" + itemNum;

    var listItem = $("<li></li>");
    listItem.attr('id', checkboxId);
    listItem.addClass("todo");

    var checkbox = $('<input>');
    checkbox.attr('type', 'checkbox');
    checkbox.attr('id', checkboxId);
    checkbox.val(1);
    // checkbox.on('change', toggleDone);

    var space = document.createTextNode(" ");

    var label = $('<label></label>');

    label.html(todoItems[itemNum]);
    itemNum++;
    listItem.append(checkbox);
    listItem.append(space);
    listItem.append(label);

    $("#todolist").append(listItem);
    updateCounters();
}


//About marking a block as a done one
$(document).ready(function() {
    // $("input[type=checkbox]").on('change', toggleDone);

    $('#todolist').on('change', 'input[type=checkbox]', toggleDone);

    updateCounters();
    $("form").bind('submit', submitTodo);
    $("#delete-checked").bind('click', deleteDoneTodos);
});

function toggleDone() {
    var checkbox = this;
    $(checkbox).parent().toggleClass("completed");

    updateCounters();
}


function updateCounters() {
    var alltodos = $('.todo').length;
    var completedtodos = $(".completed").length;
    $("#total-count").html(alltodos);
    $("#completed-count").html(completedtodos);
    $("#active-count").html(alltodos - completedtodos);
    showNew();
}

$(function () {
    $("label").dblclick(function () {
        alert('vololo');
        var originContent = $(this).text();
        $(this).addClass("beginEditing");
        $(this).html("<input type='text' value='" + originContent + "' />");
        $(this).children().first().focus();
        $(this).children().first().keypress(function (e) {
            if (e.which == 13) {
                var newContent = $(this).val();
                $(this).parent().text(newContent);
                $(this).parent().removeClass("beginEditing");
            }
        });
        $(this).children().first().blur(function () {
            $(this).parent().text(OriginalContent);
            $(this).parent().removeClass("beginEditing");
        });
    });

    $('#todolist').on('dblclick', 'label', function(){
        console.log(222, this);
    });
});



//View select



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


//Marks all the checkboxes as checked
function selectAll() {
    $("input[type=checkbox]").prop('checked', true);
    $("input[type=checkbox]").parent().addClass("completed");
    updateCounters();
}
//Marks all the checkboxes as unchecked
function selectNone() {
    $("input[type=checkbox]").prop('checked', false);
    $("input[type=checkbox]").parent().removeClass("completed");
    updateCounters();
}
//Deletes checked todos
function deleteDoneTodos(event) {
    event.preventDefault();
    $.when($(".completed").remove())
        .then(updateCounters);
}

