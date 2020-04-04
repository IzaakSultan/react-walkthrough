import React, {useRef} from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import PropTypes from 'prop-types';

import style from './Walkthrough.module.scss';
export const WalkthroughContext = React.createContext({});

export default class Walkthrough extends React.Component {
    state = {
        beacons: Immutable.List.of(),
        modals: Immutable.List.of(),
        openBeacon: false,
        current: '',
        seen: Immutable.Set.of()
    };

    constructor(props) {
        super(props);
    }

    addModal = (modal) => {
        this.setState(previousState => {
            return {...previousState, modals: previousState.modals.push(modal)}
        });
    };

    updateModal = (modal) => {
        this.setState(previousState => (
            {
                ...previousState,
                modals: previousState.modals.map(previousModal => (
                    perviousModal.get('id') === modal.get('id') ? modal : previousModal
                ))
            }
        ));
    };

    removeModal = (id) => {
        this.setState(previousState => (
            {...previousState, modals: previousState.modals.filter(modal => modal.get('id') !== id)}
        ));
    };

    openBeacon = (id) => {
        this.setState(previousState => {
            return {
                ...previousState,
                openBeacon: id,
                seen: previousState.seen.add(id),
            };
        });
    }

    closeBeacon = (id) => {
        this.setState(previousState => {
            return {
                ...previousState,
                openBeacon: null,
            };
        });
    }

    render() {
        const contextValue = {
            currentBeacon: this.state.openBeacon,
            seen: this.state.seen,
            openBeacon: this.openBeacon,
            closeBeacon: this.closeBeacon,
        };

        return (
            <WalkthroughContext.Provider value={contextValue}>
                {React.Children.only(this.props.children)}
            </WalkthroughContext.Provider>
        );
    }
}
