import React from 'react';
import {projectDB, Project} from './database';
import {IconButton, Card, Paragraph} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import ScrollView from './ScrollView';
import {AddProjectButton} from './AddProjectButton';
import OverrideColor from './OverrideColor';

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

export default class ProjectView extends React.Component<any, ProjectState> {
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
        projects: results.rows.map((row) => row.doc as Project),
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
          <Card key={project._id} style={projectViewStyle.projectCard}>
            <OverrideColor color={project.color}>
              <Card.Title title={project.name} />
            </OverrideColor>
            <Card.Content>
              <Paragraph>12 hours this week</Paragraph>
            </Card.Content>
            <Card.Actions>
              <IconButton
                icon="play"
                accessibilityLabel="Start recording time"
              />
            </Card.Actions>
          </Card>
        ))}
        <AddProjectButton
          projectsLength={this.state.projects.length}
          disabled={this.state.loading}
          addProjectCallback={async (name, color) => {
            if (name === '' || color === '') {
              return;
            }
            this.setLoading();
            await projectDB.put({
              _id: new Date().toISOString(),
              name: name,
              color: color,
            });
            await this.fetchData();
          }}
        />
      </ScrollView>
    );
  }
}
