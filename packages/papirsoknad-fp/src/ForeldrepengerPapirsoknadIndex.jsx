import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { SoknadData } from '@fpsak-frontend/papirsoknad-felles';

import ForeldrepengerForm from './components/ForeldrepengerForm';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const ForeldrepengerPapirsoknadIndex = ({
  onSubmitUfullstendigsoknad,
  onSubmit,
  readOnly,
  soknadData,
  alleKodeverk,
  fagsakPerson,
}) => (
  <RawIntlProvider value={intl}>
    <ForeldrepengerForm
      onSubmitUfullstendigsoknad={onSubmitUfullstendigsoknad}
      onSubmit={onSubmit}
      readOnly={readOnly}
      soknadData={soknadData}
      alleKodeverk={alleKodeverk}
      fagsakPerson={fagsakPerson}
    />
  </RawIntlProvider>
);

ForeldrepengerPapirsoknadIndex.propTypes = {
  onSubmitUfullstendigsoknad: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  soknadData: PropTypes.instanceOf(SoknadData).isRequired,
  alleKodeverk: PropTypes.shape({}).isRequired,
  fagsakPerson: PropTypes.shape({}).isRequired,
};

export default ForeldrepengerPapirsoknadIndex;
