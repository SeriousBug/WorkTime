/// <reference types="pouchdb-core" />

declare module '@craftzdog/pouchdb-core-react-native' {
  const pouchDb: PouchDB.Static;
  export default pouchDb;
}

declare var PouchDB: PouchDB.Static;
