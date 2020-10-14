import { Injectable } from '@angular/core';

export const TODO_KEY      = 'todo',
             COMPLETE_KEY  = 'complete'

export interface PartialTodoItem {
  name      : string
}

export interface TodoItem extends PartialTodoItem  {
  id           : number
  createTs     : number
  completed   ?: boolean
  modifiedTs  ?: number

}

@Injectable({
  providedIn: 'root'
})

export class TodoService {

  private todoItemList  : TodoItem[]  = []
  private completedList : TodoItem[]  = []

  constructor() { 
    this.todoItemList   = Storage.getItem(TODO_KEY)
    this.completedList  = Storage.getItem(COMPLETE_KEY)
  }

  private getLastId() : number {

    if (!this.todoItemList.length) return 0

    let lastId  = this.todoItemList[0].id

    for (const item of this.todoItemList) {
      if (item.id > lastId) lastId  = item.id
    }
    
    return lastId

  }

  addTodo(parialTodoItem  : PartialTodoItem) {

    const lastId = this.getLastId()
    const todoItem  : TodoItem  = {
      id  : lastId + 1,
      createTs  : Date.now(),
      ...parialTodoItem
    }

    this.todoItemList.push(todoItem)
    Storage.setItem(this.todoItemList, TODO_KEY)

  }

  editTodo(todoItem : TodoItem) {

    const editedItemIdx  = this.todoItemList.findIndex(item  => item.id === todoItem.id)

    if (editedItemIdx === -1) {
      throw new Error(`Invalid item id ${todoItem.id}`)
    }

    todoItem.modifiedTs               = Date.now()
    this.todoItemList[editedItemIdx]  = todoItem
    Storage.setItem(this.todoItemList, TODO_KEY)
  } 

  markAsCompleted(todoItem : TodoItem) {
    const editedItemIdx  = this.todoItemList.findIndex(item  => item.id === todoItem.id)

    if (editedItemIdx === -1) {
      throw new Error(`Invalid item id ${todoItem.id}`)
    }

    todoItem.completed                = true
    todoItem.modifiedTs               = Date.now()
    this.completedList.push(todoItem)
    this.deleteTodo(todoItem.id)
    Storage.setItem(this.completedList, COMPLETE_KEY)
  }

  deleteTodo(id : number) {
    
    const itemIdx  = this.todoItemList.findIndex(item  => item.id === id)

    if (itemIdx === -1) {
      throw new Error(`Invalid item id ${id}`)
    }

    this.todoItemList.splice(itemIdx, 1)
    Storage.setItem(this.todoItemList, TODO_KEY)

  }

  deleteCompleted(id : number) {
    
    const itemIdx  = this.completedList.findIndex(item  => item.id === id)

    if (itemIdx === -1) {
      throw new Error(`Invalid item id ${id}`)
    }

    this.completedList.splice(itemIdx, 1)
    Storage.setItem(this.completedList, COMPLETE_KEY)

  }

  getAllTodoList() {
    return this.todoItemList
  }

  getCompleted() {
    return this.completedList
  }

  rearrangeTodoItems(pendingItems : TodoItem[], completedItems : TodoItem[]) {
    Storage.setItem(pendingItems, TODO_KEY)
    Storage.setItem(completedItems, COMPLETE_KEY)
  }

}

class Storage {

  static setItem(item : TodoItem[], key : string) {
    localStorage.setItem(key, JSON.stringify(item))
  }

  static getItem(key : string) {
    const item  = localStorage.getItem(key)
    return item ? JSON.parse(item) : []
  }

}