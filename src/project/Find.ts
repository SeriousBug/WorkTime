import {usePouch} from 'use-pouchdb';
import PouchDB from 'pouchdb-core';
import {useEffect, useState} from 'react';

/** Perform pouchdb.find, and also subscribe to changes on the database.
 *
 * use-pouchdb fails to create or use the index for some reason, so
 * using this to simply get an index I created before.
 *
 * @param dbname Name of the database.
 * @param request pouchdb's find options.
 */
export function useFind<T>(
  dbname: string,
  request: PouchDB.Find.FindRequest<any>,
) {
  const db = usePouch<T>(dbname);
  const [response, setResponse] = useState<PouchDB.Find.FindResponse<T> | null>(
    null,
  );
  const [feed, setFeed] = useState<PouchDB.Core.Changes<T> | null>(null);
  useEffect(() => {
    if (feed === null) {
      setFeed(
        db.changes({live: true, since: 'now'}).on('change', () => {
          setResponse(null);
        }),
      );
    }
    return () => {
      if (feed) {
        feed.cancel();
      }
    };
  }, [feed, db]);
  useEffect(() => {
    if (response === null) {
      db.find(request).then(setResponse).catch(setResponse);
    }
  }, [response, request, db]);
  return {...response, loading: response === null};
}
