import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { BehandlingInfoHolder } from '@fpsak-frontend/fp-behandling-felles';

import behandlingSelectors from './selectors/klageBehandlingSelectors';

// TODO (TOR) Midlertidig komponent. Ikkje legg meir her!! Komponentane utanfor behandlingskonteksten skal sjølv ha ansvar for å henta data
export class FpSakBehandlingInfoSetter extends Component {
  constructor(props) {
    super(props);
    this.setBehandlingInfo();
  }

  setBehandlingInfo = () => {
    const {
      setBehandlingInfoHolder, isKontrollerRevurderingApOpen, behandlingVersjon,
      behandlingKlageVurdering, behandlingsresultat, behandlingKlageVurderingResultatNFP, behandlingKlageVurderingResultatNK,
      behandlingsresultatFraOriginalBehandling, resultatstrukturFraOriginalBehandling,
    } = this.props;

    setBehandlingInfoHolder(new BehandlingInfoHolder()
      .withIsKontrollerRevurderingAksjonspunkOpen(isKontrollerRevurderingApOpen)
      .withBehandlingVersjon(behandlingVersjon)
      .withBehandlingKlageVurdering(behandlingKlageVurdering)
      .withBehandlingsresultat(behandlingsresultat)
      .withBehandlingKlageVurderingResultatNFP(behandlingKlageVurderingResultatNFP)
      .withBehandlingKlageVurderingResultatNK(behandlingKlageVurderingResultatNK)
      .withBehandlingsresultatFraOriginalBehandling(behandlingsresultatFraOriginalBehandling)
      .withResultatstrukturFraOriginalBehandling(resultatstrukturFraOriginalBehandling));
  }

  componentDidUpdate = (prevProps) => {
    const { behandlingVersjon } = this.props;

    if (prevProps.behandlingVersjon !== behandlingVersjon) {
      this.setBehandlingInfo();
    }
  }

  render =() => null
}

FpSakBehandlingInfoSetter.propTypes = {
  isKontrollerRevurderingApOpen: PropTypes.bool.isRequired,
  setBehandlingInfoHolder: PropTypes.func.isRequired,
  behandlingVersjon: PropTypes.number,
  behandlingKlageVurdering: PropTypes.shape(),
  behandlingsresultat: PropTypes.shape(),
  behandlingKlageVurderingResultatNFP: PropTypes.shape(),
  behandlingKlageVurderingResultatNK: PropTypes.shape(),
  behandlingsresultatFraOriginalBehandling: PropTypes.shape(),
  resultatstrukturFraOriginalBehandling: PropTypes.shape(),
};

FpSakBehandlingInfoSetter.defaultProps = {
  behandlingVersjon: undefined,
  behandlingsresultat: undefined,
  behandlingKlageVurdering: undefined,
  behandlingKlageVurderingResultatNFP: undefined,
  behandlingKlageVurderingResultatNK: undefined,
  behandlingsresultatFraOriginalBehandling: undefined,
  resultatstrukturFraOriginalBehandling: undefined,
};

const mapStateToProps = (state) => ({
  isKontrollerRevurderingApOpen: behandlingSelectors.isKontrollerRevurderingAksjonspunkOpen(state),
  behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
  behandlingKlageVurdering: behandlingSelectors.getBehandlingKlageVurdering(state),
  behandlingsresultat: behandlingSelectors.getBehandlingsresultat(state),
  behandlingKlageVurderingResultatNFP: behandlingSelectors.getBehandlingKlageVurderingResultatNFP(state),
  behandlingKlageVurderingResultatNK: behandlingSelectors.getBehandlingKlageVurderingResultatNK(state),
});

export default connect(mapStateToProps)(FpSakBehandlingInfoSetter);
