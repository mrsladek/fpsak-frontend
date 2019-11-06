import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import aktivitetStatuser from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import inntektskategorier from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import arbeidType from '@fpsak-frontend/kodeverk/src/arbeidType';
import opptjeningAktivitetType from '@fpsak-frontend/kodeverk/src/opptjeningAktivitetType';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import BeregningFaktaIndex from '@fpsak-frontend/fakta-beregning';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';


import withReduxProvider from '../../decorators/withRedux';

const behandling = {
  id: 1,
  versjon: 1,
};

const {
  VURDER_MOTTAR_YTELSE,
  VURDER_BESTEBEREGNING,
  VURDER_LONNSENDRING,
  VURDER_NYOPPSTARTET_FL,
  VURDER_AT_OG_FL_I_SAMME_ORGANISASJON,
  VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT,
  VURDER_MILITÆR_SIVILTJENESTE,
  VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD,
  VURDER_ETTERLONN_SLUTTPAKKE,
  FASTSETT_BG_KUN_YTELSE,
  VURDER_SN_NY_I_ARBEIDSLIVET,
} = faktaOmBeregningTilfelle;

const lagBeregningsgrunnlagAvklarAktiviteter = (
  aktiviteter,
) => ({
  faktaOmBeregning: {
    avklarAktiviteter: {
      aktiviteterTomDatoMapping: [
        {
          tom: '01.01.2020',
          aktiviteter,
        },
      ],
    },
    andelerForFaktaOmBeregning: [],
  },
});

const lagBeregningsgrunnlag = (
  andeler,
  faktaOmBeregning,
) => ({
  beregningsgrunnlagPeriode: [
    {
      beregningsgrunnlagPrStatusOgAndel: andeler.map((andel) => (
        {
          andelsnr: andel.andelsnr,
          aktivitetStatus: { kode: andel.aktivitetStatus },
          inntektskategori: { kode: andel.inntektskategori },
          erNyoppstartet: andel.erNyoppstartet,
        }
      )),
    },
  ],
  faktaOmBeregning,
});

const mapTilKodeliste = (arrayOfCodes) => arrayOfCodes.map((kode) => ({ kode }));

const lagAndel = (andelsnr, aktivitetStatus, inntektskategori) => (
  { andelsnr, aktivitetStatus: { kode: aktivitetStatus }, inntektskategori: { kode: inntektskategori } }
);

