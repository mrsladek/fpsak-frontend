import React from 'react';

import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import { faktaPanelCodes } from '@fpsak-frontend/konstanter';
import FeilutbetalingFaktaIndex from '@fpsak-frontend/fakta-feilutbetaling';

import tilbakekrevingApi from '../data/tilbakekrevingBehandlingApi';

const faktaPanelDefinisjoner = [{
  urlCode: faktaPanelCodes.FEILUTBETALING,
  textCode: 'TilbakekrevingFakta.FaktaFeilutbetaling',
  aksjonspunkterCodes: [aksjonspunktCodesTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING],
  endpoints: [tilbakekrevingApi.FEILUTBETALING_AARSAK],
  renderComponent: (props) => <FeilutbetalingFaktaIndex {...props} />,
  showComponent: ({ feilutbetalingFakta }) => !!feilutbetalingFakta,
  getData: ({ feilutbetalingFakta, fagsak, fpsakKodeverk }) => (
    { feilutbetalingFakta, fagsakYtelseTypeKode: fagsak.fagsakYtelseType.kode, fpsakKodeverk }
  ),
}];

export default faktaPanelDefinisjoner;