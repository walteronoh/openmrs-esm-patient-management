import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Button } from '@carbon/react';
import { type HieClient } from '../types';
import ClientDependantList from './client-dependants/list/client-depandants.component';
import ClientDetails from './client-details/client-details';

interface NewClientTabProps {
  client: HieClient;
  useHieData: () => void;
}

const NewClientTab: React.FC<NewClientTabProps> = ({ client, useHieData }) => {
  return (
    <>
      <Tabs>
        <TabList contained>
          <Tab>Patient</Tab>
          <Tab>Dependants</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>{client ? <ClientDetails client={client} /> : <></>}</TabPanel>
          <TabPanel>{client.dependants ? <ClientDependantList hieDependants={client.dependants} /> : <></>}</TabPanel>
        </TabPanels>
      </Tabs>
      <Button onClick={useHieData}>Use Data</Button>
    </>
  );
};

export default NewClientTab;
