import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import Timeline from 'react-visjs-timeline';
import { Column, Row } from 'nav-frontend-grid';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import { TimeLineNavigation } from '@fpsak-frontend/tidslinje';
import opptjeningAktivitetKlassifisering from '@fpsak-frontend/prosess-vilkar-opptjening/src/kodeverk/opptjeningAktivitetKlassifisering';
import DateContainer from './DateContainer';
import styles from './opptjeningTimeLineLight.less';

import TimeLineData from './TimeLineData';

// Desse må alltid vare med for rett skala av tidslinjen
const standardItems = (opptjeningFomDate, opptjeningTomDate) => {
  const items = [
    {
      id: 1000,
      start: moment(opptjeningFomDate)
        .startOf('month'),
      end: moment(opptjeningFomDate)
        .startOf('month'),
      content: '',
      group: 1,
      className: styles.hiddenpast,

    }, {
      id: 1001,
      start: moment(opptjeningTomDate)
        .endOf('month'),
      end: moment(opptjeningTomDate)
        .endOf('month'),
      content: '',
      group: 1,
      className: styles.hiddenpast,

    },
  ];
  return items;
};

const classNameGenerator = (klasseKode) => {
  if (klasseKode === opptjeningAktivitetKlassifisering.BEKREFTET_AVVIST || klasseKode === opptjeningAktivitetKlassifisering.ANTATT_AVVIST) {
    return 'avvistPeriode';
  }
  if (klasseKode === opptjeningAktivitetKlassifisering.BEKREFTET_GODKJENT || klasseKode === opptjeningAktivitetKlassifisering.ANTATT_GODKJENT) {
    return 'godkjentPeriode';
  }
  return 'mellomliggendePeriode';
};

const createItems = (opptjeningPeriods, opptjeningFomDate, opptjeningTomDate) => {
  const items = opptjeningPeriods.map((ap) => ({
    id: ap.id,
    start: moment(ap.fom),
    end: moment(ap.tom),
    className: classNameGenerator(ap.klasse.kode),
    content: '',
    data: ap,
  }));
  return items.concat(standardItems(opptjeningFomDate, opptjeningTomDate));
};

const options = (opptjeningFomDate, opptjeningTomDate) => ({
  end: moment(opptjeningTomDate).endOf('month'),
  locale: moment.locale('nb'),
  margin: { item: 10 },
  max: moment(opptjeningTomDate).endOf('month'),
  min: moment(opptjeningFomDate).startOf('month'),
  moment,
  moveable: false,
  orientation: { axis: 'top' },
  showCurrentTime: true,
  stack: false,
  start: moment(opptjeningFomDate).startOf('month'),
  verticalScroll: false,
  width: '100%',
  zoomable: false,
});

class OpptjeningTimeLineLight extends Component {
  constructor() {
    super();

    this.state = {
      items: undefined,
      selectedPeriod: undefined,
    };

    this.selectHandler = this.selectHandler.bind(this);
    this.openPeriodInfo = this.openPeriodInfo.bind(this);
    this.selectNextPeriod = this.selectNextPeriod.bind(this);
    this.selectPrevPeriod = this.selectPrevPeriod.bind(this);

    this.timelineRef = React.createRef();
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    const { opptjeningPeriods, opptjeningFomDate, opptjeningTomDate } = this.props;
    const unsortedItems = opptjeningPeriods.sort((a, b) => new Date(a.fom) - new Date(b.fom));
    const items = createItems(unsortedItems, opptjeningFomDate, opptjeningTomDate);
    this.setState({ items });
  }

  componentDidMount() {
    // TODO Fjern når denne er retta: https://github.com/Lighthouse-io/react-visjs-timeline/issues/40
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(this.timelineRef.current);
    if (node) {
      node.children[0].style.visibility = 'visible';
    }
  }

  selectHandler(eventProps) {
    const { items } = this.state;
    const selectedItem = items.find((item) => item.id === eventProps.items[0]);
    if (selectedItem) {
      this.setState({
        selectedPeriod: selectedItem,
      });
    }
  }

  openPeriodInfo(event) {
    const { selectedPeriod, items } = this.state;
    event.preventDefault();
    const currentSelectedItem = selectedPeriod;
    if (currentSelectedItem) {
      this.setState({
        selectedPeriod: null,
      });
    } else {
      const selectedItem = items[0];
      this.setState({
        selectedPeriod: selectedItem,
      });
    }
  }

  selectNextPeriod(event) {
    const { selectedPeriod, items } = this.state;
    event.preventDefault();
    const newIndex = items.findIndex((oa) => oa.id === selectedPeriod.id) + 1;
    if (newIndex < items.length - 2) {
      this.setState({
        selectedPeriod: items[newIndex],
      });
    }
  }

  selectPrevPeriod(event) {
    const { selectedPeriod, items } = this.state;
    event.preventDefault();
    const newIndex = items.findIndex((oa) => oa.id === selectedPeriod.id) - 1;
    if (newIndex >= 0) {
      this.setState({
        selectedPeriod: items[newIndex],
      });
    }
  }

  render() {
    const { opptjeningFomDate, opptjeningTomDate } = this.props;
    const { selectedPeriod, items } = this.state;
    return (
      <div className="opptjening">
        <div className="timeLineLight">
          <Row>
            <Column xs="12">
              <DateContainer
                opptjeningFomDate={moment(opptjeningFomDate, ISO_DATE_FORMAT)
                  .format(DDMMYYYY_DATE_FORMAT)}
                opptjeningTomDate={moment(opptjeningTomDate, ISO_DATE_FORMAT)
                  .format(DDMMYYYY_DATE_FORMAT)}
              />
              <div className={styles.timelineContainer}>
                <div className={styles.timeLineWrapper}>
                  <div className={styles.timeLine}>
                    <Timeline
                      ref={this.timelineRef}
                      options={options(opptjeningFomDate, opptjeningTomDate)}
                      items={items}
                      customTimes={{ currentDate: new Date(opptjeningTomDate) }}
                      selectHandler={this.selectHandler}
                      selection={[selectedPeriod ? selectedPeriod.id : undefined]}
                    />
                  </div>
                  <TimeLineNavigation
                    openPeriodInfo={this.openPeriodInfo}
                  />
                  {selectedPeriod
                  && (
                    <TimeLineData
                      selectedPeriod={selectedPeriod}
                      selectNextPeriod={this.selectNextPeriod}
                      selectPrevPeriod={this.selectPrevPeriod}
                    />
                  )}
                </div>
              </div>
            </Column>
          </Row>
        </div>
      </div>
    );
  }
}

OpptjeningTimeLineLight.propTypes = {
  opptjeningPeriods: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  opptjeningFomDate: PropTypes.string.isRequired,
  opptjeningTomDate: PropTypes.string.isRequired,
};

export default OpptjeningTimeLineLight;
