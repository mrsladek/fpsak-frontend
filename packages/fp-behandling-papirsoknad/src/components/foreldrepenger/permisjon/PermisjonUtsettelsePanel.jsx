import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import { FieldArray, formValueSelector } from 'redux-form';

import { CheckboxField } from '@fpsak-frontend/form';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { getKodeverk } from 'papirsoknad/src/duck';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import kodeverkPropType from '@fpsak-frontend/kodeverk/src/kodeverkPropType';
import {
  hasValidPeriodIncludingOtherErrors, required, isRequiredMessage,
} from '@fpsak-frontend/utils';
import RenderUtsettelsePeriodeFieldArray from './RenderUtsettelsePeriodeFieldArray';
import styles from './permisjonPanel.less';


export const utsettelsePeriodeFieldArrayName = 'utsettelsePeriode';

/**
 *  PermisjonUtsettelsePanel
 *
 * Presentasjonskomponent: Viser panel for utsettelse
 * Komponenten har inputfelter og må derfor rendres som etterkommer av komponent dekorert med reduxForm.
 */
export const PermisjonUtsettelsePanel = ({
  utsettelseReasons,
  utsettelseKvoter,
  skalUtsette,
  readOnly,
  visFeilMelding,
}) => (
  <div>
    <Element><FormattedMessage id="Registrering.Permisjon.Utsettelse.Title" /></Element>
    <VerticalSpacer sixteenPx />
    <CheckboxField
      className={visFeilMelding ? styles.showErrorBackground : ''}
      readOnly={readOnly}
      name="skalUtsette"
      label={<FormattedMessage id="Registrering.Permisjon.Utsettelse.UtsettUttaket" />}
    />
    { skalUtsette
      && (
      <FieldArray
        name={utsettelsePeriodeFieldArrayName}
        component={RenderUtsettelsePeriodeFieldArray}
        utsettelseReasons={utsettelseReasons}
        utsettelseKvoter={utsettelseKvoter}
        readOnly={readOnly}
      />
      )
    }
  </div>
);


PermisjonUtsettelsePanel.validate = (values) => {
  if (!values || !values.length) {
    return { _error: isRequiredMessage() };
  }
  const otherErrors = values.map(({
    arsakForUtsettelse, erArbeidstaker,
  }) => {
    const arsakForUtsettelseError = required(arsakForUtsettelse);
    const typeArbeidRequired = arsakForUtsettelse === 'ARBEID';
    const typeArbeidError = typeArbeidRequired && required(erArbeidstaker);
    if (arsakForUtsettelseError || typeArbeidError) {
      return {
        erArbeidstaker: typeArbeidError,
        arsakForUtsettelse: arsakForUtsettelseError,
      };
    }
    return null;
  });

  return hasValidPeriodIncludingOtherErrors(values, otherErrors);
};

PermisjonUtsettelsePanel.propTypes = {
  utsettelseReasons: kodeverkPropType.isRequired,
  utsettelseKvoter: kodeverkPropType.isRequired,
  skalUtsette: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  visFeilMelding: PropTypes.bool.isRequired,
};

PermisjonUtsettelsePanel.initialValues = {
  [utsettelsePeriodeFieldArrayName]: [{}],
  skalUtsette: false,
};

const mapStateToProps = (state, ownProps) => ({
  utsettelseReasons: getKodeverk(kodeverkTyper.UTSETTELSE_ARSAK)(state),
  utsettelseKvoter: getKodeverk(kodeverkTyper.UTSETTELSE_GRADERING_KVOTE)(state),
  skalUtsette: formValueSelector(ownProps.form)(state, ownProps.namePrefix).skalUtsette,
});

export default connect(mapStateToProps)(PermisjonUtsettelsePanel);