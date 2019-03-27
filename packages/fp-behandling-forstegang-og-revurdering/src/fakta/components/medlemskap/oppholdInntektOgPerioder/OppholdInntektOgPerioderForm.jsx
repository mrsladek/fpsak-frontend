import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';

import { VerticalSpacer, AksjonspunktHelpText, ElementWrapper } from '@fpsak-frontend/shared-components';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  getBehandlingMedlem, getPersonopplysning,
  getSoknad, getAksjonspunkter, getBehandlingRevurderingAvFortsattMedlemskapFom,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { behandlingForm } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { FaktaBegrunnelseTextField } from '@fpsak-frontend/fp-behandling-felles';
import { getKodeverk, getFagsakPerson } from 'behandlingForstegangOgRevurdering/src/duck';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import OppholdINorgeOgAdresserFaktaPanel from './OppholdINorgeOgAdresserFaktaPanel';
import InntektOgYtelserFaktaPanel from './InntektOgYtelserFaktaPanel';
import PerioderMedMedlemskapFaktaPanel from './PerioderMedMedlemskapFaktaPanel';
import StatusForBorgerFaktaPanel from './StatusForBorgerFaktaPanel';
import FortsattMedlemskapFaktaPanel from './FortsattMedlemskapFaktaPanel';

const {
  AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN, AVKLAR_OM_BRUKER_ER_BOSATT,
  AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE, AVKLAR_OPPHOLDSRETT, AVKLAR_LOVLIG_OPPHOLD, AVKLAR_FORTSATT_MEDLEMSKAP,
} = aksjonspunktCodes;

const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);
const shouldSubmitAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode && ap.erAktivt);

const getHelpTexts = (aksjonspunkter) => {
  const helpTexts = [];
  if (hasAksjonspunkt(AVKLAR_FORTSATT_MEDLEMSKAP, aksjonspunkter)) {
    helpTexts.push(<FormattedMessage key="HarFortsattMedlemskap" id="MedlemskapInfoPanel.HarFortsattMedlemskap" />);
  }
  if (hasAksjonspunkt(AVKLAR_OM_BRUKER_ER_BOSATT, aksjonspunkter)) {
    helpTexts.push(<FormattedMessage key="ErSokerBosattINorge" id="MedlemskapInfoPanel.ErSokerBosattINorge" />);
  }
  if (hasAksjonspunkt(AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE, aksjonspunkter)) {
    helpTexts.push(<FormattedMessage key="GyldigMedlemFolketrygden" id="MedlemskapInfoPanel.GyldigMedlemFolketrygden" />);
  }
  if (hasAksjonspunkt(AVKLAR_OPPHOLDSRETT, aksjonspunkter)) {
    helpTexts.push(<FormattedMessage key="EOSBorgerMedOppholdsrett1" id="MedlemskapInfoPanel.EOSBorgerMedOppholdsrett" />);
  }
  if (hasAksjonspunkt(AVKLAR_LOVLIG_OPPHOLD, aksjonspunkter)) {
    helpTexts.push(<FormattedMessage key="IkkeEOSBorgerMedLovligOpphold" id="MedlemskapInfoPanel.IkkeEOSBorgerMedLovligOpphold" />);
  }
  return helpTexts;
};

/**
 * OppholdInntektOgPerioderForm
 *
 * Presentasjonskomponent. Har ansvar for å sette opp Redux Formen for faktapenelet til Medlemskapsvilkåret.
 */
export const OppholdInntektOgPerioderForm = ({
  hasOpenAksjonspunkter,
  submittable,
  aksjonspunkter,
  readOnly,
  initialValues,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <AksjonspunktHelpText isAksjonspunktOpen={hasOpenAksjonspunkter || !submittable}>{getHelpTexts(aksjonspunkter)}</AksjonspunktHelpText>
    { hasAksjonspunkt(AVKLAR_FORTSATT_MEDLEMSKAP, aksjonspunkter)
      && <FortsattMedlemskapFaktaPanel readOnly={readOnly} />
    }
    <OppholdINorgeOgAdresserFaktaPanel readOnly={readOnly} />
    <InntektOgYtelserFaktaPanel />
    <PerioderMedMedlemskapFaktaPanel readOnly={readOnly} />
    { (hasAksjonspunkt(AVKLAR_OPPHOLDSRETT, aksjonspunkter) || hasAksjonspunkt(AVKLAR_LOVLIG_OPPHOLD, aksjonspunkter))
      && <StatusForBorgerFaktaPanel readOnly={readOnly} />
    }
    { aksjonspunkter && aksjonspunkter.length > 0
      && (
      <ElementWrapper>
        <VerticalSpacer twentyPx />
        <FaktaBegrunnelseTextField isDirty={formProps.dirty} isSubmittable={submittable} isReadOnly={readOnly} hasBegrunnelse={!!initialValues.begrunnelse} />
        <VerticalSpacer twentyPx />
        <FaktaSubmitButton formName={formProps.form} isSubmittable={submittable} isReadOnly={readOnly} hasOpenAksjonspunkter={hasOpenAksjonspunkter} />
      </ElementWrapper>
      )
    }
  </form>
);

OppholdInntektOgPerioderForm.propTypes = {
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType.isRequired).isRequired,
  readOnly: PropTypes.bool.isRequired,
  ...formPropTypes,
};

