import createProject from "./project.js";
import createTask from "./task.js";
import storageController from "./localStorage.js";

const appController = (function () {
    let _projects = [];
    let _activeProject = null;

    function init() {
        const storedProjectData = storageController.loadProjects();

        storedProjectData.forEach(p => {
            const project = createProject(p._title);

            if (Array.isArray(p._tasks)) {
                p._tasks.forEach(t => {
                    const task = createTask(t._title, t._description, t._dueDate, t._notes, t._priority);
                    project.addTask(task);
                });
            }
            _projects.push(project);
        });

        if (_projects.length === 0) {
            // add default project and set it active
            addProject("Today");
        }

        _activeProject = _projects[0];
    }

    function getActiveProject () {
        // console.log ("active project: ", _activeProject.getTitle());
        return _activeProject;
    }

    function addProject(title) {
        console.log("adding project with title:", title);
        if (_projects.some(p => p.getTitle() === title)) return false;

        const newProject = createProject(title);
        _projects.push(newProject);
        storageController.saveProjects(_projects);
    }

    function removeProject(title) {
        const projectToRemove = _projects.find(p => p.getTitle() === title);

        if (projectToRemove) {
            const tasksToDelete = [...projectToRemove.getTasks()];

            tasksToDelete.forEach(task => {
                projectToRemove.deleteTask(task);
            });

            _projects = _projects.filter(p => p.getTitle() !== title);
            storageController.saveProjects(_projects);
        }
    }

    function setActiveProject(title) {
        _activeProject = _projects.find(p => p.getTitle() === title);
    }

    function clearActiveProject() {
        _activeProject = null;
    }

    function checkActiveProject() {
        if (!_activeProject) {
            console.log("No active project");
            return false;
        }

        return true;
    }

    function addTaskToProject(title, description = null, dueDate = null, notes = null, priority = "medium") {
        if (!checkActiveProject()) return false;

        const newTask = createTask(title, description, dueDate, notes, priority);
        const success = _activeProject.addTask(newTask);

        if (success) storageController.saveProjects(_projects);
        return success;
    }

    function removeTaskFromProject(task) {
        if (!checkActiveProject()) return false;

        const success = _activeProject.deleteTask(task);

        if (success) storageController.saveProjects(_projects);
        return success;
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

    function logProjects() {
        console.log(_projects);
    }

    return {
        init,
        getActiveProject,
        addProject,
        removeProject,
        setActiveProject,
        clearActiveProject,
        checkActiveProject,
        addTaskToProject,
        removeTaskFromProject,
        getProjects,
        logAllTasks,
        logProjects,
    }
})();

export default appController;