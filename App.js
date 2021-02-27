/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {View, Button, Platform} from 'react-native';
import {Appbar, Text} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

export const TestView = () => {
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <View>
      <View>
        <Button onPress={showDatepicker} title="Show date picker!" />
      </View>
      <View>
        <Button onPress={showTimepicker} title="Show time picker!" />
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

const App: () => React$Node = () => {
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction />
        <Appbar.Content title="WorkTime" />
        <Appbar.Action icon="cog" onPress={() => {}} />
      </Appbar.Header>
      <Text>Hello, world!</Text>
      <TestView />
    </>
  );
};

export default App;
