const aksjonspunktCodes = {
  TERMINBEKREFTELSE: '5001',
  ADOPSJONSDOKUMENTAJON: '5004',
  OM_ADOPSJON_GJELDER_EKTEFELLES_BARN: '5005',
  OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE: '5006',
  SOKNADSFRISTVILKARET: '5007',
  OMSORGSOVERTAKELSE: '5008',
  TILLEGGSOPPLYSNINGER: '5009',
  MEDLEMSKAP: '5010',
  MANUELL_VURDERING_AV_OMSORGSVILKARET: '5011',
  REGISTRER_PAPIRSOKNAD_ENGANGSSTONAD: '5012',
  MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_2_LEDD: '5013',
  MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_4_LEDD: '5014',
  FORESLA_VEDTAK: '5015',
  FATTER_VEDTAK: '5016',
  SOKERS_OPPLYSNINGSPLIKT_MANU: '5017',
  VEDTAK_UTEN_TOTRINNSKONTROLL: '5018',
  AVKLAR_LOVLIG_OPPHOLD: '5019',
  AVKLAR_OM_BRUKER_ER_BOSATT: '5020',
  AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE: '5021',
  AVKLAR_PERSONSTATUS: '5022',
  AVKLAR_OPPHOLDSRETT: '5023',
  VARSEL_REVURDERING_ETTERKONTROLL: '5025',
  VARSEL_REVURDERING_MANUELL: '5026',
  SJEKK_MANGLENDE_FODSEL: '5027',
  FORESLA_VEDTAK_MANUELT: '5028',
  AVKLAR_VERGE: '5030',
  AVKLAR_OM_STONAD_GJELDER_SAMME_BARN: '5031',
  AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN: '5032',
  VURDERE_ANNEN_YTELSE: '5033',
  VURDERE_DOKUMENT: '5034',
  FORMKRAV_KLAGE_NFP: '5082',
  FORMKRAV_KLAGE_NK: '5083',
  BEHANDLE_KLAGE_NFP: '5035',
  BEHANDLE_KLAGE_NK: '5036',
  VURDER_INNSYN: '5037',
  FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS: '5038',
  VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE: '5039',
  REGISTRER_PAPIRSOKNAD_FORELDREPENGER: '5040',
  REGISTRER_PAPIR_ENDRINGSØKNAD_FORELDREPENGER: '5057',
  FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE: '5042',
  VURDER_SOKNADSFRIST_FORELDREPENGER: '5043',
  VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT: '5044',
  AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN: '5045',
  FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD: '5047',
  FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET: '5049',
  VURDER_GRADERING_UTEN_BEREGNINGSGRUNNLAG: '5050',
  VURDER_PERIODER_MED_OPPTJENING: '5051',
  AVKLAR_AKTIVITETER: '5052',
  AVKLAR_FORTSATT_MEDLEMSKAP: '5053',
  AVKLAR_VILKAR_FOR_FORELDREANSVAR: '5054',
  KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST: '5055',
  VURDER_FAKTA_FOR_ATFL_SN: '5058',
  KONTROLL_AV_MAUNELT_OPPRETTET_REVURDERINGSBEHANDLING: '5056',
  MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG: '5060',
  MANUELL_KONTROLL_AV_OM_BRUKER_HAR_OMSORG: '5061',
  VEDTAK_OVERSTYRTE_VURDERINGER: '5062',
  INNHENT_DOKUMENTASJON_FRA_UTENLANDS_TRYGDEMYNDIGHET: '5068',
  AVKLAR_UTTAK: '5070',
  FASTSETT_UTTAKPERIODER: '5071',
  TILKNYTTET_STORTINGET: '5072',
  KONTROLLER_REALITETSBEHANDLING_ELLER_KLAGE: '5073',
  KONTROLLER_OPPLYSNINGER_OM_MEDLEMSKAP: '5074',
  KONTROLLER_OPPLYSNINGER_OM_FORDELING_AV_STØNADSPERIODEN: '5075',
  KONTROLLER_OPPLYSNINGER_OM_DØD: '5076',
  KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST: '5077',
  KONTROLLER_TILSTØTENDE_YTELSER_INNVILGET: '5078',
  KONTROLLER_TILSTØTENDE_YTELSER_OPPHØRT: '5079',
  AVKLAR_ARBEIDSFORHOLD: '5080',
  AVKLAR_FØRSTE_UTTAKSDATO: '5081',
  VURDERING_AV_FORMKRAV_KLAGE_NFP: '5082',
  VURDER_FEILUTBETALING: '5084',
  VURDER_INNTREKK: '5085',
  AVKLAR_ANNEN_FORELDER_RETT: '5086',
  VURDER_DEKNINGSGRAD: '5087',
  VURDERING_AV_FORMKRAV_KLAGE_KA: '5083',
  TILBAKEKREVING: '5084',
  VURDER_TILBAKEKREVING: '5002',
  VURDER_FORELDELSE: '5003',
  SOKERS_OPPLYSNINGSPLIKT_OVST: '6002',
  OVERSTYR_FODSELSVILKAR: '6003',
  OVERSTYR_ADOPSJONSVILKAR: '6004',
  OVERSTYR_MEDLEMSKAPSVILKAR: '6005',
  OVERSTYR_SOKNADSFRISTVILKAR: '6006',
  OVERSTYR_BEREGNING: '6007',
  OVERSTYRING_AV_UTTAKPERIODER: '6008',
  OVERSTYR_FODSELSVILKAR_FAR_MEDMOR: '6009',
  OVERSTYRING_AV_ADOPSJONSVILKÅRET_FP: '6010',
  OVERSTYRING_AV_OPPTJENINGSVILKARET: '6011',
  OVERSTYR_LØPENDE_MEDLEMSKAPSVILKAR: '6012',
  OVERSTYR_AVKLAR_FAKTA_UTTAK: '6013',
  MANUELL_AVKLAR_FAKTA_UTTAK: '6070',
  AUTO_MANUELT_SATT_PÅ_VENT: '7001',
  AUTO_VENT_PÅ_FODSELREGISTRERING: '7002',
  AUTO_VENTER_PÅ_KOMPLETT_SOKNAD: '7003',
  AVKLAR_FAKTA_FOR_FEILUTBETALING: '7003',
  AUTO_VENT_GRADERING_UTEN_BEREGNINGSGRUNNLAG: '7019',
};

