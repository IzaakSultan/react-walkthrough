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

    measure = () => {
        const {top, left, bottom, right, width, height} = ReactDOM.findDOMNode(this).getBoundingClientRect();

        return (
            Immutable.fromJS({
                top: top + window.scrollY,
                left: left + window.scrollX,
                bottom: bottom + window.scrollY,
                right: right +  window.scrollX,
                width,
                height
            })
        );
    };

    asMap = props => {
        const {id, title, description, requires, if: condition} = props;

        return (
            Immutable.fromJS({
                id,
                title,
                description,
                requires,
                condition,
                measure: this.measure
            })
        );
    };

    componentDidMount() {
        const {addBeacon} = this.context;
        addBeacon(this.asMap(this.props));
    }

    componentDidUpdate(prevProps, prevState) {
        const {updateBeacon} = this.context;

        if (!this.asMap(this.props).equals(this.asMap(prevProps))) {
            updateBeacon(this.asMap(this.props));
        }
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
