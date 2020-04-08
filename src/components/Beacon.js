import React, { useContext, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Guid from 'guid';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import useDimensions from 'react-use-dimensions';

// coordinates beacons
import {WalkthroughContext} from './Walkthrough'
import style from './Walkthrough.module.scss';

const PortalLayer = React.forwardRef(({container, pointerEvents='auto'}, ref) => {
    if (container) {
        return ReactDOM.createPortal(
            <div ref={ref} style={{ position: 'absolute', width: '100%', height: '100%', left: 0, top: 0, pointerEvents: pointerEvents }}>
            </div>
            , container);
    } else {
        return null;
    }
});

// shows the orange target to open the overlay
const BeaconTarget = ({position, onClick}) => {
    return (
        <div
            className={style.outerBeacon}
            style={{ top: window.scrollY + position.left, left: window.scrollX + position.top }}
            onClick={onClick}
        >
            <div className={style.innerBeacon}></div>
        </div>
    );
}

// greys out the background, highlights the target section and shows the tooltip
const BeaconOverlay = ({position, onClose, title, description}) => {
    let {
        top,
        left,
        width,
        height,
        bottom,
    } = position;

    return (
        <div className={style.overlay}>
            <div style={{position: 'fixed', width: '100%', height: '100%', cursor: 'pointer'}} onClick={onClose}>
            </div>
            <div
                className={style.highlight}
                style={{
                    top: window.scrollY + left - 2,
                    left: top - 2,
                    width: width + 4,
                    height: height + 4
                }}>
            </div>
            <div className={style.infoBox} style={{top: window.scrollY + bottom + 12, left: top}}>
                <div className={style.caret}></div>
                <div className={style.content}>
                    <h3 style={{margin: 0}}>{title}</h3>
                    <div className={style.divider} />
                    <p>{description}</p>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

const BeaconPortal = ({id, expanded, layer, title, description, position, onOpen, onClose}) => {
    if (!layer || !layer.current) {
        return null;
    }

    if (!expanded) {
        return ReactDOM.createPortal(<BeaconTarget
            position={position}
            onClick={() => onOpen(id) }
        />, layer.current);
    } else {
        return ReactDOM.createPortal(<BeaconOverlay
          position={position}
          title={title}
          description={description}
          onClose={ () => onClose(id) }
        />, layer.current);
    }
}

const Beacon = (props) => {
    const {
        currentBeacon,
        seen,
        openBeacon,
        closeBeacon,
    } = useContext(WalkthroughContext);

    const { id, title, description, requires, if: condition } = props;

    // TODO: debounce position
    const [ref, position] = useDimensions({liveMeasure: true});

    const expanded = currentBeacon === id;
    const visible = condition && (
        expanded || (
            !currentBeacon && !seen.includes(id)
        )
    ) && requires.every(requirement => seen.includes(requirement));

    const [container, setContainer] = useState(null);

    useEffect(() => {
        const root = document.body;

        let beaconsDiv;
        if (visible) {
            beaconsDiv = document.createElement('div');
            beaconsDiv.className = 'react-walkthrough-beacons';
            root.appendChild(beaconsDiv);
            setContainer(beaconsDiv);
        }

        return function cleanup() {
            if (beaconsDiv) {
                root.removeChild(beaconsDiv);
            }
        }
    }, [visible, id])
    const layer = useRef(null);

    return (
        <React.Fragment>
            {React.cloneElement(React.Children.only(props.children), {ref})}
            {visible && <PortalLayer container={container} ref={layer} pointerEvents={expanded ? 'auto' : 'none'} />}
            {visible && <BeaconPortal
                id={id}
                layer={layer}
                expanded={expanded}
                position={position}
                onOpen={openBeacon}
                onClose={closeBeacon}
                title={title}
                description={description}
            />}
        </React.Fragment>
    );
};

Beacon.propTypes = {
    id: PropTypes.any,
    requires: PropTypes.arrayOf(PropTypes.any),
    if: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
};

Beacon.defaultProps = {
    id: Guid.raw(),
    requires: [],
    if: true,
};


export default Beacon;