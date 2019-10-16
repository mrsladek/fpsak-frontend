import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import VurderOgFastsettSN, { VurderOgFastsettSNImpl } from './VurderOgFastsettSN';
import VurderVarigEndretEllerNyoppstartetSN,
{
  begrunnelseFieldname as vurderingBegrunnelse, varigEndringRadioname,
}
  from './VurderVarigEndretEllerNyoppstartetSN';
import FastsettSN, { begrunnelseFieldname as fastsettingBegrunnelse, fastsettInntektFieldname } from './FastsettSN';

const {
  VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
  FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
} = aksjonspunktCodes;

const mockAksjonspunktMedKodeOgStatus = (apKode, begrunnelse, status) => ({
  definisjon: {
    kode: apKode,
  },
  status: {
    kode: status,
  },
  begrunnelse,
  kanLoses: true,
  erAktivt: true,
});

describe('<VurderVarigEndretEllerNyoppstartetSN>', () => {
  it('Skal vise korrekte komponenter når det er aksjonspunkt for å fastsette inntekt for bruker ny i arbeidslivet', () => {
    const snNyIArb = mockAksjonspunktMedKodeOgStatus(FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET, undefined, 'OPPR');
    const wrapper = shallowWithIntl(<VurderOgFastsettSNImpl
      readOnly={false}
      erVarigEndretNaering={undefined}
      isAksjonspunktClosed={false}
      gjeldendeAksjonspunkter={[snNyIArb]}
    />);
    expect(wrapper.find(FastsettSN)).to.have.length(1);
    expect(wrapper.find(VurderVarigEndretEllerNyoppstartetSN)).to.have.length(0);
  });

  it('Skal vise korrekte komponenter når det er aksjonspunkt for å vurdere varig endring uten at varig endring er bestemt', () => {
    const vurderEndring = mockAksjonspunktMedKodeOgStatus(VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE, undefined, 'OPPR');
    const wrapper = shallowWithIntl(<VurderOgFastsettSNImpl
      readOnly={false}
      erVarigEndretNaering={undefined}
      isAksjonspunktClosed={false}
      gjeldendeAksjonspunkter={[vurderEndring]}
    />);
    expect(wrapper.find(FastsettSN)).to.have.length(0);
    expect(wrapper.find(VurderVarigEndretEllerNyoppstartetSN)).to.have.length(1);
  });

  it('Skal vise korrekte komponenter når det er aksjonspunkt for å vurdere varig endring og det er vurdert at det ikke er varig endring', () => {
    const vurderEndring = mockAksjonspunktMedKodeOgStatus(VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE, undefined, 'OPPR');
    const wrapper = shallowWithIntl(<VurderOgFastsettSNImpl
      readOnly={false}
      erVarigEndretNaering={false}
      isAksjonspunktClosed={false}
      gjeldendeAksjonspunkter={[vurderEndring]}
    />);
    expect(wrapper.find(FastsettSN)).to.have.length(0);
    expect(wrapper.find(VurderVarigEndretEllerNyoppstartetSN)).to.have.length(1);
  });

  it('Skal vise korrekte komponenter når det er aksjonspunkt for å vurdere varig endring og det er vurdert at det er varig endring', () => {
    const vurderEndring = mockAksjonspunktMedKodeOgStatus(VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE, undefined, 'OPPR');
    const wrapper = shallowWithIntl(<VurderOgFastsettSNImpl
      readOnly={false}
      erVarigEndretNaering
      isAksjonspunktClosed={false}
      gjeldendeAksjonspunkter={[vurderEndring]}
    />);
    expect(wrapper.find(FastsettSN)).to.have.length(1);
    expect(wrapper.find(VurderVarigEndretEllerNyoppstartetSN)).to.have.length(1);
  });

  it('Skal teste at transformValues setter korrekte values når det kun skal fastsettes inntekt for søker ny i arbeidslivet', () => {
    const snNyIArb = mockAksjonspunktMedKodeOgStatus(FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET, undefined, 'OPPR');
    const values = {
      [fastsettingBegrunnelse]: 'Ok.',
      [fastsettInntektFieldname]: '360 000',
    };
    const transformedValues = VurderOgFastsettSN.transformValues(values, [snNyIArb]);
    const expectedTransformedValues = {
      kode: FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
      begrunnelse: 'Ok.',
      bruttoBeregningsgrunnlag: 360000,
    };
    expect(transformedValues).to.deep.equal([expectedTransformedValues]);
  });

  it('Skal teste at transformValues setter korrekte values når det er vurdert at det ikke er varig endret næring', () => {
    const vurderEndring = mockAksjonspunktMedKodeOgStatus(VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE, undefined, 'OPPR');
    const values = {
      [vurderingBegrunnelse]: 'Ok.',
      [varigEndringRadioname]: false,
    };
    const transformedValues = VurderOgFastsettSN.transformValues(values, [vurderEndring]);
    const expectedTransformedValues = {
      kode: VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
      begrunnelse: 'Ok.',
      erVarigEndretNaering: false,
    };
    expect(transformedValues).to.deep.equal([expectedTransformedValues]);
  });

  it('Skal teste at transformValues setter korrekte values når det er vurdert at det er varig endret næring og inntekt er fastsatt', () => {
    const vurderEndring = mockAksjonspunktMedKodeOgStatus(VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE, undefined, 'OPPR');
    const values = {
      [vurderingBegrunnelse]: 'Ok varig endring.',
      [fastsettingBegrunnelse]: 'Ok fastsatt inntekt.',
      [varigEndringRadioname]: true,
      [fastsettInntektFieldname]: '650 000',
    };
    const transformedValues = VurderOgFastsettSN.transformValues(values, [vurderEndring]);
    const expectedTransformedValues = [
      {
        kode: VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
        begrunnelse: 'Ok varig endring.',
        erVarigEndretNaering: true,
      },
      {
        kode: FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
        begrunnelse: 'Ok fastsatt inntekt.',
        bruttoBeregningsgrunnlag: 650000,
      },
    ];
    expect(transformedValues).to.deep.equal(expectedTransformedValues);
  });
});