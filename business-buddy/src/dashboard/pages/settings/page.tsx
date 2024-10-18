import { useDashboard } from '@wix/dashboard-react';
import {
  Button,
  Card,
  FormField,
  InputArea,
  Loader,
  Page,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import React from 'react';
import { httpClient } from '@wix/essentials';
import { useMutation, useQuery } from 'react-query';
import { withProviders } from '../../withProviders';

async function getSettings() {
  const data = await httpClient.fetchWithAuth(`${import.meta.env.BASE_API_URL}/settings`);
  return data.json();
}

async function saveSettings(behaviorDirective: string) {
  console.log({ behaviorDirective });
  return httpClient.fetchWithAuth(`${import.meta.env.BASE_API_URL}/settings`, {
    method: 'POST',
    body: JSON.stringify({ behaviorDirective }),
  });
}

export default withProviders(function SettingsPage() {
  const { data } = useQuery('settings', getSettings);

  console.log('render', {data})

  const { showToast } = useDashboard();

  const mutation = useMutation(
    async (newBehaviorDirective: string) =>
      saveSettings(newBehaviorDirective),
    {
      onSuccess: () => {
        showToast({
          message: 'Changes saved!',
          type: 'success',
        });
      },
    }
  );

  const [behaviorDirective, setBehaviorDirective] = React.useState('');

  return (
    <Page>
      <Page.Header title='Behavior Settings' />
      <Page.Content>
        <Card>
          <Card.Header
            title='Behavior Directive'
            suffix={
              <Button
                size='small'
                onClick={() => {
                  mutation.mutate(behaviorDirective);
                }}
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? <Loader size='tiny' /> : 'Save'}
              </Button>
            }
          ></Card.Header>
          <Card.Subheader title='Give Business Buddy directives on how to answer your questions' />
          <Card.Content>
            <FormField label='Directive'>
              <InputArea
                placeholder={
                  data?.behaviorDirective ??
                  'You always end your messages with a Spanish goodbye.'
                }
                rows={4}
                maxLength={300}
                hasCounter
                resizable
                value={behaviorDirective}
                onChange={(e) => setBehaviorDirective(e.target.value)}
              />
            </FormField>
          </Card.Content>
        </Card>
      </Page.Content>
    </Page>
  );
});
