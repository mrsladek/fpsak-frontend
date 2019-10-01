import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Undertekst, Undertittel } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import { BehandlingspunktBegrunnelseTextField, injectKodeverk } from '@fpsak-frontend/fp-felles';
import { RadioGroupField, RadioOption, SelectField } from '@fpsak-frontend/form';
import { AksjonspunktHelpText, FadingPanel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT, required } from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { hasBehandlingFormErrorsOfType, isBehandlingFormDirty, isBehandlingFormSubmitting } from 'behandlingKlage/src/behandlingFormKlage';
import { getAlleKodeverk, getAvsluttedeBehandlinger } from 'behandlingKlage/src/duckBehandlingKlage';
import { BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-behandling-felles';
// TODO komponent skal ha eiga less-fil
import styles from '../Klagevurdering/SharedUtills/behandleKlageForm.less';

export const IKKE_PA_KLAGD_VEDTAK = 'ikkePaklagdVedtak';

export const getPaKlagdVedtak = (klageFormkavResultat) => (
  klageFormkavResultat.paKlagdBehandlingId ? `${klageFormkavResultat.paKlagdBehandlingId}` : IKKE_PA_KLAGD_VEDTAK
);

const getKlagBareVedtak = (avsluttedeBehandlinger, intl, getKodeverknavn) => {
  const klagBareVedtak = [<option key="formkrav" value={IKKE_PA_KLAGD_VEDTAK}>{intl.formatMessage({ id: 'Klage.Formkrav.IkkePåklagdVedtak' })}</option>];
  return klagBareVedtak.concat(avsluttedeBehandlinger.map((behandling) => (
    <option key={behandling.id} value={`${behandling.id}`}>
      {`${getKodeverknavn(behandling.type)} ${moment(behandling.avsluttet).format(DDMMYYYY_DATE_FORMAT)}`}
    </option>
  )));
};

const getLovHjemmeler = (aksjonspunktCode) => (
  aksjonspunktCode === aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP ? 'Klage.LovhjemmelNFP' : 'Klage.LovhjemmelKA'
);

/**
 * FormkravKlageForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for formkrav klage (NFP og KA).
 */
export const FormkravKlageForm = ({
  readOnly,
  readOnlySubmitButton,
  aksjonspunktCode,
  avsluttedeBehandlinger,
  intl,
  formProps,
  getKodeverknavn,
}) => {
  const klageBareVedtakOptions = getKlagBareVedtak(avsluttedeBehandlinger, intl, getKodeverknavn);

  return (
    <FadingPanel>
      <Undertittel>{intl.formatMessage({ id: 'Klage.Formkrav.Title' })}</Undertittel>
      <VerticalSpacer fourPx />
      <Undertekst>{intl.formatMessage({ id: getLovHjemmeler(aksjonspunktCode) })}</Undertekst>
      <VerticalSpacer fourPx />
      <AksjonspunktHelpText isAksjonspunktOpen={!readOnlySubmitButton}>
        {[<FormattedMessage id="Klage.Formkrav.HelpText" key={aksjonspunktCode} />]}
      </AksjonspunktHelpText>
      <VerticalSpacer sixteenPx />
      <Row>
        <Column xs="6">
          <BehandlingspunktBegrunnelseTextField
            readOnly={readOnly}
          />
        </Column>
        <Column xs="6">
          <SelectField
            readOnly={readOnly}
            validate={[required]}
            name="vedtak"
            label={intl.formatMessage({ id: 'Klage.Formkrav.VelgVedtak' })}
            placeholder={intl.formatMessage({ id: 'Klage.Formkrav.SelectVedtakPlaceholder' })}
            selectValues={klageBareVedtakOptions}
            bredde="l"
          />
          <Row>
            <Column xs="4">
              <Undertekst>
                {intl.formatMessage({ id: 'Klage.Formkrav.ErKlagerPart' })}
              </Undertekst>
              <VerticalSpacer sixteenPx />
              <RadioGroupField name="erKlagerPart" validate={[required]} readOnly={readOnly} className={styles.noWrap}>
                <RadioOption value label={{ id: 'Klage.Formkrav.Ja' }} />
                <RadioOption value={false} label={{ id: 'Klage.Formkrav.Nei' }} />
              </RadioGroupField>
            </Column>
            <Column xs="8">
              <Undertekst>
                {intl.formatMessage({ id: 'Klage.Formkrav.ErKonkret' })}
              </Undertekst>
              <VerticalSpacer sixteenPx />
              <RadioGroupField name="erKonkret" validate={[required]} readOnly={readOnly} className={styles.noWrap}>
                <RadioOption value label={{ id: 'Klage.Formkrav.Ja' }} />
                <RadioOption value={false} label={{ id: 'Klage.Formkrav.Nei' }} />
              </RadioGroupField>
            </Column>
          </Row>
          <Row>
            <Column xs="4">
              <Undertekst>
                {intl.formatMessage({ id: 'Klage.Formkrav.ErFristOverholdt' })}
              </Undertekst>
              <VerticalSpacer sixteenPx />
              <RadioGroupField name="erFristOverholdt" validate={[required]} readOnly={readOnly} className={styles.noWrap}>
                <RadioOption value label={{ id: 'Klage.Formkrav.Ja' }} />
                <RadioOption value={false} label={{ id: 'Klage.Formkrav.Nei' }} />
              </RadioGroupField>
            </Column>
            <Column xs="8">
              <Undertekst>
                {intl.formatMessage({ id: 'Klage.Formkrav.ErSignert' })}
              </Undertekst>
              <VerticalSpacer sixteenPx />
              <RadioGroupField name="erSignert" validate={[required]} readOnly={readOnly} className={styles.noWrap}>
                <RadioOption value label={{ id: 'Klage.Formkrav.Ja' }} />
                <RadioOption value={false} label={{ id: 'Klage.Formkrav.Nei' }} />
              </RadioGroupField>
            </Column>
          </Row>
        </Column>
      </Row>
      <div className={styles.confirmVilkarForm}>
        <BehandlingspunktSubmitButton
          formName={formProps.form}
          isReadOnly={readOnly}
          isSubmittable={!readOnlySubmitButton}
          isBehandlingFormSubmitting={isBehandlingFormSubmitting}
          isBehandlingFormDirty={isBehandlingFormDirty}
          hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
        />
      </div>

    </FadingPanel>
  );
};

FormkravKlageForm.propTypes = {
  avsluttedeBehandlinger: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.shape({
      kode: PropTypes.string.isRequired,
    }).isRequired,
    avsluttet: PropTypes.string,
  })).isRequired,
  formProps: PropTypes.shape().isRequired,
  aksjonspunktCode: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  readOnlySubmitButton: PropTypes.bool,
  intl: PropTypes.shape().isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

FormkravKlageForm.defaultProps = {
  readOnly: true,
  readOnlySubmitButton: true,
};

const mapStateToProps = (state) => ({
  avsluttedeBehandlinger: getAvsluttedeBehandlinger(state),
});

export default connect(mapStateToProps)(injectIntl(injectKodeverk(getAlleKodeverk)(FormkravKlageForm)));
