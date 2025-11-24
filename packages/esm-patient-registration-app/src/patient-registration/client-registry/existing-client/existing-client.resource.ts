import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { type AmrsClient } from './types';
import { mapAmrsPatientRelationship } from './mapper-utils';

export async function fetchAmrsPatientData(patientUuid: string) {
  return await openmrsFetch<AmrsClient>(`${restBaseUrl}/patient/${patientUuid}?v=full`, {
    method: 'GET',
  }).catch((err) => {
    console.error(err);
  });
}

export async function updateAmrsPersonIdentifiers(
  patientUuid: string,
  identifierUuid: string,
  payload: unknown,
  fromDependant = false,
) {
  const resource = fromDependant ? 'person' : 'patient';
  return await openmrsFetch(`${restBaseUrl}/${resource}/${patientUuid}/identifier/${identifierUuid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
  });
}

export async function fetchAmrsPersonData(personUuid: string) {
  return await openmrsFetch(`${restBaseUrl}/person/${personUuid}?v=full`, {
    method: 'GET',
  }).catch((err) => {
    console.error(err);
  });
}

export async function updatePerson(patientUuid: string, payload: unknown) {
  return await openmrsFetch<AmrsClient>(`${restBaseUrl}/person/${patientUuid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
  });
}

export async function createPerson(payload: unknown) {
  return await openmrsFetch<AmrsClient>(`${restBaseUrl}/person`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
  });
}

export async function createRelationship(payload: unknown) {
  return await openmrsFetch(`${restBaseUrl}/relationship`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
  });
}

export async function getRelationships(patientUuid: string) {
  const response = await openmrsFetch(`${restBaseUrl}/relationship?person=${patientUuid}&v=full`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response && response.data) {
    return mapAmrsPatientRelationship(patientUuid, response.data.results);
  }
  return [];
}
