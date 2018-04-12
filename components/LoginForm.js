import React from 'react';
import { 
  StyleSheet, 
  Text, 
  Button, 
  View,
  TextInput,
  Image, 
} from 'react-native';

const initialState = { 
  email: '',            // Form field: login email
  password: '',         // Form field: login password
}

export default class LoginForm extends React.Component {

  constructor(opts) {
    super(opts);
    this.state = initialState;
  }

  login() {

    // Your fancy form validation logic goes here
    if (this.state.email && this.state.password) {

      if (this.props.onValidSubmit && typeof this.props.onValidSubmit == 'function') {
        this.props.onValidSubmit(this.state.email, this.state.password);
      }
    }

  }


  render() {
    return (
      <View style={styles.loginForm}>
        <TextInput
          placeholder="user@example.com"
          keyboardType="email-address"
          value={this.state.email}
          onChangeText={(email) => this.setState({ email })}
          autoCorrect={false}
          autoCapitalize='none'
          style={styles.loginInput} 
        />

        <TextInput
          placeholder="password"
          secureTextEntry={true}
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
          autoCorrect={false}
          autoCapitalize='none'
          style={styles.loginInput} 
        />

        <Button
            onPress={(evt) => this.login(evt)}
            title="Login"
        />

      </View>
    )

  }
  


}




const styles = StyleSheet.create({

  loginForm: {
    flex: 1,
    // alignItems: 'center',
    paddingLeft: 50,
    paddingRight: 50,
    justifyContent: 'center',
  },


  loginInput: {
    fontSize: 20,
    textAlign: 'left'
  }

});
