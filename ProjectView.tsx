import React from 'react';
import {projectDB, Project, ProjectDB} from './database';
import {Card, Paragraph, Title, Text, Button} from 'react-native-paper';
import {StyleSheet, ScrollView} from 'react-native';
import {AddProjectButton} from './AddProjectButton';
import OverrideColor from './OverrideColor';
import {createStackNavigator} from '@react-navigation/stack';
import {DateTime, Duration} from 'luxon';
import {LoadingIcon} from './loading';

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
  id: string;
  project: Project | undefined;
};

class ProjectSingleView extends React.Component<any, ProjectSingleState> {
  constructor(props: any) {
    super(props);
    this.state = {id: props.route.params, project: undefined};
  }

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    try {
      const project = await projectDB.get(this.state.id);
      this.setState({project: new Project(project)});
    } catch (err) {
      console.error('Failed to get project', err);
    }
  }

  render() {
    if (this.state.project === undefined) {
      return <LoadingIcon />;
    }

    const project = this.state.project;
    const duration = project.duration;
    return (
      <ScrollView>
        <OverrideColor color={project.color}>
          <Title>{project.name}</Title>
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
      console.log('Got ' + results.total_rows + ' projects');
      this.setState({
        loading: false,
        projects: results.rows.map((row) => new Project(row.doc as ProjectDB)),
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
        {this.state.loading ? <LoadingIcon /> : null}
        {this.state.projects.map((project) => (
          <Card
            key={project._id}
            style={projectViewStyle.projectCard}
            onPress={() => {
              this.props.navigation.navigate('project', project._id);
            }}>
            <OverrideColor color={project.color}>
              <Card.Title title={project.name} />
            </OverrideColor>
            <Card.Content>
              <Paragraph>{project.duration} hours this week</Paragraph>
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
