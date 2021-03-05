import React from 'react';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'react-native-paper';
import {StyleSheet} from 'react-native';

const style = StyleSheet.create({
  view: {
    position: 'absolute',
    top: '5%',
    left: 0,
    right: 0,
  },
  icon: {textAlign: 'center'},
});

export function LoadingIcon(props: any) {
  const theme = useTheme();

  return (
    <Animatable.View
      {...props}
      animation="rotate"
      easing="linear"
      iterationCount="infinite"
      style={style.view}>
      <Icon
        name="loading"
        size={80}
        color={theme.colors.text}
        style={style.icon}
      />
    </Animatable.View>
  );
}
