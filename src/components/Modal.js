import React from 'react';
import ReactDOM from 'react-dom';
import Guid from 'guid';
import Immutable from 'immutable';

export default class Modal extends React.Component {
    static contextTypes = {
        addModal: React.PropTypes.func,
        updateModal: React.PropTypes.func,
        removeModal: React.PropTypes.func
    };

    static propTypes = {
        id: React.PropTypes.any,
        requires: React.PropTypes.arrayOf(React.PropTypes.any),
        if: React.PropTypes.bool
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
        addModal(this.asMap(this.props), children);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !this.asMap(this.props).equals(this.asMap(nextProps)) || this.props.children !== nextProps.children;
    }

    componentDidUpdate() {
        const {children} = this.props;
        const {updateBeacon} = this.context;
        updateBeacon(this.asMap(this.props), children);
    }

    componentWillUnmount() {
        const {removeModal} = this.context;
        const {id} = this.props;

        removeModal(id);
    }

    render() {
        return React.Children.only(this.props.children);
    }
}
