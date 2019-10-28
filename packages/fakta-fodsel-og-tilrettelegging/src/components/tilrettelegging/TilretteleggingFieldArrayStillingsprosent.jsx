import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  hasValidDecimal, maxValue, minValue, required,
} from '@fpsak-frontend/utils';
import { DecimalField } from '@fpsak-frontend/form';
import { behandlingFormValueSelector } from '@fpsak-frontend/fp-felles';
import tilretteleggingType from '@fpsak-frontend/kodeverk/src/tilretteleggingType';

import styles from './tilretteleggingFieldArrayStillingsprosent.less';

const maxValue100 = maxValue(100);
const minValue0 = minValue(0);

export const TilretteleggingFieldArrayStillingsprosent = ({
  readOnly,
  tilretteleggingFieldId,
  showStillingsprosent,
}) => (
  <>
    { showStillingsprosent && (
    <div className={styles.rightAlignText}>
      <DecimalField
        readOnly={readOnly}
        name={`${tilretteleggingFieldId}.stillingsprosent`}
        label=""
        validate={[required, minValue0, maxValue100, hasValidDecimal]}
        normalizeOnBlur={(value) => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
      />
    </div>
    )}
  </>
);

TilretteleggingFieldArrayStillingsprosent.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  tilretteleggingFieldId: PropTypes.string.isRequired,
  showStillingsprosent: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const {
    behandlingId, behandlingVersjon, index, formSectionName,
  } = ownProps;
  const tilretteleggingKode = behandlingFormValueSelector('FodselOgTilretteleggingForm', behandlingId, behandlingVersjon)(state,
    `${formSectionName}.tilretteleggingDatoer[${index}].type.kode`);
  return {
    showStillingsprosent: tilretteleggingKode === tilretteleggingType.DELVIS_TILRETTELEGGING,
  };
};


export default connect(mapStateToProps)(TilretteleggingFieldArrayStillingsprosent);