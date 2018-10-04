import { notNull } from '@fpsak-frontend/utils/objectUtils';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/fagsakYtelseType';
import foreldreType from '@fpsak-frontend/kodeverk/foreldreType';
import familieHendelseType from '@fpsak-frontend/kodeverk/familieHendelseType';

class SoknadData {
  constructor(selectedFagsakYtelseType, selectedFamilieHendelseType, selectedForeldreType) {
    this.fagsakYtelseType = notNull(selectedFagsakYtelseType);
    if (selectedFagsakYtelseType === fagsakYtelseType.ENDRING_FORELDREPENGER) {
      this.familieHendelseType = familieHendelseType.IKKE_RELEVANT;
      this.foreldreType = foreldreType.IKKE_RELEVANT;
    } else {
      this.familieHendelseType = notNull(selectedFamilieHendelseType);
      this.foreldreType = notNull(selectedForeldreType);
    }
  }

  getFagsakYtelseType() {
    return this.fagsakYtelseType;
  }

  getFamilieHendelseType() {
    return this.familieHendelseType;
  }

  getForeldreType() {
    return this.foreldreType;
  }
}

export default SoknadData;
