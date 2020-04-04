import React from 'react';
import ReactDOM from 'react-dom';
import Guid from 'guid';
import Immutable from 'immutable';
import PropTypes from 'prop-types';

export default class Modal extends React.Component {
    static contextTypes = {
        addModal: PropTypes.func,
        updateModal: PropTypes.func,
        removeModal: PropTypes.func
    };

    static propTypes = {
        id: PropTypes.any,
        requires: PropTypes.arrayOf(PropTypes.any),
        if: PropTypes.bool
    };

    static defaultProps = {
        id: Guid.raw(),
        requires: [],
        if: true
    };

    asMap = props => {
        const {id, requires, if: condition} = props;

        return (
            Immutable.fromJS({
                id,
                requires,
                condition
            })
        );
    };

    componentDidMount() {
        const {children} = this.props;
        const {addModal} = this.context;
        if (addModal) {
            addModal(this.asMap(this.props), children);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !this.asMap(this.props).equals(this.asMap(nextProps)) || this.props.children !== nextProps.children;
    }

    componentDidUpdate() {
        const {children} = this.props;
        const {updateBeacon} = this.context;
        if (updateBeacon) {
            updateBeacon(this.asMap(this.props), children);
        }
    }

    componentWillUnmount() {
        const {removeModal} = this.context;
        const {id} = this.props;

        if (removeModal) {
            removeModal(id);
        }
    }

    render() {
        return React.Children.only(this.props.children);
    }
}
