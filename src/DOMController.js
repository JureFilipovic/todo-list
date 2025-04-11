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
        attachDeleteProjectButtonListener();
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
                return;
            }
            const projectTitle = projectItem.dataset.projectTitle;

            appController.setActiveProject(projectTitle);
            projectUI.renderProjectList();
            taskUI.renderTaskList();
            
        });
    }

    /**
     * Attaches an event listener to the 'Delete Project' button to delete project
     */
    function attachDeleteProjectButtonListener() {
        const projectHeader = document.getElementById("project-header");

        projectHeader.addEventListener("click", (e) => {
            if (e.target.id = "delete-project-btn") {
                const project = appController.getActiveProject();
                appController.removeProject(project.getTitle());

                const projects = appController.getProjects();

                if (projects.length > 0) {
                    appController.setActiveProject(projects[0].getTitle());
                } else {
                    appController.clearActiveProject();
                }

                projectUI.renderProjectList();
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
            // attachProjectEventListeners();
        });
    }

    /**
     * Attaches event listeners to the task list for actions like creating, 
     * selecting, and deleting tasks.
     */
    function attachTaskEventListeners() {
        const taskList = document.getElementById("task-list");

        taskList.addEventListener("click", (e) => {
            const taskItem = e.target.closest(".task-item");

            if (e.target.id === "create-task-btn") {
                e.stopPropagation();
                modalUI.showTaskModal();
                return;
            }
            
            const taskId = Number(taskItem.dataset.taskId);
            const task = appController.getActiveProject().getTask(taskId);

            if (!task) return;            
            
            if (!taskItem) return;


            if (e.target.classList.contains("delete-task-btn")) {
                e.stopPropagation();

                appController.removeTaskFromProject(task);
                taskUI.renderTaskList();
                // attachTaskEventListeners();
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
        const taskDetails = taskItem.querySelector(".task-details");
        const editButton = taskItem.querySelector(".edit-button");
        const deleteButton = taskItem.querySelector(".delete-task-btn");

        if (activeTask === task) {
            taskItem.classList.remove("expanded");

            if (taskDetails) taskDetails.classList.add("hidden");

            if (editButton) editButton.classList.add("hidden");

            if (deleteButton) deleteButton.classList.remove("hidden");

            appController.getActiveProject().setActiveTask(null);
        } else {
            taskItem.classList.add("expanded");

            if (taskDetails) {
                taskDetails.classList.remove("hidden");
                editButton.classList.remove("hidden");

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

            if (deleteButton) deleteButton.classList.remove("hidden");

            if(!editButton) {
                const newEditButton = document.createElement("button");
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