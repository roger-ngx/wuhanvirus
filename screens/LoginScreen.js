import React from 'react';
import { View } from 'react-native';
import { GoogleSignin, GoogleSigninButton } from '@react-native-community/google-signin';
import { LoginButton, AccessToken } from 'react-native-fbsdk';

const LoginScreen = () => {

    return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <LoginButton
            onLoginFinished={
                (error, result) => {
                if (error) {
                    console.log("login has error: " + result.error);
                } else if (result.isCancelled) {
                    console.log("login is cancelled.");
                } else {
                    AccessToken.getCurrentAccessToken().then(
                    (data) => {
                        console.log(data.accessToken.toString())
                    }
                    )
                }
                }
            }
            onLogoutFinished={() => console.log("logout.")}
        />
        <GoogleSigninButton
            style={{ width: 192, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={this._signIn}
            disabled={this.state.isSigninInProgress}
        />
    </View>
}

export default LoginScreen;