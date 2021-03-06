import React from 'react';
import {Project, ProjectDB, TimeLog, TimeLogDB} from '../Database';
import {LoadingIcon} from '../Loading';
import {ScrollView} from 'react-native';
import OverrideColor from '../OverrideColor';
import {Button, Text, Title} from 'react-native-paper';
import {useDoc, useFind} from 'use-pouchdb';
import {useTimer} from '../Timer';

export function ProjectSingleView(props: any) {
  const id = props.route.params.id;
  console.log(props.route);
  const projectR = useDoc<ProjectDB>(id, {db: 'project'});
  const lastTimeLogR = useFind<TimeLogDB>({
    index: {fields: ['project-id']},
    selector: {'project-id': id},
    limit: 1,
    db: 'timelog',
  });

  // TODO: Check if projectR.error || lastTimeLogR.error, and show an error to user'
  if (projectR.doc === null || lastTimeLogR.loading) {
    return <LoadingIcon />;
  }

  const project = new Project(projectR.doc);

  if (lastTimeLogR.docs.length === 0 || lastTimeLogR.docs[0].end !== '') {
    // Not currently working
    return (
      <ScrollView>
        <OverrideColor color={project.color}>
          <Title>{project.name}</Title>
        </OverrideColor>
        <Text>{project.duration} hours</Text>
        <Button icon="play">Start work</Button>
      </ScrollView>
    );
  } else {
    // Currently working, there is a lastTimeLog and it has no end time recorded
    return (
      <ProjectWorkingView
        project={project}
        lastTimeLog={new TimeLog(lastTimeLogR.docs[0])}
      />
    );
  }
}

function ProjectWorkingView({
  lastTimeLog,
  project,
}: {
  lastTimeLog: TimeLog;
  project: Project;
}) {
  useTimer(1000); // Forces this component to update every second
  return (
    <ScrollView>
      <OverrideColor color={project.color}>
        <Title>{project.name}</Title>
      </OverrideColor>
      <Text>{lastTimeLog.start.diffNow().toFormat('hh:mm:ss')}</Text>
    </ScrollView>
  );
}
