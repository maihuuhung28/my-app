import { HomePage, TasksPage} from './pages';
import { withNavigationWatcher } from './contexts/navigation-hooks';

const routeData = [
    {
        path: '/tasks',
        element: TasksPage
    },
    {
        path: '/home',
        element: HomePage
    }
];

export const routes = routeData.map(route => {
    return {
        ...route,
        element: withNavigationWatcher(route.element, route.path)
    };
});
