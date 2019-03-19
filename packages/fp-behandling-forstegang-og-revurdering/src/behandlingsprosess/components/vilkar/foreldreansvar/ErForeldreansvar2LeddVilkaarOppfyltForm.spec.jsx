import React from 'react';
import { shallowWithIntl, intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { expect } from 'chai';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';

import BpPanelTemplate from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/components/vilkar/BpPanelTemplate';
import { BehandlingspunktBegrunnelseTextField } from '@fpsak-frontend/fp-behandling-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { ErForeldreansvar2LeddVilkaarOppfyltFormImpl as UnwrappedForm, buildInitialValues } from './ErForeldreansvar2LeddVilkaarOppfyltForm';


const fagsakYtelseTypeEngangsstonad = {
  kode: fagsakYtelseType.ENGANGSSTONAD,
  navn: '',
  kodeverk: '',
};

describe('<ErForeldreansvar2LeddVilkaarOppfyltForm>', () => {
  const aksjonspunkterList = [{
    definisjon: {
      navn: aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_2_LEDD,
      kode: aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_2_LEDD,
    },
    status: {
      kode: '',
      navn: '',
    },
    vilkarType: {
      kode: vilkarType.FORELDREANSVARSVILKARET_2_LEDD,
      navn: 'Omsorgsvilkåret',
    },
    begrunnelse: 'begrunnelse',
    kanLoses: true,
    erAktivt: true,
  }];

  it('skal vise readonly-form med utgråete knapper når readonly og vilkåret ikke er vurdert', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      isEngangsstonad
      fagsakYtelseTypeForSak={fagsakYtelseTypeEngangsstonad}
      avslagsarsaker={[{
        kode: 'TEST_KODE',
        navn: 'testnavn',
      }]}
      aksjonspunkter={aksjonspunkterList}
      readOnly
      readOnlySubmitButton
      erVilkarOk={false}
    />);


    const readonlyForm = wrapper.find(BehandlingspunktBegrunnelseTextField);
    expect(readonlyForm).to.have.length(1);
    expect(readonlyForm.prop('readOnly')).is.true;
  });

  it('skal vise radioknapper og nedtrekksliste for å velge om vilkåret skal godkjennes eller avvises med avslagsgrunn når ikke readonly', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      isEngangsstonad
      fagsakYtelseTypeForSak={fagsakYtelseTypeEngangsstonad}

      avslagsarsaker={[{
        kode: 'TEST_KODE',
        navn: 'testnavn',
      }]}
      aksjonspunkter={aksjonspunkterList}
      readOnly={false}
      readOnlySubmitButton
      erVilkarOk={undefined}
    />);

    const selector = wrapper.find('InjectIntl(VilkarResultPickerImpl)');
    expect(selector).to.have.length(1);
    expect(selector.prop('avslagsarsaker')).to.eql([{
      kode: 'TEST_KODE',
      navn: 'testnavn',
    }]);
    expect(selector.prop('erVilkarOk')).is.undefined;

    expect(wrapper.find(BehandlingspunktBegrunnelseTextField)).to.have.length(1);
    expect(wrapper.find('ConfirmInformationVilkarFormReadOnly')).to.have.length(0);
  });

  it('skal vise readonly-form når status er readonly og status er ulik ikke vurdert', () => {
    const aksjonspunkter = [{
      id: 1,
      definisjon: {
        navn: aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_2_LEDD,
        kode: 'test',
      },
      status: {
        kode: '',
        navn: '',
      },
      vilkarType: {
        kode: vilkarType.FORELDREANSVARSVILKARET_2_LEDD,
        navn: 'Adopsjonvilkåret',
      },
      begrunnelse: 'begrunnelse',
      kanLoses: true,
      erAktivt: true,
    }];

    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      isEngangsstonad
      fagsakYtelseTypeForSak={fagsakYtelseTypeEngangsstonad}
      avslagsarsaker={[]}
      aksjonspunkter={aksjonspunkter}
      readOnly
      readOnlySubmitButton
      erVilkarOk
    />);

    const readonlyForm = wrapper.find(BehandlingspunktBegrunnelseTextField);
    expect(readonlyForm).to.have.length(1);
    expect(readonlyForm.prop('readOnly')).is.true;
  });

  it('skal sette opp initielle0  verdier for form gitt behandling og behandlingspunkt', () => {
    const behandlingsresultat = {
      avslagsarsak: {
        kode: 'TEST',
      },
    };
    const aksjonspunkter = [{
      definisjon: {
        kode: 'test',
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: 'Dette er en begrunnelse',
      vilkarType: {
        kode: vilkarType.FORELDREANSVARSVILKARET_2_LEDD,
      },
      erAktivt: true,
    }];

    const initialValues = buildInitialValues.resultFunc(behandlingsresultat, aksjonspunkter, vilkarUtfallType.OPPFYLT);

    expect(initialValues).to.eql({
      erVilkarOk: undefined,
      avslagCode: undefined,
      begrunnelse: aksjonspunkter[0].begrunnelse,
    });
  });

  it('skal sette vilkår til godkjent når aksjonspunkt er lukket og vilkår er oppfylt', () => {
    const behandlingsresultat = {
      avslagsarsak: {
        kode: 'TEST',
      },
    };
    const aksjonspunkter = [{
      definisjon: {
        kode: 'test',
      },
      status: {
        kode: aksjonspunktStatus.AVBRUTT,
      },
      begrunnelse: 'Dette er en begrunnelse',
      vilkarType: {
        kode: vilkarType.FORELDREANSVARSVILKARET_2_LEDD,
      },
      erAktivt: true,
    }];

    const initialValues = buildInitialValues.resultFunc(behandlingsresultat, aksjonspunkter, vilkarUtfallType.OPPFYLT);

    expect(initialValues).to.eql({
      erVilkarOk: true,
      avslagCode: undefined,
      begrunnelse: aksjonspunkter[0].begrunnelse,
    });
  });

  it('skal sette vilkår til avslått når aksjonspunkt er lukket og vilkår ikke er oppfylt', () => {
    const behandlingsresultat = {
      avslagsarsak: {
        kode: 'TEST',
      },
    };
    const aksjonspunkter = [{
      definisjon: {
        kode: 'test',
      },
      status: {
        kode: aksjonspunktStatus.AVBRUTT,
      },
      begrunnelse: 'Dette er en begrunnelse',
      vilkarType: {
        kode: vilkarType.FORELDREANSVARSVILKARET_2_LEDD,
      },
      erAktivt: true,
    }];

    const initialValues = buildInitialValues.resultFunc(behandlingsresultat, aksjonspunkter, vilkarUtfallType.IKKE_OPPFYLT);

    expect(initialValues).to.eql({
      erVilkarOk: false,
      avslagCode: behandlingsresultat.avslagsarsak.kode,
      begrunnelse: aksjonspunkter[0].begrunnelse,
    });
  });

  it('skal vise riktig hjelpetekst med fagsakYtelseType lik Foreldrepenger', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      isEngangsstonad={false}
      avslagsarsaker={[{
        kode: 'TEST_KODE',
        navn: 'testnavn',
      }]}
      aksjonspunkter={aksjonspunkterList}
      readOnly
      readOnlySubmitButton
      erVilkarOk={false}
    />);

    const template = wrapper.find(BpPanelTemplate);
    expect(template).to.have.length(1);
    expect(template.prop('aksjonspunktHelpTexts')).to.eql(['ErForeldreansvar2LeddVilkaarOppfyltForm.ParagrafForeldrepenger']);
  });

  it('skal vise riktig hjelpetekst med fagsakYtelseType lik Engangsstønad', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      isEngangsstonad
      avslagsarsaker={[{
        kode: 'TEST_KODE',
        navn: 'testnavn',
      }]}
      aksjonspunkter={aksjonspunkterList}
      readOnly
      readOnlySubmitButton
      erVilkarOk={false}
    />);

    const template = wrapper.find(BpPanelTemplate);
    expect(template).to.have.length(1);
    expect(template.prop('aksjonspunktHelpTexts')).to.eql(['ErForeldreansvar2LeddVilkaarOppfyltForm.ParagrafEngangsStonad']);
  });
});