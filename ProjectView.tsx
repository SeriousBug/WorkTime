import React from 'react';
import {projectDB, Project, ProjectDB} from './database';
import {Card, Paragraph, Title, Text, Button} from 'react-native-paper';
import {StyleSheet, ScrollView} from 'react-native';
import {AddProjectButton} from './AddProjectButton';
import OverrideColor from './OverrideColor';
import {createStackNavigator} from '@react-navigation/stack';
import {DateTime, Duration} from 'luxon';

type ProjectState = {
  loading: boolean;
  addProjectDialog: boolean;
  projects: Project[];
};

const projectViewStyle = StyleSheet.create({
  projectCard: {
    margin: 16,
  },
});

const StackNavigator = createStackNavigator();

export default function ProjectView() {
  return (
    <StackNavigator.Navigator initialRouteName="listprojects" headerMode="none">
      <StackNavigator.Screen name="listprojects" component={ProjectListView} />
      <StackNavigator.Screen name="project" component={ProjectSingleView} />
    </StackNavigator.Navigator>
  );
}

type ProjectSingleState = {
  project: Project;
};

class ProjectSingleView extends React.Component<any, ProjectSingleState> {
  constructor(props: any) {
    super(props);
    this.state = {project: props.project};
  }

  render() {
    // TODO: Don't pass in project, needs to be serializable, pass in id and fetch here
    const params: Project = this.props.route.params;
    const duration = params.duration.toFormat('h');
    return (
      <ScrollView>
        <OverrideColor color={params.color}>
          <Title>{params.name}</Title>
        </OverrideColor>
        <Text>{duration === 'PT0S' ? '0' : duration} hours</Text>
        <Button icon="play">Start work</Button>
      </ScrollView>
    );
  }
}

class ProjectListView extends React.Component<any, ProjectState> {
  constructor(props: any) {
    super(props);
    this.state = {loading: true, addProjectDialog: false, projects: []};
  }

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    this.setLoading();
    try {
      const results = await projectDB.allDocs({
        include_docs: true,
        descending: true,
      });
      console.log(results);
      this.setState({
        loading: false,
        projects: results.rows.map((row) => {
          const doc = row.doc as ProjectDB;
          return {
            _id: doc._id,
            name: doc.name,
            color: doc.color,
            duration: Duration.fromISO(doc.duration),
          };
        }),
      });
    } catch (err) {
      this.setState({loading: false});
      console.error('Failed getting projects!', err);
      // TODO: Show error message to the user?
    }
  }

  private setLoading() {
    this.setState({loading: true});
  }

  async addProject() {}

  render() {
    return (
      <ScrollView>
        {this.state.projects.map((project) => (
          <Card
            key={project._id}
            style={projectViewStyle.projectCard}
            onPress={() => {
              this.props.navigation.navigate('project', project);
            }}>
            <OverrideColor color={project.color}>
              <Card.Title title={project.name} />
            </OverrideColor>
            <Card.Content>
              <Paragraph>12 hours this week</Paragraph>
            </Card.Content>
          </Card>
        ))}
        <AddProjectButton
          projectsLength={this.state.projects.length}
          disabled={this.state.loading}
          addProjectCallback={async (name, color) => {
            if (name === '') {
              return;
            }
            this.setLoading();
            await projectDB.put({
              _id: DateTime.now().toISO(),
              name: name,
              color: color,
              duration: Duration.fromMillis(0).toISO(),
            });
            await this.fetchData();
          }}
        />
      </ScrollView>
    );
  }
}
