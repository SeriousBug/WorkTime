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
  for (let p in bProcess) {
    if (!(p in process)) {
      // noinspection JSUnfilteredForInLoop
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
import {
  DarkTheme,
  DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {Appearance} from 'react-native-appearance';
import './src/Database';
import Home from './src/Home';
import ProjectView from './src/project/ProjectView';
import Stats from './src/Stats';
import {HeaderBar} from './src/ActionBars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const themes = {
  light: {
    ...DefaultTheme,
    roundness: 2,
    dark: false,
    mode: 'adaptive',
    colors: {
      ...DefaultTheme.colors,
      primary: '#fc9321',
      accent: '#35659d',
    },
  },
  dark: {
    ...DarkTheme,
    roundness: 2,
    dark: true,
    mode: 'adaptive',
    colors: {
      ...DarkTheme.colors,
      primary: '#fc9321',
      accent: '#35659d',
    },
  },
};

export class Main extends React.Component {
  getTheme(scheme) {
    if (scheme === 'light') {
      console.log('Using light theme as requested');
      return themes.light;
    }
    if (scheme === 'dark' || scheme === 'no-preference') {
      console.log(
        'Using dark theme ' +
          (scheme === 'dark' ? 'as requested' : 'by default'),
      );
      return themes.dark;
    }
  }

  constructor(props) {
    super(props);

    const colorSchemeListener = Appearance.addChangeListener(
      ({colorScheme}) => {
        this.setState({theme: this.getTheme(colorScheme)});
      },
    );
    this.state = {
      theme: this.getTheme(Appearance.getColorScheme()),
      colorSchemeListener: colorSchemeListener,
    };
  }

  componentWillUnmount() {
    this.state.colorSchemeListener.remove();
  }

  tabIcon(icon) {
    return ({color}) => <Icon name={icon} size={20} color={color} />;
  }

  render() {
    return (
      <PaperProvider theme={this.state.theme}>
        <NavigationContainer theme={this.state.theme}>
          <Tab.Navigator
            initialRouteName="Home"
            backBehavior="initialRoute"
            screenOptions={{header: (props) => <HeaderBar {...props} />}}>
            <Tab.Screen
              name="Home"
              options={{
                tabBarIcon: this.tabIcon('home'),
              }}
              component={Home}
            />
            <Tab.Screen
              name="Project"
              options={{
                tabBarIcon: this.tabIcon('briefcase-clock'),
              }}
              component={ProjectView}
            />
            <Tab.Screen
              name="Stats"
              options={{
                tabBarIcon: this.tabIcon('chart-line'),
              }}
              component={Stats}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    );
  }
}

AppRegistry.registerComponent(appName, () => Main);
