import React from 'react';
import {Project, ProjectDB, projectDB} from '../Database';
import {ScrollView, StyleSheet} from 'react-native';
import {LoadingIcon} from '../Loading';
import {Card, Paragraph} from 'react-native-paper';
import OverrideColor from '../OverrideColor';
import {AddProjectButton} from './AddProjectButton';
import {DateTime, Duration} from 'luxon';

type State = {
  loading: boolean;
  addProjectDialog: boolean;
  projects: Project[];
};

const style = StyleSheet.create({
  projectCard: {
    margin: 16,
  },
});

export class ProjectListView extends React.Component<any, State> {
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
            style={style.projectCard}
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
