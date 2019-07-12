import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {}
        }
    }
    componentDidMount() {
    }

    componentWillReceiveProps(nProps) {
    }

    render() {
        const { user } = this.props
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="#">Welcome to ThangLD8 - smart Travel</a>
                    </div>
                    <ul className="nav navbar-nav">
                        <li className="active"><a href="#">Home</a></li>
                        <li><a>Hi {user.user.email}!</a></li>
                        <li><Link to="/login">Logout</Link></li>
                    </ul>
                </div>
            </nav>
        );
    }
}

function mapStateToProps(state) {
    const { authentication: user } = state
    return { 
        user
    }
}

const connectedHomePage = connect(mapStateToProps)(NavBar);
export { connectedHomePage as NavBar };