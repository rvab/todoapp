import { Component, OnInit } from '@angular/core';
import { TodoItem, TodoService, PartialTodoItem, TODO_KEY, COMPLETE_KEY } from '../todo.service'
import { FormControl, Validators } from '@angular/forms'
import { moveItemInArray, transferArrayItem, CdkDragDrop } from '@angular/cdk/drag-drop'

@Component({
  selector    : 'app-todo',
  templateUrl : './todo.component.html',
  styleUrls   : ['./todo.component.scss']
})

export class TodoComponent {

  todoItemList  : TodoItem[]
  todoForm      : FormControl
  selectedTodo  : TodoItem  

  completedTask : TodoItem[]

  constructor(private todoService : TodoService) { 

    this.todoForm   = new FormControl('', [Validators.required])

  }

  ngOnInit() {
    this.todoItemList   = this.todoService.getAllTodoList()
    this.completedTask  = this.todoService.getCompleted()
  }


  /*=====================================================================
                              HTML
  =====================================================================*/
  addTodoItem() {
    if (this.todoForm.invalid) return

    const item  : PartialTodoItem = {
      name  : this.todoForm.value
    }
    if (this.selectedTodo) {
      this.selectedTodo.name  = this.todoForm.value
      this.todoService.editTodo(this.selectedTodo)
      this.selectedTodo = null
    } else {
      this.todoService.addTodo(item) 
    }

    this.todoItemList = this.todoService.getAllTodoList()
    this.todoForm.reset()
  }

  openEditMode(todo : TodoItem, inputElem : HTMLInputElement) {
    this.todoForm.setValue(todo.name)
    inputElem.focus()
    this.selectedTodo = todo
  }

  markAsComplete(todo : TodoItem) {
    this.todoService.markAsCompleted(todo)
    this.todoItemList = this.todoService.getAllTodoList()
    this.completedTask = this.todoService.getCompleted()

  }

  resetInput() {
    this.todoForm.reset()
    this.selectedTodo = null
  }

  deleteTodoItem(todo : TodoItem) {
    this.todoService.deleteTodo(todo.id)
    this.todoItemList = this.todoService.getAllTodoList()

  }

  deleteCompletedItem(todo : TodoItem) {
    this.todoService.deleteCompleted(todo.id)
    this.completedTask = this.todoService.getCompleted()

  }

  drop(event: CdkDragDrop<string[]>) {

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
    this.todoService.rearrangeTodoItems(this.todoItemList, this.completedTask)
  }


}
