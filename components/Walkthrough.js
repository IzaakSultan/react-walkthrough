import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import Guid from 'guid';

import style from './Walkthrough.module.scss';

class PortalBeacons extends React.Component {
    render() {
        const {beacons, openBeacon} = this.props;

        console.log('beacons ', beacons.toJS());

        return (
            <div style={{position: 'absolute', width: '100%', height: '100%', left: 0, top: 0, pointerEvents: 'none'}}>
                 {beacons.map((beacon, ix) => {
                     return (
                         <div
                            key={ix}
                            className={style.outerBeacon}
                            style={{top: beacon.getIn(['position', 'top']), left: beacon.getIn(['position', 'left'])}}
                            onClick={() => openBeacon(beacon)}>
                                <div className={style.innerBeacon}></div>
                        </div>
                     );
                 })}
            </div>
        );
    }
}


export class Walkthrough extends React.Component {
    static childContextTypes = {
        addBeacon: React.PropTypes.func,
        updateBeacon: React.PropTypes.func,
        removeBeacon: React.PropTypes.func
    };

    state = {
        beacons: Immutable.List.of(),
        openBeacon: false,
        seen: Immutable.Set.of()
    };

    constructor(props) {
        super(props);

        this.closeBeacon = this.closeBeacon.bind(this);
    }

    getChildContext() {
        return {
            addBeacon: this.addBeacon,
            updateBeacon: this.updateBeacon,
            removeBeacon: this.removeBeacon
        };
    }

    addBeacon = (beacon) => {
        this.setState(previousState => {
            return {...previousState, beacons: previousState.beacons.push(beacon)};
        });
    };

    updateBeacon = (beacon) => {
        this.setState(previousState => {
            return {
                ...previousState,
                beacons: previousState.beacons.map(previousBeacon => (
                    previousBeacon.get('id') === beacon.get('id') ? beacon : previousBeacon
                ))
            }
        });
    };

    removeBeacon = (id) => {
        this.setState(previousState => {
            return {...previousState, beacons: previousState.beacons.filter(beacon => beacon.get('id') !== id)}
        });
    };

    openBeacon = (beacon) => {
        const {seen} = this.state;

        this.setState({openBeacon: true, seen: seen.add(beacon.get('id'))});

        ReactDOM.render(
            <div className={style.overlay}>
                <div style={{position: 'fixed', width: '100%', height: '100%', cursor: 'pointer'}} onClick={this.closeBeacon}>

                </div>
                <div
                    className={style.highlight}
                    style={{
                        top: beacon.getIn(['position', 'top']) - 6,
                        left: beacon.getIn(['position', 'left']) - 6,
                        width: beacon.getIn(['position', 'width']) + 12,
                        height: beacon.getIn(['position', 'height']) + 12
                    }}>
                </div>
                <div className={style.infoBox} style={{top: beacon.getIn(['position', 'bottom']) + 12, left: beacon.getIn(['position', 'left'])}}>
                    <div className={style.caret}></div>
                    <div className={style.content}>
                        <h3 style={{margin: 0}}>{beacon.get('title')}</h3>
                        <p>{beacon.get('description')}</p>
                        <button>Done</button>
                    </div>
                </div>
            </div>,
            this._overlay
        );
    };

    closeBeacon = () => {
        this.setState({openBeacon: false});
        ReactDOM.unmountComponentAtNode(this._overlay);
    };

    renderBeacons = () => {
        const {beacons, seen} = this.state;

        ReactDOM.render(
            <PortalBeacons beacons={beacons.filter(beacon => !seen.includes(beacon.get('id')) && beacon.get('requires').every(requirement => seen.includes(requirement)))} openBeacon={this.openBeacon} />,
            this._beacons
        );
    };

    componentWillMount() {
        this._beacons = document.createElement('div');
        document.body.appendChild(this._beacons);

        this._overlay = document.createElement('div');
        document.body.appendChild(this._overlay);

        this.renderBeacons();

        window.addEventListener('resize', this.renderBeacons);
    }

    componentWillUnmount() {
        const {openBeacon} = this.state;

        window.removeEventListener('resize', this.renderBeacons);

        ReactDOM.unmountComponentAtNode(this._beacons);
        if (openBeacon) ReactDOM.unmountComponentAtNode(this._overlay);
        document.body.removeChild(this._beacons);
        document.body.removeChild(this._overlay);
    }

    componentDidUpdate(prevProps, prevState) {
        this.renderBeacons();
    }

    render() {
        return React.Children.only(this.props.children);
    }
}

export class Beacon extends React.Component {
    static contextTypes = {
        addBeacon: React.PropTypes.func,
        updateBeacon: React.PropTypes.func,
        removeBeacon: React.PropTypes.func
    };

    static propTypes = {
        id: React.PropTypes.any,
        requires: React.PropTypes.arrayOf(React.PropTypes.any),
        if: React.PropTypes.bool,
        title: React.PropTypes.string,
        description: React.PropTypes.string
    };

    static defaultProps = {
        id: Guid.raw(),
        requires: [],
        if: true
    };

    asMap = props => {
        const {id, title, description, requires, if: condition} = props;
        const {top, left, bottom, right, width, height} = ReactDOM.findDOMNode(this).getBoundingClientRect();

        return (
            Immutable.fromJS({
                position: {top, left, bottom, right, width, height},
                id,
                title,
                description,
                requires,
                condition
            })
        );
    };

    componentDidMount() {
        const {addBeacon} = this.context;
        addBeacon(this.asMap(this.props));
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !this.asMap(this.props).equals(this.asMap(nextProps));
    }

    componentDidUpdate() {
        const {updateBeacon} = this.context;
        updateBeacon(this.asMap(this.props));
    }

    componentWillUnmount() {
        const {removeBeacon} = this.context;
        const {id} = this.props;

        removeBeacon(id);
    }

    render() {
        return React.Children.only(this.props.children);
    }
}