const standardFaktaArbeidstakerAndel = {
  ...lagAndel(1, aktivitetStatuser.ARBEIDSTAKER, inntektskategorier.ARBEIDSTAKER),
  visningsnavn: 'Bedriften (12345678)',
  belopReadOnly: 30000,
  lagtTilAvSaksbehandler: false,
  arbeidsforhold: {
    arbeidsgiverNavn: 'Bedriften',
    arbeidsgiverId: '12345678',
    arbeidsforholdId: null,
    startdato: '01.01.2019',
    opphoersdato: null,
    arbeidsforholdType: { kode: opptjeningAktivitetType.ARBEID, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
  },
};
const standardFaktaArbeidstakerAndel2 = {
  ...lagAndel(4, aktivitetStatuser.ARBEIDSTAKER, inntektskategorier.ARBEIDSTAKER),
  visningsnavn: 'Bedriften2 (12345679)',
  belopReadOnly: 30000,
  lagtTilAvSaksbehandler: false,
  arbeidsforhold: {
    arbeidsgiverNavn: 'Bedriften2',
    arbeidsgiverId: '12345679',
    arbeidsforholdId: null,
    startdato: '01.01.2019',
    opphoersdato: '01.01.2020',
    arbeidsforholdType: { kode: opptjeningAktivitetType.ARBEID, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
  },
};
const tidsbegrensetFaktaArbeidstakerAndel = {
  ...lagAndel(6, aktivitetStatuser.ARBEIDSTAKER, inntektskategorier.ARBEIDSTAKER),
  visningsnavn: 'Bedriften3 (12345671)',
  belopReadOnly: 30000,
  lagtTilAvSaksbehandler: false,
  arbeidsforhold: {
    arbeidsgiverNavn: 'Bedriften3',
    arbeidsgiverId: '12345671',
    arbeidsforholdId: null,
    startdato: '01.09.2019',
    opphoersdato: '01.01.2020',
    arbeidsforholdType: { kode: opptjeningAktivitetType.ARBEID, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
  },
};
const etterlønnSluttpakkeFaktaArbeidstakerAndel = {
  ...lagAndel(7, aktivitetStatuser.ARBEIDSTAKER, inntektskategorier.ARBEIDSTAKER),
  visningsnavn: 'Bedriften4 (795349533)',
  belopReadOnly: 30000,
  lagtTilAvSaksbehandler: false,
  arbeidsforhold: {
    arbeidsgiverNavn: 'Bedriften4',
    arbeidsgiverId: '795349533',
    arbeidsforholdId: null,
    startdato: '01.09.2019',
    opphoersdato: null,
    arbeidsforholdType: { kode: opptjeningAktivitetType.ETTERLONN_SLUTTPAKKE, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
  },
};
const standardFaktaDagpengerAndel = {
  ...lagAndel(3, aktivitetStatuser.DAGPENGER, inntektskategorier.DAGPENGER),
  visningsnavn: 'Dagpenger',
  belopReadOnly: 30000,
  lagtTilAvSaksbehandler: false,
};
const standardFaktaFrilansAndel = {
  ...lagAndel(2, aktivitetStatuser.FRILANSER, inntektskategorier.FRILANSER),
  visningsnavn: 'Frilans',
  belopReadOnly: 10000,
  lagtTilAvSaksbehandler: false,
};
const standardFaktaMilitærAndel = {
  ...lagAndel(5, aktivitetStatuser.MILITAER_ELLER_SIVIL, inntektskategorier.ARBEIDSTAKER),
  visningsnavn: 'Militær- eller sivilforsvarstjeneste',
  belopReadOnly: 10000,
  lagtTilAvSaksbehandler: false,
};
const standardFaktaYtelseAndel = {
  ...lagAndel(8, aktivitetStatuser.KUN_YTELSE, inntektskategorier.UDEFINERT),
  visningsnavn: 'Ytelse',
  belopReadOnly: 10000,
  lagtTilAvSaksbehandler: false,
};
const standardFaktaNæringAndel = {
  ...lagAndel(9, aktivitetStatuser.SELVSTENDIG_NAERINGSDRIVENDE, inntektskategorier.SELVSTENDIG_NAERINGSDRIVENDE),
  visningsnavn: 'Selvstendig næringsdrivende',
  belopReadOnly: 10000,
  lagtTilAvSaksbehandler: false,
};
const standardFaktaAAPAndel = {
  ...lagAndel(10, aktivitetStatuser.ARBEIDSAVKLARINGSPENGER, inntektskategorier.ARBEIDSAVKLARINGSPENGER),
  visningsnavn: 'Arbeidsavklaringspenger',
  belopReadOnly: 10000,
  lagtTilAvSaksbehandler: false,
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
  },
  {
    kode: opptjeningAktivitetType.AAP,
    navn: 'Arbeidsavklaringspenger',
  },
  {
    kode: opptjeningAktivitetType.MILITAR_ELLER_SIVILTJENESTE,
    navn: 'Militær- eller sivilforsvarstjeneste',
  },
  ],
  [kodeverkTyper.ARBEID_TYPE]: [{
    kode: arbeidType.LONN_UNDER_UTDANNING,
    navn: 'Lønn under utdanning',
  }, {
    kode: arbeidType.FRILANSER,
    navn: 'Frilanser',
  }],
  [kodeverkTyper.INNTEKTSKATEGORI]: [{
    kode: inntektskategorier.ARBEIDSTAKER,
    navn: 'Arbeidstaker',
  }, {
    kode: inntektskategorier.FRILANSER,
    navn: 'Frilanser',
  },
  {
    kode: inntektskategorier.DAGPENGER,
    navn: 'Dagpenger',
  },
  {
    kode: inntektskategorier.ARBEIDSTAKER_UTEN_FERIEPENGER,
    navn: 'Arbeidstaker uten feriepenger',
  },
  {
    kode: inntektskategorier.ARBEIDSAVKLARINGSPENGER,
    navn: 'Arbeidsavklaringspenger',
  },
  {
    kode: inntektskategorier.SELVSTENDIG_NÆRINGSDRIVENDE,
    navn: 'Selvstendig næringsdrivende',
  }],
  [kodeverkTyper.AKTIVITET_STATUS]: [{
    kode: aktivitetStatuser.ARBEIDSTAKER,
    navn: 'Arbeidstaker',
  }, {
    kode: aktivitetStatuser.FRILANSER,
    navn: 'Frilanser',
  },
  {
    kode: aktivitetStatuser.DAGPENGER,
    navn: 'Dagpenger',
  },
  {
    kode: aktivitetStatuser.SELVSTENDIG_NÆRINGSDRIVENDE,
    navn: 'Selvstendig næringsdrivende',
  },
  {
    kode: aktivitetStatuser.BRUKERS_ANDEL,
    navn: 'Brukers andel',
  },
  ],
};

const toggle = (openInfoPanels, togglePanel) => (value) => {
  const exists = openInfoPanels.some((op) => op === value);
  return togglePanel(exists ? [] : [value]);
};

export default {
  title: 'fakta/BeregningFaktaIndex',
  component: BeregningFaktaIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const AvklarAktiviteterFullAAPOgAndreAktiviteter = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.BEREGNING]);
  const aapAktivitet = {
    arbeidsforholdType: { kode: opptjeningAktivitetType.AAP, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
    fom: '01-01-2019',
    tom: '01-04-2020',
  };
  const arbeidsAktivitet = {
    ...standardFaktaArbeidstakerAndel.arbeidsforhold,
    fom: '01-01-2019',
    tom: '01-04-2020',
  };
  const aktiviteter = [
    aapAktivitet,
    arbeidsAktivitet,
  ];
  const beregningsgrunnlag = lagBeregningsgrunnlagAvklarAktiviteter(aktiviteter);

  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_AKTIVITETER,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
    />
  );
};


