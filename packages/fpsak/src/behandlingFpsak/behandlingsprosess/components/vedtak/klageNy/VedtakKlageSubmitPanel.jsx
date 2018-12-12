import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getBehandlingIsOnHold } from 'behandlingFpsak/behandlingSelectors';
import classNames from 'classnames';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Row, Column } from 'nav-frontend-grid';

import { medholdIKlage } from '../VedtakHelper';

import styles from '../vedtakForm.less';

export const isMedholdIKlage = (
  klageVurderingResultatNFP, klageVurderingResultatNK,
) => medholdIKlage(klageVurderingResultatNFP) || medholdIKlage(klageVurderingResultatNK);

const getPreviewCallback = (formProps, begrunnelse, previewVedtakCallback) => (e) => {
  if (formProps.valid || formProps.pristine) {
    previewVedtakCallback(begrunnelse || ' ');
  } else {
    formProps.submit();
  }
  e.preventDefault();
};

export const VedtakKlageSubmitPanelImpl = ({
  intl,
  behandlingPaaVent,
  previewVedtakCallback,
  begrunnelse,
  formProps,
  readOnly,
}) => {
  const previewBrev = getPreviewCallback(formProps, begrunnelse, previewVedtakCallback);

  return (
    <Row>
      <Column xs="6">
        {!readOnly
        && (
        <Hovedknapp
          mini
          className={styles.mainButton}
          onClick={formProps.handleSubmit}
          disabled={behandlingPaaVent || formProps.submitting}
          spinner={formProps.submitting}
        >
          {intl.formatMessage({ id: 'VedtakKlageForm.TilGodkjenning' })}
        </Hovedknapp>
        )
        }
        <a
          href=""
          onClick={previewBrev}
          onKeyDown={e => (e.keyCode === 13 ? previewBrev(e) : null)}
          className={classNames(styles.previewLink, 'lenke lenke--frittstaende')}
        >
          <FormattedMessage id="VedtakKlageForm.ForhandvisBrev" />
        </a>
      </Column>
    </Row>
  );
};

VedtakKlageSubmitPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  previewVedtakCallback: PropTypes.func.isRequired,
  behandlingPaaVent: PropTypes.bool.isRequired,
  begrunnelse: PropTypes.string,
  readOnly: PropTypes.bool.isRequired,
  formProps: PropTypes.shape().isRequired,
};

VedtakKlageSubmitPanelImpl.defaultProps = {
  begrunnelse: undefined,
};


const mapStateToProps = state => ({
  behandlingPaaVent: getBehandlingIsOnHold(state),
});

export default connect(mapStateToProps)(injectIntl(VedtakKlageSubmitPanelImpl));