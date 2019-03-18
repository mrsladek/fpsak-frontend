import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';
import { Hovedknapp } from 'nav-frontend-knapper';
// import { FormattedMessage } from 'react-intl';
import utlandSakstypeKode from './utlandSakstypeKode';
import { UtlandImpl as Utland } from './Utland';

describe('<Utland>', () => {
  it('skal vise riktig utland status', () => {
    const wrapper = shallow(
      <Utland
        submitCallback={sinon.spy()}
        readOnly={false}
      />,
    );

    wrapper.setState({ currentUtlandStatus: utlandSakstypeKode.NASJONAL });
    let formattedMessage = wrapper.find('FormattedMessage');
    expect(formattedMessage.at(1).prop('id')).to.equal('AdressePanel.utlandSakstype.Nasjonal');

    wrapper.setState({ currentUtlandStatus: utlandSakstypeKode.EØS_BOSATT_NORGE });
    formattedMessage = wrapper.find('FormattedMessage');
    expect(formattedMessage.at(1).prop('id')).to.equal('AdressePanel.utlandSakstype.EøsBosattNorge');

    wrapper.setState({ currentUtlandStatus: utlandSakstypeKode.BOSATT_UTLAND });
    formattedMessage = wrapper.find('FormattedMessage');
    expect(formattedMessage.at(1).prop('id')).to.equal('AdressePanel.utlandSakstype.BosattUtland');
  });

  it('skal sjekke at panel for endring av status vises/skjules når det skal ', () => {
    const wrapper = shallow(
      <Utland
        submitCallback={sinon.spy()}
        readOnly={false}
      />,
    );

    expect(wrapper.find(Hovedknapp)).to.have.length(0);
    wrapper.setState({ showEditUtland: true });
    expect(wrapper.find(Hovedknapp)).to.have.length(1);
  });
});