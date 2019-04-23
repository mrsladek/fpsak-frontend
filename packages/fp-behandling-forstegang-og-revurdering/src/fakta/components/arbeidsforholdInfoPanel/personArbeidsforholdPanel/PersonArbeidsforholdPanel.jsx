import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { getKodeverk, getSelectedBehandlingId } from 'behandlingForstegangOgRevurdering/src/duck';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getBehandlingVersjon } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { arbeidsforholdPropType } from '@fpsak-frontend/prop-types';
import { behandlingFormValueSelector, getBehandlingFormPrefix } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import FaktaGruppe from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaGruppe';
import { ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import { ElementWrapper, VerticalSpacer } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import arbeidsforholdKilder from '@fpsak-frontend/kodeverk/src/arbeidsforholdKilder';
import aktivtArbeidsforholdHandling from '@fpsak-frontend/kodeverk/src/aktivtArbeidsforholdHandling';
import PersonArbeidsforholdTable from './PersonArbeidsforholdTable/PersonArbeidsforholdTable';
import PersonArbeidsforholdDetailForm, { PERSON_ARBEIDSFORHOLD_DETAIL_FORM } from './PersonArbeidsforholdDetailForm/PersonArbeidsforholdDetailForm';
import styles from './personArbeidsforholdPanel.less';

// -------------------------------------------------------------------------------------------------------------
// Methods
// -------------------------------------------------------------------------------------------------------------

const removeDeleted = arbeidsforhold => arbeidsforhold.filter(a => !a.erSlettet);

const cleanUpArbeidsforhold = (newValues, originalValues) => {
  if (!newValues.brukArbeidsforholdet) {
    return {
      ...newValues,
      erNyttArbeidsforhold: undefined,
      erstatterArbeidsforholdId: undefined,
      tomDato: originalValues.tomDato,
    };
  }
  if (newValues.erNyttArbeidsforhold) {
    return {
      ...newValues,
      erstatterArbeidsforholdId: undefined,
    };
  }
  return newValues;
};

const findFomDato = (arbeidsforhold, replacedArbeidsforhold) => (arbeidsforhold.erstatterArbeidsforholdId
  ? replacedArbeidsforhold.fomDato : arbeidsforhold.originalFomDato);

const getUnresolvedArbeidsforhold = arbeidsforholdList => arbeidsforholdList.find(a => a.tilVurdering && !a.erEndret);

const hasArbeidsforholdAksjonspunkt = arbeidsforhold => arbeidsforhold && (arbeidsforhold.tilVurdering || arbeidsforhold.erEndret);

export const sortArbeidsforhold = arbeidsforhold => arbeidsforhold
  .sort((a1, a2) => {
    const i = a1.navn.localeCompare(a2.navn);
    if (i !== 0) {
      return i;
    }

    if (a1.mottattDatoInntektsmelding && a2.mottattDatoInntektsmelding) {
      return moment(a2.mottattDatoInntektsmelding, ISO_DATE_FORMAT).diff(moment(a1.mottattDatoInntektsmelding, ISO_DATE_FORMAT));
    }
    if (a1.mottattDatoInntektsmelding) {
      return -1;
    }
    if (a2.mottattDatoInntektsmelding) {
      return 1;
    }
    return a1.id.localeCompare(a2.id);
  });

export const erDetTillattMedFortsettingAvAktivtArbeidsforholdUtenIM = (arbeidsforhold) => {
  let isAllowed = true;
  const arbeidsforholdUtenInntektsmeldingTilVurdering = arbeidsforhold.filter(a => (a.tilVurdering || a.erEndret) && !a.mottattDatoInntektsmelding);
  arbeidsforholdUtenInntektsmeldingTilVurdering.forEach((a) => {
    const arbeidsforholdFraSammeArbeidsgiverMedInntekstmelding = arbeidsforhold
      .filter(b => a.id !== b.id && a.arbeidsgiverIdentifikator === b.arbeidsgiverIdentifikator && b.mottattDatoInntektsmelding);
    if (arbeidsforholdFraSammeArbeidsgiverMedInntekstmelding.length > 0) {
      isAllowed = false;
    }
  });
  return isAllowed;
};

const addReplaceableArbeidsforhold = arbeidsforholdList => arbeidsforholdList.map((a1) => {
  const matches = arbeidsforholdList.filter(a2 => a2.arbeidsgiverIdentifikator === a1.arbeidsgiverIdentifikator
    && a2.arbeidsforholdId && a1.arbeidsforholdId && a2.arbeidsforholdId !== a1.arbeidsforholdId);
  const hasSomeNewer = matches.some(m => moment(m.mottattDatoInntektsmelding).isAfter(a1.mottattDatoInntektsmelding));
  return {
    ...a1,
    replaceOptions: hasSomeNewer ? [] : matches,
  };
});

const utledAktivtArbeidsforholdHandlingValue = (arbeidsforhold, brukUendretArbeidsforhold) => {
  // brukUendretArbeidsforhold === true tilsier at "arbeidsforholdet er aktivt" er valgt
  if (brukUendretArbeidsforhold) {
    if (arbeidsforhold.inntektIkkeMedTilBeregningsgrunnlaget === true) {
      return aktivtArbeidsforholdHandling.INNTEKT_IKKE_MED_I_BG;
    }
    if (arbeidsforhold.fortsettBehandlingUtenInntektsmelding === true) {
      return aktivtArbeidsforholdHandling.FORTSETT_BEHANDLING;
    }
    if (arbeidsforhold.fortsettBehandlingUtenInntektsmelding === false) {
      return aktivtArbeidsforholdHandling.AVSLA_YTELSE;
    }
  }
  return undefined;
};

const sjekkBrukUendretArbeidsforhold = arbeidsforhold => arbeidsforhold.brukArbeidsforholdet && !arbeidsforhold.brukMedJustertPeriode;

const leggTilValuesForRendering = arbeidsforholdList => arbeidsforholdList.map((arbeidsforhold) => {
  const brukUendretArbeidsforhold = sjekkBrukUendretArbeidsforhold(arbeidsforhold);
  const aktivtArbeidsforholdHandlingField = utledAktivtArbeidsforholdHandlingValue(arbeidsforhold, brukUendretArbeidsforhold);
  return {
    ...arbeidsforhold,
    originalFomDato: arbeidsforhold.fomDato,
    brukUendretArbeidsforhold,
    overstyrtTom: arbeidsforhold.brukMedJustertPeriode ? arbeidsforhold.tomDato : undefined,
    aktivtArbeidsforholdHandlingField,
  };
});

/**
 * PersonArbeidsforholdPanelImpl:
 * - Håndterer staten for children-components.
 * - Bygger initialValues til children-components ved hjelp av arbeidsforhold PropType. Verdiene
 * som har samme navn i GUI og PropTypen blir fylt inn 'automatisk', mens andre variabler som
 * ikke er med i PropTypen må håndteres f.eks. i UpdateArbeidsforhold metoden.
 */
export class PersonArbeidsforholdPanelImpl extends Component {
  constructor() {
    super();
    this.state = {
      selectedArbeidsforhold: undefined,
    };
    this.setSelectedArbeidsforhold = this.setSelectedArbeidsforhold.bind(this);
    this.updateArbeidsforhold = this.updateArbeidsforhold.bind(this);
    this.cancelArbeidsforhold = this.cancelArbeidsforhold.bind(this);
    this.initializeActivityForm = this.initializeActivityForm.bind(this);
    this.leggTilArbeidsforhold = this.leggTilArbeidsforhold.bind(this);
  }

  componentWillMount() {
    const { arbeidsforhold } = this.props;
    const selected = getUnresolvedArbeidsforhold(arbeidsforhold) || undefined;
    this.setSelectedArbeidsforhold(undefined, undefined, selected);
  }

  setSelectedArbeidsforhold(p, id, selectedArbeidsforhold) {
    this.setState({ selectedArbeidsforhold });
    this.initializeActivityForm(selectedArbeidsforhold);
  }

  setFormField(fieldName, fieldValue) {
    const { behandlingFormPrefix, reduxFormChange: formChange } = this.props;
    formChange(`${behandlingFormPrefix}.${'ArbeidsforholdInfoPanel'}`, fieldName, fieldValue);
  }

  initializeActivityForm(arbeidsforhold) {
    const { selectedArbeidsforhold } = this.state;
    if (selectedArbeidsforhold !== arbeidsforhold) {
      const { behandlingFormPrefix, reduxFormInitialize: formInitialize } = this.props;
      formInitialize(`${behandlingFormPrefix}.${PERSON_ARBEIDSFORHOLD_DETAIL_FORM}`, arbeidsforhold);
    }
  }

  updateArbeidsforhold(values) {
    const { selectedArbeidsforhold } = this.state;
    const { arbeidsforhold } = this.props;

    const brukMedJustertPeriode = values.brukUendretArbeidsforhold === false && !!values.overstyrtTom;
    const brukArbeidsforholdet = values.brukUendretArbeidsforhold || brukMedJustertPeriode;
    const inntektIkkeMedTilBeregningsgrunnlaget = values.aktivtArbeidsforholdHandlingField === aktivtArbeidsforholdHandling.INNTEKT_IKKE_MED_I_BG;
    const fortsettBehandlingUtenInntektsmelding = values.aktivtArbeidsforholdHandlingField !== aktivtArbeidsforholdHandling.AVSLA_YTELSE
      || brukMedJustertPeriode;

    const newValues = {
      ...values,
      brukMedJustertPeriode,
      brukArbeidsforholdet,
      fortsettBehandlingUtenInntektsmelding,
      inntektIkkeMedTilBeregningsgrunnlaget,
    };

    const cleanedValues = cleanUpArbeidsforhold(newValues, selectedArbeidsforhold);

    let other = arbeidsforhold.filter(o => o.id !== cleanedValues.id);
    const oldState = arbeidsforhold.find(a => a.id === cleanedValues.id);
    let { fomDato } = cleanedValues;
    if (oldState !== undefined && oldState !== null && cleanedValues.erstatterArbeidsforholdId !== oldState.erstatterArbeidsforholdId) {
      if (oldState.erstatterArbeidsforholdId) {
        other = other.map(o => (o.id === oldState.erstatterArbeidsforholdId ? { ...o, erSlettet: false } : o));
      }
      if (cleanedValues.erstatterArbeidsforholdId) {
        other = other.map(o => (o.id === cleanedValues.erstatterArbeidsforholdId ? { ...o, erSlettet: true } : o));
      }
      fomDato = findFomDato(cleanedValues, arbeidsforhold.find(a => a.id === cleanedValues.erstatterArbeidsforholdId));
    }

    this.setFormField('arbeidsforhold', other.concat({
      ...cleanedValues,
      fomDato,
      erEndret: true,
    }));

    const unresolvedArbeidsforhold = getUnresolvedArbeidsforhold(removeDeleted(other));
    this.setSelectedArbeidsforhold(undefined, undefined, unresolvedArbeidsforhold);
  }

  cancelArbeidsforhold() {
    this.setState({ selectedArbeidsforhold: undefined });
    this.initializeActivityForm({});
  }

  leggTilArbeidsforhold() {
    const lagtTilArbeidsforhold = {
      id: `${(new Date()).getTime()}_${Math.floor(Math.random() * 1000000000)}`,
      navn: undefined,
      arbeidsgiverIdentifikator: undefined,
      arbeidsgiverIdentifiktorGUI: undefined,
      arbeidsforholdId: undefined,
      fomDato: undefined,
      tomDato: undefined,
      kilde: {
        navn: arbeidsforholdKilder.SAKSBEHANDLER,
      },
      mottattDatoInntektsmelding: undefined,
      begrunnelse: undefined,
      stillingsprosent: undefined,
      brukArbeidsforholdet: true,
      fortsettBehandlingUtenInntektsmelding: undefined,
      erNyttArbeidsforhold: undefined,
      erSlettet: undefined,
      erstatterArbeidsforholdId: undefined,
      harErsattetEttEllerFlere: undefined,
      ikkeRegistrertIAaRegister: undefined,
      tilVurdering: true,
      vurderOmSkalErstattes: undefined,
      erEndret: undefined,
      brukMedJustertPeriode: false,
      handlingType: undefined,
      lagtTilAvSaksbehandler: true,
      inntektIkkeMedTilBeregningsgrunnlaget: false,
      brukUendretArbeidsforhold: true,
      aktivtArbeidsforholdHandlingField: aktivtArbeidsforholdHandling.FORTSETT_BEHANDLING,
    };
    this.setState({ selectedArbeidsforhold: lagtTilArbeidsforhold });
    this.initializeActivityForm(lagtTilArbeidsforhold);
  }

  render() {
    const {
      readOnly,
      hasAksjonspunkter,
      hasOpenAksjonspunkter,
      arbeidsforhold,
      fagsystemer,
      aktivtArbeidsforholdTillatUtenIM,
      skalKunneLeggeTilNyeArbeidsforhold,
    } = this.props;

    const {
      selectedArbeidsforhold,
    } = this.state;

    return (
      <ElementWrapper>
        <FaktaGruppe aksjonspunktCode={aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD} titleCode="PersonArbeidsforholdPanel.ArbeidsforholdHeader">
          <PersonArbeidsforholdTable
            selectedId={selectedArbeidsforhold ? selectedArbeidsforhold.id : undefined}
            alleArbeidsforhold={removeDeleted(arbeidsforhold)}
            selectArbeidsforholdCallback={this.setSelectedArbeidsforhold}
            fagsystemer={fagsystemer}
          />
          { !readOnly && skalKunneLeggeTilNyeArbeidsforhold && selectedArbeidsforhold === undefined && arbeidsforhold.length === 0 && (
            <button
              type="button"
              className={styles.leggTilArbeidsforholdButton}
              onClick={this.leggTilArbeidsforhold}
              disabled={readOnly}
            >
              <FormattedMessage id="PersonArbeidsforholdTable.LeggTilArbeidsforhold" />
            </button>
          )}
          { hasArbeidsforholdAksjonspunkt(selectedArbeidsforhold) && (
            <PersonArbeidsforholdDetailForm
              key={selectedArbeidsforhold.id}
              arbeidsforhold={selectedArbeidsforhold}
              readOnly={readOnly}
              hasAksjonspunkter={hasAksjonspunkter}
              hasOpenAksjonspunkter={hasOpenAksjonspunkter}
              updateArbeidsforhold={this.updateArbeidsforhold}
              cancelArbeidsforhold={this.cancelArbeidsforhold}
              aktivtArbeidsforholdTillatUtenIM={aktivtArbeidsforholdTillatUtenIM}
              skalKunneLeggeTilNyeArbeidsforhold={skalKunneLeggeTilNyeArbeidsforhold}
            />
          )}
        </FaktaGruppe>
        <VerticalSpacer twentyPx />
      </ElementWrapper>
    );
  }
}

PersonArbeidsforholdPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  hasAksjonspunkter: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  arbeidsforhold: PropTypes.arrayOf(arbeidsforholdPropType).isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
  fagsystemer: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  aktivtArbeidsforholdTillatUtenIM: PropTypes.bool.isRequired,
  skalKunneLeggeTilNyeArbeidsforhold: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const arbeidsforhold = sortArbeidsforhold(behandlingFormValueSelector('ArbeidsforholdInfoPanel')(state, 'arbeidsforhold'));
  return {
    arbeidsforhold,
    behandlingFormPrefix: getBehandlingFormPrefix(getSelectedBehandlingId(state), getBehandlingVersjon(state)),
    fagsystemer: getKodeverk(kodeverkTyper.FAGSYSTEM)(state),
    aktivtArbeidsforholdTillatUtenIM: erDetTillattMedFortsettingAvAktivtArbeidsforholdUtenIM(arbeidsforhold),
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    reduxFormChange,
    reduxFormInitialize,
  }, dispatch),
});

const PersonArbeidsforholdPanel = connect(mapStateToProps, mapDispatchToProps)(injectIntl(PersonArbeidsforholdPanelImpl));

PersonArbeidsforholdPanel.buildInitialValues = arbeidsforhold => ({
  arbeidsforhold: leggTilValuesForRendering(addReplaceableArbeidsforhold(arbeidsforhold)),
});

PersonArbeidsforholdPanel.isReadOnly = (state) => {
  const isDetailFormOpen = !!behandlingFormValueSelector(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)(state, 'navn');
  if (isDetailFormOpen) {
    return true;
  }
  const arbeidsforhold = behandlingFormValueSelector('ArbeidsforholdInfoPanel')(state, 'arbeidsforhold');
  return !arbeidsforhold || !!getUnresolvedArbeidsforhold(arbeidsforhold);
};

export default PersonArbeidsforholdPanel;