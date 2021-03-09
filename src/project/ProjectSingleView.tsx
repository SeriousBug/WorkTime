import React from 'react';
import {Project, ProjectDB, TimeLog, TimeLogDB} from '../Database';
import {LoadingIcon} from '../Loading';
import {ScrollView} from 'react-native';
import {Button, Text, Title, useTheme} from 'react-native-paper';
import {useDoc, usePouch} from 'use-pouchdb';
import {useTimer} from '../Timer';
import {DateTime} from 'luxon';
import {useFind} from '../Find';
import {getThemeColor} from '../color';
import {ProjectDuration} from './ProjectDuration';

export function ProjectSingleView(props: any) {
  const id = props.route.params.id;
  const projectR = useDoc<ProjectDB>(id, {db: 'project'});
  const lastTimeLogR = useFind<TimeLogDB>('timelog', {
    selector: {project_id: {$eq: id}, _id: {$gte: null}},
    sort: [{_id: 'desc'}],
    limit: 1,
  });
  const theme = useTheme();

  // TODO: Check if projectR.error || lastTimeLogR.error, and show an error to user'
  if (projectR.doc === null || lastTimeLogR.loading) {
    return <LoadingIcon />;
  }

  const project = new Project(projectR.doc);

  if (
    lastTimeLogR.docs === undefined ||
    lastTimeLogR.docs.length === 0 ||
    lastTimeLogR.docs[0].end !== ''
  ) {
    // User is not currently working
    return (
      <ScrollView>
        <Title style={{color: getThemeColor(theme, project.color)}}>
          {project.name}
        </Title>
        <ProjectDuration projectID={project._id} />
        <StartWorkButton projectID={project._id} />
      </ScrollView>
    );
  } else {
    // User is currently working, there is a lastTimeLog and it has no end time recorded
    const lastTimeLogDoc = lastTimeLogR.docs[0];
    const lastTimeLog = new TimeLog(lastTimeLogDoc);
    return (
      <ScrollView>
        <Title style={{color: getThemeColor(theme, project.color)}}>
          {project.name}
        </Title>
        <Timer start={lastTimeLog.start} />
        <EndWorkButton rev={lastTimeLogDoc._rev} lastTimeLog={lastTimeLog} />
      </ScrollView>
    );
  }
}

function StartWorkButton({projectID}: {projectID: string}) {
  const timelogDB = usePouch<TimeLogDB>('timelog');

  return (
    <Button
      icon="play"
      onPress={() => {
        timelogDB
          .put({
            _id: DateTime.now().toISO(),
            project_id: projectID,
            start: DateTime.now().toISO(),
            end: '',
          })
          .then(() => {
            console.log('Starting work for project ', projectID);
          })
          .catch((err) => {
            console.error(err);
          });
      }}>
      Start work
    </Button>
  );
}

function Timer({start}: {start: DateTime}) {
  useTimer(1000); // Forces this component to update every second
  return <Text>{DateTime.now().diff(start).toFormat('hh:mm:ss')}</Text>;
}

function EndWorkButton({
  lastTimeLog,
  rev,
}: {
  lastTimeLog: TimeLog;
  rev: string;
}) {
  const timelogDB = usePouch<TimeLogDB>('timelog');

  return (
    <Button
      icon="stop"
      onPress={() => {
        timelogDB
          .put({
            _rev: rev,
            _id: lastTimeLog._id,
            project_id: lastTimeLog.project_id,
            start: lastTimeLog.start.toISO(),
            end: DateTime.now().toISO(),
          })
          .then(() => {
            console.log(
              'Stopping recording work for project ' + lastTimeLog.project_id,
            );
          })
          .catch((err) => {
            console.error(err);
          });
      }}>
      Finish work
    </Button>
  );
}