export const AvklartAktiviteterMedAksjonspunktIFaktaAvklaring = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.BEREGNING]);

  const aapAktivitet = {
    arbeidsforholdType: { kode: opptjeningAktivitetType.AAP, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
    fom: '01-01-2019',
    tom: '01-04-2020',
  };
  const arbeidsAktivitet = {
    ...standardFaktaArbeidstakerAndel.arbeidsforhold,
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const aktiviteter = [
    aapAktivitet,
    arbeidsAktivitet,
  ];
  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
  };
  const aapBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaAAPAndel.andelsnr,
    aktivitetStatus: standardFaktaAAPAndel.aktivitetStatus,
    inntektskategori: standardFaktaAAPAndel.inntektskategori,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
    aapBeregningsgrunnlagAndel,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaArbeidstakerAndel,
    standardFaktaAAPAndel,
  ];
  const refusjonskravSomKommerForSentListe = [
    {
      arbeidsgiverId: standardFaktaArbeidstakerAndel.arbeidsforhold.arbeidsforholdId,
      arbeidsgiverVisningsnavn: standardFaktaArbeidstakerAndel.visningsnavn,
    },
  ];
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT]),
    refusjonskravSomKommerForSentListe,
    andelerForFaktaOmBeregning,
    avklarAktiviteter: {
      aktiviteterTomDatoMapping: [
        {
          tom: '01-01-2020',
          aktiviteter,
        },
      ],
    },
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_AKTIVITETER,
        },
        status: {
          kode: aksjonspunktStatus.UTFORT,
        },
        begrunnelse: 'En begrunnelse for at arbeidsforholdet var gyldig.',
        kanLoses: true,
        erAktivt: true,
      },
      {
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
    />
  );
};

