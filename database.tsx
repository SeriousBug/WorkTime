// @ts-ignore
import SQLite from 'react-native-sqlite-2';
// @ts-ignore
import SQLiteAdapterFactory from 'pouchdb-adapter-react-native-sqlite';
const SQLiteAdapter = SQLiteAdapterFactory(SQLite);
import PouchDB from '@craftzdog/pouchdb-core-react-native';
import {ThemedColor} from './color';
PouchDB.plugin(SQLiteAdapter);

export class Project {
  _id: string;
  name: string;
  color: ThemedColor;
}

export type TimeLog = {
  _id: string;
};

export const projectDB = new PouchDB<Project>('project', {
  adapter: 'react-native-sqlite',
});
export const timeLogDB = new PouchDB<TimeLog>('timelog', {
  adapter: 'react-native-sqlite',
});
