import { reducerRegistry } from '@fpsak-frontend/fp-felles';

import behandlingOrchestrator from '../behandling/BehandlingOrchestrator';

const reducerName = 'behandlingSupport';

/* Action types */
const actionType = (name) => `${reducerName}/${name}`;
const SET_SELECTED_SUPPORT_PANEL = actionType('SET_SELECTED_SUPPORT_PANEL');
const RESET_BEHANDLING_SUPPORT = actionType('RESET_BEHANDLING_SUPPORT');

/* Action creators */
export const setSelectedSupportPanel = (panelName) => ({
  type: SET_SELECTED_SUPPORT_PANEL,
  payload: panelName,
});

export const resetBehandlingSupport = () => ({
  type: RESET_BEHANDLING_SUPPORT,
});

export const updateBehandlingsupportInfo = (saksnummer) => (dispatch) => (behandlingOrchestrator.fetchBehandlingSupportInfo(saksnummer, dispatch));

/* Reducer */
const initialState = {
  selectedSupportPanel: undefined,
};

export const behandlingSupportReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_SELECTED_SUPPORT_PANEL:
      return {
        ...state,
        selectedSupportPanel: action.payload,
      };
    case RESET_BEHANDLING_SUPPORT:
      return initialState;
    default:
      return state;
  }
};

reducerRegistry.register(reducerName, behandlingSupportReducer);

const getBehandlingSupportContext = (state) => state.default[reducerName];
export const getSelectedSupportPanel = (state) => getBehandlingSupportContext(state).selectedSupportPanel;