export const FrilansOgArbeidsforholdMedLønnendringOgNyoppstartet = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.BEREGNING]);
  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
  };
  const frilansBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaFrilansAndel.andelsnr,
    aktivitetStatus: standardFaktaFrilansAndel.aktivitetStatus,
    inntektskategori: standardFaktaFrilansAndel.inntektskategori,
    erNyoppstartet: null,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
    frilansBeregningsgrunnlagAndel,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaArbeidstakerAndel,
    standardFaktaFrilansAndel,
  ];
  const vurderMottarYtelse = {
    erFrilans: true,
    frilansMottarYtelse: null,
    frilansInntektPrMnd: 20000,
    arbeidstakerAndelerUtenIM: [],
  };
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_LONNSENDRING, VURDER_NYOPPSTARTET_FL, VURDER_MOTTAR_YTELSE]),
    arbeidsforholdMedLønnsendringUtenIM: [arbeidstakerBeregningsgrunnlagAndel],
    vurderMottarYtelse,
    andelerForFaktaOmBeregning,
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);

  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
    />
  );
};


export const DagpengerOgArbeidstakerMedVurderingAvBesteberegning = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.BEREGNING]);
  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
  };
  const dagpengerBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaDagpengerAndel.andelsnr,
    aktivitetStatus: standardFaktaDagpengerAndel.aktivitetStatus,
    inntektskategori: standardFaktaDagpengerAndel.inntektskategori,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
    dagpengerBeregningsgrunnlagAndel,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaArbeidstakerAndel,
    standardFaktaDagpengerAndel,
  ];
  const vurderBesteberegning = {
    skalHaBesteberegning: null,
    andeler: [standardFaktaDagpengerAndel, standardFaktaArbeidstakerAndel],
  };
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_BESTEBEREGNING]),
    vurderBesteberegning,
    andelerForFaktaOmBeregning,
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);

  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
    />
  );
};


export const KunArbeidstakerMedVurderingAvBesteberegning = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.BEREGNING]);
  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
  };
  const arbeidstakerBeregningsgrunnlagAndel2 = {
    andelsnr: standardFaktaArbeidstakerAndel2.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel2.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel2.inntektskategori,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
    arbeidstakerBeregningsgrunnlagAndel2,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaArbeidstakerAndel,
    standardFaktaArbeidstakerAndel2,
  ];
  const vurderBesteberegning = {
    skalHaBesteberegning: null,
    andeler: [standardFaktaArbeidstakerAndel2, standardFaktaArbeidstakerAndel],
  };
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_BESTEBEREGNING]),
    vurderBesteberegning,
    andelerForFaktaOmBeregning,
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
    />
  );
};


export const KunArbeidstakerMedVurderingSentRefusjonskrav = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.BEREGNING]);
  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
  };
  const arbeidstakerBeregningsgrunnlagAndel2 = {
    andelsnr: standardFaktaArbeidstakerAndel2.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel2.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel2.inntektskategori,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
    arbeidstakerBeregningsgrunnlagAndel2,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaArbeidstakerAndel,
    standardFaktaArbeidstakerAndel2,
  ];
  const refusjonskravSomKommerForSentListe = [
    {
      arbeidsgiverId: standardFaktaArbeidstakerAndel.arbeidsforhold.arbeidsforholdId,
      arbeidsgiverVisningsnavn: standardFaktaArbeidstakerAndel.visningsnavn,
    },
  ];
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT]),
    refusjonskravSomKommerForSentListe,
    andelerForFaktaOmBeregning,
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);

  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
    />
  );
};

export const FrilansOgArbeidsforholdISammeOrganisasjon = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.BEREGNING]);
  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
    arbeidsforhold: standardFaktaArbeidstakerAndel.arbeidsforhold,
  };
  const frilansBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaFrilansAndel.andelsnr,
    aktivitetStatus: standardFaktaFrilansAndel.aktivitetStatus,
    inntektskategori: standardFaktaFrilansAndel.inntektskategori,
    erNyoppstartet: null,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
    frilansBeregningsgrunnlagAndel,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaArbeidstakerAndel,
    standardFaktaFrilansAndel,
  ];
  const vurderMottarYtelse = {
    erFrilans: true,
    frilansMottarYtelse: null,
    frilansInntektPrMnd: 30000,
    arbeidstakerAndelerUtenIM: [],
  };
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_AT_OG_FL_I_SAMME_ORGANISASJON, VURDER_MOTTAR_YTELSE]),
    arbeidstakerOgFrilanserISammeOrganisasjonListe: [arbeidstakerBeregningsgrunnlagAndel],
    vurderMottarYtelse,
    andelerForFaktaOmBeregning,
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
    />
  );
};

