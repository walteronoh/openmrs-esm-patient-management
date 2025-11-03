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
      address7: string;
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
    attributes: Array<Attributes>;
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
  identifier: string;
  identifierType: {
    uuid: string;
    display: string;
  };
}

export interface Attributes {
  uuid: string;
  display: string;
  value: {
    uuid: string;
    display: string;
  };
  attributeType: {
    uuid: string;
    display: string;
  };
}

export type ClientRegistrySearchResponse = Array<ClientRegistryBody>;

export enum HieIdentificationType {
  NationalID = 'National ID',
  SHANumber = 'SHA Number',
  HouseholdNumber = 'Household Number',
  RefugeeID = 'Refugee ID',
  AlienID = 'Alien ID',
  MandateNumber = 'Mandate Number',
  Cr = 'id',
  TemporaryDependantID = 'Temporary Dependant ID',
}

const HOUSE_HOLD_NUMBER_UUID = 'bb74b20e-dcee-4f59-bdf1-2dffc3abf106';
const SHA_UUID = 'cf5362b2-8049-4442-b3c6-36f870e320cb';
const CLIENT_REGISTRY_NO_UUID = 'e88dc246-3614-4ee3-8141-1f2a83054e72';
const NATIONAL_ID_UUID = '58a47054-1359-11df-a1f1-0026b9348838';
const PROVIDER_NATIONAL_ID_UUID = '4550df92-c684-4597-8ab8-d6b10eabdcfb';
const REFUGEE_ID_UUID = '465e81af-8d69-47e9-9127-53a94adc75fb';
const MANDATE_NUMBER_UUID = 'aae2d097-20ba-43ca-9b71-fd8296068f39';
const ALIEN_ID_UUID = '12f5b147-3403-4a73-913d-7ded9ffec094';
const TEMPORARY_DEPENDANT_ID_UUID = 'a3d34214-93e8-4faf-bf4d-0272eee079eb';
const AMRS_UNIVERSAL_ID_UUID = '58a4732e-1359-11df-a1f1-0026b9348838';
const UPI_NUMBER_UUID = 'cba702b9-4664-4b43-83f1-9ab473cbd64d';

export const IdentifierTypesUuids = {
  HOUSE_HOLD_NUMBER_UUID,
  SHA_UUID,
  CLIENT_REGISTRY_NO_UUID,
  NATIONAL_ID_UUID,
  PROVIDER_NATIONAL_ID_UUID,
  REFUGEE_ID_UUID,
  MANDATE_NUMBER_UUID,
  ALIEN_ID_UUID,
  TEMPORARY_DEPENDANT_ID_UUID,
  AMRS_UNIVERSAL_ID_UUID,
  UPI_NUMBER_UUID,
};
