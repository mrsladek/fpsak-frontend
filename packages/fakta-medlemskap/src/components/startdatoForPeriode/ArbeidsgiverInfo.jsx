import React from 'react';
import PropTypes from 'prop-types';
import { Column } from 'nav-frontend-grid';

import { DatepickerField } from '@fpsak-frontend/form';
import { hasValidDate, required } from '@fpsak-frontend/utils';

const truncateEmployerName = (empName) => {
  const cutOffLength = 20;

  if (empName.length > cutOffLength) {
    return (`${empName.substring(0, cutOffLength - 3)}...`);
  }
  return empName;
};

export const ArbeidsgiverInfo = ({ fields }) => (
  <div>
    {fields.map((arbeidsgiverId, index) => {
      const arbeidsgiverNavn = fields.get(index).arbeidsgiver;

      return (
        <Column xs="4" key={arbeidsgiverId}>
          <DatepickerField
            name={`${arbeidsgiverId}.arbeidsgiverStartdato`}
            label={fields.length > 2 ? truncateEmployerName(arbeidsgiverNavn) : arbeidsgiverNavn}
            validate={[required, hasValidDate]}
            readOnly
          />
        </Column>
      );
    })}
  </div>
);

ArbeidsgiverInfo.propTypes = {
  fields: PropTypes.shape().isRequired,
};

export default ArbeidsgiverInfo;