export const VurderingAvMilitær = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.BEREGNING]);
  const arbeidstakerMilitærAndel = {
    andelsnr: standardFaktaMilitærAndel.andelsnr,
    aktivitetStatus: standardFaktaMilitærAndel.aktivitetStatus,
    inntektskategori: standardFaktaMilitærAndel.inntektskategori,
  };
  const andeler = [
    arbeidstakerMilitærAndel,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaMilitærAndel,
  ];
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_MILITÆR_SIVILTJENESTE]),
    andelerForFaktaOmBeregning,
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
    />
  );
};


export const FrilansOgTidsbegrensetArbeidsforholdISammeOrganisasjon = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.BEREGNING]);
  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: tidsbegrensetFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: tidsbegrensetFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: tidsbegrensetFaktaArbeidstakerAndel.inntektskategori,
    arbeidsforhold: tidsbegrensetFaktaArbeidstakerAndel.arbeidsforhold,
  };
  const frilansBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaFrilansAndel.andelsnr,
    aktivitetStatus: standardFaktaFrilansAndel.aktivitetStatus,
    inntektskategori: standardFaktaFrilansAndel.inntektskategori,
    erNyoppstartet: null,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
    frilansBeregningsgrunnlagAndel,
  ];
  const andelerForFaktaOmBeregning = [
    tidsbegrensetFaktaArbeidstakerAndel,
    standardFaktaFrilansAndel,
  ];
  const vurderMottarYtelse = {
    erFrilans: true,
    frilansMottarYtelse: null,
    frilansInntektPrMnd: 30000,
    arbeidstakerAndelerUtenIM: [],
  };
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_AT_OG_FL_I_SAMME_ORGANISASJON, VURDER_MOTTAR_YTELSE, VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD]),
    arbeidstakerOgFrilanserISammeOrganisasjonListe: [arbeidstakerBeregningsgrunnlagAndel],
    kortvarigeArbeidsforhold: [arbeidstakerBeregningsgrunnlagAndel],
    vurderMottarYtelse,
    andelerForFaktaOmBeregning,
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
    />
  );
};


export const KunTidsbegrensetArbeidsforhold = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.BEREGNING]);
  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: tidsbegrensetFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: tidsbegrensetFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: tidsbegrensetFaktaArbeidstakerAndel.inntektskategori,
    arbeidsforhold: tidsbegrensetFaktaArbeidstakerAndel.arbeidsforhold,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
  ];
  const andelerForFaktaOmBeregning = [
    tidsbegrensetFaktaArbeidstakerAndel,
  ];
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD]),
    kortvarigeArbeidsforhold: [arbeidstakerBeregningsgrunnlagAndel],
    andelerForFaktaOmBeregning,
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
    />
  );
};

export const VurderingAvEtterlønnSluttpakke = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.BEREGNING]);
  const etterlønnSluttpakkeBeregningsgrunnlagAndel = {
    andelsnr: etterlønnSluttpakkeFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: etterlønnSluttpakkeFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: etterlønnSluttpakkeFaktaArbeidstakerAndel.inntektskategori,
    arbeidsforhold: etterlønnSluttpakkeFaktaArbeidstakerAndel.arbeidsforhold,
  };
  const andeler = [
    etterlønnSluttpakkeBeregningsgrunnlagAndel,
  ];
  const andelerForFaktaOmBeregning = [
    etterlønnSluttpakkeFaktaArbeidstakerAndel,
  ];
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_ETTERLONN_SLUTTPAKKE]),
    andelerForFaktaOmBeregning,
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
    />
  );
};

