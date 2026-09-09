import { PORT, PROJECT_TITLE } from './config/config.js';
import taskapp from './init.js';

const server = taskapp.listen(PORT, () => {
    console.log(`${PROJECT_TITLE} Server is running at http://localhost:${PORT}`);
});

export default server;