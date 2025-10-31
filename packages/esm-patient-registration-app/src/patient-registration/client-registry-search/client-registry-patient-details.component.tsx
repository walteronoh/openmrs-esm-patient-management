import React, { useEffect, useMemo, useState } from 'react';
import { TableRow, TableCell, Checkbox, Table, TableHead, TableHeader, TableBody, Button, Row } from '@carbon/react';
import { type AmrsPerson, type ClientRegistryBody } from './client-registry.resource';

interface ClientRegistryPatientDetailsProps {
  hieData: ClientRegistryBody;
  amrsPerson: AmrsPerson;
}

interface GetTableDataRowProps {
  field: string;
  label: string;
  amrsPerson: string;
  hiePatient: string;
  onChange?(e: boolean, field: string, multiple: boolean): void;
  allChecked: boolean;
}

const TableDataRow: React.FC<GetTableDataRowProps> = ({
  field,
  label,
  amrsPerson,
  hiePatient,
  onChange,
  allChecked,
}) => {
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    onChange?.(allChecked, field, true);
    setChecked(allChecked);
  }, [onChange, allChecked, field]);

  return (
    <TableRow>
      <TableCell>{label}</TableCell>
      <TableCell>{amrsPerson}</TableCell>
      <TableCell>{hiePatient}</TableCell>
      <TableCell>
        <Checkbox
          id={`cbox-${field}`}
          onChange={(e) => {
            onChange(e.target.checked, field, false);
            setChecked(e.target.checked);
          }}
          checked={checked}
        />
      </TableCell>
    </TableRow>
  );
};

const ClientRegistryPatientDetails: React.FC<ClientRegistryPatientDetailsProps> = ({ hieData, amrsPerson }) => {
  const [syncFields, setSyncFields] = useState<string[]>([]);
  const [allChecked, setAllChecked] = useState(false);

  const handleFieldChange = (checked: boolean, field: string, multiple: boolean) => {
    if (multiple) {
      if (checked) {
        setSyncFields((prev) => [...prev, field]);
      } else {
        setSyncFields([]);
      }
    } else {
      if (checked) {
        setSyncFields([...syncFields, field]);
      } else {
        setSyncFields((prev) => prev.filter((p) => p !== field));
      }
    }
  };

  const handleCheckAll = (e) => {
    setAllChecked(e.target.checked);
  };

  const handleSync = () => {
    // To be implemented
  };

  return (
    <>
      <Row>{syncFields.length ? <Button onClick={handleSync}>Sync data</Button> : null}</Row>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Field</TableHeader>
            <TableHeader>AMRS Person</TableHeader>
            <TableHeader>HIE Patient</TableHeader>
            <TableHeader>
              <Checkbox id="cbox-multiple" onChange={(e) => handleCheckAll(e)} />
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableDataRow
            label="SHA number"
            field="SHA_Number"
            amrsPerson=""
            hiePatient=""
            onChange={handleFieldChange}
            allChecked={allChecked}
          />
          <TableDataRow
            label="Household number"
            field="Household_Number"
            amrsPerson=""
            hiePatient=""
            onChange={handleFieldChange}
            allChecked={allChecked}
          />
          <TableDataRow
            label="Cr"
            field="id"
            amrsPerson="id"
            hiePatient={hieData.id ?? ''}
            onChange={handleFieldChange}
            allChecked={allChecked}
          />
          <TableDataRow
            label="National id"
            field="identification_number"
            amrsPerson=""
            hiePatient={hieData.identification_number ?? ''}
            onChange={handleFieldChange}
            allChecked={allChecked}
          />
          <TableDataRow
            label="First name"
            field="first_name"
            amrsPerson={amrsPerson?.person.preferredName.givenName ?? ''}
            hiePatient={hieData.first_name ?? ''}
            onChange={handleFieldChange}
            allChecked={allChecked}
          />
          <TableDataRow
            label="Middle name"
            field="middle_name"
            amrsPerson={amrsPerson?.person.preferredName.middleName ?? ''}
            hiePatient={hieData.middle_name ?? ''}
            onChange={handleFieldChange}
            allChecked={allChecked}
          />
          <TableDataRow
            label="Last name"
            field="last_name"
            amrsPerson={amrsPerson?.person.preferredName.familyName ?? ''}
            hiePatient={hieData.last_name ?? ''}
            onChange={handleFieldChange}
            allChecked={allChecked}
          />
          <TableDataRow
            label="Gender"
            field="gender"
            amrsPerson={amrsPerson?.person.gender ?? ''}
            hiePatient={hieData.gender ?? ''}
            onChange={handleFieldChange}
            allChecked={allChecked}
          />
          <TableDataRow
            label="Date of birth"
            field="date_of_birth"
            amrsPerson={amrsPerson?.person.birthdate ?? ''}
            hiePatient={hieData.date_of_birth ?? ''}
            onChange={handleFieldChange}
            allChecked={allChecked}
          />
          <TableDataRow
            label="Citizenship"
            field="citizenship"
            amrsPerson=""
            hiePatient={hieData.citizenship ?? ''}
            onChange={handleFieldChange}
            allChecked={allChecked}
          />
          <TableDataRow
            label="Country"
            field="country"
            amrsPerson={amrsPerson?.person.preferredAddress.country ?? ''}
            hiePatient={hieData.country ?? ''}
            onChange={handleFieldChange}
            allChecked={allChecked}
          />
          <TableDataRow
            label="County"
            field="county"
            amrsPerson={amrsPerson?.person.preferredAddress.countyDistrict ?? ''}
            hiePatient={hieData.county ?? ''}
            onChange={handleFieldChange}
            allChecked={allChecked}
          />
          <TableDataRow
            label="Sub county"
            field="sub_county"
            amrsPerson={amrsPerson?.person.preferredAddress.stateProvince ?? ''}
            hiePatient={hieData.sub_county ?? ''}
            onChange={handleFieldChange}
            allChecked={allChecked}
          />
          <TableDataRow
            label="Ward"
            field="ward"
            amrsPerson=""
            hiePatient={hieData.ward ?? ''}
            onChange={handleFieldChange}
            allChecked={allChecked}
          />
          <TableDataRow
            label="Village estate"
            field="village_estate"
            amrsPerson={amrsPerson?.person.preferredAddress.cityVillage ?? ''}
            hiePatient={hieData.village_estate ?? ''}
            onChange={handleFieldChange}
            allChecked={allChecked}
          />
          <TableDataRow
            label="Longitude"
            field="longitude"
            amrsPerson={amrsPerson?.person.preferredAddress.longitude ?? ''}
            hiePatient={hieData.longitude ?? ''}
            onChange={handleFieldChange}
            allChecked={allChecked}
          />
          <TableDataRow
            label="Latitude"
            field="latitude"
            amrsPerson={amrsPerson?.person.preferredAddress.latitude ?? ''}
            hiePatient={hieData.latitude ?? ''}
            onChange={handleFieldChange}
            allChecked={allChecked}
          />
        </TableBody>
      </Table>
    </>
  );
};

export default ClientRegistryPatientDetails;
