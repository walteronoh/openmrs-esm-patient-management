import React, { useEffect, useState } from 'react';
import { Button } from '@carbon/react';
import { age, usePatient } from '@openmrs/esm-framework';
import { Formik } from 'formik';
import ClientRegistryLookupSection from '../client-registry-search.component';

const ClientRegistryVerificationTag = () => {
  const { patient } = usePatient();
  const [showCrBtn, setShowCrBtn] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [isClientVerified, setIsClientVerified] = useState(false);
  const initialFormValues = {};

  useEffect(() => {
    if (patient && patient.birthDate) {
      const ageArr = age(patient.birthDate).split(' ');
      if (ageArr.includes('yrs')) {
        const yrs = Number(ageArr[0]);
        setShowCrBtn(yrs > 17);
      }
    }
  }, [patient]);

  const openVerifyModal = () => {
    setShowVerifyModal(true);
  };
  const closeVerifyModal = () => {
    setShowVerifyModal(false);
  };

  return showCrBtn ? (
    <>
      <Button kind="ghost" style={{ backgroundColor: 'purple', color: 'white' }} onClick={openVerifyModal}>
        Verify CR
      </Button>
      {showVerifyModal ? (
        <Formik enableReinitialize initialValues={initialFormValues} onSubmit={null}>
          <ClientRegistryLookupSection
            onClientVerified={() => setIsClientVerified(true)}
            onModalClose={closeVerifyModal}
            open={showVerifyModal}
            isNewClient={false}
          />
        </Formik>
      ) : (
        <></>
      )}
    </>
  ) : (
    <></>
  );
};

export default ClientRegistryVerificationTag;
