import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vt from '@fpsak-frontend/kodeverk/src/vilkarType';
import vut from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { BehandlingspunktProperties } from '@fpsak-frontend/fp-behandling-felles';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';
import { hasSimuleringOn, getStatusFromSimulering } from './simuleringStatusUtleder';
import getVedtakStatus from './vedtakStatusUtleder';

const getStatusFromBeregningsresultat = ({ resultatstruktur }) => (resultatstruktur ? vut.OPPFYLT : vut.IKKE_VURDERT);

const hasNonDefaultBehandlingspunkt = (builderData, bpLength) => bpLength > 0;

/**
 * Rekkefølgen i listene under bestemmer behandlingspunkt-rekkefølgen i GUI.
 * @see BehandlingspunktProperties.Builder for mer informasjon.
 */
const engangsstonadBuilders = [
  new BehandlingspunktProperties.Builder(bpc.VARSEL, 'CheckVarselRevurdering')
    .withAksjonspunktCodes(ac.VARSEL_REVURDERING_MANUELL, ac.VARSEL_REVURDERING_ETTERKONTROLL),
  new BehandlingspunktProperties.Builder(bpc.SAKSOPPLYSNINGER, 'Saksopplysninger')
    .withAksjonspunktCodes(ac.AVKLAR_PERSONSTATUS),
  new BehandlingspunktProperties.Builder(bpc.OPPLYSNINGSPLIKT, 'Opplysningsplikt')
    .withVilkarTypes(vt.SOKERSOPPLYSNINGSPLIKT)
    .withAksjonspunktCodes(ac.SOKERS_OPPLYSNINGSPLIKT_OVST, ac.SOKERS_OPPLYSNINGSPLIKT_MANU),
  new BehandlingspunktProperties.Builder(bpc.FOEDSEL, 'Fodselsvilkaret')
    .withVilkarTypes(vt.FODSELSVILKARET_MOR)
    .withAksjonspunktCodes(ac.OVERSTYR_FODSELSVILKAR, ac.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN, ac.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN),
  new BehandlingspunktProperties.Builder(bpc.ADOPSJON, 'Adopsjonsvilkaret')
    .withVilkarTypes(vt.ADOPSJONSVILKARET)
    .withAksjonspunktCodes(ac.OVERSTYR_ADOPSJONSVILKAR, ac.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN, ac.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN),
  new BehandlingspunktProperties.Builder(bpc.OMSORG, 'Omsorgsvilkaret')
    .withVilkarTypes(vt.OMSORGSVILKARET)
    .withAksjonspunktCodes(
      ac.MANUELL_VURDERING_AV_OMSORGSVILKARET, ac.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN,
      ac.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN,
    ),
  new BehandlingspunktProperties.Builder(bpc.FORELDREANSVAR, 'Foreldreansvar')
    .withVilkarTypes(vt.FORELDREANSVARSVILKARET_2_LEDD, vt.FORELDREANSVARSVILKARET_4_LEDD)
    .withAksjonspunktCodes(
      ac.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_2_LEDD, ac.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_4_LEDD,
      ac.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN, ac.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN,
    ),
  new BehandlingspunktProperties.Builder(bpc.MEDLEMSKAP, 'Medlemskapsvilkaret')
    .withVilkarTypes(vt.MEDLEMSKAPSVILKARET)
    .withAksjonspunktCodes(ac.OVERSTYR_MEDLEMSKAPSVILKAR),
  new BehandlingspunktProperties.Builder(bpc.SOEKNADSFRIST, 'Soknadsfristvilkaret')
    .withVilkarTypes(vt.SOKNADFRISTVILKARET)
    .withAksjonspunktCodes(ac.SOKNADSFRISTVILKARET, ac.OVERSTYR_SOKNADSFRISTVILKAR),
  new BehandlingspunktProperties.Builder(bpc.BEREGNING, 'Beregning')
    .withAksjonspunktCodes(ac.OVERSTYR_BEREGNING)
    .withVisibilityWhen(hasNonDefaultBehandlingspunkt)
    .withStatus(getStatusFromBeregningsresultat),
  new BehandlingspunktProperties.Builder(bpc.AVREGNING, 'Avregning')
    .withVisibilityWhen(hasNonDefaultBehandlingspunkt, hasSimuleringOn)
    .withAksjonspunktCodes(ac.VURDER_FEILUTBETALING, ac.VURDER_INNTREKK)
    .withStatus(getStatusFromSimulering),
  new BehandlingspunktProperties.Builder(bpc.VEDTAK, 'Vedtak')
    .withAksjonspunktCodes(
      ac.FORESLA_VEDTAK, ac.FATTER_VEDTAK, ac.FORESLA_VEDTAK_MANUELT, ac.VEDTAK_UTEN_TOTRINNSKONTROLL, ac.VURDERE_ANNEN_YTELSE,
      ac.VURDERE_DOKUMENT, ac.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST, ac.KONTROLL_AV_MAUNELT_OPPRETTET_REVURDERINGSBEHANDLING,
    )
    .withVisibilityWhen(hasNonDefaultBehandlingspunkt)
    .withStatus(getVedtakStatus),
];

const createEngangsstonadBpProps = builderData => engangsstonadBuilders.reduce((currentEbs, eb) => {
  const res = eb.build(builderData, currentEbs.length);
  return res.isVisible ? currentEbs.concat([res]) : currentEbs;
}, []);

export default createEngangsstonadBpProps;