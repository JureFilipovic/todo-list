import appController from "./app";
import createProject from "./project";
import createTask from "./task";

const DOMController = (() => {
    const content = document.getElementById("content");

    const sideBar = document.createElement("div");
    sideBar.id = "side-bar";

    const mainArea = document.createElement("div");
    mainArea.id = "main-area";

    const projectList = document.createElement("ul");
    projectList.id = "project-list";

    const taskList = document.createElement("ul");
    taskList.id = "task-list";

    const createProjectButton = document.createElement("button");
    sideBar.appendChild(createProjectButton);

    createProjectButton.addEventListener("click", () => {
        
    })

    content.appendChild(sideBar);
    content.appendChild(mainArea);
    sideBar.appendChild(projectList);
    mainArea.appendChild(taskList);

    function renderProjectList() {
        const projects = appController.getProjects();

        projects.forEach((project) => {
            const projectItem = document.createElement("li");
            projectItem.classList.add("project-item");

            const projectTitle = document.createElement("span");
            projectTitle.textContent = project.getTitle();

            const taskCount = document.createElement("span");
            taskCount.textContent = `(${project.getTasks().length} tasks)`;

            if (appController.getActiveProject() === project) {
                projectItem.classList.add("active");
            }

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => {
                appController.removeProject(project.getTitle());
                renderProjectList();
            });

            projectItem.addEventListener("click", (e) => {
                appController.setActiveProject(project.getTitle());
                renderTaskList();
            })

            projectItem.appendChild(projectTitle);
            projectItem.appendChild(taskCount);
            projectItem.appendChild(deleteButton);

            projectList.appendChild(projectItem);
        });
    }

    function renderTaskList() {
        const activeProject = appController.getActiveProject();
        let tasks = [];

        if (activeProject) {
            tasks = activeProject.getTasks();
        } else {
            console.log ("No active project");
        }

        taskList.innerHTML = "";

        tasks.forEach((task) => {
            renderTaskItem(task);
        })
    }
    
    function renderTaskItem(task) {
        const taskItem = document.createElement("li");
        taskItem.classList.add("task-item");
        taskItem.classList.add(task.getPriority());

        const taskTitle = document.createElement("span");
        taskTitle.textContent = task.getTitle();
        taskItem.appendChild(taskTitle);

        taskItem.addEventListener("click", () => {
            toggleTaskDetails(task, taskItem);
        });

        taskList.appendChild(taskItem);
    }

    function toggleTaskDetails(task, taskItem) {
        const activeTask = appController.getActiveProject().getActiveTask();

        if (activeTask === task) {
            taskItem.classList.remove("expanded");
            const taskDetails = taskItem.querySelector(".task-details");

            if (taskDetails) taskDetails.remove();

            const editButton = taskItem.querySelector("button");
            if (editButton) editButton.remove();

            appController.getActiveProject().setActiveTask(null);
        } else {
            taskItem.classList.add("expanded");

            const taskDetails = document.createElement("div");
            taskDetails.classList.add("task-details");
            taskDetails.innerHTML = `
                <p>Description: ${task.getDescription() || "No description"}</p>
                <p>Due Date: ${task.getDueDate() || "No Due Date"}</p>
                <p>Notes: ${task.getNotes() || "No notes"}</p>`

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.addEventListener("click", (e) => {
                e.stopPropagation();
                // editTask(task);
            });

            taskItem.appendChild(taskDetails);
            taskItem.appendChild(editButton);

            appController.getActiveProject().setActiveTask(task);
        }
    }

    return {
        renderProjectList,
        renderTaskList,
    }
})();

export default DOMController;