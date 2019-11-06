import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import LonnsendringForm, { lonnsendringField } from './LonnsendringForm';

describe('<LonnsendringForm>', () => {
  it('skal teste at korrekt antall radioknapper vises med korrekte props', () => {
    const wrapper = shallow(<LonnsendringForm
      readOnly={false}
      isAksjonspunktClosed={false}
      erLonnsendring={false}
      tilfeller={[]}
      radioknappOverskrift={['test1', 'test2']}
      manglerIM={false}
    />);
    const radios = wrapper.find('RadioOption');
    expect(radios).to.have.length(2);
    expect(radios.last().prop('disabled')).is.eql(false);
  });

  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.VURDER_LONNSENDRING }],
    arbeidsforholdMedLønnsendringUtenIM: [{ andelsnr: 1 }],
  };

  it('skal teste at transformValues gir korrekt output', () => {
    const values = { };
    values[lonnsendringField] = true;
    values.dummyField = 'tilfeldig verdi';
    const inntektVerdier = [
      { fastsattBelop: '10 000', andelsnr: 1 },
    ];
    const transformedObject = LonnsendringForm.transformValues(values, inntektVerdier, faktaOmBeregning, []);
    expect(transformedObject.vurdertLonnsendring.erLønnsendringIBeregningsperioden).to.equal(true);
    expect(transformedObject.vurdertLonnsendring.dummyField).to.equal(undefined);
    expect(transformedObject.fastsattUtenInntektsmelding.andelListe.length).to.equal(1);
    expect(transformedObject.fastsattUtenInntektsmelding.andelListe[0].andelsnr).to.equal(1);
    expect(transformedObject.fastsattUtenInntektsmelding.andelListe[0].fastsatteVerdier.fastsattBeløp).to.equal(10000);
  });


  it('skal ikkje submitte inntekt uten lønnsendring', () => {
    const values = { };
    values[lonnsendringField] = false;
    const inntektVerdier = [
      { fastsattBelop: '', andelsnr: 1 },
    ];
    const transformedObject = LonnsendringForm.transformValues(values, inntektVerdier, faktaOmBeregning, []);
    expect(transformedObject.vurdertLonnsendring.erLønnsendringIBeregningsperioden).to.equal(false);
    expect(transformedObject.fastsattUtenInntektsmelding.andelListe.length).to.equal(0);
  });


  it('skal teste at buildInitialValues gir korrekt output med gyldig beregningsgrunnlag', () => {
    const gyldigBG = {
      beregningsgrunnlagPeriode: [
        {
          beregningsgrunnlagPrStatusOgAndel: [
            {
              aktivitetStatus: {
                kode: aktivitetStatus.ARBEIDSTAKER,
              },
              lonnsendringIBeregningsperioden: true,
            },
          ],
        },
      ],
    };
    const initialValues = LonnsendringForm.buildInitialValues(gyldigBG);
    expect(initialValues[lonnsendringField]).to.equal(true);
  });
});