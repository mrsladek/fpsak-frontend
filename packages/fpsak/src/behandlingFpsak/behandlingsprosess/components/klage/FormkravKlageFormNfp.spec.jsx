import React from 'react';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/assets/testHelpers//intl-enzyme-test-helper';
import { expect } from 'chai';

import { reduxFormPropsMock } from '@fpsak-frontend/assets/testHelpers//redux-form-test-helper';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { FormkravKlageFormNfpImpl } from './FormkravKlageFormNfp';

describe('<FormkravKlageFormNfp>', () => {
  it('skal initiere fomrkrav-form', () => {
    const wrapper = shallowWithIntl(<FormkravKlageFormNfpImpl
      readOnly={false}
      readOnlySubmitButton
      aksjonspunktCode={aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP}
      intl={intlMock}
      {...reduxFormPropsMock}
    />);
    expect(wrapper.find('Connect(InjectIntl(FormkravKlageForm))')).has.length(1);
  });
});