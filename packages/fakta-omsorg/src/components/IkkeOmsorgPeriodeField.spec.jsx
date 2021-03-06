import React from 'react';
import { expect } from 'chai';

import { MockFields } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { DatepickerField } from '@fpsak-frontend/form';
import { PeriodFieldArray } from '@fpsak-frontend/shared-components';

import IkkeOmsorgPeriodeField from './IkkeOmsorgPeriodeField';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-fakta-omsorg';

const getRemoveButton = () => <button id="avslutt" type="button" />;

describe('<IkkeOmsorgPeriodeField>', () => {
  it('Skal rendre IkkeOmsorgPeriodeField', () => {
    const fields = new MockFields('ikkeOmsorgPerioder', 1);

    const wrapper = shallowWithIntl(<IkkeOmsorgPeriodeField
      readOnly={false}
      fields={fields}
      meta={{}}
    />);

    const fieldArray = wrapper.find(PeriodFieldArray);
    expect(fieldArray).has.length(1);

    const fn = fieldArray.prop('children');
    const comp = fn('fieldId1', 0, getRemoveButton);
    const innerWrapper = shallowWithIntl(comp);

    const dateFields = innerWrapper.find(DatepickerField);
    expect(dateFields).has.length(2);
    expect(dateFields.first().prop('name')).is.eql('fieldId1.periodeFom');
    expect(dateFields.last().prop('name')).is.eql('fieldId1.periodeTom');
    expect(innerWrapper.find('#avslutt')).has.length(1);
  });
});
