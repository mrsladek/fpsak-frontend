import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import moment from 'moment';

import {
  dateAfterOrEqual, hasValidDate, ISO_DATE_FORMAT, required,
} from '@fpsak-frontend/utils';
import {
  FlexColumn, FlexContainer, FlexRow, PeriodFieldArray,
} from '@fpsak-frontend/shared-components';
import { DatepickerField } from '@fpsak-frontend/form';

import styles from './frilansPerioderFieldArray.less';

/**
 *  FrilansPerioderFieldArray
 *
 * Presentasjonskomponent: Viser inputfelter for fra og til dato for frilansperioder
 * Komponenten må rendres som komponenten til et FieldArray.
 */
export const FrilansPerioderFieldArray = ({
  fields,
  meta,
  readOnly,
}) => (
  <PeriodFieldArray fields={fields} meta={meta} readOnly={readOnly}>
    {(periodeElementFieldId, index, getRemoveButton) => (
      <Row key={periodeElementFieldId}>
        <Column xs="12" className={index !== (fields.length - 1) ? styles.notLastRow : ''}>
          <FlexContainer>
            <FlexRow>
              <FlexColumn>
                <DatepickerField
                  name={`${periodeElementFieldId}.periodeFom`}
                  defaultValue={null}
                  label={index === 0 ? { id: 'Registrering.Frilans.periodeFom' } : ''}
                />
              </FlexColumn>
              <FlexColumn>
                <DatepickerField
                  name={`${periodeElementFieldId}.periodeTom`}
                  defaultValue={null}
                  label={index === 0 ? { id: 'Registrering.Frilans.periodeTom' } : ''}
                />
              </FlexColumn>
              <FlexColumn>
                {getRemoveButton()}
              </FlexColumn>
            </FlexRow>
          </FlexContainer>
        </Column>
      </Row>
    )}
  </PeriodFieldArray>
);

FrilansPerioderFieldArray.propTypes = {
  fields: PropTypes.shape().isRequired,
  meta: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
};

FrilansPerioderFieldArray.validate = (values) => {
  const arrayErrors = values.map(({ periodeFom, periodeTom }) => {
    const periodeFomDate = moment(periodeFom, ISO_DATE_FORMAT);
    const periodeTomDate = moment(periodeTom, ISO_DATE_FORMAT);
    const periodeFomError = required(periodeFom) || hasValidDate(periodeFom);
    let periodeTomError = required(periodeTom) || hasValidDate(periodeTom);

    if (!periodeFomError && !periodeTomError) {
      periodeTomError = dateAfterOrEqual(periodeFomDate)(periodeTomDate);
    }
    if (periodeFomError || periodeTomError) {
      return {
        periodeFom: periodeFomError,
        periodeTom: periodeTomError,
      };
    }
    return null;
  });

  if (arrayErrors.some((errors) => errors !== null)) {
    return arrayErrors;
  }
  return null;
};

export default FrilansPerioderFieldArray;
