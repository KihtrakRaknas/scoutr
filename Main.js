import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert, KeyboardAvoidingView, TouchableOpacity, AsyncStorage, FlatList} from 'react-native'
import firebase from 'firebase'
import '@firebase/firestore';
import { SplashScreen } from 'expo';
import { ListItem } from 'react-native-elements'

export default class SetUp extends React.Component {
    state = {comps:[],team:'null'}
    constructor(props){
      super(props)
      SplashScreen.hide()
      AsyncStorage.getItem('team').then((team)=>{
        this.setState({team})
        console.log('https://api.vexdb.io/v1/get_events?season=current&team='+team)
        fetch('https://api.vexdb.io/v1/get_events?season=current&team='+team).then((response) => response.json()).then((responseJson)=>{
            console.log(responseJson)
            console.log(responseJson["result"])
            AsyncStorage.setItem('offlineEventData',JSON.stringify(responseJson["result"]))
            this.setState({comps:responseJson["result"]})
        })
      })
      AsyncStorage.getItem('offlineEventData').then((offlineEventData)=>{
        if(offlineEventData)
          this.setState({comps:JSON.parse(offlineEventData)})
      });
    }
   
    render() {
      return (
        <FlatList
            data={this.state.comps}
            renderItem={({ item }) => <ListItem chevron onPress={()=>this.props.navigation.navigate('CompScreen',{title:item.name,sku:item.sku,compName: item.name})}
        bottomDivider topDivider subtitle={item.loc_city+" - "+((new Date(item.end).getMonth() > 8) ? (new Date(item.end).getMonth() + 1) : ('0' + (new Date(item.end).getMonth() + 1))) + '/' + ((new Date(item.end).getDate() > 9) ? new Date(item.end).getDate() : ('0' + new Date(item.end).getDate())) + '/' + new Date(item.end).getFullYear()%100} title={item.name} />}
            keyExtractor={item => item.id}
      ListEmptyComponent={<View><Text>No Competitions found for {this.state.team}</Text></View>}
        />
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