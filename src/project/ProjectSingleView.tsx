import React, {useState} from 'react';
import {Project, ProjectDB, TimeLog, TimeLogDB} from '../Database';
import {LoadingIcon} from '../Loading';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Modal, Portal, Text, Title, useTheme} from 'react-native-paper';
import {useDoc, usePouch} from 'use-pouchdb';
import {useTimer} from '../Timer';
import {DateTime} from 'luxon';
import {useFind} from '../Find';
import {getThemeColor} from '../color';
import {ProjectDuration} from './ProjectDuration';
import {RecordPreviousWorkButton} from './RecordPreviousWorkButton';
import {useNavigation} from '@react-navigation/native';

const style = StyleSheet.create({
  container: {padding: 60},
  title: {fontSize: 40, lineHeight: 40},
  titleContainer: {height: 60},
  modal: {},
  timer: {fontSize: 30, marginLeft: 50, marginBottom: 50},
  button: {
    padding: 10,
    margin: 20,
  },
});

export function ProjectSingleView(props: any) {
  const id = props.route.params.id;
  const projectR = useDoc<ProjectDB>(id, {db: 'project'});
  const lastTimeLogR = useFind<TimeLogDB>('timelog', {
    selector: {project_id: {$eq: id}, _id: {$gte: null}},
    sort: [{_id: 'desc'}],
    limit: 1,
  });

  // TODO: Check if projectR.error || lastTimeLogR.error, and show an error to user'
  if (projectR.doc === null || lastTimeLogR.loading) return <LoadingIcon />;

  const project = new Project(projectR.doc);

  if (
    lastTimeLogR.docs === undefined ||
    lastTimeLogR.docs.length === 0 ||
    lastTimeLogR.docs[0].end !== ''
  ) {
    // User is not currently working
    return (
      <ScrollView style={style.container}>
        <ProjectTitle project={project} />
        <ProjectDuration style={style.timer} projectID={project._id} />
        <StartWorkButton projectID={project._id} />
        <RecordPreviousWorkButton project={project} />
        <DeleteProjectButton project={projectR.doc} />
      </ScrollView>
    );
  } else {
    // User is currently working, there is a lastTimeLog and it has no end time recorded
    const lastTimeLogDoc = lastTimeLogR.docs[0];
    const lastTimeLog = new TimeLog(lastTimeLogDoc);
    return (
      <ScrollView style={style.container}>
        <ProjectTitle project={project} />
        <Timer start={lastTimeLog.start} />
        <EndWorkButton rev={lastTimeLogDoc._rev} lastTimeLog={lastTimeLog} />
      </ScrollView>
    );
  }
}

function ProjectTitle({project}: {project: Project}) {
  const theme = useTheme();
  return (
    <View key={project._id} style={style.titleContainer}>
      <Title
        style={{
          color: getThemeColor(theme, project.color),
          ...style.title,
        }}>
        {project.name}
      </Title>
    </View>
  );
}

function StartWorkButton({projectID}: {projectID: string}) {
  const timelogDB = usePouch<TimeLogDB>('timelog');

  return (
    <Button
      icon="play"
      style={style.button}
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
  return (
    <Text style={style.timer}>
      {DateTime.now().diff(start).toFormat('hh:mm:ss')}
    </Text>
  );
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
      style={style.button}
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

function DeleteProjectButton({
  project,
}: {
  project: PouchDB.Core.ExistingDocument<ProjectDB>;
}) {
  const [show, setShow] = useState(false);
  const theme = useTheme();
  const db = usePouch<ProjectDB>('project');
  const nav = useNavigation();

  return (
    <>
      <Button
        style={style.button}
        onPress={() => {
          setShow(true);
        }}>
        Delete project
      </Button>
      <Portal>
        <Modal
          style={{backgroundColor: 'rgba(0, 0, 0, .8)'}}
          visible={show}
          onDismiss={() => {
            setShow(false);
          }}>
          <Text style={{textAlign: 'center'}}>
            Delete project{' '}
            <Text
              style={{
                color: getThemeColor(theme, project.color),
              }}>
              {project.name}
            </Text>
          </Text>

          <Button
            onPress={() => {
              setShow(false);
            }}>
            Cancel
          </Button>
          <Button
            onPress={() => {
              setShow(false);
              db.remove(project);
              if (nav.canGoBack()) nav.goBack();
              else nav.navigate('listprojects');
            }}>
            Delete
          </Button>
        </Modal>
      </Portal>
    </>
  );
}
