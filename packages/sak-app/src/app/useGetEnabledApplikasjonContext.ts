import { useGlobalStateRestApiData } from '@fpsak-frontend/rest-api-hooks';
import { featureToggle } from '@fpsak-frontend/konstanter';

import { FpsakApiKeys } from '../data/fpsakApiNyUtenRedux';
import ApplicationContextPath from './ApplicationContextPath';

const useGetEnabledApplikasjonContext = (): ApplicationContextPath[] => {
  const enabledApplicationContexts = [ApplicationContextPath.FPSAK];

  const featureToggles = useGlobalStateRestApiData<{[key: string]: boolean}>(FpsakApiKeys.FEATURE_TOGGLE);
  const kodeverkFpTilbake = useGlobalStateRestApiData(FpsakApiKeys.KODEVERK_FPTILBAKE);

  if (featureToggles[featureToggle.AKTIVER_TILBAKEKREVINGBEHANDLING] && !!kodeverkFpTilbake) {
    enabledApplicationContexts.push(ApplicationContextPath.FPTILBAKE);
  }
  return enabledApplicationContexts;
};

export default useGetEnabledApplikasjonContext;