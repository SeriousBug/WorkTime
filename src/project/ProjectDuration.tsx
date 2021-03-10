import React from 'react';
import {Text} from 'react-native-paper';
import {useFind} from '../Find';
import {TimeLogDB} from '../Database';
import {DateTime, Duration} from 'luxon';

// TODO: Some memoization here would save a lot of repeated computation,
//       especially if we can persist the memoized values.
export function ProjectDuration({projectID}: {projectID: string}) {
  const getSince = DateTime.now().minus({days: 7});
  const logs = useFind<TimeLogDB>('timelog', {
    selector: {project_id: {$eq: projectID}, _id: {$gt: getSince.toISO()}},
  });
  if (logs.docs === undefined) {
    return <Text>Loading...</Text>;
  }
  const duration = logs.docs
    .filter((doc) => doc.end !== '' && doc.start !== '')
    .map((doc) => DateTime.fromISO(doc.end).diff(DateTime.fromISO(doc.start)))
    .reduce((l, r) => l.plus(r), Duration.fromMillis(0));

  return <Text>{duration.toFormat('hh:mm:ss')}</Text>;
}
