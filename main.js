document.addEventListener('DOMContentLoaded', () => {
  const todoForm = document.getElementById('add-todo-form')
  if (!todoForm) {
    throw new Error('Todo form is not defined or null')
  }
  todoForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const formData = new FormData(todoForm)
    const textarea = formData.get('todo-content')
    if (!textarea) {
      return
    }
    item(textarea)
    todoForm.reset()
  })

  // Load data from storage
  const dbItems = getItems()
  if (dbItems.length > 0) {
    dbItems.forEach((dbItem) => {
      item(dbItem)
    })
  }

  function item(content) {
    const todoWrapper = document.getElementById('todo-list')
    if (!todoWrapper) {
      throw new Error('Todo wrapper is not defined or null')
    }
    const todo = Array.from(document.querySelectorAll('.todo-item'))
    const HTML = `<li class="todo-item" data-index="${todo.length}">
                    <div class="todo-item-content">${content}</div>
                    <div class="tod-edit-item">
                      <textarea class="todo-item-editing">${content}</textarea>
                    </div>
                    <div class="todo-actions">
                      <button type="button" class="edit">Edit</button>
                      <button type="button" class="save">Save</button>
                      <button type="button" class="cancel">Cancel</button>
                      <button type="button" class="delete">Delete</button>
                    </div>
                  </li>`
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = HTML
    todoWrapper.prepend(tempDiv.firstChild)

    const itemsArr = []
    const items = Array.from(document.querySelectorAll('.todo-item-content'))
    if (items.length > 0) {
      items.forEach((item) => {
        itemsArr.push(item.textContent.trim())
      })
    }
    const itemsJSON = JSON.stringify(itemsArr)
    saveItems(itemsJSON)
  }

  // Handle delete and edit
  const listParent = document.querySelector('#todo-list')
  listParent.addEventListener('click', (event) => {
    // Delete
    if (event.target.classList.contains('delete')) {
      const parent = event.target.closest('.todo-item')
      parent.remove()

      const itemsData = []
      const taskItems = Array.from(document.querySelectorAll('.todo-item'))
      if (taskItems.length > 0) {
        taskItems.forEach((item) => {
          const content = item.querySelector('.todo-item-content')
          itemsData.push(content.textContent)
        })
      }
      saveItems(JSON.stringify(itemsData))
    }

    // Edit
    if (event.target.classList.contains('edit')) {
      const parent = event.target.closest('.todo-item')
      parent.classList.add('editing')
    }

    // Cancel
    if (event.target.classList.contains('cancel')) {
      const parent = event.target.closest('.todo-item')
      parent.classList.remove('editing')
    }

    // Save
    if (event.target.classList.contains('save')) {
      const parent = event.target.closest('.todo-item')
      const editTextarea = parent.querySelector('.todo-item-editing')
      const dataIndex = parseInt(parent.getAttribute('data-index'))
      const items = getItems()
      items[dataIndex] = editTextarea.value
      items.reverse()
      saveItems(JSON.stringify(items))
      const content = parent.querySelector('.todo-item-content')
      content.textContent = editTextarea.value
      parent.classList.remove('editing')
    }
  })

  function saveItems(data) {
    window.localStorage.setItem('todo-items', data)
  }

  function getItems() {
    const items = window.localStorage.getItem('todo-items')
    if (!items) {
      return []
    }
    const itemsArr = JSON.parse(items)
    return itemsArr.reverse()
  }
})