const klageAksjonspunkter = [
  aksjonspunktCodes.BEHANDLE_KLAGE_NK,
  aksjonspunktCodes.BEHANDLE_KLAGE_NFP,
  aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP,
  aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA,
];

const uttakAksjonspunkter = [
  aksjonspunktCodes.AVKLAR_UTTAK,
  aksjonspunktCodes.MANUELL_AVKLAR_FAKTA_UTTAK,
  aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER,
  aksjonspunktCodes.FASTSETT_UTTAKPERIODER,
  aksjonspunktCodes.TILKNYTTET_STORTINGET,
  aksjonspunktCodes.KONTROLLER_REALITETSBEHANDLING_ELLER_KLAGE,
  aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_MEDLEMSKAP,
  aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_FORDELING_AV_STØNADSPERIODEN,
  aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_DØD,
  aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
  aksjonspunktCodes.KONTROLLER_TILSTØTENDE_YTELSER_INNVILGET,
  aksjonspunktCodes.KONTROLLER_TILSTØTENDE_YTELSER_OPPHØRT,
];

const innhentSaksopplysningerAksjonspunkt = [
  aksjonspunktCodes.REGISTRER_PAPIRSOKNAD_ENGANGSSTONAD,
  aksjonspunktCodes.REGISTRER_PAPIRSOKNAD_FORELDREPENGER,
  aksjonspunktCodes.AUTO_VENTER_PÅ_KOMPLETT_SOKNAD,
  aksjonspunktCodes.BEHANDLE_KLAGE_NFP,
];

const beregningsgrunnlagFritekstfeltIVedtakAksjonspunkt = [
  aksjonspunktCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
  aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
  aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
];

const isVilkarForSykdomOppfyltAksjonspunkter = [
  aksjonspunktCodes.VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT,
];

const beregningAksjonspunkter = [
  aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
  aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
  aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
  aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  aksjonspunktCodes.VURDER_DEKNINGSGRAD,
];

const aksjonspunktIsOfType = validAksjonspunktCodes => aksjonspunktCode => validAksjonspunktCodes.includes(aksjonspunktCode);

export const isKlageAksjonspunkt = aksjonspunktIsOfType(klageAksjonspunkter);
export const isInnhentSaksopplysningerAksjonspunkt = aksjonspunktIsOfType(innhentSaksopplysningerAksjonspunkt);
export const isBGAksjonspunktSomGirFritekstfelt = aksjonspunktIsOfType(beregningsgrunnlagFritekstfeltIVedtakAksjonspunkt);
export const isVilkarForSykdomOppfylt = aksjonspunktIsOfType(isVilkarForSykdomOppfyltAksjonspunkter);
export const isUttakAksjonspunkt = aksjonspunktIsOfType(uttakAksjonspunkter);
export const isBeregningAksjonspunkt = aksjonspunktIsOfType(beregningAksjonspunkter);

export default aksjonspunktCodes;
