import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Panel } from 'nav-frontend-paneler';

import { behandlingIListePropType } from '@fpsak-frontend/prop-types';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { requireProps } from '@fpsak-frontend/fp-felles';

import { getFagsakYtelseType, getSelectedFagsakStatus, getSelectedSaksnummer } from '../fagsak/fagsakSelectors';
import { getBehandlinger, getBehandlingerTypesMappedById, getNoExistingBehandlinger } from '../behandling/selectors/behandlingerSelectors';
import { getSelectedBehandlingId } from '../behandling/duck';
import {
  getAnnenPartBehandling, getShowAllBehandlinger, resetFagsakProfile, toggleShowAllBehandlinger,
} from './duck';
import FagsakProfile from './components/FagsakProfile';
import RisikoklassifiseringIndex from './risikoklassifisering/RisikoklassifiseringIndex';

import styles from './fagsakProfileIndex.less';
import { getAlleKodeverk } from '../kodeverk/duck';

export const getSkalViseRisikoklassifisering = createSelector(
  [getSelectedBehandlingId, getBehandlingerTypesMappedById],
  (selectedBehandlingId, behandlingTypeMap) => {
    if (!selectedBehandlingId || !behandlingTypeMap) {
      return false;
    }
    return behandlingTypeMap[selectedBehandlingId] === behandlingType.FORSTEGANGSSOKNAD;
  },
);

export class FagsakProfileIndex extends Component {
  componentDidMount() {
    const { selectedBehandlingId, showAll, toggleShowAll } = this.props;
    if (!selectedBehandlingId && !showAll) {
      toggleShowAll();
    }
  }

  componentWillUnmount() {
    const { reset } = this.props;
    reset();
  }

  render() {
    const {
      sakstype, toggleShowAll, showAll, selectedBehandlingId, behandlinger, alleKodeverk,
      noExistingBehandlinger, fagsakStatus, annenPartLink, saksnummer, skalViseRisikoklassifisering,
    } = this.props;
    return (
      <Panel className={styles.panelPadding}>
        <FagsakProfile
          annenPartLink={annenPartLink}
          saksnummer={saksnummer}
          sakstype={sakstype}
          fagsakStatus={fagsakStatus}
          behandlinger={behandlinger}
          noExistingBehandlinger={noExistingBehandlinger}
          selectedBehandlingId={selectedBehandlingId}
          showAll={showAll}
          toggleShowAll={toggleShowAll}
          alleKodeverk={alleKodeverk}
        />
        {skalViseRisikoklassifisering
          && (
          <RisikoklassifiseringIndex />
          )}


      </Panel>
    );
  }
}

FagsakProfileIndex.propTypes = {
  saksnummer: PropTypes.number.isRequired,
  sakstype: PropTypes.shape().isRequired,
  fagsakStatus: PropTypes.shape().isRequired,
  selectedBehandlingId: PropTypes.number,
  behandlinger: PropTypes.arrayOf(behandlingIListePropType).isRequired,
  noExistingBehandlinger: PropTypes.bool.isRequired,
  showAll: PropTypes.bool.isRequired,
  toggleShowAll: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  skalViseRisikoklassifisering: PropTypes.bool.isRequired,
  annenPartLink: PropTypes.shape(),
  alleKodeverk: PropTypes.shape().isRequired,
};

FagsakProfileIndex.defaultProps = {
  selectedBehandlingId: null,
  annenPartLink: {},
};

const mapStateToProps = (state) => {
  const annenPartLink = getAnnenPartBehandling(state);

  return {
    annenPartLink,
    saksnummer: getSelectedSaksnummer(state),
    sakstype: getFagsakYtelseType(state),
    fagsakStatus: getSelectedFagsakStatus(state),
    selectedBehandlingId: getSelectedBehandlingId(state),
    behandlinger: getBehandlinger(state),
    noExistingBehandlinger: getNoExistingBehandlinger(state),
    showAll: getShowAllBehandlinger(state),
    skalViseRisikoklassifisering: getSkalViseRisikoklassifisering(state),
    alleKodeverk: getAlleKodeverk(state),
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  toggleShowAll: toggleShowAllBehandlinger,
  reset: resetFagsakProfile,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(requireProps(['saksnummer', 'behandlinger'], <LoadingPanel />)(FagsakProfileIndex));