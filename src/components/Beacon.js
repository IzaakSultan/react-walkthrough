import React from 'react';
import ReactDOM from 'react-dom';
import Guid from 'guid';
import Immutable from 'immutable';

export default class Beacon extends React.Component {
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
