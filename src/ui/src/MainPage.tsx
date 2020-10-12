import React from "react";
import { UserAccountProps, withWebAuthn } from 'webauthn-react';

class MainPageBase extends React.Component<UserAccountProps> {
    render = (): React.ReactNode => {
        return (<React.Fragment>
            {this.accountInfo()}
            <span>I am testing : Prince</span>
        </React.Fragment>);
    }

    accountInfo = (): React.ReactNode => {
        return this.props.loggedIn 
        ? (<React.Fragment>
            <span>Hi {this.props.userDisplayname}</span>
            <a href="#" onClick={this.props.logOut} id="logout">Logout</a>
        </React.Fragment>) 
        : (<span>Sign in to access the resources</span>);

    }
}

export let MainPage = withWebAuthn(MainPageBase);
