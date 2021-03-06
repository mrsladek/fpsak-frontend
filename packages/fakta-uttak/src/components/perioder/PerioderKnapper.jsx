import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import uttakPeriodeVurdering from '@fpsak-frontend/kodeverk/src/uttakPeriodeVurdering';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import styles from './periodeTyper.less';

export const PerioderKnapper = ({
  resultat, updatePeriode, updated, resetPeriode, id, cancelEditPeriode, bekreftet, readOnly,
}) => (
  !readOnly && (
  <div>
    <VerticalSpacer sixteenPx />
    <Hovedknapp
      className={styles.oppdaterMargin}
      htmlType="button"
      mini
      disabled={resultat === uttakPeriodeVurdering.PERIODE_IKKE_VURDERT}
      onClick={updatePeriode}
    >
      <FormattedMessage id="UttakInfoPanel.Oppdater" />
    </Hovedknapp>
    {!bekreftet && !updated
      && (
      <Knapp
        className={styles.oppdaterMargin}
        htmlType="button"
        mini
        disabled={resultat === uttakPeriodeVurdering.PERIODE_IKKE_VURDERT}
        onClick={() => resetPeriode()}
      >
        <FormattedMessage id="UttakInfoPanel.Nullstill" />
      </Knapp>
      )}
    {(bekreftet || (!bekreftet && updated))
      && (
      <Knapp
        htmlType="button"
        mini
        onClick={() => {
          resetPeriode();
          cancelEditPeriode(id);
        }}
      >
        <FormattedMessage id="UttakInfoPanel.Avbryt" />
      </Knapp>
      )}
  </div>
  )
);

PerioderKnapper.propTypes = {
  resultat: PropTypes.string,
  updatePeriode: PropTypes.func.isRequired,
  updated: PropTypes.bool.isRequired,
  bekreftet: PropTypes.bool.isRequired,
  resetPeriode: PropTypes.func.isRequired,
  cancelEditPeriode: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

PerioderKnapper.defaultProps = {
  resultat: undefined,
};

export default PerioderKnapper;
