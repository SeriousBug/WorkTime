import React, {useState} from 'react';
import {
  Portal,
  Dialog,
  Button,
  TextInput,
  IconButton,
} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import OverrideColor from './OverrideColor';

export type AddProjectButtonProps = {
  disabled: boolean;
  projectsLength: number;
  addProjectCallback: (name: string, color: string) => void;
};

const style = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 60,
  },
  colorButton: {
    maxWidth: '30%',
  },
  colorButtonList: {flexDirection: 'row', flexWrap: 'wrap'},
});

const PROJECT_COLORS = [
  '#95d0fc',
  '#eecffe',
  '#fe83cc',
  '#c7fdb5',
  '#7af9ab',
  '#ffb07c',
  '#f29e8e',
  '#e6daa6',
  '#ffffe4',
];

export function AddProjectButton(props: AddProjectButtonProps) {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('');

  const colorButton = (forColor: string) => (
    <IconButton
      key={forColor}
      icon="checkbox-blank-circle"
      color={forColor}
      style={style.colorButton}
      onPress={() => {
        setColor(forColor);
      }}
    />
  );

  return (
    <View style={style.container}>
      <Button
        icon="plus"
        disabled={props.disabled}
        onPress={() => {
          setVisible(true);
        }}>
        Add project
      </Button>
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={() => {
            setName('');
            setColor(PROJECT_COLORS[0]);
          }}>
          <OverrideColor color={color ? color : PROJECT_COLORS[0]}>
            <Dialog.Title>Add Project</Dialog.Title>
          </OverrideColor>
          <Dialog.Content>
            <TextInput label="Project name" onChangeText={setName} />
            <View style={style.colorButtonList}>
              {PROJECT_COLORS.map(colorButton)}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                props.addProjectCallback(name, color);
                setVisible(false);
                setName('');
                setColor(PROJECT_COLORS[0]);
                setVisible(false);
              }}>
              OK
            </Button>
            <Button
              onPress={() => {
                setName('');
                setColor(PROJECT_COLORS[0]);
                setVisible(false);
              }}>
              Cancel
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
