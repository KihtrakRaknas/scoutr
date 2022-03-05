import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert, KeyboardAvoidingView, TouchableOpacity, AsyncStorage, FlatList, Platform} from 'react-native'
import firebase from 'firebase'
import 'firebase/firestore';
import { SplashScreen } from 'expo';
import { ListItem } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import { Input } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';
 
export default class TeamInfo extends React.Component {
 
     state = {
       team:null,name:"Didn't load in"
     }
  
   constructor(props){
     super(props)
     AsyncStorage.getItem('name').then((name)=>{
       this.setState({name})
     });
     AsyncStorage.getItem('team').then((team)=>{
       this.setState({team})
       let currTeam = team
       let compName = this.props.navigation.getParam('sku')
       let selTeam = this.props.navigation.getParam('team','default team')
       firebase.firestore().collection('teams').doc(currTeam.replace(/\D+/g, '')).collection('comp').doc(compName).collection('teams').doc(selTeam).onSnapshot(doc => {
         if (!doc.exists) {
           console.log('No such document!');
         } else {
           if(!doc.metadata.hasPendingWrites)
             this.setState(doc.data())
         }
       })
     })
     let team = this.props.navigation.getParam('team','750S')
       fetch('https://api.vexdb.io/v1/get_season_rankings?season=current&team='+team)
           .then((response) => response.json())
           .then((responseJson)=>{
               console.log(responseJson)
               //console.log(responseJson["result"])
               this.setState({vrating_rank:responseJson["result"][0].vrating_rank,vrating:responseJson["result"][0].vrating})
           })
       fetch('https://api.vexdb.io/v1/get_awards?season=current&team='+team)
           .then((response) => response.json())
           .then((responseJson)=>{
               console.log(responseJson)
               //console.log(responseJson["result"])
               this.setState({awards:responseJson["result"]})
           })
         fetch('https://api.vexdb.io/v1/get_events?season=current&team='+team).then((response) => response.json()).then((responseJson)=>{
             this.setState({comps:responseJson["result"]})
         })
         fetch('https://api.vexdb.io/v1/get_skills?season=current&season_rank=true&team='+team).then((response) => response.json()).then((responseJson)=>{
           for(let index in responseJson["result"]){
             let res = responseJson["result"][index]
             let type = "?";
             if(res.type == 0)
               type = "Robot Skills"
             else if(res.type == 1)
               type = "Programming Skills"
             else if(res.type == 2)
               type = "Combined Skills"
               responseJson["result"][index].type = type
           }
           console.log(responseJson["result"])
           this.setState({skills:responseJson["result"]})
       })
        
       var db = firebase.firestore();
       console.log('compName'+ this.props.navigation.getParam('compName'))
   }
 
   static navigationOptions = ({ navigation }) => {
       return {
           title: navigation.getParam('team', 'No Name').substring(0,25)+`${navigation.getParam('team', 'No Name').substring(25).trim()!=""?'...':''}`,
       };
     };
 
     createDropDown(name,options,oldFormat){
       let data = []
       for(let option of options)
         data.push({
           value: option,
         })
       if(oldFormat)
         data = options
       if(Platform.OS !== 'web')
         return(<View style={styles.intake}><Dropdown
                   label={name}
                   data={data}
                   value={this.state[name]}
                   itemCount={5}
                   onChangeText={(value) => this.updateFirebase(name,value)}
                 /></View>)
       return(<Input placeholder={name} label={name} value={this.state[name]} onChangeText={(text)=>this.updateFirebase(name,text)} style={styles.place}/>)
     }
 
