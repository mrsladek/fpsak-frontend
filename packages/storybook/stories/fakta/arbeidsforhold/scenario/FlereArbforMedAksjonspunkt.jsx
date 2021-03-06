import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';

export const iay = {
  inntektsmeldinger: [
    {
      arbeidsgiver: 'KIWI',
      arbeidsgiverOrgnr: '999999999',
      arbeidsgiverStartdato: '2019-06-03',
      innsendingstidspunkt: '2020-05-14T00:12:17',
      utsettelsePerioder: [],
      graderingPerioder: [],
      getRefusjonBeløpPerMnd: {
        verdi: 36181,
        indexKey: '36181.00',
      },
    },
    {
      arbeidsgiver: 'REMA 1000',
      arbeidsgiverOrgnr: '999999998',
      arbeidsgiverStartdato: '2019-05-13',
      innsendingstidspunkt: '2019-04-19T21:30:17',
      utsettelsePerioder: [
        {
          fom: '2019-06-03',
          tom: '2019-10-11',
          utsettelseArsak: {
            kode: 'ARBEID',
            kodeverk: 'UTSETTELSE_AARSAK_TYPE',
          },
        },
        {
          fom: '2019-10-14',
          tom: '2020-02-14',
          utsettelseArsak: {
            kode: 'ARBEID',
            kodeverk: 'UTSETTELSE_AARSAK_TYPE',
          },
        },
      ],
      graderingPerioder: [
        {
          fom: '2019-05-13',
          tom: '2019-05-31',
          arbeidsprosent: 80,
        },
      ],
      getRefusjonBeløpPerMnd: {
        verdi: 36180.88,
        indexKey: '36180.88',
      },
    },
  ],
  relatertTilgrensendeYtelserForSoker: [
    {
      relatertYtelseType: 'FORELDREPENGER',
      tilgrensendeYtelserListe: [
        {
          relatertYtelseType: 'FORELDREPENGER',
          periodeFraDato: '2019-05-13',
          periodeTilDato: '2020-02-14',
          status: 'LØPENDE',
          saksNummer: '139110930',
        },
        {
          relatertYtelseType: 'FORELDREPENGER',
          periodeFraDato: '2017-02-07',
          periodeTilDato: '2018-03-16',
          status: 'AVSLUTTET',
          saksNummer: null,
        },
      ],
    },
    {
      relatertYtelseType: 'ENGANGSSTØNAD',
      tilgrensendeYtelserListe: [],
    },
    {
      relatertYtelseType: 'SYKEPENGER',
      tilgrensendeYtelserListe: [
        {
          relatertYtelseType: 'SYKEPENGER',
          periodeFraDato: '2019-02-01',
          periodeTilDato: '2019-05-12',
          status: 'AVSLUTTET',
          saksNummer: null,
        },
        {
          relatertYtelseType: 'SYKEPENGER',
          periodeFraDato: '2018-11-07',
          periodeTilDato: '2019-01-31',
          status: 'AVSLUTTET',
          saksNummer: null,
        },
        {
          relatertYtelseType: 'SYKEPENGER',
          periodeFraDato: '2018-08-24',
          periodeTilDato: '2018-08-29',
          status: 'ÅPEN',
          saksNummer: null,
        },
        {
          relatertYtelseType: 'SYKEPENGER',
          periodeFraDato: '2018-07-23',
          periodeTilDato: '2018-07-23',
          status: 'AVSLUTTET',
          saksNummer: null,
        },
        {
          relatertYtelseType: 'SYKEPENGER',
          periodeFraDato: '2018-05-15',
          periodeTilDato: '2018-05-22',
          status: 'ÅPEN',
          saksNummer: null,
        },
      ],
    },
    {
      relatertYtelseType: 'DAGPENGER',
      tilgrensendeYtelserListe: [],
    },
    {
      relatertYtelseType: 'ARBEIDSAVKLARINGSPENGER',
      tilgrensendeYtelserListe: [],
    },
    {
      relatertYtelseType: 'SVANGERSKAPSPENGER',
      tilgrensendeYtelserListe: [],
    },
    {
      relatertYtelseType: 'OMP',
      tilgrensendeYtelserListe: [],
    },
    {
      relatertYtelseType: 'OLP',
      tilgrensendeYtelserListe: [],
    },
    {
      relatertYtelseType: 'PSB',
      tilgrensendeYtelserListe: [],
    },
    {
      relatertYtelseType: 'PPN',
      tilgrensendeYtelserListe: [],
    },
    {
      relatertYtelseType: 'FRISINN',
      tilgrensendeYtelserListe: [],
    },
  ],
  relatertTilgrensendeYtelserForAnnenForelder: [
    {
      relatertYtelseType: 'FORELDREPENGER',
      tilgrensendeYtelserListe: [],
    },
    {
      relatertYtelseType: 'ENGANGSSTØNAD',
      tilgrensendeYtelserListe: [],
    },
  ],
  innvilgetRelatertTilgrensendeYtelserForAnnenForelder: [
    {
      relatertYtelseType: 'FORELDREPENGER',
      tilgrensendeYtelserListe: [],
    },
    {
      relatertYtelseType: 'ENGANGSSTØNAD',
      tilgrensendeYtelserListe: [],
    },
  ],
  arbeidsforhold: [
    {
      id: '999999999-c14b0c78-eb1f-4d8e-b73f-7f385a5e67d2',
      navn: 'KIWI',
      arbeidsgiverIdentifikator: '999999999',
      arbeidsgiverIdentifiktorGUI: '999999999',
      arbeidsforholdId: 'c14b0c78-eb1f-4d8e-b73f-7f385a5e67d2',
      eksternArbeidsforholdId: 'V999999999R50049082SS157848L0001',
      begrunnelse: null,
      erstatterArbeidsforholdId: null,
      handlingType: null,
      kilde: {
        navn: 'AA-Registeret',
      },
      stillingsprosent: 100,
      skjaeringstidspunkt: '2019-05-13',
      mottattDatoInntektsmelding: '2020-05-14',
      fomDato: '2019-06-03',
      tomDato: null,
      harErstattetEttEllerFlere: false,
      ikkeRegistrertIAaRegister: false,
      tilVurdering: false,
      vurderOmSkalErstattes: false,
      brukArbeidsforholdet: true,
      fortsettBehandlingUtenInntektsmelding: false,
      erNyttArbeidsforhold: false,
      erEndret: false,
      erSlettet: null,
      brukMedJustertPeriode: false,
      lagtTilAvSaksbehandler: false,
      basertPaInntektsmelding: false,
      brukPermisjon: null,
      inntektMedTilBeregningsgrunnlag: null,
      permisjoner: [],
      overstyrtTom: null,
      kanOppretteNyttArbforFraIM: false,
    },
    {
      id: '999999998-null',
      navn: 'REMA 1000',
      arbeidsgiverIdentifikator: '999999998',
      arbeidsgiverIdentifiktorGUI: '999999998',
      arbeidsforholdId: null,
      eksternArbeidsforholdId: null,
      begrunnelse: null,
      erstatterArbeidsforholdId: null,
      handlingType: null,
      kilde: {
        navn: 'Inntektsmelding',
      },
      stillingsprosent: 100,
      skjaeringstidspunkt: '2019-05-13',
      mottattDatoInntektsmelding: '2019-04-19',
      fomDato: '2020-05-15',
      tomDato: null,
      harErstattetEttEllerFlere: true,
      ikkeRegistrertIAaRegister: true,
      tilVurdering: true,
      vurderOmSkalErstattes: false,
      brukArbeidsforholdet: null,
      fortsettBehandlingUtenInntektsmelding: null,
      erNyttArbeidsforhold: null,
      erEndret: false,
      erSlettet: null,
      brukMedJustertPeriode: false,
      lagtTilAvSaksbehandler: false,
      basertPaInntektsmelding: false,
      brukPermisjon: null,
      inntektMedTilBeregningsgrunnlag: null,
      permisjoner: [],
      overstyrtTom: null,
      kanOppretteNyttArbforFraIM: true,
    },
    {
      id: '999999999-b269bf8f-c90d-45c7-ae4f-53ae6d8b7dce',
      navn: 'KIWI',
      arbeidsgiverIdentifikator: '999999999',
      arbeidsgiverIdentifiktorGUI: '999999999',
      arbeidsforholdId: 'b269bf8f-c90d-45c7-ae4f-53ae6d8b7dce',
      eksternArbeidsforholdId: null,
      begrunnelse: null,
      erstatterArbeidsforholdId: null,
      handlingType: null,
      kilde: {
        navn: 'AA-Registeret',
      },
      stillingsprosent: 100,
      skjaeringstidspunkt: '2019-05-13',
      mottattDatoInntektsmelding: null,
      fomDato: '2015-05-01',
      tomDato: '2019-06-02',
      harErstattetEttEllerFlere: null,
      ikkeRegistrertIAaRegister: false,
      tilVurdering: true,
      vurderOmSkalErstattes: false,
      brukArbeidsforholdet: null,
      fortsettBehandlingUtenInntektsmelding: null,
      erNyttArbeidsforhold: null,
      erEndret: false,
      erSlettet: null,
      brukMedJustertPeriode: false,
      lagtTilAvSaksbehandler: false,
      basertPaInntektsmelding: false,
      brukPermisjon: null,
      inntektMedTilBeregningsgrunnlag: null,
      permisjoner: [],
      overstyrtTom: null,
      kanOppretteNyttArbforFraIM: null,
    },
  ],
  skalKunneLeggeTilNyeArbeidsforhold: false,
  skalKunneLageArbeidsforholdBasertPaInntektsmelding: true,
};

export const ap = {
  definisjon: {
    kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
  },
  status: {
    kode: aksjonspunktStatus.OPPRETTET,
  },
  begrunnelse: undefined,
  kanLoses: true,
  erAktivt: true,
};
