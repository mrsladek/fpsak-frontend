import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import arbeidType from '@fpsak-frontend/kodeverk/src/arbeidType';
import opptjeningAktivitetType from '@fpsak-frontend/kodeverk/src/opptjeningAktivitetType';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import OpptjeningFaktaIndex from '@fpsak-frontend/fakta-opptjening';

import withReduxProvider from '../../decorators/withRedux';

const behandling = {
  id: 1,
  versjon: 1,
};

const opptjeningNårEnHarAksjonspunkt = {
  fastsattOpptjening: {
    opptjeningFom: '2018-12-25',
    opptjeningTom: '2019-10-24',
    opptjeningperiode: {
      måneder: 0,
      dager: 0,
    },
    fastsattOpptjeningAktivitetList: [],
  },
  opptjeningAktivitetList: [{
    aktivitetType: {
      kode: opptjeningAktivitetType.NARING,
    },
    originalFom: null,
    originalTom: null,
    opptjeningFom: '1995-09-14',
    opptjeningTom: '9999-12-31',
    arbeidsgiver: 'EQUINOR ASA AVD STATOIL SOKKELVIRKSOMHET',
    arbeidsgiverNavn: null,
    oppdragsgiverOrg: '973861778',
    arbeidsgiverIdentifikator: '973861778',
    privatpersonNavn: null,
    privatpersonFødselsdato: null,
    arbeidsforholdRef: null,
    stillingsandel: 100,
    naringRegistreringsdato: '1995-09-14',
    erManueltOpprettet: false,
    erGodkjent: null,
    erEndret: false,
    begrunnelse: null,
    erPeriodeEndret: false,
  }, {
    aktivitetType: {
      kode: opptjeningAktivitetType.ARBEID,
    },
    originalFom: null,
    originalTom: null,
    opptjeningFom: '2018-01-01',
    opptjeningTom: '2018-11-01',
    arbeidsgiver: 'EQUINOR ASA AVD STATOIL SOKKELVIRKSOMHET',
    arbeidsgiverNavn: null,
    oppdragsgiverOrg: '973861778',
    arbeidsgiverIdentifikator: '973861778',
    privatpersonNavn: null,
    privatpersonFødselsdato: null,
    arbeidsforholdRef: 'e5ec2632-0e31-4c8f-8190-d942053f847b',
    stillingsandel: 100,
    naringRegistreringsdato: '1995-09-14',
    erManueltOpprettet: false,
    erGodkjent: true,
    erEndret: false,
    begrunnelse: null,
    erPeriodeEndret: false,
  }],
};

const opptjeningUtenAksjonspunkt = {
  fastsattOpptjening: {
    opptjeningFom: '2018-11-30',
    opptjeningTom: '2019-09-29',
    opptjeningperiode: {
      dager: 4,
      månder: 10,
    },
  },
  opptjeningAktivitetList: [{
    opptjeningFom: '2017-01-01',
    opptjeningTom: '9999-12-31',
    aktivitetType: {
      kode: opptjeningAktivitetType.ARBEID,
    },
    arbeidsforholdRef: 'bf623ff9-6ffb-4a81-b9f1-2648e5530a47',
    arbeidsgiver: 'EQUINOR ASA AVD STATOIL SOKKELVIRKSOMHET',
    arbeidsgiverIdentifikator: '973861778',
    erEndret: false,
    erGodkjent: true,
    erManueltOpprettet: false,
    erPeriodeEndret: false,
    aringRegistreringsdato: '1995-09-14',
    oppdragsgiverOrg: '973861778',
    stillingsandel: 50,
  }, {
    opptjeningFom: '2017-01-01',
    opptjeningTom: '9999-12-31',
    aktivitetType: {
      kode: opptjeningAktivitetType.DAGPENGER,
    },
    arbeidsforholdRef: 'bf623ff9-6ffb-4a81-b9f1-2648e5530a47',
    arbeidsgiver: 'EQUINOR ASA AVD STATOIL SOKKELVIRKSOMHET',
    arbeidsgiverIdentifikator: '973861778',
    erEndret: false,
    erGodkjent: true,
    erManueltOpprettet: false,
    erPeriodeEndret: false,
    aringRegistreringsdato: '1995-09-14',
    oppdragsgiverOrg: '973861778',
    stillingsandel: 50,
  }],
};

const merknaderFraBeslutter = {
  notAccepted: false,
};

const alleKodeverk = {
  [kodeverkTyper.OPPTJENING_AKTIVITET_TYPE]: [{
    kode: opptjeningAktivitetType.ARBEID,
    navn: 'Arbeid',
  }, {
    kode: opptjeningAktivitetType.FRILANS,
    navn: 'Frilans',
  }, {
    kode: opptjeningAktivitetType.DAGPENGER,
    navn: 'Dagpenger',
  }, {
    kode: opptjeningAktivitetType.NARING,
    navn: 'Næring',
  }],
  [kodeverkTyper.ARBEID_TYPE]: [{
    kode: arbeidType.LONN_UNDER_UTDANNING,
    navn: 'Lønn under utdanning',
  }, {
    kode: arbeidType.FRILANSER,
    navn: 'Frilanser',
  }],
};

const toggle = (openInfoPanels, togglePanel) => (value) => {
  const exists = openInfoPanels.some((op) => op === value);
  return togglePanel(exists ? [] : [value]);
};

export default {
  title: 'fakta/OpptjeningFaktaIndex',
  component: OpptjeningFaktaIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visAksjonspunktForOpptjeningsvilkåret = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.OPPTJENINGSVILKARET]);
  return (
    <OpptjeningFaktaIndex
      behandling={behandling}
      opptjening={object('opptjening', opptjeningNårEnHarAksjonspunkt)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
    />
  );
};

export const visPanelUtenAksjonpunkt = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.OPPTJENINGSVILKARET]);
  return (
    <OpptjeningFaktaIndex
      behandling={behandling}
      opptjening={object('opptjening', opptjeningUtenAksjonspunkt)}
      aksjonspunkter={[]}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{}}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
    />
  );
};