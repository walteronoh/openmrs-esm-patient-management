import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import {
  type AmrsPerson,
  type ClientRegistrySearchRequest,
  type ClientRegistrySearchResponse,
  type RequestCustomOtpDto,
  type RequestCustomOtpResponse,
  type ValidateCustomOtpResponse,
  type ValidateHieCustomOtpDto,
} from './client-registry.types';

const HIE_BASE_URL = 'https://ngx.ampath.or.ke/hie';

async function postJson<T>(url: string, payload: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed with ${response.status}: ${errorText}`);
  }

  return response.json() as Promise<T>;
}

export async function requestCustomOtp(payload: RequestCustomOtpDto): Promise<RequestCustomOtpResponse> {
  const url = `${HIE_BASE_URL}/client/send-custom-otp`;
  const formattedPayload = {
    identificationNumber: payload.identificationNumber,
    identificationType: payload.identificationType,
    locationUuid: payload.locationUuid,
  };
  return postJson<RequestCustomOtpResponse>(url, formattedPayload);
}

export async function validateCustomOtp(payload: ValidateHieCustomOtpDto): Promise<ValidateCustomOtpResponse> {
  const url = `${HIE_BASE_URL}/client/validate-custom-otp`;
  const formattedPayload = {
    sessionId: payload.sessionId,
    otp: payload.otp,
    locationUuid: payload.locationUuid,
  };
  return postJson<ValidateCustomOtpResponse>(url, formattedPayload);
}

export async function fetchClientRegistryData(
  payload: ClientRegistrySearchRequest,
): Promise<ClientRegistrySearchResponse> {
  const url = `${HIE_BASE_URL}/client/search`;
  const formattedPayload = {
    identificationNumber: payload.identificationNumber,
    identificationType: payload.identificationType,
    locationUuid: payload.locationUuid,
  };
  return postJson<ClientRegistrySearchResponse>(url, formattedPayload);
}

export async function fetchAmrsPersonData(patientUuid: string) {
  return await openmrsFetch<AmrsPerson>(`${restBaseUrl}/patient/${patientUuid}?v=full`, {
    method: 'GET',
  }).catch((err) => {
    console.error(err);
  });
}

export async function updateAmrsPersonIdentifiers(patientUuid: string, payload: unknown) {
  return await openmrsFetch(`${restBaseUrl}/patient/${patientUuid}/identifier`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
  });
}

export async function updateAmrsPersonAttributes(patientUuid: string, payload: unknown) {
  return await openmrsFetch(`${restBaseUrl}/person/${patientUuid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
  });
}
