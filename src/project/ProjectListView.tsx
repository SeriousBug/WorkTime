import React from 'react';
import {Project, ProjectDB} from '../Database';
import {ScrollView, StyleSheet} from 'react-native';
import {LoadingIcon} from '../Loading';
import {Card, useTheme} from 'react-native-paper';
import {AddProjectButton} from './AddProjectButton';
import {useAllDocs} from 'use-pouchdb';
import {useNavigation} from '@react-navigation/native';
import {getThemeColor} from '../color';
import {ProjectDuration} from './ProjectDuration';

const style = StyleSheet.create({
  projectCard: {
    margin: 16,
  },
});

export function ProjectListView() {
  const navigation = useNavigation();
  const projectsR = useAllDocs<ProjectDB>({db: 'project', include_docs: true});
  let theme = useTheme();

  if (projectsR.loading) {
    return (
      <ScrollView>
        <LoadingIcon />
      </ScrollView>
    );
  }
  const projects = projectsR.rows
    .filter((row) => row.doc !== undefined)
    .map((row) => new Project(row.doc as ProjectDB));

  return (
    <ScrollView>
      {projects.map((project) => {
        return (
          <Card
            key={project._id}
            style={style.projectCard}
            onPress={() => {
              navigation.navigate('project', {id: project._id});
            }}>
            <Card.Title
              titleStyle={{color: getThemeColor(theme, project.color)}}
              title={project.name}
            />
            <Card.Content>
              <ProjectDuration projectID={project._id} />
            </Card.Content>
          </Card>
        );
      })}
      <AddProjectButton />
    </ScrollView>
  );
}
