import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import {
  getEndringBeregningsgrunnlagPerioder,
  getFaktaOmBeregning,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';

export const sortArbeidsforholdList = (arbeidsforhold) => {
  const copy = arbeidsforhold.slice(0);
  copy.sort((a, b) => new Date(a.arbeidsforhold.startdato) - new Date(b.arbeidsforhold.startdato));
  return copy;
};

export const getSortedKortvarigeArbeidsforholdList = createSelector([getFaktaOmBeregning],
  faktaOmBeregning => sortArbeidsforholdList(faktaOmBeregning.kortvarigeArbeidsforhold));

export const createArbeidsperiodeString = (arbeidsforhold) => {
  if (arbeidsforhold.opphoersdato !== undefined && arbeidsforhold.opphoersdato !== null) {
    return `${arbeidsforhold.startdato} - ${arbeidsforhold.opphoersdato}`;
  }
  return `${arbeidsforhold.startdato} - `;
};

const arbeidsforholdEksistererIListen = (arbeidsforhold, arbeidsgiverList) => {
  if (arbeidsforhold.arbeidsforholdId === null) {
    return arbeidsgiverList.map(({ arbeidsgiverId }) => (arbeidsgiverId)).includes(arbeidsforhold.arbeidsgiverId);
  }
  return arbeidsgiverList.map(({ arbeidsforholdId }) => (arbeidsforholdId)).includes(arbeidsforhold.arbeidsforholdId);
};

export const getUniqueListOfArbeidsforholdFromAndeler = (andeler) => {
  const arbeidsgiverList = [];
  if (andeler === undefined) {
    return arbeidsgiverList;
  }
  andeler.forEach((andel) => {
    if (andel.arbeidsforhold !== null && !arbeidsforholdEksistererIListen(andel.arbeidsforhold, arbeidsgiverList)) {
      const arbeidsforholdObject = {
        andelsnr: andel.andelsnr,
        ...andel.arbeidsforhold,
      };
      arbeidsgiverList.push(arbeidsforholdObject);
    }
  });
  return arbeidsgiverList;
};

const emptyList = [];

export const getUniqueListOfArbeidsforhold = createSelector([getEndringBeregningsgrunnlagPerioder],
  endringPerioder => getUniqueListOfArbeidsforholdFromAndeler(endringPerioder.length > 0
  ? endringPerioder.flatMap(p => p.endringBeregningsgrunnlagAndeler) : emptyList));

export const getUniqueListOfArbeidsforholdFields = (fields) => {
  const arbeidsgiverList = [];
  if (fields === undefined) {
    return arbeidsgiverList;
  }
  fields.forEach((id, index) => {
    const field = fields.get(index);
    if (field.arbeidsgiverNavn !== null && !arbeidsforholdEksistererIListen(field, arbeidsgiverList)) {
      const arbeidsforholdObject = {
        andelsnr: field.andelsnr,
        arbeidsforholdId: field.arbeidsforholdId,
        arbeidsgiverId: field.arbeidsgiverId,
        arbeidsgiverNavn: field.arbeidsgiverNavn,
        arbeidsperiodeFom: field.arbeidsperiodeFom,
        arbeidsperiodeTom: field.arbeidsperiodeTom,
      };
      arbeidsgiverList.push(arbeidsforholdObject);
    }
  });
  return arbeidsgiverList;
};


export const arbeidsforholdProptype = PropTypes.shape({
  arbeidsgiverNavn: PropTypes.string,
  arbeidsgiverId: PropTypes.string,
  startdato: PropTypes.string,
  opphoersdato: PropTypes.string,
  arbeidsforholdId: PropTypes.string,
});
