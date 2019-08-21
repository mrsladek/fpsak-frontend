import {
  RestApiConfigBuilder, ReduxRestApiBuilder, ReduxEvents,
} from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const PapirsoknadApiKeys = {
  BEHANDLING: 'BEHANDLING',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
  SUBMIT_MESSAGE: 'SUBMIT_MESSAGE',
};

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/api/behandlinger', PapirsoknadApiKeys.BEHANDLING)
  .withPost('/api/behandlinger/endre-pa-vent', PapirsoknadApiKeys.UPDATE_ON_HOLD)

  /* /api/behandling */
  .withAsyncPost('/api/behandling/aksjonspunkt', PapirsoknadApiKeys.SAVE_AKSJONSPUNKT)

  /* /api/brev */
  .withPostAndOpenBlob('/api/brev/forhandsvis', PapirsoknadApiKeys.PREVIEW_MESSAGE)
  .withPost('/api/brev/bestill', PapirsoknadApiKeys.SUBMIT_MESSAGE)

  .build();

const reducerName = 'dataContextPapirsoknad';

const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withContextPath('fpsak')
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator())
    .withPollingMessageActionCreator(setRequestPollingMessage))
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const papirsoknadApi = reduxRestApi.getEndpointApi();
export default papirsoknadApi;
