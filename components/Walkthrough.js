import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';

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
                            style={{
                                position: 'absolute',
                                top: beacon.getIn(['position', 'top']),
                                left: beacon.getIn(['position', 'left']),
                                borderRadius: '50%',
                                width: 34,
                                height: 34,
                                backgroundColor: 'rgba(255,165,0,0.4)',
                                border: '2px solid rgb(255,165,0)',
                                cursor: 'pointer',
                                pointerEvents: 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                animation: 'joyride-beacon-outer 1.2s infinite ease-in-out'
                            }}
                            onClick={() => openBeacon(beacon)}>
                                <div style={{backgroundColor: 'rgb(255,165,0)', width: 18, height: 18, borderRadius: '50%'}}></div>
                            </div>
                     );
                 })}
            </div>
        );
    }
}


export class Walkthrough extends React.Component {
    static childContextTypes = {
        addBeacon: React.PropTypes.func
    };

    state = {
        beacons: Immutable.List.of(),
        openBeacon: false
    };

    constructor(props) {
        super(props);
        this.addBeacon = this.addBeacon.bind(this);
        this.openBeacon = this.openBeacon.bind(this);
        this.closeBeacon = this.closeBeacon.bind(this);
    }

    getChildContext() {
        return {addBeacon: this.addBeacon,};
    }

    addBeacon(beacon) {
        const {beacons} = this.state;
        this.setState({beacons: beacons.push(beacon)})
    }

    removeBeacon(id) {

    }

    openBeacon(beacon) {
        this.setState({openBeacon: true});

        ReactDOM.render(
            <div style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, cursor: 'pointer'}} onClick={this.closeBeacon}>
                <div
                onClick={() => {}}
                    style={{
                        position: 'absolute',
                        top: beacon.getIn(['position', 'top']) - 4,
                        left: beacon.getIn(['position', 'left']) - 4,
                        width: beacon.getIn(['position', 'width']) + 8,
                        height: beacon.getIn(['position', 'height']) + 8,
                        borderRadius: 4,
                        boxShadow: '0 0 0 9999px rgba(0,0,0,0.5),0 0 15px rgba(0,0,0,0.5)',
                        cursor: 'auto'
                    }}>
                </div>
                <div
                    onClick={() => {}}
                    style={{
                        position: 'absolute',
                        backgroundColor: 'white',
                        top: beacon.getIn(['position', 'bottom']) + 12,
                        left: beacon.getIn(['position', 'left']),
                        borderRadius: 2,
                        padding: 12
                    }}>
                    <h3 style={{margin: 0}}>Beacon content here yas</h3>
                    <p>Beacon content yo</p>
                </div>
            </div>,
            this._overlay
        );
    }

    closeBeacon() {
        this.setState({openBeacon: false});
        ReactDOM.unmountComponentAtNode(this._overlay);
    }

    componentWillMount() {
        this._beacons = document.createElement('div');
        document.body.appendChild(this._beacons);

        this._overlay = document.createElement('div');
        document.body.appendChild(this._overlay);

        this.renderBeacons();
    }

    componentWillUnmount() {
        const {openBeacon} = this.state;

        ReactDOM.unmountComponentAtNode(this._beacons);
        if (openBeacon) ReactDOM.unmountComponentAtNode(this._overlay);
        doument.body.removeChild(this._beacons);
        doument.body.removeChild(this._overlay);
    }

    componentDidUpdate(prevProps, prevState) {
        this.renderBeacons();
    }

    renderBeacons() {
        const {beacons} = this.state;

        ReactDOM.render(
            <PortalBeacons beacons={beacons} openBeacon={this.openBeacon} />,
            this._beacons
        );
    }

    render() {
        return React.Children.only(this.props.children);
    }
}


// The sole purpose of this element is to define the region that highlights when the beacon is clicked
export class Beacon extends React.Component {
    static contextTypes = {
        addBeacon: React.PropTypes.func,
        openBeacon: React.PropTypes.func
    };

    state = {
        active: false
    };

    componentDidMount() {
        const {addBeacon} = this.context;

        const boundingRect = ReactDOM.findDOMNode(this).getBoundingClientRect();

        addBeacon(Immutable.fromJS({
            position: {
                top: boundingRect.top,
                left: boundingRect.left,
                bottom: boundingRect.bottom,
                right: boundingRect.right,
                width: boundingRect.width,
                height: boundingRect.height,
            }
        }));
        // TODO register beacon with walkthrough
    }

    componentWillUnmount() {
        // TODO unregister beacon with walkthrough
    }

    render() {
        return React.Children.only(this.props.children);
    }
}
