import React, {useState} from 'react';
import {
  Portal,
  Dialog,
  Button,
  TextInput,
  IconButton,
  useTheme,
} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import {getColor, ThemedColor, allColors} from '../color';
import {usePouch} from 'use-pouchdb';
import {ProjectDB} from '../Database';
import {DateTime, Duration} from 'luxon';

const style = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 60,
  },
  colorButton: {
    maxWidth: '30%',
  },
  colorButtonList: {flexDirection: 'row', flexWrap: 'wrap'},
  dialogButton: {
    minWidth: '20%',
    textAlign: 'center',
  },
});

const DEFAULT_COLOR = 'blue';

export function AddProjectButton() {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState(getColor(DEFAULT_COLOR));
  const projectDB = usePouch<ProjectDB>('project');

  const theme = useTheme();

  const colorButton = (forColor: ThemedColor) => (
    <IconButton
      key={forColor.dark}
      icon="checkbox-blank-circle"
      color={theme.dark ? forColor.dark : forColor.light}
      style={style.colorButton}
      onPress={() => {
        setColor(forColor);
      }}
    />
  );

  const reset = () => {
    setName('');
    setColor(getColor(DEFAULT_COLOR));
    setVisible(false);
  };

  return (
    <View style={style.container}>
      <Button
        icon="plus"
        onPress={() => {
          setVisible(true);
        }}>
        Add project
      </Button>
      <Portal>
        <Dialog visible={visible} onDismiss={reset}>
          <Dialog.Title
            theme={{colors: {text: theme.dark ? color.dark : color.light}}}>
            Add Project
          </Dialog.Title>
          <Dialog.Content>
            <TextInput label="Project name" onChangeText={setName} />
            <View style={style.colorButtonList}>
              {allColors.map(colorButton)}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button style={style.dialogButton} onPress={reset}>
              Cancel
            </Button>
            <Button
              style={style.dialogButton}
              disabled={name === ''}
              onPress={() => {
                projectDB
                  .put({
                    _id: DateTime.now().toISO(),
                    name: name,
                    color: color,
                    duration: Duration.fromMillis(0).toISO(),
                  })
                  .then((res) => {
                    console.log(res);
                  })
                  .catch((err) => {
                    console.error(err);
                  });
                reset();
              }}>
              OK
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
