import React from 'react';
import {Appbar} from 'react-native-paper';

export function HeaderBar({navigation, route, previous}) {
  return (
    <Appbar.Header>
      {previous ? <Appbar.BackAction /> : null}
      <Appbar.Content title="WorkTime" />
      {route.name === 'Home' ? (
        <Appbar.Action icon="cog" onPress={() => {}} />
      ) : null}
    </Appbar.Header>
  );
}
