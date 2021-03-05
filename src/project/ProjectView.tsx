import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ProjectListView} from './ProjectListView';
import {ProjectSingleView} from './ProjectSingleView';

const StackNavigator = createStackNavigator();

export default function ProjectView() {
  return (
    <StackNavigator.Navigator initialRouteName="listprojects" headerMode="none">
      <StackNavigator.Screen name="listprojects" component={ProjectListView} />
      <StackNavigator.Screen name="project" component={ProjectSingleView} />
    </StackNavigator.Navigator>
  );
}
