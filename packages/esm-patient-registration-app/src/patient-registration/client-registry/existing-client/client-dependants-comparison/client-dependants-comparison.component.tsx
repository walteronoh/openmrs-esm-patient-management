import { Accordion } from '@carbon/react';
import React from 'react';
import { type ClientDependantsComparisonProps } from '../types';
import ClientDependantComparisonRows from './dependant-comparison-rows.component';

const ClientDependantsComparison: React.FC<ClientDependantsComparisonProps> = ({
  hieDependants,
  amrsClient,
  patientRelationships,
}) => {
  return (
    <div>
      <Accordion size="lg">
        {hieDependants.map((dependant) => (
          <ClientDependantComparisonRows
            hieDependant={dependant}
            amrsClient={amrsClient}
            patientRelationships={patientRelationships}
          />
        ))}
      </Accordion>
    </div>
  );
};

export default ClientDependantsComparison;
