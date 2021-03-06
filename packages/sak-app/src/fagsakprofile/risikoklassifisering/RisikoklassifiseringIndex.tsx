import React, { FunctionComponent, useEffect, useCallback } from 'react';
import { createSelector } from 'reselect';
import { Location } from 'history';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { setSubmitFailed as dispatchSubmitFailed } from 'redux-form';

import { Aksjonspunkt, NavAnsatt, Risikoklassifisering } from '@fpsak-frontend/types';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import RisikoklassifiseringSakIndex from '@fpsak-frontend/sak-risikoklassifisering';

import { getRiskPanelLocationCreator } from '../../app/paths';
import { getBehandlingerErPaaVentStatusMappedById } from '../../behandling/selectors/behandlingerSelectors';
import { getNavAnsatt } from '../../app/duck';
import getAccessRights from '../../app/util/access';
import { getSelectedFagsakStatus } from '../../fagsak/fagsakSelectors';
import {
  getBehandlingIdentifier, getBehandlingVersjon, getSelectedBehandlingId, getBehandlingStatus, getBehandlingType,
} from '../../behandling/duck';
import {
  isRiskPanelOpen, resolveAksjonspunkter as resolveAp, setRiskPanelOpen,
} from './duck';
import trackRouteParam from '../../app/trackRouteParam';
import BehandlingIdentifier from '../../behandling/BehandlingIdentifier';

interface OwnProps {
  resolveAksjonspunkter: (params: any, behandlingIdentifier: BehandlingIdentifier) => void;
  push: (location: Location) => void;
  location: Location;
  isPanelOpen: boolean;
  readOnly: boolean;
  behandlingIdentifier?: BehandlingIdentifier;
  behandlingVersjon?: number;
  kontrollresultat?: Risikoklassifisering;
  risikoAksjonspunkt?: Aksjonspunkt;
}

/**
 * RisikoklassifiseringIndex
 *
 * Container komponent. Har ansvar for å vise risikoklassifisering for valgt behandling
 * Viser en av tre komponenter avhengig av: Om ingen klassifisering er utført,
 * om klassifisering er utført og ingen faresignaler er funnet og om klassifisering er utført og faresignaler er funnet
 */
export const RisikoklassifiseringIndexImpl: FunctionComponent<OwnProps> = ({
  risikoAksjonspunkt,
  kontrollresultat,
  behandlingIdentifier,
  behandlingVersjon,
  resolveAksjonspunkter,
  readOnly,
  push: pushLocation,
  location,
  isPanelOpen = false,
}) => {
  const toggleRiskPanel = useCallback(() => {
    pushLocation(getRiskPanelLocationCreator(location)(!isPanelOpen));
  }, [location, isPanelOpen]);

  const harRisikoAksjonspunkt = !!risikoAksjonspunkt;
  useEffect(() => {
    if (harRisikoAksjonspunkt && risikoAksjonspunkt.status.kode === aksjonspunktStatus.OPPRETTET && !isPanelOpen) {
      toggleRiskPanel();
    }
  }, [harRisikoAksjonspunkt, behandlingIdentifier.behandlingId, behandlingVersjon]);

  const submitAksjonspunkt = useCallback((aksjonspunkt) => {
    const params = {
      ...behandlingIdentifier.toJson(),
      behandlingVersjon,
      bekreftedeAksjonspunktDtoer: [{
        '@type': aksjonspunkt.kode,
        ...aksjonspunkt,
      }],
    };

    return resolveAksjonspunkter(params, behandlingIdentifier);
  }, [behandlingIdentifier, behandlingVersjon]);

  return (
    <RisikoklassifiseringSakIndex
      behandlingId={behandlingIdentifier ? behandlingIdentifier.behandlingId : undefined}
      behandlingVersjon={behandlingVersjon}
      aksjonspunkt={risikoAksjonspunkt}
      risikoklassifisering={kontrollresultat}
      isPanelOpen={isPanelOpen}
      readOnly={readOnly}
      submitAksjonspunkt={submitAksjonspunkt}
      toggleRiskPanel={toggleRiskPanel}
    />
  );
};

const getRettigheter = createSelector([
  getNavAnsatt,
  getSelectedFagsakStatus,
  getBehandlingStatus,
  getBehandlingType,
], getAccessRights);

const getReadOnly = createSelector([getRettigheter, getNavAnsatt, getBehandlingerErPaaVentStatusMappedById, getSelectedBehandlingId],
  (rettigheter, navAnsatt: NavAnsatt, erPaaVentMap, selectedBehandlingId) => {
    const erPaaVent = erPaaVentMap && getSelectedBehandlingId ? erPaaVentMap[selectedBehandlingId] : false;
    if (erPaaVent) {
      return true;
    }
    const { kanSaksbehandle } = navAnsatt;
    return !kanSaksbehandle || !rettigheter.writeAccess.isEnabled;
  });

const mapStateToProps = (state) => ({
  location: state.router.location,
  behandlingIdentifier: getBehandlingIdentifier(state),
  behandlingVersjon: getBehandlingVersjon(state),
  isPanelOpen: isRiskPanelOpen(state),
  readOnly: getReadOnly(state),
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    push,
    dispatchSubmitFailed,
    setRiskPanelOpen,
    resolveAksjonspunkter: resolveAp,
  }, dispatch),
});

export default trackRouteParam({
  paramName: 'risiko',
  parse: (isOpen) => isOpen === 'true',
  storeParam: setRiskPanelOpen,
  getParamFromStore: isRiskPanelOpen,
  isQueryParam: true,
})(connect(mapStateToProps, mapDispatchToProps)(RisikoklassifiseringIndexImpl));
