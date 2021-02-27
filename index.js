/**
 * @format
 */

// Shim to make pouchdb work, https://github.com/craftzdog/pouchdb-react-native/blob/v7/example/index.js
import 'react-native-get-random-values';
import {shim as shimBase64} from 'react-native-quick-base64';
if (typeof process === 'undefined') {
  global.process = require('process');
} else {
  const bProcess = require('process');
  for (var p in bProcess) {
    if (!(p in process)) {
      process[p] = bProcess[p];
    }
  }
}
shimBase64();
process.browser = true;
// End of shim

import 'react-native-gesture-handler'; // Must be at the top
import * as React from 'react';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {Provider as PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import './database';
import Home from './Home';
import ProjectView from './ProjectView';
import Stats from './Stats';
import {HeaderBar} from './ActionBars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useState} from 'react';

//const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function Main() {
  useState();

  const tabIcon = (icon) => {
    return ({color}) => <Icon name={icon} size={20} color={color} />;
  };

  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          backBehavior="initialRoute"
          screenOptions={{header: (props) => <HeaderBar {...props} />}}>
          <Tab.Screen
            name="Home"
            options={{
              tabBarIcon: tabIcon('home'),
            }}
            component={Home}
          />
          <Tab.Screen
            name="Project"
            options={{
              tabBarIcon: tabIcon('briefcase-clock'),
            }}
            component={ProjectView}
          />
          <Tab.Screen
            name="Stats"
            options={{
              tabBarIcon: tabIcon('chart-line'),
            }}
            component={Stats}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
