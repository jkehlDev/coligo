import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import local from 'store/localStorage';
import { createBrowserHistory } from 'history';
import throttle from 'lodash.throttle';
import createRootReducer from 'store/combineReducers';
import { routerMiddleware } from 'connected-react-router';

/* Application middlewares */
import applicationMdl from 'store/combineMiddlewares';

/* Browser history */
export const history = createBrowserHistory();

export default function configureStore(preloadedState) {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    composeWithDevTools(
      applyMiddleware(
        routerMiddleware(history), // For dispatching history actions
        ...applicationMdl // For dispatching application middlewares actions
      )
    )
  );

  store.subscribe(
    throttle(() => {
      const { profil } = store.getState();
      local.saveState({
        profil,
      });
    }, 1500)
  );
  return store;
}
