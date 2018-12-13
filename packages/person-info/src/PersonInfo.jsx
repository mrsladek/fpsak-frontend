import React from 'react';
import PropTypes from 'prop-types';
import { Undertittel, Undertekst } from 'nav-frontend-typografi';
import Panel from 'nav-frontend-paneler';
import urlMann from '@fpsak-frontend/assets/images/mann.svg';
import urlKvinne from '@fpsak-frontend/assets/images/kvinne.svg';
import { Image } from '@fpsak-frontend/shared-components';
import AlderVisning from './Aldervisning';
import MerkePanel from './Merkepanel';

import styles from './personInfo.less';

/**
 * PersonInfo
 *
 * Presentasjonskomponent. Definerer visning av personen relatert til fagsak. (Søker)
 *
 * Eksempel:
 * ```html
 * <PersonInfo person={navn:"Ola" alder:{40} personnummer:"12345678910" erKvinne:false
 * erDod:false diskresjonskode:"6" dodsdato:"1990.03.03"} medPanel />
 * ```
 */
const PersonInfo = ({
  person,
  medPanel,
}) => {
  const {
    erKvinne, dodsdato, diskresjonskode, erDod, alder, navn, personnummer,
  } = person;
  const content = (
    <div>
      <Image
        className={styles.icon}
        src={erKvinne ? urlKvinne : urlMann}
        altCode="Person.ImageText"
        titleCode={erKvinne ? 'Person.Woman' : 'Person.Man'}
      />
      <div className={styles.infoPlaceholder}>
        <div>
          <Undertittel>
            {navn}
            {' '}
            <AlderVisning erDod={erDod} alder={alder} dodsdato={dodsdato} />
          </Undertittel>
          <Undertekst>
            {personnummer}
          </Undertekst>
        </div>
        <div>
          <MerkePanel erDod={erDod} diskresjonskode={diskresjonskode} />
        </div>
      </div>
    </div>);
  return medPanel ? <Panel>{content}</Panel> : content;
};

PersonInfo.propTypes = {
  person: PropTypes.shape().isRequired,
  medPanel: PropTypes.bool.isRequired,
};

export default PersonInfo;