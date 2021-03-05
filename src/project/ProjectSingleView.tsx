import React from 'react';
import {Project, projectDB} from '../Database';
import {LoadingIcon} from '../Loading';
import {ScrollView} from 'react-native';
import OverrideColor from '../OverrideColor';
import {Button, Text, Title} from 'react-native-paper';

type State = {
  id: string;
  project: Project | undefined;
};

export class ProjectSingleView extends React.Component<any, State> {
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
