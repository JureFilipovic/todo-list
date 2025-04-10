import appController from "./app";
import projectUI from "./projectUI";
import taskUI from "./taskUI";

/**
 * `modalUI` module is responsible for managing modals in the UI, 
 * including displaying modals for creating and editing projects and tasks. 
 * It provides functions to generate modal HTML structure dynamically 
 * and handles modal interactions like opening, closing, and submitting forms.
 * The module interacts with `appController` to manage project and task data, 
 * and with `projectUI` and `taskUI` to render updated content after form submissions.
 */
const modalUI = (() => {

     /**
     * Closes the modal and backdrop by setting their display to "none".
     * 
     * @param {HTMLElement} modal - The modal element to close
     * @param {HTMLElement} backdrop - The backdrop element to hide
     */
    function closeModal(modal, backdrop) {
        modal.style.display = "none";
        backdrop.style.display = "none";
    }

    /**
     * Creates a new modal with the specified HTML content.
     * Also creates a backdrop that covers the screen when the modal is shown.
     * 
     * @param {string} htmlContent - The content to be injected into the modal
     * @returns {Object} The created modal and backdrop elements
     */
    function createModal(htmlContent) {
        const modal = document.createElement("div");
        modal.classList.add("modal");
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                ${htmlContent}
            </div>
        `;

        const backdrop = document.createElement("div");
        backdrop.classList.add("backdrop");
        document.body.appendChild(backdrop);

        console.log (backdrop);

        backdrop.appendChild(modal);
        modal.style.display = "flex";
        
        modal.querySelector(".close").addEventListener("click", () => {
            closeModal(modal, backdrop);
        });

        backdrop.addEventListener("click", () => {
            closeModal(modal, backdrop);
        });

        modal.querySelector(".modal-content").addEventListener("click", (e) => {
            e.stopPropagation();
        });


        return {
            modal,
            backdrop 
        };
    }

     /**
     * Opens the modal to create a new project.
     * Handles the form submission to create the project.
     */
    function showProjectModal() {
        const { modal, backdrop } = createModal(`
            <h2>Create Project</h2>
            <form id="projectForm">
                <label for="projectTitle">Project Title:</label>
                <input type="text" id="projectTitle" required>
                <button type="submit">Create</button>
            </form>
        `);

        modal.querySelector("#projectForm").addEventListener("submit", (e) => {
            e.preventDefault();
            const title = modal.querySelector("#projectTitle").value.trim();
            if (!title) return;

            appController.addProject(title);
            projectUI.renderProjectList();
            closeModal(modal, backdrop);
        });
    }

    /**
     * Opens the modal to create or edit a task.
     * If a task is provided, the modal will show the task data for editing.
     * Handles the form submission to create or update the task.
     * 
     * @param {Object|null} task - The task to edit, or null to create a new one
     */
    function showTaskModal(task = null) {
        const isEditing = task !== null;
        const { modal, backdrop } = createModal(`
            <h2>${isEditing ? "Edit Task" : "Create Task"}</h2>
            <form id="taskForm">
                <label for="taskTitle">Title:</label>
                <input type="text" id="taskTitle" required value="${task ? task.getTitle() : ""}">
                
                <label for="taskDescription">Description:</label>
                <textarea id="taskDescription">${task ? task.getDescription() : ""}</textarea>

                <label for="taskDueDate">Due Date:</label>
                <input type="date" id="taskDueDate" value="${task ? task.getDueDate() : ""}">

                <label for="taskNotes">Notes:</label>
                <input type="text" id="taskNotes" value="${task ? task.getNotes() : ""}">

                <label for="taskPriority">Priority:</label>
                <select id="taskPriority">
                    <option value="low" ${task?.getPriority() === "low" ? "selected" : ""}>Low</option>
                    <option value="medium" ${!task || task.getPriority() === "medium" ? "selected" : ""}>Medium</option>
                    <option value="high" ${task?.getPriority() === "high" ? "selected" : ""}>High</option>
                </select>

                <button type="submit">${isEditing ? "Save Changes" : "Create"}</button>
            </form>
        `);

        modal.querySelector("#taskForm").addEventListener("submit", (e) => {
            e.preventDefault();
            const activeProject = appController.getActiveProject();
            const activeTask = activeProject.getActiveTask();
            if (!activeProject) return;

            const title = modal.querySelector("#taskTitle").value.trim();
            const description = modal.querySelector("#taskDescription").value.trim();
            const dueDate = modal.querySelector("#taskDueDate").value;
            const notes = modal.querySelector("#taskNotes").value;
            const priority = modal.querySelector("#taskPriority").value;

            if (isEditing) {
                activeProject.updateTask(activeTask, title, description, dueDate, notes, priority);
            } else {
                appController.addTaskToProject(title, description, dueDate, notes, priority);
            }

            taskUI.renderTaskList();
            closeModal(modal, backdrop);
        });
    }

    return {
        showProjectModal,
        showTaskModal
    };
})();

export default modalUI;