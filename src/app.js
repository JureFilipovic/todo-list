import createProject from "./project.js";
import createTask from "./task.js";

const appController = (function () {
    let _projects = [];
    let _activeProject = null;

    function init() {
        //load projects first

        if (_projects.length === 0) {
            // add default project and set it active
            addProject("Today");
            _activeProject = _projects[0];
        }
    }

    function getActiveProject () {
        return _activeProject;
    }

    function addProject(title) {
        if (_projects.some(p => p.getTitle() === title)) return false;

        const newProject = createProject(title);
        _projects.push(newProject);

        // save projects to memory
    }

    function removeProject(title) {
        const projectToRemove = _projects.find(p => p.getTitle() === title);

        if (projectToRemove) {
            const tasksToDelete = projectToRemove.getTasks();

            tasksToDelete.forEach(task => {
                projectToRemove.deleteTask(task);
            });

            _projects = _projects.filter(p => p.getTitle() !== title);
        }
        //save projects to memory
    }

    function setActiveProject(title) {
        _activeProject = _projects.find(p => p.getTitle() === title);
    }

    function checkActiveProject() {
        if (!_activeProject) {
            console.log("No active project");
            return false;
        }

        return true;
    }

    function addTaskToProject(title, description = null, dueDate = null, notes = null, priority = "medium") {
        if (checkActiveProject()) {
            const newTask = createTask(title, description, dueDate, notes, priority);
            return _activeProject.addTask(newTask);
        }

        return false;

    }

    function removeTaskFromProject(task) {
        if (checkActiveProject()) {
            console.log("removing task id:", task.getId());
            return _activeProject.deleteTask(task);
        }

        return false;
    }

    function getProjects() {
        return _projects;
    }

    function logAllTasks() {
        _projects.forEach(project => {
            console.log(`Project: ${project.getTitle()}`);
            if (project.getTasks().length === 0) console.log("  Empty Project")
            project.getTasks().forEach(task => {
                console.log(`   Task ID: ${task.getId()}`);
                console.log(`   Title: ${task.getTitle()}`);
                console.log(`   Description: ${task.getDescription()}`);
                console.log(`   Due Date: ${task.getDueDate()}`);
                console.log(`   Notes: ${task.getNotes()}`);
                console.log(`   Priority: ${task.getPriority()}`);
                console.log(`   Completed: ${task.isCompleted()}`);
                console.log('-------------------------------');
            });
        });
    }

    return {
        init,
        getActiveProject,
        addProject,
        removeProject,
        setActiveProject,
        checkActiveProject,
        addTaskToProject,
        removeTaskFromProject,
        getProjects,
        logAllTasks,
    }
})();

export default appController;