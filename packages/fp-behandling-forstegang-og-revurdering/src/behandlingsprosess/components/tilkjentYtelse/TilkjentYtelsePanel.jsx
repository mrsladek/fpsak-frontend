import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment/moment';
import { createSelector } from 'reselect';
import { FormattedMessage, injectIntl } from 'react-intl';

import { Undertittel } from 'nav-frontend-typografi';
import { beregningresultatMedUttaksplanPropType } from '@fpsak-frontend/prop-types';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import { FadingPanel } from '@fpsak-frontend/shared-components';
import {
  getPersonopplysning,
  getBehandlingResultatstruktur,
  getFamiliehendelseGjeldende,
  getIsFagsakTypeSVP,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';
import { ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import Tilbaketrekkpanel from './tilbaketrekk/Tilbaketrekkpanel';
import TilkjentYtelse from './TilkjentYtelse';

const perioderMedClassName = [];

const formatPerioder = (perioder) => {
  perioderMedClassName.length = 0;
  perioder.forEach((item, index) => {
    if (item.andeler[0] && item.dagsats) {
      perioderMedClassName.push(item);
      perioderMedClassName[perioderMedClassName.length - 1].id = index;
    }
  });
  return perioderMedClassName;
};

const groups = [{ id: 1, content: '' }, { id: 2, content: '' }];

export const TilkjentYtelsePanelImpl = ({
  beregningsresultatMedUttaksplan,
  hovedsokerKjonn,
  medsokerKjonn,
  soknadDato,
  familiehendelseDato,
  vurderTilbaketrekkAP,
  readOnly,
  submitCallback,
  readOnlySubmitButton,
  isSoknadSvangerskapspenger,
}) => (
  <FadingPanel>
    <Undertittel>
      <FormattedMessage id="TilkjentYtelse.Title" />
    </Undertittel>
    {beregningsresultatMedUttaksplan
      && (
      <TilkjentYtelse
        items={formatPerioder(beregningsresultatMedUttaksplan.perioder)}
        groups={groups}
        soknadDate={soknadDato}
        familiehendelseDate={familiehendelseDato}
        hovedsokerKjonnKode={hovedsokerKjonn}
        medsokerKjonnKode={medsokerKjonn}
        isSoknadSvangerskapspenger={isSoknadSvangerskapspenger}
      />
      )
      }
    { vurderTilbaketrekkAP
    && (
    <Tilbaketrekkpanel
      readOnly={readOnly}
      vurderTilbaketrekkAP={vurderTilbaketrekkAP}
      submitCallback={submitCallback}
      readOnlySubmitButton={readOnlySubmitButton}
    />
    )
    }
  </FadingPanel>
);

TilkjentYtelsePanelImpl.propTypes = {
  beregningsresultatMedUttaksplan: beregningresultatMedUttaksplanPropType,
  hovedsokerKjonn: PropTypes.string.isRequired,
  medsokerKjonn: PropTypes.string,
  soknadDato: PropTypes.string.isRequired,
  familiehendelseDato: PropTypes.shape().isRequired,
  vurderTilbaketrekkAP: PropTypes.shape(),
  readOnly: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  isSoknadSvangerskapspenger: PropTypes.bool.isRequired,
};

TilkjentYtelsePanelImpl.defaultProps = {
  beregningsresultatMedUttaksplan: undefined,
  medsokerKjonn: undefined,
  vurderTilbaketrekkAP: undefined,
};

const parseDateString = dateString => moment(dateString, ISO_DATE_FORMAT).toDate();

const getFamiliehendelsedatoFraSoknad = (soknad) => {
  if (soknad.fodselsdatoer && Object.keys(soknad.fodselsdatoer).length > 0) {
    return Object.values(soknad.fodselsdatoer)[0];
  }
  if (soknad.termindato) {
    return soknad.termindato;
  }
  if (soknad.adopsjonFodelsedatoer && Object.keys(soknad.adopsjonFodelsedatoer).length > 0) {
    return Object.values(soknad.adopsjonFodelsedatoer)[0];
  }
  return undefined;
};

const getCurrentFamiliehendelseDato = (
  soknadsType, familiehendelsedatoFraSoknad,
  endredFodselsDato, omsorgsOvertagelseDato, endredomsorgsOvertagelseDato,
) => {
  if (soknadsType === soknadType.FODSEL) {
    return endredFodselsDato ? parseDateString(endredFodselsDato) : parseDateString(familiehendelsedatoFraSoknad);
  }
  return endredomsorgsOvertagelseDato ? parseDateString(endredomsorgsOvertagelseDato) : parseDateString(omsorgsOvertagelseDato);
};

const finnTilbaketrekkAksjonspunkt = createSelector([behandlingSelectors.getAksjonspunkter], (alleAksjonspunkter) => {
  if (alleAksjonspunkter) {
    return alleAksjonspunkter.find(ap => ap.definisjon && ap.definisjon.kode === aksjonspunktCodes.VURDER_TILBAKETREKK);
  }
  return undefined;
});

const mapStateToProps = (state) => {
  const person = getPersonopplysning(state);
  const familiehendelse = getFamiliehendelseGjeldende(state);
  const beregningsresultat = getBehandlingResultatstruktur(state);
  const soknad = behandlingSelectors.getSoknad(state);
  const isSVP = getIsFagsakTypeSVP(state);
  return {
    hovedsokerKjonn: person ? person.navBrukerKjonn.kode : undefined,
    medsokerKjonn: person.annenPart ? person.annenPart.navBrukerKjonn.kode : undefined,
    soknadDato: soknad.mottattDato,
    isSoknadSvangerskapspenger: isSVP,
    familiehendelseDato: getCurrentFamiliehendelseDato(
      soknad.soknadType.kode,
      getFamiliehendelsedatoFraSoknad(soknad),
      familiehendelse.fodselsdato,
      soknad.omsorgsovertakelseDato,
      familiehendelse.omsorgsovertakelseDato,
    ),
    beregningsresultatMedUttaksplan: beregningsresultat,
    vurderTilbaketrekkAP: finnTilbaketrekkAksjonspunkt(state),
  };
};

const TilkjentYtelsePanel = connect(mapStateToProps)(injectIntl(TilkjentYtelsePanelImpl));

TilkjentYtelsePanel.supports = bp => bp === behandlingspunktCodes.TILKJENT_YTELSE;

export default TilkjentYtelsePanel;
