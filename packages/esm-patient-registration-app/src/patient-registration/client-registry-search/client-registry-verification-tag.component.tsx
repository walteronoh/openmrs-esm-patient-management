import React from 'react';
import { Button } from '@carbon/react';
import { showModal } from '@openmrs/esm-framework';
import ClientRegistryLookupSection from './client-registry-search.component';
import { Formik } from 'formik';
import { type RequestCustomOtpDto } from './client-registry.resource';
import ClientRegistryDetails from './client-registry-details.component';
// import { useInitialPatientRelationships } from '../section/patient-relationships/relationships.resource';

const ClientRegistryVerificationTag = () => {
  const handleClientRegistryVerification = () => {
    const dispose = showModal(
      'client-registry-verification-modal',
      {
        onConfirm: () => {
          dispose();
        },
        Component: CrFormikComponent,
        props: {
          forceClose: () => {
            dispose();
          },
        },
      },
      () => {},
    );
  };

  return (
    <Button kind="ghost" onClick={handleClientRegistryVerification}>
      Verify CR
    </Button>
  );
};

interface CrFormicComponentProps {
  forceClose?(): void;
}
const CrFormikComponent: React.FC<CrFormicComponentProps> = ({ forceClose }) => {
  const initialFormValues = {};

  const handleOnClientVerified = (payload: RequestCustomOtpDto) => {
    forceClose?.();
    const dispose = showModal(
      'client-registry-verification-modal',
      {
        onConfirm: () => {
          dispose();
        },
        Component: ClientRegistryDetails,
        props: { payload: payload },
      },
      () => {},
    );
  };

  return (
    <Formik initialValues={initialFormValues} onSubmit={null}>
      <ClientRegistryLookupSection onClientVerified={handleOnClientVerified} />
    </Formik>
  );
};

export default ClientRegistryVerificationTag;
