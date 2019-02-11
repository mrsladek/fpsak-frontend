import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';
import { getSelectedBehandlingId, getFagsakYtelseType } from 'behandlingInnsyn/src/duckInnsyn';
import {
  getBehandlingStatus, getBehandlingsresultat, getAksjonspunkter, getBehandlingType,
} from 'behandlingInnsyn/src/selectors/innsynBehandlingSelectors';
import { Image } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { requireProps } from '@fpsak-frontend/fp-felles';
import { getResolveProsessAksjonspunkterSuccess } from 'behandlingInnsyn/src/behandlingsprosess/duckBpInnsyn';

import styles from './fatterVedtakStatusModal.less';

/**
 * FatterVedtakStatusModal
 *
 * Presentasjonskomponent. Denne modalen viser en lightbox etter at en saksbehandler har sendt et forslag på vedtak til beslutter
 * ved totrinnskontroll. Ved å trykke på knapp blir saksbehandler tatt tilbake til søkesiden.
 */
export class FatterVedtakStatusModal extends Component {
  constructor() {
    super();

    this.showModal = false;
  }

  render() {
    const {
      intl, showModal, closeEvent, infoTextCode, altImgTextCode, resolveProsessAksjonspunkterSuccess, modalDescriptionTextCode,
    } = this.props;
    if (showModal !== undefined) {
      this.showModal = showModal;
    } else if (!this.showModal) {
      this.showModal = resolveProsessAksjonspunkterSuccess;
    }

    return (
      <Modal
        className={styles.modal}
        isOpen={this.showModal}
        closeButton={false}
        contentLabel={intl.formatMessage({ id: modalDescriptionTextCode })}
        onRequestClose={closeEvent}
        shouldCloseOnOverlayClick={false}
        ariaHideApp={false}
      >
        <Row>
          <Column xs="1">
            <Image className={styles.image} altCode={altImgTextCode} src={innvilgetImageUrl} />
            <div className={styles.divider} />
          </Column>
          <Column xs="9">
            <Normaltekst>
              <FormattedMessage id={infoTextCode} />
            </Normaltekst>
            <Normaltekst><FormattedMessage id="FatterVedtakStatusModal.GoToSearchPage" /></Normaltekst>
          </Column>
          <Column xs="2">
            <Hovedknapp
              mini
              className={styles.button}
              onClick={closeEvent}
              autoFocus
            >
              {intl.formatMessage({ id: 'FatterVedtakStatusModal.Ok' })}
            </Hovedknapp>
          </Column>
        </Row>
      </Modal>
    );
  }
}

FatterVedtakStatusModal.propTypes = {
  closeEvent: PropTypes.func.isRequired,
  infoTextCode: PropTypes.string.isRequired,
  altImgTextCode: PropTypes.string.isRequired,
  modalDescriptionTextCode: PropTypes.string.isRequired,
  resolveProsessAksjonspunkterSuccess: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
  showModal: PropTypes.bool,
};

FatterVedtakStatusModal.defaultProps = {
  showModal: undefined,
};

const hasOpenAksjonspunktForVedtakUtenTotrinnskontroll = createSelector(
  [getAksjonspunkter], (aksjonspunkter = []) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL),
);

const isBehandlingsresultatOpphor = createSelector(
  [getBehandlingsresultat], behandlingsresultat => behandlingsresultat.type.kode === behandlingResultatType.OPPHOR,
);

const getModalDescriptionTextCode = createSelector(
  [isBehandlingsresultatOpphor, hasOpenAksjonspunktForVedtakUtenTotrinnskontroll, getFagsakYtelseType, getBehandlingType],
  (isOpphor, hasOpenAksjonspunkter, ytelseType, behType) => {
    if (isOpphor) {
      return 'FatterVedtakStatusModal.ModalDescriptionFPOpphort';
    }
    if (hasOpenAksjonspunkter) {
      return ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD
        ? 'FatterVedtakStatusModal.ModalDescriptionES'
        : 'FatterVedtakStatusModal.ModalDescriptionFP';
    }
    return behType === behandlingType.KLAGE ? 'FatterVedtakStatusModal.SendtKlageResultatTilBeslutter' : 'FatterVedtakStatusModal.Sendt';
  },
);


const getAltImgTextCode = createSelector(
  [hasOpenAksjonspunktForVedtakUtenTotrinnskontroll, getFagsakYtelseType, getBehandlingType],
  (hasOpenAksjonspunkter, ytelseType, behType) => {
    if (hasOpenAksjonspunkter) {
      return ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD
        ? 'FatterVedtakStatusModal.IkkeInnvilgetES'
        : 'FatterVedtakStatusModal.IkkeInnvilgetFP';
    }
    return behType === behandlingType.KLAGE ? 'FatterVedtakStatusModal.SendtKlageResultatTilBeslutter' : 'FatterVedtakStatusModal.Sendt';
  },
);

const getInfoTextCode = createSelector(
  [getBehandlingType],
  bType => (bType.kode === behandlingType.KLAGE ? 'FatterVedtakStatusModal.SendtKlageResultatTilBeslutter' : 'FatterVedtakStatusModal.SendtBeslutter'),
);
const isStatusFatterVedtak = createSelector([getBehandlingStatus], behandlingstatus => behandlingstatus.kode === behandlingStatus.FATTER_VEDTAK);

const mapStateToProps = state => ({
  selectedBehandlingId: getSelectedBehandlingId(state),
  isBehandlingStatusFatterVedtak: getBehandlingStatus(state).kode === behandlingStatus.FATTER_VEDTAK ? true : undefined,
  infoTextCode: isStatusFatterVedtak(state) ? getInfoTextCode(state) : '',
  altImgTextCode: isStatusFatterVedtak(state) ? getAltImgTextCode(state) : '',
  modalDescriptionTextCode: isStatusFatterVedtak(state) ? getModalDescriptionTextCode(state) : 'FatterVedtakStatusModal.ModalDescription',
  resolveProsessAksjonspunkterSuccess: getResolveProsessAksjonspunkterSuccess(state),
});

export default connect(mapStateToProps)(injectIntl(requireProps(['selectedBehandlingId', 'isBehandlingStatusFatterVedtak'])(FatterVedtakStatusModal)));