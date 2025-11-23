import React, { useState } from 'react';
import { type ClientDetailsComparisonProps } from '../types';
import {
  Row,
  Button,
  InlineLoading,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  Checkbox,
  TableBody,
} from '@carbon/react';
import { showSnackbar } from '@openmrs/esm-framework';
import { HieIdentificationType } from '../../types';
import {
  personSyncFields,
  nameFields,
  addressFields,
  identifiersSyncFields,
  getIdentifierUuid,
  patientObjFields,
  mapFieldValue,
} from '../mapper-utils';
import ComparisonTableRow from './comparison-table-row.component';
import { updateAmrsPersonIdentifiers, updatePerson } from '../existing-client.resource';

const ClientDetailsComparison: React.FC<ClientDetailsComparisonProps> = ({ hieClient, amrsClient, fromDependant }) => {
  const [syncFields, setSyncFields] = useState<Array<Record<string, string>>>([]);
  const [allChecked, setAllChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const locationUuid = '18c343eb-b353-462a-9139-b16606e6b6c2';
  const randomString = Math.random().toString(10).substring(2, 6).toUpperCase();

  const handleFieldChange = (checked: boolean, field: string, value: string, multiple: boolean) => {
    if (multiple) {
      if (checked) {
        setSyncFields((prev) => [...prev, { [field]: value }]);
      } else {
        setSyncFields([]);
      }
    } else {
      if (checked) {
        setSyncFields([...syncFields, { [field]: value }]);
      } else {
        setSyncFields((prev) => prev.filter((p) => !Object.keys(p).includes(field)));
      }
    }
  };

  const handleCheckAll = (e) => {
    setAllChecked(e.target.checked);
  };

  const handleSync = async () => {
    try {
      const payload = {};
      syncFields.forEach((field) => {
        let key = Object.keys(field)[0];
        payload[key] = field[key];
      });

      // Person
      const patientPayload = {};
      const names = {};
      const addresses = {};
      const otherFields = {};
      Object.entries(payload).forEach(([k, v]) => {
        if (personSyncFields.includes(k)) {
          // names
          if (nameFields.includes(k)) {
            names[k] = v;
          }
          // addresses
          else if (addressFields.includes(k)) {
            if (v) {
              addresses[k] = v;
            }
          } else {
            otherFields[k] = v;
          }
        }
      });
      Object.assign(patientPayload, otherFields, { addresses: [addresses] }, { names: [names] });
      await updatePerson(amrsClient.person.uuid, patientPayload);
      showSnackbar({
        kind: 'success',
        title: 'Patient successfully synced.',
      });

      // Identifiers
      Object.entries(payload).forEach(async ([k, v]) => {
        if (identifiersSyncFields().includes(k)) {
          if (v) {
            const identifierUuid = getIdentifierUuid(HieIdentificationType[k]);
            const identifierPayload = {
              identifier: v,
              location: locationUuid,
              identifierType: identifierUuid,
            };
            try {
              // Check if the identifier exists
              if (amrsClient?.person?.identifiers?.find((i) => i.identifierType.uuid === identifierUuid)) {
                // update to have the selected identifier
                await updateAmrsPersonIdentifiers(
                  amrsClient.person.uuid,
                  identifierUuid + '',
                  identifierPayload,
                  fromDependant,
                );
              } else {
                // create to have the blank identifier
                await updateAmrsPersonIdentifiers(amrsClient.person.uuid, '', identifierPayload, fromDependant);
              }
            } catch (err) {
              showSnackbar({
                kind: 'error',
                title: 'Error syncing patient identifiers.',
              });
            }
          }
        }
      });
      showSnackbar({
        kind: 'success',
        title: 'Patient identifiers successfully synced.',
      });

      setSyncFields([]);
    } catch (err) {
      showSnackbar({
        kind: 'error',
        title: 'Error syncing patient data.',
        subtitle: JSON.stringify(err?.error?.message),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Field</TableHeader>
            <TableHeader>AMRS Person</TableHeader>
            <TableHeader>HIE Patient</TableHeader>
            <TableHeader>
              <Checkbox id={`cbox-multiple-${randomString}`} onChange={(e) => handleCheckAll(e)} />
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {patientObjFields.map((field) => {
            const fieldValue = mapFieldValue(field, hieClient, amrsClient);
            const amrsField = fieldValue[0];
            const hieField = fieldValue[1];

            return (
              <ComparisonTableRow
                label={field}
                field={field}
                amrsValue={amrsField}
                hieValue={hieField}
                onChange={handleFieldChange}
                allChecked={allChecked}
              />
            );
          })}
        </TableBody>
      </Table>
      <Row>
        {syncFields.length ? <Button onClick={handleSync}>Sync data</Button> : null}
        {loading ? <InlineLoading description="Syncing patient details..." /> : null}
      </Row>
    </>
  );
};

export default ClientDetailsComparison;
