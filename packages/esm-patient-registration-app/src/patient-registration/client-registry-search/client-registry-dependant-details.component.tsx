import {
  Column,
  Row,
  Select,
  SelectItem,
  Button,
  ExpandableTile,
  TileAboveTheFoldContent,
  TileBelowTheFoldContent,
} from '@carbon/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  type CustomRelationship,
  HieIdentificationType,
  type AmrsPerson,
  type ClientRegistryDependantBody,
} from './client-registry.types';
import {
  createPerson,
  createRelationship,
  fetchAmrsPersonData,
  updateAmrsPersonIdentifiers,
} from './client-registry.resource';
import ClientRegistryPatientDetails from './client-registry-patient-details.component';
import {
  addressFields,
  getIdentifierUuid,
  getPatientRelationshipPayload,
  identifiersSyncFields,
  mapFieldValue,
  nameFields,
  patientObjFields,
  personSyncFields,
} from './map-client-registry-to-form-utils';

interface ClientRegistryDependantDetailsProps {
  hieDependants: Array<ClientRegistryDependantBody>;
  amrsPerson: AmrsPerson;
  patientRelationships: Array<CustomRelationship>;
}

interface ClientDependantTileProps {
  dependant: ClientRegistryDependantBody;
  patientRelationships: Array<CustomRelationship>;
  amrsPerson: AmrsPerson;
}

const ClientDependantTile: React.FC<ClientDependantTileProps> = ({ dependant, patientRelationships, amrsPerson }) => {
  const { t } = useTranslation();
  const [amrsRelationExists, setAmrsRelationExists] = useState(false);
  const [amrsDependantData, setAmrsDependantData] = useState<AmrsPerson>();
  const [selectedRelationship, setSelectedRelationship] = useState('');
  const locationUuid = '18c343eb-b353-462a-9139-b16606e6b6c2';

  const handleCreateDependant = async (dependantBody: ClientRegistryDependantBody) => {
    const syncFields = {};
    patientObjFields.forEach((field) => {
      let fieldArr = mapFieldValue(field, dependantBody.result[0], amrsPerson);
      const hieFieldValue = fieldArr[1];
      syncFields[field] = hieFieldValue;
    });

    // Person
    const patientPayload = {};
    const names = {};
    const addresses = {};
    const otherFields = {};
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
    Object.assign(patientPayload, otherFields, { addresses: [addresses] }, { names: [names] });
    const response = await createPerson(patientPayload);
    if (response && response.data) {
      const relationshipPayload = getPatientRelationshipPayload(amrsPerson, selectedRelationship, response.data.uuid);
      await createRelationship(relationshipPayload);
    }

    // Identifiers
    Object.entries(syncFields).forEach(async ([k, v]) => {
      if (identifiersSyncFields().includes(k)) {
        if (v) {
          const identifierUuid = getIdentifierUuid(HieIdentificationType[k]);
          const identifierPayload = {
            identifier: v,
            location: locationUuid,
            identifierType: identifierUuid,
          };
          await updateAmrsPersonIdentifiers(amrsPerson.uuid, identifierPayload);
        }
      }
    });
  };

  const handleSelectAmrsDependant = async (e: any) => {
    const uuid = e.target.value;
    const response = await fetchAmrsPersonData(uuid);
    if (response && response.data) {
      setAmrsRelationExists(true);
      setAmrsDependantData(response.data);
    } else {
      setAmrsRelationExists(false);
      setAmrsDependantData(null);
      const relationshipUuid = patientRelationships.find((v) => v.relatedPersonUuid === uuid);
      if (relationshipUuid && relationshipUuid.relationshipType) {
        setSelectedRelationship(relationshipUuid.relationshipType);
      }
    }
  };

  return (
    <ExpandableTile
      tileCollapsedIconText="Expand to view dependant details"
      tileExpandedIconText="Click to collapse dependant details">
      <TileAboveTheFoldContent>{dependant.relationship}</TileAboveTheFoldContent>
      <TileBelowTheFoldContent>
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
              <Button onClick={() => handleCreateDependant(dependant)}>
                {t('createDependant', 'Create dependant in AMRS')}
              </Button>
            </Column>
          ) : null}
        </Row>
        <Row>
          {amrsRelationExists ? (
            <ClientRegistryPatientDetails hieData={dependant.result[0]} amrsPerson={amrsDependantData} />
          ) : null}
        </Row>
      </TileBelowTheFoldContent>
    </ExpandableTile>
  );
};

const ClientRegistryDependantDetails: React.FC<ClientRegistryDependantDetailsProps> = ({
  hieDependants,
  amrsPerson,
  patientRelationships,
}) => {
  return (
    <div>
      {hieDependants.map((dependant) => (
        <ClientDependantTile
          dependant={dependant}
          amrsPerson={amrsPerson}
          patientRelationships={patientRelationships}
        />
      ))}
    </div>
  );
};

export default ClientRegistryDependantDetails;
