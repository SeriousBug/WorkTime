import React from 'react';
import {useTheme} from 'react-native-paper';
import {View} from 'react-native';

export default function OverrideColor(props: any) {
  let newProps = {...props};
  const theme = {...useTheme()};
  if (props.color) {
    theme.colors.text = props.color;
    newProps.theme = theme;
  } else {
    console.error('Trouble parsing color for override', props.color);
  }
  return <View {...newProps} />;
}
