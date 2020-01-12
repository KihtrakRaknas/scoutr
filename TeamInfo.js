import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert, KeyboardAvoidingView, TouchableOpacity, AsyncStorage, FlatList} from 'react-native'
import firebase from 'firebase'
import 'firebase/firestore';
import { SplashScreen } from 'expo';
import { ListItem } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import { Input } from 'react-native-elements';

export default class TeamInfo extends React.Component {

      state = {
        team:null
      }
    
    constructor(props){
      super(props)
      AsyncStorage.getItem('team').then((team)=>{
        this.setState({team})
        let currTeam = team
        let compName = this.props.navigation.getParam('sku')
        let selTeam = this.props.navigation.getParam('team','default team')
        firebase.firestore().collection('teams').doc(currTeam.replace(/\D+/g, '')).collection('comp').doc(compName).collection('teams').doc(selTeam).onSnapshot(doc => {
          if (!doc.exists) {
            console.log('No such document!');
          } else {
            this.setState(doc.data())
          }
        })
        .catch(err => {
          console.log('Error getting document', err);
        });
      })
      let team = this.props.navigation.getParam('team','750S')
        fetch('https://api.vexdb.io/v1/get_season_rankings?season=current&team='+team)
            .then((response) => response.json())
            .then((responseJson)=>{
                console.log(responseJson)
                //console.log(responseJson["result"])
                this.setState({vrating_rank:responseJson["result"][0].vrating_rank,vrating:responseJson["result"][0].vrating})
            })
        var db = firebase.firestore();
        console.log('compName'+ this.props.navigation.getParam('compName'))
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('team', 'No Name').substring(0,25)+`${navigation.getParam('team', 'No Name').substring(25).trim()!=""?'...':''}`,
        };
      };
   
    render() {
      return (
        <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled   keyboardVerticalOffset={100}>
            <ScrollView>
                <Text style={styles.stats}>V-Rating Rank: {this.state.vrating_rank}</Text>
                <Text style={styles.stats}>V-Rating: {this.state.vrating}</Text>
                <View style={styles.place}/>
                <Input placeholder='Intake Type' label='Intake Type' value={this.state["Intake Type"]} onChangeText={(text)=>this.updateFirebase('Intake Type',text)} />
                <View style={styles.place}/>
                <Input placeholder='Lift Type' label='Lift Type' value={this.state["Lift Type"]} onChangeText={(text)=>this.updateFirebase('Lift Type',text)} style={styles.place}/>
                <View style={styles.place}/>
                <Input placeholder='Drive Type' label='Drive Type' value={this.state["Drive Type"]} onChangeText={(text)=>this.updateFirebase('Drive Type',text)} style={styles.place}/>
                <View style={styles.place}/>
                <Input placeholder='Max Number of Cubes' label='Max Number of Cubes' value={this.state["Max Number of Cubes"]} onChangeText={(text)=>this.updateFirebase('Max Number of Cubes',text)} style={styles.place}/>
                <View style={styles.place}/>
                <Input placeholder='Highest Tower' label='Highest Tower' value={this.state["Highest Tower"]} onChangeText={(text)=>this.updateFirebase('Highest Tower',text)} style={styles.place}/>
                <View style={styles.place}/>
                <Input placeholder='Highest Descoreable Tower' label='Highest Descoreable Tower' value={this.state["Highest Descoreable Tower"]} onChangeText={(text)=>this.updateFirebase('Highest Descoreable Tower',text)} style={styles.place}/>
                <View style={styles.place}/>
                <Input placeholder='Protected Zone Auton' label='Protected Zone Auton' value={this.state["Protected Zone Auton"]} onChangeText={(text)=>this.updateFirebase('Protected Zone Auton',text)} style={styles.place}/>
                <View style={styles.place}/>
                <Input placeholder='Unprotected Zone Auton' label='Unprotected Zone Auton' value={this.state["Unprotected Zone Auton"]} onChangeText={(text)=>this.updateFirebase('Unprotected Zone Auton',text)} style={styles.place}/>
                <View style={styles.place}/>
                <Input placeholder='2 Stacks in Protected Zone' label='2 Stacks in Protected Zone' value={this.state["2 Stacks in Protected Zone"]} onChangeText={(text)=>this.updateFirebase('2 Stacks in Protected Zone',text)} style={styles.place}/>
                <View style={styles.place}/>
                <Input placeholder='Add On To Exisiting Stacks' label='Add On To Exisiting Stacks' value={this.state["Add On To Exisiting Stacks"]} onChangeText={(text)=>this.updateFirebase('Add On To Exisiting Stacks',text)} style={styles.place}/>
                <View style={styles.place}/>
                <Input placeholder='Other Comments' label='Other Comments' value={this.state["Other Comments"]} onChangeText={(text)=>this.updateFirebase('Other Comments',text)} style={styles.place}/>
                <View style={styles.place}/>
                <View style={styles.place}/>
            </ScrollView>
        </KeyboardAvoidingView> 
      )
    }

    updateFirebase(feild,content){
        this.setState({[feild]: content,})
        console.log(feild)
        console.log(content)
        let currTeam = this.state.team
        let compName = this.props.navigation.getParam('sku')
        let team = this.props.navigation.getParam('team','default team')
        console.log(currTeam)
        console.log(compName)
        console.log(team)
        firebase.firestore().collection('teams').doc(currTeam.replace(/\D+/g, '')).collection('comp').doc(compName).collection('teams').doc(team).set({
            [feild]: content,
        },{merge: true})
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef);
        })
        .catch(function(error) {
            console.error("3Error adding document: ", error);
        });
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
  stats:{
      fontSize:20,
      paddingHorizontal:10,
      paddingVertical:25,
  },
  place:{
      paddingVertical:5,
  }
})