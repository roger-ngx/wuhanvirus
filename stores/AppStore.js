import { observable, action } from 'mobx';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/auth';
import { forEach, map, compact } from 'lodash';

import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin } from '@react-native-community/google-signin';

class AppStore{
    @observable appLoading = false;

    @action setLocations = locations => this.locations = locations;

    @action getPositions = async() => {
        this.appLoading = true;
        const people = await firestore().collection('people').orderBy('createdAt').get();
        const peopleIds = map(people.docs, person => person.id);
        const data = Promise.all(map(peopleIds, async id => {
            const locations = await firestore().collection('people').doc(id).collection('locations').orderBy('order').get();
            return map(locations.docs, location => location.data());
        }));
        this.appLoading = false;

        return data;
    }

    @action loginWithFacebook = async() => {
        // Login with permissions
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
        if (result.isCancelled) {
            throw new Error('User cancelled the login process');
        }

        const data = await AccessToken.getCurrentAccessToken();
        if (!data) {
            throw new Error('Something went wrong obtaining access token');
        }

        const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
        await firebase.auth().signInWithCredential(credential);
    }

    @action loginWithGoogle = async() => {
        const { accessToken, idToken } = await GoogleSignin.signIn();

        const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
        await firebase.auth().signInWithCredential(credential);
    }
}

export default new AppStore();