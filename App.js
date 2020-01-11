import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import SetUp from './SetUp'
import Main from './Main'
import CompScreen from './CompScreen'
import TeamInfo from './TeamInfo'


const LoggedInStack = createStackNavigator({
  Main,
  CompScreen,
  TeamInfo,
},{
  initialRouteName: 'Main',
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: 'red',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
})

const App = createAppContainer(createSwitchNavigator(
  {
    SetUp,
    LoggedInStack
  },
  {
    initialRouteName: 'SetUp'
  }
))
export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
