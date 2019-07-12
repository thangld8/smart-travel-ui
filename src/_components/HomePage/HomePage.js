import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { NavBar } from '../NavBar';
import { checkT } from '../../_helpers/store';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {}
        }

        if (window.performance) {
            if (performance.navigation.type === 1) {
                checkT();
            }
        }
    }
    componentDidMount() {
        checkT();
    }

    render() {
        const { user } = this.props
        return (
            <div>
                <NavBar/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { authentication: user } = state
    return { 
        user
    }
}

const styles = {
    map: {
        width: '200px',
        height: '200px'
    }
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as HomePage };