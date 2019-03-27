import React from 'react';
import {
  reduxForm, formPropTypes, FormSection, formValueSelector,
} from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { omit } from '@fpsak-frontend/utils';
import { getRegisteredFields, getKodeverk, getFagsakPerson } from 'papirsoknad/src/duck';
import MottattDatoPanel from 'papirsoknad/src/components/commonPanels/MottattDatoPanel';
import AnnenForelderPanel from 'papirsoknad/src/components/commonPanels/AnnenForelderPanel';
import OppholdINorgePanel from 'papirsoknad/src/components/commonPanels/OppholdINorgePanel';
import TilleggsopplysningerPanel from 'papirsoknad/src/components/commonPanels/TilleggsopplysningerPanel';
import SoknadData from 'papirsoknad/src/SoknadData';
import familieHendelseType from '@fpsak-frontend/kodeverk/src/familieHendelseType';
import LagreSoknadForm from 'papirsoknad/src/components/commonPanels/LagreSoknadPanel';
import OmsorgOgAdopsjonPanel from 'papirsoknad/src/components/commonPanels/omsorgOgAdopsjon/OmsorgOgAdopsjonPanel';
import TerminFodselDatoPanel from 'papirsoknad/src/components/commonPanels/fodsel/TerminFodselDatoPanel';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import RettigheterPanel, { rettighet } from '../commonPanels/rettigheter/RettigheterPanel';
import EgenVirksomhetPanel from './virksomhet/EgenVirksomhetPanel';
import DekningsgradPanel from './dekningsgrad/DekningsgradPanel';
import InntektsgivendeArbeidPanel from './inntektsgivendeArbeid/InntektsgivendeArbeidPanel';
import AndreYtelserPanel, { ANDRE_YTELSER_FORM_NAME_PREFIX } from './andreYtelser/AndreYtelserPanel';
import PermisjonPanel, { TIDSROM_PERMISJON_FORM_NAME_PREFIX } from './permisjon/PermisjonPanel';
import FrilansPanel from './frilans/FrilansPanel';
import BekreftelsePanel from './bekreftelse/BekreftelsePanel';

const FORELDREPENGER_FORM_NAME = 'ForeldrepengerForm';
const ANNEN_FORELDER_FORM_NAME_PREFIX = 'annenForelder';
const OMSORG_FORM_NAME_PREFIX = 'omsorg';

const buildInitialValues = (soknadData, andreYtelser) => ({
  ...FrilansPanel.buildInitialValues(),
  ...AndreYtelserPanel.buildInitialValues(andreYtelser),
  ...InntektsgivendeArbeidPanel.initialValues,
  [OMSORG_FORM_NAME_PREFIX]: OmsorgOgAdopsjonPanel.initialValues,
  ...OppholdINorgePanel.initialValues,
  ...PermisjonPanel.initialValues,
});

/**
 * ForeldrepengerForm
 *
 * Redux-form-komponent for registrering av papirsøknad for foreldrepenger.
 *
 */
export const ForeldrepengerForm = ({
  handleSubmit,
  submitting,
  form,
  readOnly,
  soknadData,
  onSubmitUfullstendigsoknad,
  error,
  submitFailed,
  annenForelderInformertRequired,
  sokerHarAleneomsorg,
}) => (
  <form onSubmit={handleSubmit}>
    <MottattDatoPanel readOnly={readOnly} />
    <OppholdINorgePanel form={form} readOnly={readOnly} soknadData={soknadData} />
    <InntektsgivendeArbeidPanel readOnly={readOnly} />
    <EgenVirksomhetPanel
      readOnly={readOnly}
      form={form}
    />
    <FrilansPanel readOnly={readOnly} form={form} formName={FORELDREPENGER_FORM_NAME} />
    <AndreYtelserPanel readOnly={readOnly} form={form} />
    <DekningsgradPanel readOnly={readOnly} />
    {soknadData.getFamilieHendelseType() === familieHendelseType.FODSEL
    && <TerminFodselDatoPanel readOnly={readOnly} form={form} />
    }
    <RettigheterPanel readOnly={readOnly} soknadData={soknadData} />
    <FormSection name={OMSORG_FORM_NAME_PREFIX}>
      <OmsorgOgAdopsjonPanel
        form={form}
        namePrefix={OMSORG_FORM_NAME_PREFIX}
        readOnly={readOnly}
        familieHendelseType={soknadData.getFamilieHendelseType()}
      />
    </FormSection>
    <FormSection name={ANNEN_FORELDER_FORM_NAME_PREFIX}>
      <AnnenForelderPanel
        isForeldrepenger
        soknadData={soknadData}
        sokerHarAleneomsorg={sokerHarAleneomsorg}
        namePrefix={ANNEN_FORELDER_FORM_NAME_PREFIX}
        form={form}
        readOnly={readOnly}
      />
    </FormSection>
    <PermisjonPanel
      soknadData={soknadData}
      form={form}
      readOnly={readOnly}
      error={error}
      submitFailed={submitFailed}
      sokerHarAleneomsorg={sokerHarAleneomsorg}
    />
    <BekreftelsePanel annenForelderInformertRequired={annenForelderInformertRequired} readOnly={readOnly} />
    <TilleggsopplysningerPanel readOnly={readOnly} />
    <LagreSoknadForm readOnly={readOnly} onSubmitUfullstendigsoknad={onSubmitUfullstendigsoknad} form={form} submitting={submitting} />
  </form>
);

