import { getBehandlingFormValues } from 'behandlingFpsak/behandlingForm';
import { getFaktaOmBeregning } from 'behandlingFpsak/behandlingSelectors';


export const mottarYtelseFieldPrefix = 'mottarYtelseField';
export const frilansSuffix = '_frilans';
export const utledArbeidsforholdFieldName = andel => mottarYtelseFieldPrefix + andel.andelsnr;
export const finnFrilansFieldName = () => (mottarYtelseFieldPrefix + frilansSuffix);


export const andelsnrMottarYtelseMap = (values, vurderMottarYtelse) => {
  if (!vurderMottarYtelse) {
    return {};
  }
  const mottarYtelseMap = {};
  const atAndelerUtenIM = vurderMottarYtelse.arbeidstakerAndelerUtenIM ? vurderMottarYtelse.arbeidstakerAndelerUtenIM : [];
  atAndelerUtenIM.forEach((andel) => {
    const mottarYtelse = values[utledArbeidsforholdFieldName(andel)];
    mottarYtelseMap[andel.andelsnr] = mottarYtelse;
  });
  return mottarYtelseMap;
};

export const skalFastsetteInntektATUtenInntektsmelding = (values, vurderMottarYtelse) => {
  const atAndelerUtenIM = vurderMottarYtelse && vurderMottarYtelse.arbeidstakerAndelerUtenIM ? vurderMottarYtelse.arbeidstakerAndelerUtenIM : [];
  return atAndelerUtenIM.map(andel => values[utledArbeidsforholdFieldName(andel)])
    .find(mottarYtelse => mottarYtelse) !== undefined;
};

export const mapStateToSkalFastsetteAT = (state, formName) => {
  const values = getBehandlingFormValues(formName)(state);
  const faktaOmBeregning = getFaktaOmBeregning(state);
  return faktaOmBeregning ? skalFastsetteInntektATUtenInntektsmelding(values, faktaOmBeregning.vurderMottarYtelse) : false;
};

export const frilansMottarYtelse = values => (values[finnFrilansFieldName()]);

export const mapStateToSkalFastsetteFL = (state, formName) => {
  const values = getBehandlingFormValues(formName)(state);
  return frilansMottarYtelse(values);
};

export const harVurdertMottarYtelse = (values, vurderMottarYtelse) => {
  if (vurderMottarYtelse.erFrilans) {
    const flMottarYtelse = frilansMottarYtelse(values);
    if (flMottarYtelse === undefined || flMottarYtelse === null) {
      return false;
    }
  }
  const atAndelerUtenIM = vurderMottarYtelse.arbeidstakerAndelerUtenIM ? vurderMottarYtelse.arbeidstakerAndelerUtenIM : [];
  if (atAndelerUtenIM.length > 0) {
    const harAndelSomIkkeErVurdert = atAndelerUtenIM.map(andel => values[utledArbeidsforholdFieldName(andel)])
      .some(mottarYtelse => mottarYtelse === undefined || mottarYtelse === null);
    if (harAndelSomIkkeErVurdert) {
      return false;
    }
  }
  return true;
};