const medlemAksjonspunkter = [AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN, AVKLAR_OM_BRUKER_ER_BOSATT, AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
  AVKLAR_OPPHOLDSRETT, AVKLAR_LOVLIG_OPPHOLD];

const buildInitialValues = createSelector(
  [getFagsakPerson, getBehandlingMedlem, getPersonopplysning, getSoknad, getAksjonspunkter, getBehandlingRevurderingAvFortsattMedlemskapFom],
  (person, medlem, personopplysning, soknad, allAksjonspunkter, gjeldendeFom) => {
    const aksjonspunkter = allAksjonspunkter
      .filter(ap => medlemAksjonspunkter.includes(ap.definisjon.kode))
      .filter(ap => ap.definisjon.kode !== aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN);
    let oppholdValues = {};
    let confirmValues = {};
    if (hasAksjonspunkt(AVKLAR_OPPHOLDSRETT, aksjonspunkter) || hasAksjonspunkt(AVKLAR_LOVLIG_OPPHOLD, aksjonspunkter)) {
      oppholdValues = StatusForBorgerFaktaPanel.buildInitialValues(medlem, aksjonspunkter);
    }
    if (aksjonspunkter.length > 0) {
      confirmValues = FaktaBegrunnelseTextField.buildInitialValues(aksjonspunkter[0]);
    }

    return {
      ...OppholdINorgeOgAdresserFaktaPanel.buildInitialValues(soknad, personopplysning, medlem, aksjonspunkter),
      ...InntektOgYtelserFaktaPanel.buildInitialValues(person, medlem),
      ...PerioderMedMedlemskapFaktaPanel.buildInitialValues(medlem, soknad, aksjonspunkter),
      ...FortsattMedlemskapFaktaPanel.buildInitialValues(gjeldendeFom),
      ...oppholdValues,
      ...confirmValues,
    };
  },
);

const transformValues = (values, aksjonspunkter, state) => {
  const aksjonspunkterArray = [];
  if (shouldSubmitAksjonspunkt(AVKLAR_FORTSATT_MEDLEMSKAP, aksjonspunkter)) {
    aksjonspunkterArray.push(FortsattMedlemskapFaktaPanel.transformValues(values));
  }
  if (shouldSubmitAksjonspunkt(AVKLAR_OM_BRUKER_ER_BOSATT, aksjonspunkter)) {
    aksjonspunkterArray.push(OppholdINorgeOgAdresserFaktaPanel.transformValues(values));
  }
  if (shouldSubmitAksjonspunkt(AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE, aksjonspunkter)) {
    const vurderingstyper = getKodeverk(kodeverkTyper.MEDLEMSKAP_MANUELL_VURDERING_TYPE)(state);
    aksjonspunkterArray.push(PerioderMedMedlemskapFaktaPanel.transformValues(values, vurderingstyper));
  }
  if (shouldSubmitAksjonspunkt(AVKLAR_OPPHOLDSRETT, aksjonspunkter) || shouldSubmitAksjonspunkt(AVKLAR_LOVLIG_OPPHOLD, aksjonspunkter)) {
    aksjonspunkterArray.push(StatusForBorgerFaktaPanel.transformValues(values, aksjonspunkter));
  }

  const aksjonspunkterMedBegrunnelse = aksjonspunkterArray.map(ap => ({
    ...ap,
    ...{ begrunnelse: values.begrunnelse },
  }));

  return aksjonspunkterMedBegrunnelse;
};

const mapStateToProps = (state, initialProps) => ({
  hasOpenAksjonspunkter: initialProps.aksjonspunkter.some(ap => isAksjonspunktOpen(ap.status.kode)),
  initialValues: buildInitialValues(state),
  onSubmit: values => initialProps.submitCallback(transformValues(values, initialProps.aksjonspunkter, state)),
});

export default connect(mapStateToProps)(behandlingForm({
  form: 'OppholdInntektOgPerioderForm',
})(OppholdInntektOgPerioderForm));