export const FastsettingAvBeregningsgrunnlagForKunYtelse = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.BEREGNING]);
  const beregningsgrunnlagYtelseAndel = {
    andelsnr: standardFaktaYtelseAndel.andelsnr,
    aktivitetStatus: standardFaktaYtelseAndel.aktivitetStatus,
    inntektskategori: standardFaktaYtelseAndel.inntektskategori,
  };
  const andeler = [
    beregningsgrunnlagYtelseAndel,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaYtelseAndel,
  ];
  const kunYtelse = {
    fodendeKvinneMedDP: false,
    andeler,
  };
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([FASTSETT_BG_KUN_YTELSE]),
    andelerForFaktaOmBeregning,
    kunYtelse,
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
    />
  );
};

export const SelvstendigNæringNyIArbeidslivet = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.BEREGNING]);
  const beregningsgrunnlagNæringAndel = {
    andelsnr: standardFaktaNæringAndel.andelsnr,
    aktivitetStatus: standardFaktaNæringAndel.aktivitetStatus,
    inntektskategori: standardFaktaNæringAndel.inntektskategori,
  };
  const andeler = [
    beregningsgrunnlagNæringAndel,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaNæringAndel,
  ];
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_SN_NY_I_ARBEIDSLIVET]),
    andelerForFaktaOmBeregning,
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
    />
  );
};