   render() {
     return (
       <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled   keyboardVerticalOffset={100}>
           <ScrollView>
               <Text style={{textAlign: 'center', marginHorizontal:20}}>{this.state["Last Update"]}</Text>
               <View style={styles.place}/>
               {this.createDropDown("Ring Intake Type", ['Roller Intake','Passive Intake', 'No Intake','Other (more info in comments)'])}
               {this.createDropDown("Lift Type", ['2 Bar','4 Bar','Double Reverse 4 Bar','Cascade Lift','No Lift','Other (more info in comments)'])}
               {this.createDropDown("Drive Type", [{
                   value: 'Tank Drive (2 motors)',
                 }, {
                   value: 'Tank Drive (4 motors)',
                 }, {
                   value: 'X Drive',
                 }, {
                   value: 'Mecanum',
                 }, {
                   value: 'H Drive',
                 }, {
                   value: 'Other (more info in comments)',
                 }],true)}
               <View style={styles.place}/>
               <Input keyboardType="number-pad" placeholder='Max Number of Mobile Goals They Can Stack' label='Max Number of Mobile Goals They Can Stack' value={this.state["Max Number of Mobile Goals They Can Stack"]} onChangeText={(text)=>this.updateFirebase('Max Number of Mobile Goals They Can Stack',text)} style={styles.place}/>
               <View style={styles.place}/>
               {this.createDropDown('Scoring',[{
                   value: 'Can score on platforms',
                 }, {
                   value: 'Can place ring on low branch',
                 }, {
                   value: 'Can place ring on high branch',
                 }, {
                   value: `Can place ring on mobile goal base`,
                 }, {
                   value: 'Other (more info in comments)',
                 }],true)}
               {this.createDropDown('Auton',[{
                   value: 'Can clear AWP line',
                 }, {
                   value: 'Can work on left side',
                 }, {
                   value: 'Can work on right side',
                 }, {
                   value: `Can get middle neutral mobile goal`,
                 }, {
                   value: 'Other (more info in comments)',
                 }],true)}    
               <View style={styles.place}/>
               <Input placeholder='Protected Zone Auton Point Value and Reliability' label='Protected Zone Auton Point Value and Reliability' value={this.state["Protected Zone Auton Point Value and Reliability"]} onChangeText={(text)=>this.updateFirebase('Protected Zone Auton Point Value and Reliability',text)} style={styles.place}/>
               <View style={styles.place}/>
               <Input placeholder='Unprotected Zone Auton Point Value and Reliability' label='Unprotected Zone Auton Point Value and Reliability' value={this.state["Unprotected Zone Auton Point Value and Reliability"]} onChangeText={(text)=>this.updateFirebase('Unprotected Zone Auton Point Value and Reliability',text)} style={styles.place}/>
               <View style={styles.place}/>
               {this.createDropDown('Can they get 2 stacks in the platform?',[{
                   value: 'They can get 2 stacks in the platform',
                 }, {
                   value: `They stuggle with 2 stacks in the platform`,
                 }, {
                   value: `They can't get 2 stacks in the platform`,
                 }],true)}
               {this.createDropDown('Add onto existing stacks?',[{
                   value: 'They can add onto existing stacks',
                 }, {
                   value: `They can't add onto existing stacks`,
                 }],true)}
               <View style={styles.place}/>
               <Input placeholder='Pit Location' label='Pit Location' value={this.state["Pit Location"]} onChangeText={(text)=>this.updateFirebase('Pit Location',text)} style={styles.place}/>
               <Input placeholder='Other Comments' label='Other Comments' value={this.state["Other Comments"]} onChangeText={(text)=>this.updateFirebase('Other Comments',text)} style={styles.place}/>
               <View style={styles.place}/>
               <Text style={styles.stats}>V-Rating Rank: {this.state.vrating_rank}</Text>
               <Text style={styles.stats}>V-Rating: {this.state.vrating}</Text>
               <Text style={styles.stats}>Past Awards:</Text>
               <FlatList
                 data={this.state.awards}
                 renderItem={({ item }) => <ListItem bottomDivider topDivider title={item.name} />}
 
                 keyExtractor={item => item.id}
                 ListEmptyComponent={<View><Text style={styles.stats}>No awards found for {this.props.navigation.getParam('team','Team Name')}</Text></View>}
               />
               <Text style={styles.stats}>Past Competitions:</Text>
               <FlatList
                 data={this.state.comps}
                 renderItem={({ item }) => new Date(item.end)<new Date()?<ListItem bottomDivider topDivider title={item.name}/>:null}
 
                 keyExtractor={item => item.id}
                 ListEmptyComponent={<View><Text style={styles.stats}>No competitions found for {this.props.navigation.getParam('team','Team Name')}</Text></View>}
               />
               <View style={styles.place}/>
               <Text style={styles.stats}>Skills Scores:</Text>
               <FlatList
                 data={this.state.skills}
                 renderItem={({ item }) => <ListItem bottomDivider topDivider title={item.type} rightTitle={item.score+" (Rank: "+item.season_rank+")"}/>}
 
                 keyExtractor={item => item.id}
                 ListEmptyComponent={<View><Text style={styles.stats}>No skills data found for {this.props.navigation.getParam('team','Team Name')}</Text></View>}
               />
               <View style={styles.place}/>
               <View style={styles.place}/>
               <View style={styles.place}/>
               <View style={styles.place}/>
           </ScrollView>
       </KeyboardAvoidingView>
     )
   }
 
   updateFirebase(feild,content){
       this.setState({[feild]: content,})
       let currTeam = this.state.team
       let compName = this.props.navigation.getParam('sku')
       let team = this.props.navigation.getParam('team','default team')
       let now = new Date()
console.log(((now.getHours()-1)%12+1)+":"+now.getMinutes()+" "+(now.getHours()>=12?"PM":"AM")+" "+(now.getMonth()+1)+"/"+now.getDate()+"/"+now.getFullYear()%100);
 
       firebase.firestore().collection('teams').doc(currTeam.replace(/\D+/g, '')).collection('comp').doc(compName).collection('teams').doc(team).set({
           [feild]: content,
           "Last Update": this.state.name+" - "+this.state.team+" - "+((now.getHours()-1)%12+1)+":"+(now.getMinutes()<10?'0'+now.getMinutes():now.getMinutes())+" "+(now.getHours()>=12?"PM":"AM")+" "+(now.getMonth()+1)+"/"+now.getDate()+"/"+now.getFullYear()%100
       },{merge: true})
       .then(function(docRef) {
           console.log("Document written with ID: ", docRef);
       })
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
     paddingVertical:10,
 },
 intake:{
   marginHorizontal:10,
 }
})

