// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
import {Project, TimeLogDB} from '../Database';
import React, {useState} from 'react';
import {DateTime} from 'luxon';
import {Button, Modal, Portal, Text, useTheme} from 'react-native-paper';
import {usePouch} from 'use-pouchdb';
import {LoadingIcon} from '../Loading';
import {getThemeColor} from '../color';
import {View} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export function RecordPreviousWorkButton({project}: {project: Project}) {
  const [showDialog, setShowDialog] = useState(false);
  const [startTime, StartTimePicker] = useDateTimePicker('Worked from');
  const [endTime, EndTimePicker] = useDateTimePicker(
    'Worked until',
    DateTime.now(),
  );

  const theme = useTheme();
  const db = usePouch<TimeLogDB>('timelog');
  if (project === null) return <LoadingIcon />;

  return (
    <>
      <Button
        onPress={() => {
          setShowDialog(true);
        }}>
        Record previous work
      </Button>
      <Portal>
        <Modal
          visible={showDialog}
          onDismiss={() => {
            setShowDialog(false);
          }}>
          <Text style={{color: getThemeColor(theme, project.color)}}>
            {project.name}
          </Text>
          <StartTimePicker />
          <EndTimePicker />
          <Button
            onPress={() => {
              setShowDialog(false);
            }}>
            Cancel
          </Button>
          <Button
            onPress={() => {
              setShowDialog(false);
              if (startTime === undefined || endTime === undefined) return; // not empty
              if (endTime.diff(startTime).toMillis() < 0) return; // not backwards
              if (endTime.diffNow().toMillis() > 0) return; // not in the future
              db.put({
                _id: startTime.toISO(),
                project_id: project._id,
                start: startTime.toISO(),
                end: endTime.toISO(),
              })
                .then(() => {
                  console.log(
                    'Logged previous work for project ' + project._id,
                  );
                })
                .catch(() => {
                  console.log('Failed to insert to database');
                });
            }}>
            OK
          </Button>
        </Modal>
      </Portal>
    </>
  );
}

function useDateTimePicker(
  name: string,
  initial?: DateTime,
): [DateTime | undefined, React.FC] {
  const [show, setShow] = useState(false);
  const [picked, setPicked] = useState<DateTime | undefined>(initial);

  return [
    picked,
    function DateTimePicker() {
      return (
        <View>
          <Text>{name}</Text>
          <Text
            onPress={() => {
              setShow(true);
            }}>
            {picked === undefined
              ? ''
              : picked.toLocaleString({
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
          </Text>
          <DateTimePickerModal
            isVisible={show}
            mode="datetime"
            onConfirm={(datetime) => {
              setShow(false);
              // Converting the base Date object to Luxon's DateTime for uniformity
              setPicked(DateTime.fromISO(datetime.toISOString()));
            }}
            onCancel={() => {
              setShow(false);
            }}
          />
        </View>
      );
    },
  ];
}
