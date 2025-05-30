import appController from "./app.js";
import createTask from "./task.js";
import modalUI from "./modalUI.js";

/**
 * `taskUI` module handles the rendering and updating of the task 
 * list in the main area UI. It dynamically generates task items 
 * based on the active project's tasks, and displays them in a list. 
 * Each task is shown with its title, priority, and a delete button. 
 * The module also handles the creation of a 'Create Task' button 
 * at the bottom of the task list. It integrates with the `appController` 
 * to get the tasks from the active project and update the task list 
 * accordingly. 
 */
const taskUI = (() => {
    const content = document.getElementById("content");

    const mainArea = document.createElement("div");
    mainArea.id = "main-area";

    const projectHeader = document.createElement("div");
    projectHeader.id = "project-header";

    const taskList = document.createElement("ul");
    taskList.id = "task-list";

    mainArea.appendChild(projectHeader);
    mainArea.appendChild(taskList);
    content.appendChild(mainArea);

    /**
     * Renders the list of tasks for the active project.
     * Loops through the tasks and displays each one with its title,
     * priority, and a delete button. Also adds a 'Create Task' button
     * to the bottom of the task list.
     */
    function renderTaskList() {
        const activeProject = appController.getActiveProject();
        taskList.innerHTML = "";
        projectHeader.innerHTML = "";

        if (!activeProject) return;

        const projectTitle = document.createElement("h2");
        projectTitle.textContent = activeProject.getTitle();

        const deleteProjectButton = document.createElement("button");
        deleteProjectButton.textContent = "Delete Project";
        deleteProjectButton.id = "delete-project-btn";

        projectHeader.appendChild(projectTitle);
        projectHeader.appendChild(deleteProjectButton);

        activeProject.getTasks().forEach((task) => {
            renderTaskItem(task);
        });

        const createTaskButton = document.createElement("button");
        createTaskButton.textContent = "Create Task";
        createTaskButton.id = "create-task-btn";

        taskList.appendChild(createTaskButton);
    }

    /**
     * Renders a single task item with its title and a delete button.
     * Each task is given a class based on its priority to style accordingly.
     * 
     * @param {object} task - The task to render
     */
    function renderTaskItem(task) {
        const taskItem = document.createElement("li");
        taskItem.classList.add("task-item", task.getPriority());

        const headerDiv = document.createElement("div");
        headerDiv.classList.add("task-header");

        const taskTitle = document.createElement("span");
        taskTitle.textContent = task.getTitle();
        taskTitle.classList.add("task-title");
        
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete Task";
        deleteButton.classList.add("delete-task-btn");

        headerDiv.appendChild(taskTitle);
        headerDiv.appendChild(deleteButton);
        
        taskItem.appendChild(headerDiv);
        taskItem.dataset.taskId = task.getId();
        taskList.appendChild(taskItem);
    }

    
    return {
        renderTaskList
    };
})();

export default taskUI;
