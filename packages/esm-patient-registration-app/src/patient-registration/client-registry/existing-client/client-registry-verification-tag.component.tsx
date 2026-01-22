import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@carbon/react';
import { age, usePatient } from '@openmrs/esm-framework';
import { Formik } from 'formik';
import ClientRegistryLookupSection from '../client-registry-search.component';
import { useTranslation } from 'react-i18next';

const ClientRegistryVerificationTag = () => {
  const { t } = useTranslation();
  const { patient } = usePatient();
  const [showCrBtn, setShowCrBtn] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [isClientVerified, setIsClientVerified] = useState(false);
  const initialFormValues = {};
  const [hasCR, setHasCR] = useState(false);

  useEffect(() => {
    if (patient && patient.birthDate) {
      const isDeceased = patient?.deceasedBoolean ?? true;
      if (!isDeceased) {
        setHasCR(patient.identifier.some((v) => v.type.text.includes('CR')));
        const ageArr = age(patient.birthDate).split(' ');
        if (ageArr.includes('yrs')) {
          const yrs = Number(ageArr[0]);
          setShowCrBtn(yrs > 17);
        }
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
      <Button
        kind="ghost"
        size="sm"
        style={{
          backgroundColor: hasCR ? '#008000' : '#0055a5',
          color: 'white',
          margin: '0px 10px',
          borderRadius: '10px',
          fontSize: '14px',
        }}
        onClick={openVerifyModal}>
        {hasCR ? t('updateFromCR', 'Updated from CR') : t('verifyCR', 'Verify CR')}
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
