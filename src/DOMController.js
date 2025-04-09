import appController from "./app.js";
import modalUI from "./modalUI";
import projectUI from "./projectUI";
import taskUI from "./taskUI";
import createTask from "./task";
import createProject from "./project";

/**
 * The DOMController module manages the user interface and event listeners for 
 * interacting with projects and tasks. It handles rendering project/task lists,
 * attaching event listeners to buttons and task/project items, and manages 
 * interactions like opening modals, setting active projects, and toggling task details.
 * 
 * The main function to initialize this module is `init`, which calls various 
 * functions to set up the UI and events.
 */
const DOMController = (() => {

    /**
     * Initializes the DOMController by rendering the project list and task list, 
     * and attaching event listeners for creating, editing, and deleting projects/tasks.
     */
    function init() {
        projectUI.renderProjectList();
        taskUI.renderTaskList();
        attachProjectEventListeners();
        attachCreateProjectButtonListener();
        attachTaskEventListeners();
    }

    /**
     * Attaches event listeners to the project list for actions like selecting 
     * and deleting projects.
     */
    function attachProjectEventListeners() {
        const projectList = document.getElementById("project-list");

        projectList.addEventListener("click", (e) => {
            const projectItem = e.target.closest(".project-item");
            if (!projectItem) {
                console.log("no project item")
                return;
            }
            const projectTitle = projectItem.dataset.projectTitle;
            console.log(`active project: ${projectTitle}`)

            if (e.target.classList.contains("delete-project-btn")) {
                e.stopPropagation();
                appController.removeProject(projectTitle);
                projectUI.renderProjectList();
                attachProjectEventListeners();
            } else {
                appController.setActiveProject(projectTitle);
                taskUI.renderTaskList();
            }
        });
    }


    /**
     * Attaches an event listener to the 'Create Project' button to show the project 
     * creation modal.
     */
    function attachCreateProjectButtonListener() {
        const createProjectButton = document.getElementById("create-project-btn");
        createProjectButton.addEventListener("click", () => {
            modalUI.showProjectModal();
            projectUI.renderProjectList();
            attachProjectEventListeners();
        });
    }

    /**
     * Attaches event listeners to the task list for actions like creating, 
     * selecting, and deleting tasks.
     */
    function attachTaskEventListeners() {
        console.log("Attaching task event listeners..")
        const taskList = document.getElementById("task-list");

        taskList.addEventListener("click", (e) => {
            console.log("clicked element: ", e.target);
            const taskItem = e.target.closest(".task-item");
            console.log("taskitem: ",taskItem);
            if (e.target.id === "create-task-btn") {
                e.stopPropagation();
                modalUI.showTaskModal();
                return;
            }
            appController.logAllTasks();
            const taskId = Number(taskItem.dataset.taskId);
            const task = appController.getActiveProject().getTask(taskId);

            if (!task) {
                console.log("active prj:", appController.getActiveProject().getTitle());
                console.log("taskid dom: ", taskId);
                // console.log("taskID app: ", task.getId())
                console.log("task: ", task);
                console.log("taskItem: ", taskItem);
                console.log("no task in domCOntroler");
                return;
            }

            
            
            if (!taskItem) return;


            if (e.target.classList.contains("delete-task-btn")) {
                e.stopPropagation();

                appController.removeTaskFromProject(task);
                taskUI.renderTaskList();
                attachTaskEventListeners();
            } else {
                toggleTaskDetails(task, taskItem);
            }
        })
    }

    /**
     * Toggles the visibility of additional task details when a task is selected.
     * It displays task details (description, due date, notes, and priority) when 
     * expanded, and hides them when collapsed.
     * 
     * @param {object} task - The task object whose details are being toggled.
     * @param {HTMLElement} taskItem - The DOM element representing the task item.
     */
    function toggleTaskDetails(task, taskItem) {
        const activeTask = appController.getActiveProject().getActiveTask();

        if (activeTask === task) {
            taskItem.classList.remove("expanded");
            const taskDetails = taskItem.querySelector(".task-details");

            if (taskDetails) taskDetails.classList.add("hidden");

            const editButton = taskItem.querySelector("button");
            if (editButton) editButton.classList.add("hidden");

            const deleteButton = taskItem.querySelector(".delete-task-btn");
            if (deleteButton) deleteButton.classList.remove("hidden");

            appController.getActiveProject().setActiveTask(null);
        } else {
            taskItem.classList.add("expanded");

            const taskDetails = taskItem.querySelector(".task-details");

            if (taskDetails) {
                taskDetails.classList.remove("hidden");

            } else {
                const newTaskDetails = document.createElement("div");
                newTaskDetails.classList.add("task-details");
                newTaskDetails.innerHTML = `
                    <p>Description: ${task.getDescription() || "No description"}</p>
                    <p>Due Date: ${task.getDueDate() || "No Due Date"}</p>
                    <p>Notes: ${task.getNotes() || "No notes"}</p>
                    <p>Priority: ${task.getPriority()}</p>`
                
                    taskItem.appendChild(newTaskDetails);
            }

            const deleteButton = taskItem.querySelector(".delete-task-btn");
            if (deleteButton) deleteButton.classList.remove("hidden");

            const editButton = document.querySelector(".edit-button");

            if(!editButton) {
                const newEditButton = document.createElement("div");
                newEditButton.textContent = "Edit";
                newEditButton.classList.add("edit-button");
                newEditButton.addEventListener("click", (e) => {
                    e.stopPropagation();
                    modalUI.showTaskModal(task);
                });
    
                taskItem.appendChild(newEditButton);
            }

            appController.getActiveProject().setActiveTask(task);
        }
    }


    return { 
        init,
    };
})();

export default DOMController;