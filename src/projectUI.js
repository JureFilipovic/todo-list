import appController from "./app";

/**
 * `projectUI` module is responsible for handling the rendering 
 * and updating of the project list in the sidebar UI. It manages 
 * the creation of the sidebar elements, including the list of 
 * projects and the 'Create Project' button. This module is 
 * integrated with the `appController` to retrieve the current 
 * projects and dynamically update the project list. Each project 
 * is displayed with a delete button, and the active project is 
 * visually highlighted. The module allows for project creation 
 * and deletion within the UI.
 */
const projectUI = (() => {
    const content = document.getElementById("content");

    const sideBar = document.createElement("div");
    sideBar.id = "side-bar";

    const projectList = document.createElement("ul");
    projectList.id = "project-list";

    const createProjectButton = document.createElement("button");
    createProjectButton.id = "create-project-btn";
    createProjectButton.textContent = "Create Project";

    sideBar.appendChild(createProjectButton);
    sideBar.appendChild(projectList);
    content.appendChild(sideBar);

    /**
     * Renders the list of projects in the sidebar.
     * Iterates over the projects and adds them to the project list
     * in the sidebar. Each project is displayed with a delete button.
     * Highlights the active project.
     */
    function renderProjectList() {
        projectList.innerHTML = "";
        const projects = appController.getProjects();

        projects.forEach((project) => {
            const projectItem = document.createElement("li");
            projectItem.classList.add("project-item");
            projectItem.textContent = `${project.getTitle()}`;

            if (appController.getActiveProject() === project) {
                projectItem.classList.add("active");
            }

            projectItem.dataset.projectTitle = project.getTitle();

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("delete-project-btn");

            projectItem.appendChild(deleteButton);
            projectList.appendChild(projectItem);
        });
    }

    return {
        renderProjectList,
    };
})();

export default projectUI;