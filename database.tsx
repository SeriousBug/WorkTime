// @ts-ignore
import SQLite from 'react-native-sqlite-2';
// @ts-ignore
import SQLiteAdapterFactory from 'pouchdb-adapter-react-native-sqlite';
const SQLiteAdapter = SQLiteAdapterFactory(SQLite);
import PouchDB from '@craftzdog/pouchdb-core-react-native';
import {ThemedColor} from './color';
import {DateTime, Duration} from 'luxon';
PouchDB.plugin(SQLiteAdapter);

export class Project {
  _id: string;
  name: string;
  color: ThemedColor;
  /** How much time has been spent on the project within some user-defined timespan.
   *
   * Doesn't account for any ongoing work.
   */
  duration: Duration;
}

export class ProjectDB {
  _id: string;
  name: string;
  color: ThemedColor;
  duration: string;
}

export type TimeLog = {
  _id: string;
  start: DateTime;
  end: DateTime;
};

export type TimeLogDB = {
  _id: string;
  start: string;
  end: string;
};

export const projectDB = new PouchDB<ProjectDB>('project', {
  adapter: 'react-native-sqlite',
});
export const timeLogDB = new PouchDB<TimeLogDB>('timelog', {
  adapter: 'react-native-sqlite',
});
