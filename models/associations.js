import User from "./user.model.js";
import Task from "./task.model.js";

// Associate Task and User
Task.belongsTo(User, {
    foreignKey: 'creator_id',
    as: 'creator'
});
User.hasMany(Task, {
    foreignKey: 'creator_id',
    as: 'created_tasks'
});


Task.belongsTo(User, {
    foreignKey: 'updater_id',
    as: 'updater'
});
User.hasMany(Task, {
    foreignKey: 'updater_id',
    as: 'updated_tasks'
});

export {
    User,
    Task
}