import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert, KeyboardAvoidingView, TouchableOpacity, AsyncStorage} from 'react-native'
import * as firebase from 'firebase';
import { SplashScreen } from 'expo';


export default class SetUp extends React.Component {
    state = {name:'',team:''}
    constructor(props){
      super(props)
      firebase.initializeApp({
        apiKey: 'AIzaSyAgbDbOgy-QIkZmXNkueOWhSZfSOYta0MA',
        authDomain: 'roboticsscoutingtool.firebaseapp.com',
        projectId: 'roboticsscoutingtool'
      });      
      AsyncStorage.getItem('name').then((name)=>{
        if(name)
          this.props.navigation.navigate('LoggedInStack')
        else
          SplashScreen.hide()
      })
    }
    handleLogin = () => {
      AsyncStorage.setItem('name',this.state.name).then(()=>{
        AsyncStorage.setItem('team',this.state.team).then(()=>{
          this.props.navigation.navigate('LoggedInStack')
        })
      })
      
      /*firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        if(checkUserFeilds(doc.data()))
          this.props.navigation.navigate('LoggedIn')
        else
          this.props.navigation.navigate('SetUp')
      })
      .catch(error => {
        if(error.message.includes("The user may have been deleted"))
          error.message = error.message.substring(0,error.message.indexOf("The user may have been deleted"))
        Alert.alert(error.message)
        this.setState({ errorMessage: error.message })
      })*/
    }  
    render() {
      return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <Text style={styles.title}>Set Up</Text>
        <View style={styles.textInputBox}>
          <TextInput
            placeholder="Real Name"
            placeholderTextColor="white"
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={name => this.setState({ name })}
            value={this.state.name}
          />
        </View>
        <View style={styles.textInputBox}>
          <TextInput
            placeholder="Team (including letter)"
            placeholderTextColor="white"
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={team => this.setState({ team })}
            value={this.state.team}
          />
        </View>
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={this.handleLogin}
        >
          <Text style={{color:"white",fontSize:20,}}>Continue To App</Text>
        </TouchableOpacity>
    </KeyboardAvoidingView>
      )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"red",
    
  },
  textInputBox: {
    borderBottomColor:"white",
    borderBottomWidth: 1,
    marginBottom: 40,
    width:"90%",
  },
  textInput: {
    alignSelf: 'stretch',
    fontSize: 24,
    height: 40,
    fontWeight: '200',
    marginBottom: 0,
    color:"white",
    
  },
  title: {
    fontSize:50,
    marginBottom:30,
    color:"white"
  },
  submitButton:{
    alignItems: 'center',
    backgroundColor:"blue",
    width:"90%",
    padding:15,
    borderRadius:7,
    marginBottom:10
  },
})