export const KombinasjonstestForFaktapanel = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.BEREGNING]);

  const aapAktivitet = {
    arbeidsforholdType: { kode: opptjeningAktivitetType.AAP, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
    fom: '01-01-2019',
    tom: '01-04-2020',
  };
  const arbeidsAktivitet = {
    ...standardFaktaArbeidstakerAndel.arbeidsforhold,
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const arbeidsAktivitet2 = {
    ...standardFaktaArbeidstakerAndel2.arbeidsforhold,
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const tidsbegrensetarbeidsAktivitet = {
    ...tidsbegrensetFaktaArbeidstakerAndel.arbeidsforhold,
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const næringAktivitet = {
    arbeidsforholdType: { kode: opptjeningAktivitetType.NARING, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const etterlonnSluttpakkeAktivitet = {
    ...etterlønnSluttpakkeFaktaArbeidstakerAndel.arbeidsforhold,
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const frilansAktivitet = {
    arbeidsforholdType: { kode: opptjeningAktivitetType.FRILANS, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const militærAktivitet = {
    arbeidsforholdType: { kode: opptjeningAktivitetType.MILITAR_ELLER_SIVILTJENESTE, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const aktiviteter = [
    aapAktivitet,
    arbeidsAktivitet,
    arbeidsAktivitet2,
    næringAktivitet,
    tidsbegrensetarbeidsAktivitet,
    etterlonnSluttpakkeAktivitet,
    frilansAktivitet,
    militærAktivitet,
  ];
  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
  };
  const arbeidstakerBeregningsgrunnlagAndel2 = {
    andelsnr: standardFaktaArbeidstakerAndel2.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel2.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel2.inntektskategori,
    arbeidsforhold: standardFaktaArbeidstakerAndel2.arbeidsforhold,

  };
  const tidsbegrensetarbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: tidsbegrensetFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: tidsbegrensetFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: tidsbegrensetFaktaArbeidstakerAndel.inntektskategori,
    arbeidsforhold: tidsbegrensetFaktaArbeidstakerAndel.arbeidsforhold,
  };
  const beregningsgrunnlagNæringAndel = {
    andelsnr: standardFaktaNæringAndel.andelsnr,
    aktivitetStatus: standardFaktaNæringAndel.aktivitetStatus,
    inntektskategori: standardFaktaNæringAndel.inntektskategori,
  };
  const aapBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaAAPAndel.andelsnr,
    aktivitetStatus: standardFaktaAAPAndel.aktivitetStatus,
    inntektskategori: standardFaktaAAPAndel.inntektskategori,
  };
  const etterlønnSluttpakkeBeregningsgrunnlagAndel = {
    andelsnr: etterlønnSluttpakkeFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: etterlønnSluttpakkeFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: etterlønnSluttpakkeFaktaArbeidstakerAndel.inntektskategori,
    arbeidsforhold: etterlønnSluttpakkeFaktaArbeidstakerAndel.arbeidsforhold,
  };
  const frilansBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaFrilansAndel.andelsnr,
    aktivitetStatus: standardFaktaFrilansAndel.aktivitetStatus,
    inntektskategori: standardFaktaFrilansAndel.inntektskategori,
    erNyoppstartet: null,
  };
  const militærBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaMilitærAndel.andelsnr,
    aktivitetStatus: standardFaktaMilitærAndel.aktivitetStatus,
    inntektskategori: standardFaktaMilitærAndel.inntektskategori,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
    arbeidstakerBeregningsgrunnlagAndel2,
    tidsbegrensetarbeidstakerBeregningsgrunnlagAndel,
    beregningsgrunnlagNæringAndel,
    aapBeregningsgrunnlagAndel,
    etterlønnSluttpakkeBeregningsgrunnlagAndel,
    frilansBeregningsgrunnlagAndel,
    militærBeregningsgrunnlagAndel,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaArbeidstakerAndel,
    standardFaktaArbeidstakerAndel2,
    tidsbegrensetFaktaArbeidstakerAndel,
    standardFaktaNæringAndel,
    standardFaktaAAPAndel,
    etterlønnSluttpakkeFaktaArbeidstakerAndel,
    standardFaktaFrilansAndel,
    standardFaktaMilitærAndel,
  ];
  const refusjonskravSomKommerForSentListe = [
    {
      arbeidsgiverId: standardFaktaArbeidstakerAndel.arbeidsforhold.arbeidsforholdId,
      arbeidsgiverVisningsnavn: standardFaktaArbeidstakerAndel.visningsnavn,
    },
  ];
  const vurderMottarYtelse = {
    erFrilans: true,
    frilansMottarYtelse: null,
    frilansInntektPrMnd: 30000,
    arbeidstakerAndelerUtenIM: [standardFaktaArbeidstakerAndel2],
  };
  const vurderBesteberegning = {
    skalHaBesteberegning: null,
    andeler: andelerForFaktaOmBeregning,
  };

  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT, VURDER_SN_NY_I_ARBEIDSLIVET, VURDER_NYOPPSTARTET_FL,
      VURDER_ETTERLONN_SLUTTPAKKE, VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD, VURDER_BESTEBEREGNING, VURDER_AT_OG_FL_I_SAMME_ORGANISASJON, VURDER_MOTTAR_YTELSE,
      VURDER_MILITÆR_SIVILTJENESTE]),
    refusjonskravSomKommerForSentListe,
    arbeidstakerOgFrilanserISammeOrganisasjonListe: [arbeidstakerBeregningsgrunnlagAndel2],
    kortvarigeArbeidsforhold: [tidsbegrensetarbeidstakerBeregningsgrunnlagAndel],
    vurderBesteberegning,
    andelerForFaktaOmBeregning,
    vurderMottarYtelse,
    avklarAktiviteter: {
      aktiviteterTomDatoMapping: [
        {
          tom: '01-01-2020',
          aktiviteter,
        },
      ],
    },
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_AKTIVITETER,
        },
        status: {
          kode: aksjonspunktStatus.UTFORT,
        },
        begrunnelse: 'En begrunnelse for at arbeidsforholdet var gyldig.',
        kanLoses: true,
        erAktivt: true,
      },
      {
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
    />
  );
};


export const OverstyringAvInntekt = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.BEREGNING]);
  const arbeidsAktivitet = {
    ...standardFaktaArbeidstakerAndel.arbeidsforhold,
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const arbeidsAktivitet2 = {
    ...standardFaktaArbeidstakerAndel2.arbeidsforhold,
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const aktiviteter = [
    arbeidsAktivitet,
    arbeidsAktivitet2,
  ];

  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
  };
  const arbeidstakerBeregningsgrunnlagAndel2 = {
    andelsnr: standardFaktaArbeidstakerAndel2.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel2.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel2.inntektskategori,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
    arbeidstakerBeregningsgrunnlagAndel2,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaArbeidstakerAndel,
    standardFaktaArbeidstakerAndel2,
  ];
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: [],
    andelerForFaktaOmBeregning,
    avklarAktiviteter: {
      aktiviteterTomDatoMapping: [
        {
          tom: '01-01-2020',
          aktiviteter,
        },
      ],
    },
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);

  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
    />
  );
};