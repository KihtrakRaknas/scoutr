import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert, KeyboardAvoidingView, TouchableOpacity, AsyncStorage, FlatList} from 'react-native'
import firebase from 'firebase'
import 'firebase/firestore';
import { SplashScreen } from 'expo';
import { ListItem } from 'react-native-elements'

export default class CompScreen extends React.Component {

      state = {
        teams:[]
      }
    
    constructor(props){
      super(props)
      let name = this.props.navigation.getParam('name', 'No Name')
      let sku = this.props.navigation.getParam('sku','sku')
      let fireStSn;
        AsyncStorage.getItem('team').then((team)=>{
            this.setState({team})
            fetch('https://api.vexdb.io/v1/get_teams?season=current&sku='+sku)
            .then((response) => response.json())
            .then((responseJson)=>{
                console.log(responseJson)
                let teams = responseJson["result"]
                console.log(teams)
                AsyncStorage.setItem('offlineTeamData-'+sku,JSON.stringify(teams))
                this.setState({teams})            
                fireStSn = firebase.firestore().collection('teams').doc(team.replace(/\D+/g, '')).collection('comp').doc(sku).collection('teams').onSnapshot(snapshot => {
                  for(let teamItemNa in teams){
                    let teamItem = teams[teamItemNa]
                    let has = false;
                    snapshot.forEach(doc => {
                        //console.log(doc.id, '=>', doc.data());
                        if(doc.id == teamItem.number && Object.keys(doc.data()).length>9){
                            console.log("AHHH")
                            has = true;
                        }
                    });
                    teams[teamItemNa].haveData = has;
                  }
                  AsyncStorage.setItem('offlineTeamData'+sku,JSON.stringify(teams))
                  this.setState({teams}) 
                })
              })


              AsyncStorage.getItem('offlineTeamData'+sku).then((offlineTeamData)=>{
              
                if(offlineTeamData){
                  console.log("\n\n\n\n\nOFF\n\n\n\n\n")
                    console.log(offlineTeamData)
                    let teams = JSON.parse(offlineTeamData)
                    console.log(teams)
                    this.setState({teams})            
                    fireStSn = firebase.firestore().collection('teams').doc(team.replace(/\D+/g, '')).collection('comp').doc(sku).collection('teams').onSnapshot(snapshot => {
                        for(let teamItemNa in teams){
                            let teamItem = teams[teamItemNa]
                            let has = false;
                            snapshot.forEach(doc => {
                                //console.log(doc.id, '=>', doc.data());
                                if(doc.id == teamItem.number && Object.keys(doc.data()).length>9){
                                    console.log("AHHH")
                                    has = true;
                                }
                            });
                            teams[teamItemNa].haveData = has;
                        }
                        this.setState({teams}) 
                    })
                   }
  
                  })
            


            })
            
  
      
    }

    static navigationOptions = ({ navigation }) => {
        return {
          title: navigation.getParam('title', 'No Name').substring(0,25)+`${navigation.getParam('title', 'No Name').substring(25).trim()!=""?'...':''}`,
        };
      };
   
    render() {
      return (
        <FlatList
            data={this.state.teams}
            renderItem={({ item }) => <ListItem chevron checkmark={item.haveData} onPress={()=>this.props.navigation.navigate('TeamInfo',{team:item.number, compName: this.props.navigation.getParam('compName'),sku:this.props.navigation.getParam('sku')})}
            bottomDivider topDivider subtitle={item.organisation+" - "+item.region} title={item.number} />}
            keyExtractor={item => item.id}
      ListEmptyComponent={<View><Text>No Competitions found for {this.state.team}</Text></View>}
        />
      )
    }

    abbrState(input, to){
    
        var states = [
            ['Arizona', 'AZ'],
            ['Alabama', 'AL'],
            ['Alaska', 'AK'],
            ['Arkansas', 'AR'],
            ['California', 'CA'],
            ['Colorado', 'CO'],
            ['Connecticut', 'CT'],
            ['Delaware', 'DE'],
            ['Florida', 'FL'],
            ['Georgia', 'GA'],
            ['Hawaii', 'HI'],
            ['Idaho', 'ID'],
            ['Illinois', 'IL'],
            ['Indiana', 'IN'],
            ['Iowa', 'IA'],
            ['Kansas', 'KS'],
            ['Kentucky', 'KY'],
            ['Louisiana', 'LA'],
            ['Maine', 'ME'],
            ['Maryland', 'MD'],
            ['Massachusetts', 'MA'],
            ['Michigan', 'MI'],
            ['Minnesota', 'MN'],
            ['Mississippi', 'MS'],
            ['Missouri', 'MO'],
            ['Montana', 'MT'],
            ['Nebraska', 'NE'],
            ['Nevada', 'NV'],
            ['New Hampshire', 'NH'],
            ['New Jersey', 'NJ'],
            ['New Mexico', 'NM'],
            ['New York', 'NY'],
            ['North Carolina', 'NC'],
            ['North Dakota', 'ND'],
            ['Ohio', 'OH'],
            ['Oklahoma', 'OK'],
            ['Oregon', 'OR'],
            ['Pennsylvania', 'PA'],
            ['Rhode Island', 'RI'],
            ['South Carolina', 'SC'],
            ['South Dakota', 'SD'],
            ['Tennessee', 'TN'],
            ['Texas', 'TX'],
            ['Utah', 'UT'],
            ['Vermont', 'VT'],
            ['Virginia', 'VA'],
            ['Washington', 'WA'],
            ['West Virginia', 'WV'],
            ['Wisconsin', 'WI'],
            ['Wyoming', 'WY'],
        ];
    
        if (to == 'abbr'){
            input = input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
            for(i = 0; i < states.length; i++){
                if(states[i][0] == input){
                    return(states[i][1]);
                }
            }    
        } else if (to == 'name'){
            input = input.toUpperCase();
            for(i = 0; i < states.length; i++){
                if(states[i][1] == input){
                    return(states[i][0]);
                }
            }    
        }
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