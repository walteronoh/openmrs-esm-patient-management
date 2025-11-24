import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ModalBody, ModalFooter, ModalHeader, Select, Form, TextInput, SelectItem } from '@carbon/react';

interface ClientRegistryVerificationPropsModal {
  close(): void;
  Component: React.FC;
  props: object;
}

const ClientRegistryVerificationModal: React.FC<ClientRegistryVerificationPropsModal> = ({
  close,
  Component,
  props,
}) => {
  const { t } = useTranslation();

  const registerOnAfyaYangu = () => {
    window.open('https://afyayangu.go.ke/', '_blank');
  };

  return (
    <>
      <ModalHeader closeModal={close} title={t('hieClientVerificationTitle', 'HIE Client Verification')} />
      <ModalBody>
        <Component {...props} />
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" size="lg" onClick={close}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button kind="primary" size="lg" onClick={() => registerOnAfyaYangu()}>
          {t('registerOnAfyaYangu', 'Register on Afya Yangu')}
        </Button>
      </ModalFooter>
    </>
  );
};

export default ClientRegistryVerificationModal;
