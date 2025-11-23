import { AccordionItem, Row, Column, Select, SelectItem, Button } from '@carbon/react';
import { showSnackbar } from '@openmrs/esm-framework';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createPerson, createRelationship, fetchAmrsPersonData } from '../existing-client.resource';
import {
  patientObjFields,
  mapFieldValue,
  getPatientAttributes,
  personSyncFields,
  nameFields,
  addressFields,
  getPatientRelationshipPayload,
} from '../mapper-utils';
import { type AmrsClient, type ClientDependantComparisonRowsProps } from '../types';
import { type HieDependant } from '../../types';
import ClientDetailsComparison from '../client-details-comparison/client-details-comparison.component';

const ClientDependantComparisonRows: React.FC<ClientDependantComparisonRowsProps> = ({
  hieDependant,
  patientRelationships,
  amrsClient,
}) => {
  const { t } = useTranslation();
  const [amrsRelationExists, setAmrsRelationExists] = useState(false);
  const [amrsDependantData, setAmrsDependantData] = useState<AmrsClient>();
  const [selectedRelationship, setSelectedRelationship] = useState('');

  const handleCreateDependant = async (dependantBody: HieDependant) => {
    try {
      const syncFields = {};
      patientObjFields.forEach((field) => {
        let fieldArr = mapFieldValue(field, dependantBody.result[0], amrsClient);
        const hieFieldValue = fieldArr[1];
        syncFields[field] = hieFieldValue;
      });

      // Person
      const patientPayload = {};
      const names = {};
      const addresses = {};
      const otherFields = {};
      const attributes = getPatientAttributes(dependantBody.result[0]);
      Object.entries(syncFields).forEach(([k, v]) => {
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
      Object.assign(
        patientPayload,
        otherFields,
        { addresses: [addresses] },
        { names: [names] },
        { attributes: attributes },
      );
      const response = await createPerson(patientPayload);
      if (response && response.data) {
        showSnackbar({
          kind: 'success',
          title: 'Dependant created successfully.',
        });
        const relationshipPayload = getPatientRelationshipPayload(
          amrsClient,
          dependantBody.relationship,
          response.data.uuid,
        );
        await createRelationship(relationshipPayload);
        showSnackbar({
          kind: 'success',
          title: 'Dependant relationship created successfully.',
        });
      }
    } catch (err) {
      showSnackbar({
        kind: 'error',
        title: 'Error syncing patient data.',
        subtitle: JSON.stringify(err),
      });
    }
  };

  const handleSelectAmrsDependant = async (e: any) => {
    const uuid = e.target.value;
    if (!uuid) {
      setAmrsRelationExists(false);
      setAmrsDependantData(null);
    }
    const response = await fetchAmrsPersonData(uuid);
    if (response && response.data) {
      setAmrsRelationExists(true);
      setAmrsDependantData((prev) => ({ ...prev, person: response.data }));
    } else {
      setAmrsRelationExists(false);
      setAmrsDependantData(null);
      const relationshipUuid = patientRelationships.find((v) => v.relatedPersonUuid === uuid);
      if (relationshipUuid && relationshipUuid.relationshipType) {
        setSelectedRelationship(relationshipUuid.relationshipType);
      }
    }
  };

  const getDependantName = () => {
    const name = hieDependant.result[0];
    return `${name.first_name} ${name.middle_name} ${name.last_name} (${hieDependant.relationship})`;
  };

  return (
    <>
      <AccordionItem title={getDependantName()}>
        <Row>
          <Column>
            <Select labelText={t('amrsDependants', 'AMRS dependants')} onChange={handleSelectAmrsDependant}>
              <SelectItem text={t('selectAmrsRelation', 'Select AMRS relation')} value="" />
              {patientRelationships.map((relationship) => (
                <SelectItem
                  text={`${relationship.display} (${relationship.relationshipType})`}
                  value={relationship.relatedPerson.uuid}
                />
              ))}
            </Select>
          </Column>
          {!amrsRelationExists ? (
            <Column>
              <Button onClick={() => handleCreateDependant(hieDependant)}>
                {t('createDependant', 'Create dependant in AMRS')}
              </Button>
            </Column>
          ) : null}
        </Row>
        <Row>
          <ClientDetailsComparison
            hieClient={hieDependant.result[0]}
            amrsClient={amrsDependantData}
            fromDependant={true}
          />
        </Row>
      </AccordionItem>
    </>
  );
};

export default ClientDependantComparisonRows;
