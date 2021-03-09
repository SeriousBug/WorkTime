// @ts-ignore
import SQLite from 'react-native-sqlite-2';
// @ts-ignore
import SQLiteAdapterFactory from 'pouchdb-adapter-react-native-sqlite';
const SQLiteAdapter = SQLiteAdapterFactory(SQLite);
import PouchDB from '@craftzdog/pouchdb-core-react-native';
import {ThemedColor} from './color';
import {DateTime} from 'luxon';
PouchDB.plugin(SQLiteAdapter);
PouchDB.plugin(require('pouchdb-find'));

export class Project {
  _id: string;
  name: string;
  color: ThemedColor;

  constructor(dbObject: ProjectDB) {
    this._id = dbObject._id;
    this.name = dbObject.name;
    this.color = dbObject.color;
  }
}

export type ProjectDB = {
  _id: string;
  name: string;
  color: ThemedColor;
};

export class TimeLog {
  _id: string;
  project_id: string;
  start: DateTime;
  end: DateTime;

  constructor(dbObject: TimeLogDB) {
    this._id = dbObject._id;
    this.project_id = dbObject.project_id;
    this.start = DateTime.fromISO(dbObject.start);
    this.end = DateTime.fromISO(dbObject.end);
  }
}

export type TimeLogDB = {
  _id: string;
  project_id: string;
  start: string;
  end: string;
};