ForeldrepengerForm.propTypes = {
  ...formPropTypes,
  /** Egen submit-handler som brukes dersom det indikeres at søknaden er ufullstendig */
  onSubmitUfullstendigsoknad: PropTypes.func.isRequired,
  /** Skjemaverdier hentet fra reduxForm */
  readOnly: PropTypes.bool,
  soknadData: PropTypes.instanceOf(SoknadData).isRequired,
};

ForeldrepengerForm.defaultProps = {
  readOnly: true,
};

const getValidation = (soknadData, andreYtelser, sokerPersonnummer) => {
  if (soknadData.getFamilieHendelseType() === familieHendelseType.FODSEL) {
    return values => ({
      ...AndreYtelserPanel.validate(values, andreYtelser),
      ...InntektsgivendeArbeidPanel.validate(values),
      ...FrilansPanel.validate(values),
      ...OppholdINorgePanel.validate(values),
      ...TerminFodselDatoPanel.validate(values),
      [OMSORG_FORM_NAME_PREFIX]: OmsorgOgAdopsjonPanel.validate(values[OMSORG_FORM_NAME_PREFIX], values.rettigheter, values.foedselsDato),
      ...PermisjonPanel.validate(values, soknadData),
      [ANNEN_FORELDER_FORM_NAME_PREFIX]: AnnenForelderPanel.validate(sokerPersonnummer, values[ANNEN_FORELDER_FORM_NAME_PREFIX]),
    });
  }
  if (soknadData.getFamilieHendelseType() === familieHendelseType.ADOPSJON) {
    return values => ({
      ...AndreYtelserPanel.validate(values, andreYtelser),
      ...InntektsgivendeArbeidPanel.validate(values),
      ...FrilansPanel.validate(values),
      ...OppholdINorgePanel.validate(values),
      [OMSORG_FORM_NAME_PREFIX]: OmsorgOgAdopsjonPanel.validate(values[OMSORG_FORM_NAME_PREFIX], values.rettigheter, values.foedselsDato),
      ...PermisjonPanel.validate(values, soknadData),
      [ANNEN_FORELDER_FORM_NAME_PREFIX]: AnnenForelderPanel.validate(sokerPersonnummer, values[ANNEN_FORELDER_FORM_NAME_PREFIX]),
    });
  }
  return null;
};

const transformRootValues = (state, registeredFieldNames) => {
  const values = formValueSelector(FORELDREPENGER_FORM_NAME)(state, ...registeredFieldNames);
  if (values.rettigheter === rettighet.IKKE_RELEVANT) {
    return omit(values, 'rettigheter');
  }
  return values;
};


const mapStateToProps = (state, initialProps) => {
  const sokerPersonnummer = getFagsakPerson(state).personnummer;
  const registeredFields = getRegisteredFields(FORELDREPENGER_FORM_NAME)(state);
  const registeredFieldNames = Object.values(registeredFields).map(rf => rf.name);
  const andreYtelser = getKodeverk(kodeverkTyper.ARBEID_TYPE)(state);

  const valuesForRegisteredFieldsOnly = registeredFieldNames.length
    ? {
      ...transformRootValues(state, registeredFieldNames),
      [ANDRE_YTELSER_FORM_NAME_PREFIX]: AndreYtelserPanel
        .transformValues(formValueSelector(FORELDREPENGER_FORM_NAME)(state, ...registeredFieldNames), andreYtelser),
      [TIDSROM_PERMISJON_FORM_NAME_PREFIX]: PermisjonPanel
        .transformValues(formValueSelector(FORELDREPENGER_FORM_NAME)(state, ...registeredFieldNames)),
    }
    : {};
  const sokerValue = valuesForRegisteredFieldsOnly.annenForelder;
  const sokerHarAleneomsorg = sokerValue ? sokerValue.sokerHarAleneomsorg : undefined;

  let annenForelderInformertRequired = true;
  if (sokerValue && (sokerHarAleneomsorg || sokerValue.denAndreForelderenHarRettPaForeldrepenger === false)) {
    annenForelderInformertRequired = false;
  }

  return {
    initialValues: buildInitialValues(initialProps.soknadData, andreYtelser),
    validate: getValidation(initialProps.soknadData, andreYtelser, sokerPersonnummer),
    valuesForRegisteredFieldsOnly,
    annenForelderInformertRequired,
    sokerHarAleneomsorg,
  };
};

export default connect(mapStateToProps)(reduxForm({
  form: FORELDREPENGER_FORM_NAME,
})(ForeldrepengerForm));
