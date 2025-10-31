import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';

const HIE_BASE_URL = 'https://ngx.ampath.or.ke/hie';

export type RequestCustomOtpDto = {
  identificationNumber: string | number;
  identificationType: string;
  locationUuid: string;
};

export interface RequestCustomOtpResponse {
  message: string;
  sessionId: string;
  maskedPhone: string;
}

export interface ValidateHieCustomOtpDto {
  sessionId: string;
  otp: number | string;
  locationUuid: string;
}

export interface ValidateCustomOtpResponse {
  message: string;
  isValid?: boolean;
}

export type ClientRegistrySearchRequest = {
  identificationNumber: string | number;
  identificationType: string;
  locationUuid: string;
};

export type ClientRegistryBody = {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  other_identifications: Array<{
    identification_number: string;
    identification_type: string;
  }>;
  dependants: Array<unknown>;
  citizenship: string;
  email: string;
  country: string;
  county: string;
  sub_county: string;
  ward: string;
  village_estate: string;
  building_house_no: string;
  latitude: string;
  longitude: string;
  identification_number: string;
};

export interface AmrsPerson {
  uuid: string;
  identifiers: Identifier[];
  display: string;
  person: {
    uuid: string;
    display: string;
    gender: string;
    age: number;
    birthdate: string;
    birthdateEstimated: boolean;
    dead: boolean;
    deathDate?: any;
    causeOfDeath?: any;
    preferredAddress: {
      address1: string;
      address2: string;
      address3: string;
      address4: string;
      address5: string;
      address6: string;
      cityVillage: string;
      country: string;
      postalCode: string;
      stateProvince: string;
      countyDistrict: string;
      latitude: string;
      longitude: string;
    };
    preferredName: {
      display: string;
      uuid: string;
      givenName: string;
      middleName: string;
      familyName: string;
    };
    attributes: any[];
    voided: boolean;
    birthtime?: any;
    deathdateEstimated: boolean;
    resourceVersion: string;
  };
  attributes: { value: string; attributeType: { uuid: string; display: string } }[];
  voided: boolean;
}

export interface Address {
  preferred: boolean;
  address1: string;
  cityVillage: string;
  country: string;
  postalCode: string;
  stateProvince: string;
}

export interface Identifier {
  uuid: string;
  display: string;
}

export type ClientRegistrySearchResponse = Array<ClientRegistryBody>;

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
