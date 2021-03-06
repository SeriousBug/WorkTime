// @ts-ignore
import SQLite from 'react-native-sqlite-2';
// @ts-ignore
import SQLiteAdapterFactory from 'pouchdb-adapter-react-native-sqlite';
const SQLiteAdapter = SQLiteAdapterFactory(SQLite);
import PouchDB from '@craftzdog/pouchdb-core-react-native';
import {ThemedColor} from './color';
import {DateTime, Duration} from 'luxon';
PouchDB.plugin(SQLiteAdapter);
PouchDB.plugin(require('pouchdb-find'));

export class Project {
  _id: string;
  name: string;
  color: ThemedColor;
  /** How much time has been spent on the project within some user-defined timespan.
   *
   * Doesn't account for any ongoing work.
   */
  private _duration: Duration;

  get duration(): string {
    const dur = this._duration.toFormat('h');
    return dur === 'PT0S' ? '0' : dur;
  }

  set duration(dur: string) {
    this._duration = Duration.fromISO(dur);
  }

  constructor(dbObject: ProjectDB) {
    this._id = dbObject._id;
    this.name = dbObject.name;
    this.color = dbObject.color;
    this.duration = dbObject.duration;
  }

  toJSON(): ProjectDB {
    return {
      _id: this._id,
      name: this.name,
      color: this.color,
      duration: this._duration.toISO(),
    };
  }
}

export type ProjectDB = {
  _id: string;
  name: string;
  color: ThemedColor;
  duration: string;
};

export class TimeLog {
  _id: string;
  private project_id: string;
  start: DateTime;
  end: DateTime;

  constructor(dbObject: TimeLogDB) {
    this._id = dbObject._id;
    this.project_id = dbObject.project_id;
    this.start = DateTime.fromISO(dbObject.start);
    this.end = DateTime.fromISO(dbObject.end);
  }

  toJSON(): TimeLogDB {
    return {
      _id: this._id,
      project_id: this.project_id,
      start: this.start.toISO(),
      end: this.end.toISO(),
    };
  }
}

export type TimeLogDB = {
  _id: string;
  project_id: string;
  start: string;
  end: string;
};
