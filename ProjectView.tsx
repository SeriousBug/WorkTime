import React from 'react';
import {projectDB, Project} from './database';
import {Button, Card, Paragraph} from 'react-native-paper';

type ProjectState = {
  loading: boolean;
  projects: Project[];
};

export default class ProjectView extends React.Component<any, ProjectState> {
  constructor(props: any) {
    super(props);
    this.state = {loading: true, projects: []};
  }

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    console.log('Yay, fetching data!');
    // Debug!
    await projectDB.put({
      _id: new Date().toISOString(),
      name: 'Develop this app',
      color: '#000000',
    });
    // Debug!
    this.setState({loading: true});
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

  render() {
    return (
      <>
        {this.state.projects.map((project) => (
          <Card key={project._id}>
            <Card.Title title={project.name} />
            <Card.Content>
              <Paragraph>12 hours this week</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button icon="play">Start working!</Button>
            </Card.Actions>
          </Card>
        ))}
      </>
    );
  }
}
