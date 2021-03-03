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
import OverrideColor from './OverrideColor';
import {getColor, ThemedColor, allColors} from './color';

export type AddProjectButtonProps = {
  disabled: boolean;
  projectsLength: number;
  addProjectCallback: (name: string, color: ThemedColor) => void;
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
  dialogButton: {
    minWidth: '20%',
    textAlign: 'center',
  },
});

const DEFAULT_COLOR = 'blue';

export function AddProjectButton(props: AddProjectButtonProps) {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState(getColor(DEFAULT_COLOR));

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
            setVisible(false);
            setColor(getColor(DEFAULT_COLOR));
          }}>
          <OverrideColor color={color ? color : getColor(DEFAULT_COLOR)}>
            <Dialog.Title>Add Project</Dialog.Title>
          </OverrideColor>
          <Dialog.Content>
            <TextInput label="Project name" onChangeText={setName} />
            <View style={style.colorButtonList}>
              {allColors.map(colorButton)}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              style={style.dialogButton}
              onPress={() => {
                setName('');
                setColor(getColor(DEFAULT_COLOR));
                setVisible(false);
              }}>
              Cancel
            </Button>
            <Button
              style={style.dialogButton}
              disabled={name === ''}
              onPress={() => {
                props.addProjectCallback(name, color);
                setVisible(false);
                setName('');
                setColor(getColor(DEFAULT_COLOR));
                setVisible(false);
              }}>
              OK
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
