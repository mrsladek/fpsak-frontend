import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FieldArray } from 'redux-form';
import { Undertekst } from 'nav-frontend-typografi';
import { Column } from 'nav-frontend-grid';
import { FormattedMessage } from 'react-intl';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { behandlingForm, behandlingFormValueSelector, getBehandlingFormSyncErrors } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import uttakPeriodeVurdering from '@fpsak-frontend/kodeverk/src/uttakPeriodeVurdering';
import {
  FlexContainer,
  FlexRow,
  FlexColumn,
  VerticalSpacer,
  ArrowBox,
} from '@fpsak-frontend/shared-components';
import {
  RadioOption,
  RadioGroupField,
  TextAreaField,
} from '@fpsak-frontend/form';
import {
  required,
  maxLength,
  minLength,
  hasValidPeriod,
  hasValidText,
} from '@fpsak-frontend/utils';
import PerioderKnapper from './PerioderKnapper';
import DokumentertePerioderPeriodePicker from './DokumentertePerioderPeriodePicker';
import styles from './periodeTyper.less';

const minLength3 = minLength(3);
const maxLength4000 = maxLength(4000);

export const InnleggelsePeriode = ({
  fraDato,
  tilDato,
  resultat,
  id,
  cancelEditPeriode,
  updated,
  bekreftet,
  dokumentertePerioder,
  readOnly,
  formSyncErrors,
  behandlingStatusKode,
  ...formProps
}) => {
  let errorHeight = 0;

  if (
    Object.keys(formSyncErrors).length !== 0
    && formProps.submitFailed
    && formSyncErrors.dokumentertePerioder.length - 1 > 0
  ) {
    formSyncErrors.dokumentertePerioder.forEach((error) => {
      errorHeight
        += error !== undefined && error.fom[0].id === 'ValidationMessage.NotEmpty'
          ? 30
          : 52;
    });
  }
  const isEdited = resultat === uttakPeriodeVurdering.PERIODE_OK_ENDRET
    && readOnly
    && behandlingStatusKode === behandlingStatus.FATTER_VEDTAK;

  // const periodeOkDisabled = !bekreftet;

  const inlineheight = dokumentertePerioder
    && resultat === uttakPeriodeVurdering.PERIODE_OK
    && !readOnly
    ? dokumentertePerioder.length * 58 + errorHeight + 170
    : 'auto';

  const inlineStyle = {
    radioOption: {
      height: inlineheight,
    },
  };
  return (
    <FlexContainer wrap>
      <FlexRow wrap>
        <FlexColumn className={styles.fieldColumn}>
          <Undertekst>
            <FormattedMessage id="UttakInfoPanel.FastsettResultat" />
          </Undertekst>
          <VerticalSpacer fourPx />
          <RadioGroupField
            direction="vertical"
            name="resultat"
            DOMName={`resultat_${id}`}
            bredde="M"
            isEdited={isEdited}
            validate={[required]}
            readOnly={readOnly}
          >
            <RadioOption
              label={{
                id:
                  'UttakInfoPanel.InnleggelsenErDokumentertAngiAvklartPeriode',
              }}
              value={uttakPeriodeVurdering.PERIODE_OK}
              style={inlineStyle.radioOption}
            />
            <RadioOption
              label={{ id: 'UttakInfoPanel.InnleggelsenErIkkeDokumentert' }}
              value={uttakPeriodeVurdering.PERIODE_KAN_IKKE_AVKLARES}
            />
          </RadioGroupField>
          {resultat === uttakPeriodeVurdering.PERIODE_OK && !readOnly && (
            <div className={styles.addPeriodeInnleggelse}>
              <Column>
                <ArrowBox>
                  <FieldArray
                    name="dokumentertePerioder"
                    component={DokumentertePerioderPeriodePicker}
                    props={{ fraDato, tilDato, readOnly }}
                  />
                </ArrowBox>
              </Column>
            </div>
          )}
        </FlexColumn>
      </FlexRow>
      <FlexRow>
        <FlexColumn>
          <TextAreaField
            name="begrunnelse"
            label={{ id: 'UttakInfoPanel.BegrunnEndringene' }}
            readOnly={readOnly}
            validate={[required, minLength3, maxLength4000, hasValidText]}
            textareaClass={styles.textAreaStyle}
            maxLength={4000}
          />
        </FlexColumn>

      </FlexRow>
      <FlexRow>
        <FlexColumn>
          <PerioderKnapper
            resultat={resultat}
            updatePeriode={formProps.handleSubmit}
            resetPeriode={formProps.reset}
            updated={updated}
            bekreftet={bekreftet}
            cancelEditPeriode={cancelEditPeriode}
            id={id}
            readOnly={readOnly}
          />
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
  );
};

InnleggelsePeriode.propTypes = {
  fieldId: PropTypes.string.isRequired,
  resultat: PropTypes.string,
  updatePeriode: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  updated: PropTypes.bool.isRequired,
  bekreftet: PropTypes.bool.isRequired,
  cancelEditPeriode: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  dokumentertePerioder: PropTypes.arrayOf(PropTypes.shape()),
  fraDato: PropTypes.string.isRequired,
  tilDato: PropTypes.string.isRequired,
  formSyncErrors: PropTypes.shape(),
  behandlingStatusKode: PropTypes.string,
};

InnleggelsePeriode.defaultProps = {
  dokumentertePerioder: [{}],
  formSyncErrors: {},
  resultat: undefined,
  behandlingStatusKode: undefined,
};

const validateInnleggelseForm = (values) => {
  const errors = {};
  errors.dokumentertePerioder = [];
  if (values.dokumentertePerioder) {
    values.dokumentertePerioder.forEach((periode, index) => {
      const invalid = required(periode.fom) || hasValidPeriod(periode.fom, periode.tom);
      if (invalid) {
        errors.dokumentertePerioder[index] = {
          fom: invalid,
        };
      }
    });
  }
  return errors;
};

const mapToStateToProps = (state, ownProps) => {
  const formName = `innleggelseForm-${ownProps.id}`;
  const resultat = behandlingFormValueSelector(formName)(state, 'resultat');
  const initialResultat = behandlingFormValueSelector('UttakFaktaForm')(state, `${ownProps.fieldId}.resultat`);
  const begrunnelse = behandlingFormValueSelector('UttakFaktaForm')(state, `${ownProps.fieldId}.begrunnelse`);
  const initialDokumentertePerioder = behandlingFormValueSelector('UttakFaktaForm')(state, `${ownProps.fieldId}.dokumentertePerioder`);
  const dokumentertePerioder = behandlingFormValueSelector(formName)(state, 'dokumentertePerioder');
  const formSyncErrors = getBehandlingFormSyncErrors(formName)(state);

  return {
    formSyncErrors,
    dokumentertePerioder,
    resultat,
    initialValues: {
      begrunnelse,
      id: ownProps.id,
      resultat: initialResultat ? initialResultat.kode : undefined,
      dokumentertePerioder:
        initialDokumentertePerioder !== undefined
          ? initialDokumentertePerioder
          : [],
    },
    updated: behandlingFormValueSelector('UttakFaktaForm')(state, `${ownProps.fieldId}.updated`),
    bekreftet: behandlingFormValueSelector('UttakFaktaForm')(state, `${ownProps.fieldId}.bekreftet`),
    form: formName,
    onSubmit: values => ownProps.updatePeriode(values),
  };
};

export default connect(mapToStateToProps)(
  behandlingForm({
    enableReinitialize: true,
    validate: values => validateInnleggelseForm(values),
  })(InnleggelsePeriode),
);
