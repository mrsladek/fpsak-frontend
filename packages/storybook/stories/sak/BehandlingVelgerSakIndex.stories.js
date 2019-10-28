import React, { useState } from 'react';
import {
  withKnobs, object, number, boolean,
} from '@storybook/addon-knobs';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import BehandlingVelgerSakIndex from '@fpsak-frontend/sak-behandling-velger';

import withReduxAndRouterProvider from '../../decorators/withReduxAndRouter';

const BEHANDLING_TYPE_KODEVERK = 'BEHANDLING_TYPE';
const BEHANDLING_STATUS_KODEVERK = 'BEHANDLING_STATUS';

const behandlinger = [{
  id: 1,
  versjon: 2,
  type: {
    kode: behandlingType.FORSTEGANGSSOKNAD,
    kodeverk: BEHANDLING_TYPE_KODEVERK,
  },
  status: {
    kode: behandlingStatus.AVSLUTTET,
    kodeverk: BEHANDLING_STATUS_KODEVERK,
  },
  fagsakId: 3,
  opprettet: '2017-08-02T00:54:25.455',
  avsluttet: '2017-08-03T00:54:25.455',
  endret: '2017-08-03T00:54:25.455',
  behandlendeEnhetId: '4812',
  behandlendeEnhetNavn: 'NAV Familie- og pensjonsytelse Bergen',
  links: [],
  gjeldendeVedtak: true,
}, {
  id: 2,
  versjon: 2,
  type: {
    kode: behandlingType.DOKUMENTINNSYN,
    kodeverk: BEHANDLING_TYPE_KODEVERK,
  },
  status: {
    kode: behandlingStatus.OPPRETTET,
    kodeverk: BEHANDLING_STATUS_KODEVERK,
  },
  fagsakId: 3,
  opprettet: '2017-08-02T00:54:25.455',
  behandlendeEnhetId: '4812',
  behandlendeEnhetNavn: 'NAV Familie- og pensjonsytelse Bergen',
  links: [],
  gjeldendeVedtak: true,
}, {
  id: 3,
  versjon: 2,
  type: {
    kode: behandlingType.REVURDERING,
    kodeverk: BEHANDLING_TYPE_KODEVERK,
  },
  status: {
    kode: behandlingStatus.OPPRETTET,
    kodeverk: BEHANDLING_STATUS_KODEVERK,
  },
  fagsakId: 3,
  opprettet: '2017-08-02T00:54:25.455',
  behandlendeEnhetId: '4812',
  behandlendeEnhetNavn: 'NAV Familie- og pensjonsytelse Bergen',
  links: [],
  gjeldendeVedtak: true,
  førsteÅrsak: {
    behandlingArsakType: {
      kode: 'RE-ENDR-BER-GRUN',
    },
    erAutomatiskRevurdering: true,
    manueltOpprettet: true,
  },
}];

const alleKodeverk = {
  [kodeverkTyper.BEHANDLING_STATUS]: [{
    kode: behandlingStatus.AVSLUTTET,
    navn: 'Avsluttet',
    kodeverk: BEHANDLING_STATUS_KODEVERK,
  }, {
    kode: behandlingStatus.OPPRETTET,
    navn: 'Opprettet',
    kodeverk: BEHANDLING_STATUS_KODEVERK,
  }],
  [kodeverkTyper.BEHANDLING_TYPE]: [{
    kode: behandlingType.FORSTEGANGSSOKNAD,
    navn: 'Førstegangssøknad',
    kodeverk: BEHANDLING_TYPE_KODEVERK,
  }, {
    kode: behandlingType.DOKUMENTINNSYN,
    navn: 'Dokumentinnsyn',
    kodeverk: BEHANDLING_TYPE_KODEVERK,
  }],
};

export default {
  title: 'sak/BehandlingVelgerSakIndex',
  component: BehandlingVelgerSakIndex,
  decorators: [withKnobs, withReduxAndRouterProvider],
};

export const visPanelForValgAvBehandlinger = () => {
  const [visAlle, toggleVisAlle] = useState(false);
  return (
    <div style={{ width: '600px' }}>
      <BehandlingVelgerSakIndex
        behandlinger={object('behandlinger', behandlinger)}
        saksnummer={1}
        noExistingBehandlinger={boolean('noExistingBehandlinger', false)}
        behandlingId={number('behandlingId', 1)}
        showAll={visAlle}
        toggleShowAll={() => toggleVisAlle(!visAlle)}
        alleKodeverk={alleKodeverk}
      />
    </div>
  );
};