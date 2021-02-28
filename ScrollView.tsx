import {ScrollView as UnthemedScrollView} from 'react-native';
import React from 'react';
import {useTheme} from 'react-native-paper';

export default function ScrollView(props: any) {
  const theme = useTheme();
  return (
    <UnthemedScrollView
      style={{backgroundColor: theme.colors.background}}
      {...props}
    />
  );
}
