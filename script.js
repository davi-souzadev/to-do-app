const taskInput = document.querySelector('#todo-input')
const taskButton = document.querySelector('#todo-btn')
const taskList = document.querySelector('.todo-list')
const deleteBtn = document.querySelector('.delete-btn')

let taskItensArray = [];

function renderTask (task) {
    localStorage.setItem('taskItensDb', JSON.stringify(taskItensArray))

    const isChecked = task.checked ? 'task-completed' : ''
    const checkAttribute = task.checked ? 'checked' : ''
    //Seleciona o item todo atual no DOM
    const taskItem = document.querySelector(`[data-key='${task.id}']`)

    if(task.deleted) {
        taskItem.remove()
        return
    }

    const taskLI = document.createElement('li')
    taskLI.setAttribute('class', `todo-item`)
    taskLI.setAttribute('data-key', task.id)
    taskLI.innerHTML = `
        <input id="${task.id}" type="checkbox" class="checkbox" ${checkAttribute}/>
        <span class="${isChecked}">${task.taskContent}</span>
        <button class="delete-btn">
            X
        </button>
    `

    taskList.append(taskLI)

    if(taskItem) {
        taskList.replaceChild(taskLI, taskItem)
    } else {
        taskList.appendChild(taskLI)
    }
}

function addTask(taskContent) {
    const task = {
        taskContent,
        checked: false,
        id: Date.now()
    }

    taskItensArray.push(task)
    renderTask(task)
}

function toggleComplete(key) {
    //index irá receber o índice do item do array que tem o mesmo ID passado por parametro da função
    const index = taskItensArray
        .findIndex(item => item.id === Number(key))
    // A propriedade checked na posição do index irá receber seu valor oposto
    taskItensArray[index].checked = !taskItensArray[index].checked

    renderTask(taskItensArray[index])
}

function deleteTask(key) {
    const index = taskItensArray.findIndex(item => item.id === Number(key))

    const task = {
        deleted: true,
        ...taskItensArray[index]
    }

    taskItensArray.filter(item => item.id !== Number(key))
    renderTask(task)
}

taskButton.addEventListener('click', () => {
    const taskContent = taskInput.value.trim()

    if(taskContent !== '') {
        addTask(taskContent)
        taskInput.value = '';
        taskInput.focus()
    }
})

taskInput.addEventListener('keypress', event => {
    const keyPressed = event.key
    if(keyPressed === 'Enter') {
        const taskContent = taskInput.value.trim()

        if(taskContent !== '') {
            addTask(taskContent)
            taskInput.value = '';
            taskInput.focus()
        }
    }
})

taskList.addEventListener('click', event => {
    const isCheckbox = event.target.classList.contains('checkbox')
    if(isCheckbox) {
        //item key irá receber o id do elemento pai da checkbox e passar como parametro para função que irá riscar o item
        const itemKey = event.target.parentElement.dataset.key
        toggleComplete(itemKey)
    }

    const isDeleteButton = event.target.classList.contains('delete-btn')
    if(isDeleteButton) {
        const itemKey =  event.target.parentElement.dataset.key
        deleteTask(itemKey)
    }
})

document.addEventListener('DOMContentLoaded', () => {
    const db = localStorage.getItem('taskItensDb')
    if(db) {
        taskItensArray = JSON.parse(db)
        taskItensArray.forEach(taskItem => {
            renderTask(taskItem)
        })
    }
})