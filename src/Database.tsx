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
