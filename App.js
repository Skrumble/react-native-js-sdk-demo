import React from 'react';
import { 
  StyleSheet, 
  Text, 
  Button, 
  View,
  Modal,
  TextInput,
  Image, 
  Alert,
} from 'react-native';
import { APISocket } from '@skrumble/js-sdk';

import LoginForm from './components/LoginForm';
import ChatList from './components/ChatList';

const MODALS = {
  NONE: 0,
  USER_LIST: 1, 
}

const initialState = { 
  loggedInUser: false     // Authenticated user or `false` if logged-out
}

export default class App extends React.Component {

  constructor(opts) {
    super(opts);

    /** 
     * Wherever your app does it's initial set-up is a good place 
     * to do the config() block, which sets basepaths and auth keys
     */
    APISocket.config({
      client_id: "",
      client_secret: "",
      api_hostname: "",
      auth_hostname: "",
    });

    this.state = initialState;
  }


  loginUser(email, password) {

    /**
     * Logging-in a user is easy once config() is done, simply pass in 
     * the credentials and the user will be returned in the promise.
     *
     * The SDK uses promises heavily so that if you're in an environment with
     * async/await support, calls like this can be shorter and have less nesting 
     */
    APISocket.login({ email, password })
      .then((loggedInUser) => {
        console.log(loggedInUser);
        if (loggedInUser.constructor.name == "User") {
          this.setState({ loggedInUser }) 
        }
      })
      .catch((err) => {
        this.setState({ loginErr: err })
      });

  }


  logout() {
    Alert.alert(
      'Confirm logout',
      'Are you sure you wish to log-out?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Logout', onPress: () => this.setState(initialState), style: 'destructive'},
      ],
      { cancelable: false }
    );
  }



  loadChatList() {

  }


  toggleModal(modal_type) {

    // Ignore any modal type that isn't in the list
    if (!MODALS[modal_type]) return;

    // Either close the modal if it's open, or open it
    if (this.state.modal === MODALS[modal_type]) { 
      this.setState({ modal: false })
    } else {
      this.setState({ modal: MODALS[modal_type] })
    }

  }


    render() {

      let extensionList
      if (this.state.loggedInUser) {
        extensionList = this.state.loggedInUser.extension.map((ext) => `x${ext}`).join(', ');
      }

      return (
        <View style={styles.container}>

          { 
            !this.state.loggedInUser ?  
              <LoginForm
                onValidSubmit={(email, pass) => this.loginUser(email, pass)} 
              />
            : 
              <View style={{flex: 1, paddingTop: '15%', paddingLeft: '5%' }}>

                <View style={{flex: 1, flexDirection: 'row' }}>
                  <View>
                    <Image
                      style={{width: 50, height: 50}}
                      source={{uri: this.state.loggedInUser.avatar }}
                    />
                  </View>
                       
                  <View style={{ paddingLeft: 10 }}>
                    <Text>{this.state.loggedInUser.first_name} {this.state.loggedInUser.last_name} ({extensionList})</Text>
                    <Text>{this.state.loggedInUser.teams[0].team_name}</Text> 
                    <Text>{this.state.loggedInUser.role} | {this.state.loggedInUser.plan.name}</Text>
                  </View>
              </View>


              <View style={{ flex: 3 }}>
                <ChatList
                  loggedInUser={this.state.loggedInUser}
                />
              </View>

              <View style={{ flex: 1, flexDirection: 'row' }}>
              <Button
                onPress={(e) => this.logout()}
                title="Logout"
              />

              <Button
                onPress={(e) => this.toggleModal(MODALS.USER_LIST) }
                title="Team"
              />
              </View>

            </View>
          }
                
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modal===MODALS.USER_LIST}
            onRequestClose={() => {
            }}>
              <View style={{marginTop: 22}}>
              </View> 
          </Modal>

      </View>
    );
  }
}



const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

});
