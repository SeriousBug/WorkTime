import React from 'react';
import {Project, ProjectDB} from '../Database';
import {ScrollView, StyleSheet} from 'react-native';
import {LoadingIcon} from '../Loading';
import {Card, Paragraph} from 'react-native-paper';
import OverrideColor from '../OverrideColor';
import {AddProjectButton} from './AddProjectButton';
import {useAllDocs} from 'use-pouchdb';
import {useNavigation} from '@react-navigation/native';

const style = StyleSheet.create({
  projectCard: {
    margin: 16,
  },
});

export function ProjectListView() {
  const navigation = useNavigation();
  const projectsR = useAllDocs<ProjectDB>({db: 'project', include_docs: true});

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
      {projects.map((project) => (
        <Card
          key={project._id}
          style={style.projectCard}
          onPress={() => {
            navigation.navigate('project', {id: project._id});
          }}>
          <OverrideColor color={project.color}>
            <Card.Title title={project.name} />
          </OverrideColor>
          <Card.Content>
            <Paragraph>{project.duration} hours this week</Paragraph>
          </Card.Content>
        </Card>
      ))}
      <AddProjectButton />
    </ScrollView>
  );
}
