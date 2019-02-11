import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { PersonIndex } from '@fpsak-frontend/fp-felles';
import { getFagsakPerson } from 'behandlingInnsyn/src/duckInnsyn';

import styles from './faktaInnsynPanel.less';

/**
 * FaktaInnsynPanel
 *
 * Presentasjonskomponent. Har ansvar for visningen av de ulike faktapanelene. Dette gjøres
 * ved å gå gjennom aksjonspunktene og en gjør så en mapping mellom aksjonspunktene og panelene.
 */
export const FaktaInnsynPanel = ({
  fagsakPerson,
}) => (
  <>
    <div className={styles.personContainer}>
      <PersonIndex medPanel person={fagsakPerson} />
    </div>
  </>
);

FaktaInnsynPanel.propTypes = {
  fagsakPerson: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  fagsakPerson: getFagsakPerson(state),
});

export default connect(mapStateToProps)(FaktaInnsynPanel);