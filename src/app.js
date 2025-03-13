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

    function addProject(title) {
        if (_projects.some(p => p.getTitle() === title)) return false;

        const newProject = createProject(title);
        _projects.push(newProject);

        // save projects to memory
    }

    function removeProject(title) {
        _projects = _projects.filter(p => p.getTItle() !== title);

        //save projects to memory
    }

    function setActiveProject(title) {
        _activeProject = _projects.find(p => p.getTItle() === title);
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
            return _activeProject.deleteTask(task);
        }

        return false;
    }

    return {
        init,
        addProject,
        removeProject,
        setActiveProject,
        checkActiveProject,
        addTaskToProject,
        removeTaskFromProject,
    }
})();