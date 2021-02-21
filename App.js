/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import { Appbar, Text } from "react-native-paper";

const App: () => React$Node = () => {
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction />
        <Appbar.Content title="WorkTime" />
      </Appbar.Header>
      <Text>Hello, world!</Text>
    </>
  );
};

export default App;
