import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import { injectKodeverk } from '@fpsak-frontend/fp-felles';
import { BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-behandling-felles';
import { RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form';
import {
  required, minLength, maxLength, hasValidText,
} from '@fpsak-frontend/utils';
import { createVisningsnavnForAktivitet } from 'behandlingForstegangOgRevurdering/src/util/visningsnavnHelper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { VerticalSpacer, Image, BorderBox } from '@fpsak-frontend/shared-components';
import behandleImageURL from '@fpsak-frontend/assets/images/advarsel.svg';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import venteArsakType from '@fpsak-frontend/kodeverk/src/venteArsakType';
import aksjonspunktStatus, { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';

import { getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import {
  behandlingFormForstegangOgRevurdering, isBehandlingFormDirty, hasBehandlingFormErrorsOfType, isBehandlingFormSubmitting,
} from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import { getAndelerMedGraderingUtenBG } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';

import styles from './graderingUtenBG.less';

const maxLength1500 = maxLength(1500);
const minLength3 = minLength(3);

const formName = 'graderingUtenBGForm';
const begrunnelseFieldName = 'begrunnelse';
const radioFieldName = 'graderingUtenBGSettPaaVent';

const bestemVisning = (andel, getKodeverknavn) => {
  if (andel.arbeidsforhold && andel.aktivitetStatus && andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER) {
    return createVisningsnavnForAktivitet(andel.arbeidsforhold, getKodeverknavn);
  }
  const navn = getKodeverknavn(andel.aktivitetStatus);
  return andel.aktivitetStatus && navn ? navn.toLowerCase() : '';
};

const lagArbeidsgiverString = (andelerMedGraderingUtenBG, getKodeverknavn) => {
  if (!andelerMedGraderingUtenBG || andelerMedGraderingUtenBG.length < 1) {
    return '';
  }
  if (andelerMedGraderingUtenBG.length === 1) {
    return bestemVisning(andelerMedGraderingUtenBG[0], getKodeverknavn);
  }
  const arbeidsgiverVisningsnavn = andelerMedGraderingUtenBG.map(andel => bestemVisning(andel, getKodeverknavn));
  const sisteNavn = arbeidsgiverVisningsnavn.splice(andelerMedGraderingUtenBG.length - 1);
  const tekst = arbeidsgiverVisningsnavn.join(', ');
  return `${tekst} og ${sisteNavn}`;
};

export const GraderingUtenBG = ({
  andelerMedGraderingUtenBG,
  readOnly,
  aksjonspunkt,
  getKodeverknavn,
  ...formProps
}) => {
  if (!aksjonspunkt || !andelerMedGraderingUtenBG || andelerMedGraderingUtenBG.length === 0) {
    return null;
  }
  const aksjonspunktTekstId = andelerMedGraderingUtenBG.length > 1
    ? 'Beregningsgrunnlag.Gradering.AksjonspunkttekstFlereForhold'
    : 'Beregningsgrunnlag.Gradering.AksjonspunkttekstEtForhold';

  return (
    <BorderBox>
      <form onSubmit={formProps.handleSubmit}>
        <Element>
          <FormattedMessage id="Beregningsgrunnlag.Gradering.Tittel" />
        </Element>
        <VerticalSpacer sixteenPx />
        <Row>
          <Column xs="1">
            <Image className={styles.image} src={behandleImageURL} />
            <div className={styles.divider} />
          </Column>
          <Column xs="11">
            <Normaltekst>
              <FormattedMessage
                id={aksjonspunktTekstId}
                values={{ arbeidsforholdTekst: lagArbeidsgiverString(andelerMedGraderingUtenBG, getKodeverknavn) }}
              />
            </Normaltekst>
          </Column>
        </Row>
        <VerticalSpacer twentyPx />
        <Row>
          <Column xs="9">
            <RadioGroupField
              name={radioFieldName}
              validate={[required]}
              direction="vertical"
              readOnly={readOnly}
              isEdited={!isAksjonspunktOpen(aksjonspunkt.status.kode)}
            >
              <RadioOption
                label={<FormattedMessage id="Beregningsgrunnlag.Gradering.FordelingErRiktig" />}
                value={false}
              />
              <RadioOption
                label={<FormattedMessage id="Beregningsgrunnlag.Gradering.FordelingMåVurderes" />}
                value
              />
            </RadioGroupField>
          </Column>
        </Row>
        <Row>
          <Column xs="6">
            <TextAreaField
              name={begrunnelseFieldName}
              label={<FormattedMessage id="Beregningsgrunnlag.Forms.Vurdering" />}
              validate={[required, maxLength1500, minLength3, hasValidText]}
              maxLength={1500}
              readOnly={readOnly}
            />
          </Column>
        </Row>
        <Row>
          <Column xs="1">
            <VerticalSpacer eightPx />
            <BehandlingspunktSubmitButton
              formName={formProps.form}
              isReadOnly={readOnly}
              isSubmittable={!readOnly}
              isBehandlingFormSubmitting={isBehandlingFormSubmitting}
              isBehandlingFormDirty={isBehandlingFormDirty}
              hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
            />
          </Column>
        </Row>
      </form>
    </BorderBox>
  );
};

GraderingUtenBG.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  andelerMedGraderingUtenBG: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  submitCallback: PropTypes.func.isRequired,
  aksjonspunkt: PropTypes.shape(),
  getKodeverknavn: PropTypes.func.isRequired,
};

GraderingUtenBG.defaultProps = {
  aksjonspunkt: undefined,
};


export const transformValues = (values) => {
  const skalSettesPaaVent = values[radioFieldName];
  const begrunnelse = values[begrunnelseFieldName];
  return {
    kode: aksjonspunktCodes.VURDER_GRADERING_UTEN_BEREGNINGSGRUNNLAG,
    begrunnelse,
    skalSettesPaaVent,
  };
};

export const buildInitialValues = createSelector(
  [behandlingSelectors.getAksjonspunkter, behandlingSelectors.getBehandlingVenteArsakKode],
  (aksjonspunkter, venteKode) => {
    const vurderGraderingUtenBGAP = aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_GRADERING_UTEN_BEREGNINGSGRUNNLAG);
    const settPaaVentAap = aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.AUTO_VENT_GRADERING_UTEN_BEREGNINGSGRUNNLAG);
    if (!vurderGraderingUtenBGAP || vurderGraderingUtenBGAP.status.kode !== aksjonspunktStatus.UTFORT) {
      return undefined;
    }
    if (!settPaaVentAap) {
      return {
        graderingUtenBGSettPaaVent: false,
        begrunnelse: vurderGraderingUtenBGAP.begrunnelse,
      };
    }
    if (settPaaVentAap.status.kode === aksjonspunktStatus.UTFORT) {
      return {
        graderingUtenBGSettPaaVent: false,
        begrunnelse: vurderGraderingUtenBGAP.begrunnelse,
      };
    }
    if (venteKode && venteKode === venteArsakType.VENT_GRADERING_UTEN_BEREGNINGSGRUNNLAG) {
      return {
        graderingUtenBGSettPaaVent: true,
        begrunnelse: vurderGraderingUtenBGAP.begrunnelse,
      };
    }
    return undefined;
  },
);

const mapStateToPropsFactory = (initialState, ownProps) => {
  const andelerMedGraderingUtenBG = getAndelerMedGraderingUtenBG(initialState);
  const aksjonspunkt = behandlingSelectors.getAksjonspunkter(initialState)
    .find(ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_GRADERING_UTEN_BEREGNINGSGRUNNLAG);
  const onSubmit = values => ownProps.submitCallback([transformValues(values)]);
  return (state) => {
    const initialValues = buildInitialValues(state);
    return ({
    andelerMedGraderingUtenBG,
    aksjonspunkt,
    onSubmit,
    initialValues,
    });
};
};


export default connect(mapStateToPropsFactory)(behandlingFormForstegangOgRevurdering({ form: formName })(injectKodeverk(getAlleKodeverk)(GraderingUtenBG)));
