import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import { behandlingFormValueSelector, getBehandlingFormPrefix } from '@fpsak-frontend/form';
import {
  AksjonspunktHelpTextTemp, DateLabel, FlexColumn, FlexContainer, FlexRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { TimeLineNavigation } from '@fpsak-frontend/tidslinje';

import OpptjeningTimeLine from './timeline/OpptjeningTimeLine';
import ActivityPanel, { activityPanelName } from './activity/ActivityPanel';

import styles from './opptjeningFaktaForm.less';

const getAksjonspunktHelpTexts = (activities) => {
  const texts = [];
  if (activities.some((a) => a.stillingsandel === 0)) {
    texts.push(<FormattedMessage id="OpptjeningFaktaForm.AktivitetenErTimeAvslonnet" key="AktivitetenErTimeAvslonnet" />);
  }

  const aktivitetTypes = activities.filter((a) => (a.erGodjent === undefined || a.beskrivelse) && a.stillingsandel !== 0);
  if (aktivitetTypes.length === 1) {
    texts.push(<FormattedMessage id="OpptjeningFaktaForm.EttArbeidKanGodkjennes" key="EttArbeidKanGodkjennes" />);
  } else if (aktivitetTypes.length > 1) {
    texts.push(<FormattedMessage id="OpptjeningFaktaForm.FlereArbeidKanGodkjennes" key="FlereArbeidKanGodkjennes" />);
  }
  return texts;
};

const findSkjaringstidspunkt = (date) => moment(date).add(1, 'days').format(ISO_DATE_FORMAT);

const sortByFomDate = (opptjeningPeriods) => opptjeningPeriods
  .sort((o1, o2) => {
    const isSame = moment(o2.opptjeningFom, ISO_DATE_FORMAT).isSame(moment(o1.opptjeningFom, ISO_DATE_FORMAT));
    return isSame
      ? o1.id < o2.id
      : moment(o2.opptjeningFom, ISO_DATE_FORMAT).isBefore(moment(o1.opptjeningFom, ISO_DATE_FORMAT));
  });

const DOKUMENTASJON_VIL_BLI_INNHENTET = 'DOKUMENTASJON_VIL_BLI_INNHENTET';

/**
 * OpptjeningFaktaForm
 *
 * Presentasjonskomponent. Vises faktapanelet for opptjeningsvilkåret. For Foreldrepenger vises dette alltid. Finnes
 * det aksjonspunkt kan nav-ansatt endre opplysninger før en går videre i prosessen.
 */
export class OpptjeningFaktaFormImpl extends Component {
  constructor() {
    super();

    this.addOpptjeningActivity = this.addOpptjeningActivity.bind(this);
    this.setSelectedOpptjeningActivity = this.setSelectedOpptjeningActivity.bind(this);
    this.cancelSelectedOpptjeningActivity = this.cancelSelectedOpptjeningActivity.bind(this);
    this.updateActivity = this.updateActivity.bind(this);
    this.initializeActivityForm = this.initializeActivityForm.bind(this);
    this.setFormField = this.setFormField.bind(this);
    this.selectNextPeriod = this.selectNextPeriod.bind(this);
    this.selectPrevPeriod = this.selectPrevPeriod.bind(this);
    this.openPeriodInfo = this.openPeriodInfo.bind(this);
    this.isConfirmButtonDisabled = this.isConfirmButtonDisabled.bind(this);
    this.isAddButtonDisabled = this.isAddButtonDisabled.bind(this);
    this.isSelectedActivityAndButtonsEnabled = this.isSelectedActivityAndButtonsEnabled.bind(this);

    this.state = {
      selectedOpptjeningActivity: undefined,
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    const { opptjeningActivities } = this.props;
    const { selectedOpptjeningActivity } = this.state;
    const opptjeningActivityWithAp = opptjeningActivities.find((o) => o.erGodkjent === null);
    const selected = selectedOpptjeningActivity || opptjeningActivityWithAp || opptjeningActivities[0];
    this.setSelectedOpptjeningActivity(selected, true);
  }

  setSelectedOpptjeningActivity(opptjeningActivity, isMounting) {
    if (!isMounting) {
      this.initializeActivityForm(opptjeningActivity);
    }
    this.setState({ selectedOpptjeningActivity: opptjeningActivity });
  }

  setFormField(fieldName, fieldValue) {
    const { behandlingFormPrefix, formName, reduxFormChange: formChange } = this.props;
    formChange(`${behandlingFormPrefix}.${formName}`, fieldName, fieldValue);
  }

  initializeActivityForm(opptjeningActivity) {
    const { behandlingFormPrefix, reduxFormInitialize: formInitialize } = this.props;
    formInitialize(`${behandlingFormPrefix}.${activityPanelName}`, opptjeningActivity);
  }

  cancelSelectedOpptjeningActivity() {
    this.initializeActivityForm({});
    this.setState({ selectedOpptjeningActivity: undefined });
  }

  addOpptjeningActivity() {
    const { opptjeningActivities } = this.props;
    const newOpptjeningActivity = {
      id: opptjeningActivities.map((oa) => oa.id).reduce((acc, value) => (acc < value ? value : acc), 0) + 1,
      erGodkjent: true,
      erManueltOpprettet: true,
    };
    this.initializeActivityForm(newOpptjeningActivity);
    this.setState({ selectedOpptjeningActivity: newOpptjeningActivity });
  }

  updateActivity(values) {
    const { opptjeningActivities } = this.props;
    const otherThanUpdated = opptjeningActivities.filter((o) => o.id !== values.id);
    this.setFormField('opptjeningActivities', otherThanUpdated.concat({
      ...values,
      erEndret: true,
    }));
    const opptjeningActivityWithAp = otherThanUpdated.find((o) => o.erGodkjent === null);
    this.setSelectedOpptjeningActivity(opptjeningActivityWithAp || undefined);
  }

  openPeriodInfo(event) {
    const { opptjeningActivities } = this.props;
    const { selectedOpptjeningActivity } = this.state;
    event.preventDefault();
    const currentSelectedItem = selectedOpptjeningActivity;
    if (currentSelectedItem) {
      this.setSelectedOpptjeningActivity(undefined);
    } else {
      const selectedItem = opptjeningActivities.find((item) => item.id === 1);
      this.setSelectedOpptjeningActivity(selectedItem);
    }
  }

  selectNextPeriod(event) {
    const { opptjeningActivities } = this.props;
    const { selectedOpptjeningActivity } = this.state;
    const newIndex = opptjeningActivities.findIndex((oa) => oa.id === selectedOpptjeningActivity.id) + 1;
    if (newIndex < opptjeningActivities.length) {
      this.setSelectedOpptjeningActivity(opptjeningActivities[newIndex]);
    }
    event.preventDefault();
  }

  selectPrevPeriod(event) {
    const { opptjeningActivities } = this.props;
    const { selectedOpptjeningActivity } = this.state;
    const newIndex = opptjeningActivities.findIndex((oa) => oa.id === selectedOpptjeningActivity.id) - 1;
    if (newIndex >= 0) {
      this.setSelectedOpptjeningActivity(opptjeningActivities[newIndex]);
    }
    event.preventDefault();
  }

  isSelectedActivityAndButtonsEnabled() {
    const { selectedOpptjeningActivity } = this.state;
    if (selectedOpptjeningActivity === undefined) {
      return false;
    }
    return !!selectedOpptjeningActivity.erManueltOpprettet || !!selectedOpptjeningActivity.erEndret;
  }

  isConfirmButtonDisabled() {
    const {
      hasOpenAksjonspunkter, opptjeningActivities, readOnly, submitting, isDirty,
    } = this.props;
    if (!hasOpenAksjonspunkter && !isDirty) {
      return true;
    }

    return submitting
      || readOnly
      || this.isSelectedActivityAndButtonsEnabled()
      || opptjeningActivities.some((ac) => ac.erGodkjent === null);
  }

  isAddButtonDisabled() {
    const {
      readOnly, submitting,
    } = this.props;

    return submitting
    || readOnly
    || this.isSelectedActivityAndButtonsEnabled();
  }

  render() {
    const {
      hasAksjonspunkt, hasOpenAksjonspunkter, opptjeningActivities, opptjeningAktivitetTypes, opptjeningFomDato, dokStatus,
      opptjeningTomDato, readOnly, submitting, behandlingId, behandlingVersjon, alleMerknaderFraBeslutter, alleKodeverk,
    } = this.props;
    const { selectedOpptjeningActivity } = this.state;
    return (
      <div className={styles.container}>
        {hasAksjonspunkt && (
          <>
            <AksjonspunktHelpTextTemp isAksjonspunktOpen={hasOpenAksjonspunkter}>
              {getAksjonspunktHelpTexts(opptjeningActivities)}
            </AksjonspunktHelpTextTemp>
            <VerticalSpacer twentyPx />
          </>
        )}
        {dokStatus && (
          <>
            <AlertStripeInfo className={styles.info}>
              <FormattedMessage
                id={dokStatus === DOKUMENTASJON_VIL_BLI_INNHENTET ? 'OpptjeningFaktaForm.DetErInnhentetDok' : 'OpptjeningFaktaForm.DetErIkkeInnhentetDok'}
                values={{
                  b: (...chunks) => <b>{chunks}</b>,
                }}
              />
            </AlertStripeInfo>
            <VerticalSpacer twentyPx />
          </>
        )}
        <Undertekst><FormattedMessage id="OpptjeningFaktaForm.Skjaringstidspunkt" /></Undertekst>
        <Normaltekst><DateLabel dateString={findSkjaringstidspunkt(opptjeningTomDato)} /></Normaltekst>
        <VerticalSpacer twentyPx />
        <OpptjeningTimeLine
          opptjeningPeriods={opptjeningActivities}
          opptjeningAktivitetTypes={opptjeningAktivitetTypes}
          selectPeriodCallback={this.setSelectedOpptjeningActivity}
          opptjeningFomDato={opptjeningFomDato}
          opptjeningTomDato={opptjeningTomDato}
          selectedPeriod={selectedOpptjeningActivity}
        />
        <TimeLineNavigation
          openPeriodInfo={this.openPeriodInfo}
        />
        <VerticalSpacer eightPx />
        {selectedOpptjeningActivity
          && (
            <>
              <ActivityPanel
                key={selectedOpptjeningActivity.id}
                behandlingId={behandlingId}
                behandlingVersjon={behandlingVersjon}
                activity={selectedOpptjeningActivity}
                readOnly={readOnly}
                opptjeningAktivitetTypes={opptjeningAktivitetTypes}
                cancelSelectedOpptjeningActivity={this.cancelSelectedOpptjeningActivity}
                updateActivity={this.updateActivity}
                opptjeningFomDato={opptjeningFomDato}
                opptjeningTomDato={opptjeningTomDato}
                selectNextPeriod={this.selectNextPeriod}
                selectPrevPeriod={this.selectPrevPeriod}
                hasAksjonspunkt={hasAksjonspunkt}
                alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
                alleKodeverk={alleKodeverk}
              />
              <VerticalSpacer twentyPx />
            </>
          )}
        {hasAksjonspunkt
        && (
        <FlexContainer fluid>
          <FlexRow>
            <FlexColumn>
              <Hovedknapp
                mini
                disabled={this.isConfirmButtonDisabled()}
                spinner={submitting}
              >
                <FormattedMessage id="OpptjeningFaktaForm.Confirm" />
              </Hovedknapp>
            </FlexColumn>
            <FlexColumn>
              <Knapp
                mini
                htmlType="button"
                onClick={this.addOpptjeningActivity}
                disabled={this.isAddButtonDisabled()}
              >
                <FormattedMessage id="OpptjeningFaktaForm.AddActivity" />
              </Knapp>
            </FlexColumn>
          </FlexRow>
        </FlexContainer>
        )}
      </div>
    );
  }
}

OpptjeningFaktaFormImpl.propTypes = {
  hasAksjonspunkt: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  opptjeningFomDato: PropTypes.string.isRequired,
  opptjeningTomDato: PropTypes.string.isRequired,
  dokStatus: PropTypes.string,
  readOnly: PropTypes.bool.isRequired,
  opptjeningActivities: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  opptjeningAktivitetTypes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  formName: PropTypes.string.isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  submitting: PropTypes.bool.isRequired,
  isDirty: PropTypes.bool.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

OpptjeningFaktaFormImpl.defaultProps = {
  dokStatus: undefined,
};

const mapStateToProps = (state, ownProps) => ({
  opptjeningAktivitetTypes: ownProps.alleKodeverk[kodeverkTyper.OPPTJENING_AKTIVITET_TYPE],
  behandlingFormPrefix: getBehandlingFormPrefix(ownProps.behandlingId, ownProps.behandlingVersjon),
  opptjeningActivities: sortByFomDate(behandlingFormValueSelector(ownProps.formName, ownProps.behandlingId,
    ownProps.behandlingVersjon)(state, 'opptjeningActivities')),
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    reduxFormChange,
    reduxFormInitialize,
  }, dispatch),
});

const OpptjeningFaktaForm = connect(mapStateToProps, mapDispatchToProps)(OpptjeningFaktaFormImpl);

export default OpptjeningFaktaForm;
