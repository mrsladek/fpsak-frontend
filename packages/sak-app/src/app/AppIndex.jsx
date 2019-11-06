import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { captureException, configureScope, withScope } from '@sentry/browser';

import errorHandler from '@fpsak-frontend/error-api-redux';
import EventType from '@fpsak-frontend/rest-api/src/requestApi/eventType';
import { ForbiddenPage, UnauthorizedPage } from '@fpsak-frontend/sak-feilsider';
import { parseQueryString } from '@fpsak-frontend/utils';

import AppConfigResolver from './AppConfigResolver';
import { getFunksjonellTid, getNavAnsattName, getShowDetailedErrorMessages } from './duck';
import LanguageProvider from './LanguageProvider';
import Home from './components/Home';
import Dekorator from './components/Dekorator';

import '@fpsak-frontend/assets/styles/global.less';

/**
 * AppIndex
 *
 * Container komponent. Dette er toppkomponenten i applikasjonen. Denne vil rendre header
 * og home-komponentene. Home-komponenten vil rendre barn-komponenter via ruter.
 * Komponenten er også ansvarlig for å hente innlogget NAV-ansatt og kodeverk fra server og
 * lagre desse i klientens state.
 */
class AppIndex extends Component {
  componentDidUpdate(prevProps) {
    const { funksjonellTid } = this.props;
    if (prevProps.funksjonellTid !== funksjonellTid) {
      // TODO (TOR) Dette endrar jo berre moment. Kva med kode som brukar Date direkte?
      const diffInMinutes = moment()
        .diff(funksjonellTid, 'minutes');
      // Hvis diffInMinutes har avvik på over 5min: override moment.now (ref. http://momentjs.com/docs/#/customization/now/)
      if (diffInMinutes >= 5 || diffInMinutes <= -5) {
        const diff = moment()
          .diff(funksjonellTid);
        moment.now = () => Date.now() - diff;
      }
    }
  }

  componentDidCatch(error, info) {
    const { showCrashMessage: showCrashMsg } = this.props;

    withScope((scope) => {
      Object.keys(info).forEach((key) => {
        scope.setExtra(key, info[key]);
        captureException(error);
      });
    });
    showCrashMsg([
      error.toString(),
      info.componentStack
        .split('\n')
        .map((line) => line.trim())
        .find((line) => !!line),
    ].join(' '));
  }

  render() {
    const {
      location, crashMessage, errorMessages, navAnsattName, removeErrorMessage: removeErrorMsg, showDetailedErrorMessages,
    } = this.props;

    // todo sjekke om dette er beste stedet å sette dette for sentry
    configureScope((scope) => {
      scope.setUser({ username: navAnsattName });
    });

    const queryStrings = parseQueryString(location.search);
    const forbiddenErrors = errorMessages.filter((o) => o.type === EventType.REQUEST_FORBIDDEN);
    const unauthorizedErrors = errorMessages.filter((o) => o.type === EventType.REQUEST_UNAUTHORIZED);
    const shouldRenderHome = (!crashMessage && !forbiddenErrors.length > 0 && !unauthorizedErrors.length > 0);
    const nrOfErrorMessages = queryStrings.errorcode || queryStrings.errormessage ? 1 : errorMessages.length;

    return (
      <AppConfigResolver>
        <LanguageProvider>
          <Dekorator
            errorMessages={errorMessages}
            hideErrorMessages={!shouldRenderHome}
            navAnsattName={navAnsattName}
            queryStrings={queryStrings}
            removeErrorMessage={removeErrorMsg}
            showDetailedErrorMessages={showDetailedErrorMessages}
          />
          {shouldRenderHome && (<Home nrOfErrorMessages={nrOfErrorMessages} />)}
          {forbiddenErrors.length > 0 && (<ForbiddenPage errorMessages={forbiddenErrors} />)}
          {unauthorizedErrors.length > 0 && (<UnauthorizedPage errorMessages={unauthorizedErrors} />)}
        </LanguageProvider>
      </AppConfigResolver>
    );
  }
}

AppIndex.propTypes = {
  errorMessages: PropTypes.arrayOf(PropTypes.shape()),
  removeErrorMessage: PropTypes.func.isRequired,
  crashMessage: PropTypes.string,
  showCrashMessage: PropTypes.func.isRequired,
  navAnsattName: PropTypes.string,
  funksjonellTid: PropTypes.string,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  showDetailedErrorMessages: PropTypes.bool.isRequired,
};
AppIndex.defaultProps = {
  crashMessage: '',
  navAnsattName: '',
  funksjonellTid: undefined,
  errorMessages: [],
};

const mapStateToProps = (state) => ({
  errorMessages: errorHandler.getAllErrorMessages(state),
  crashMessage: errorHandler.getCrashMessage(state),
  navAnsattName: getNavAnsattName(state),
  funksjonellTid: getFunksjonellTid(state),
  showDetailedErrorMessages: getShowDetailedErrorMessages(state),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  showCrashMessage: errorHandler.getCrashMessageActionCreator(),
  removeErrorMessage: errorHandler.getRemoveErrorMessageActionCreator(),
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppIndex));