import { showToast } from '@wix/dashboard-sdk';
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
import { useMutation, useQuery } from 'react-query';
import { fetchWithWixInstance } from '../../utils';
import { withProviders } from '../../withProviders';

export default withProviders(function SettingsPage() {
  const { data } = useQuery<{
    behaviorDirective: string;
  }>('settings', async () => fetchWithWixInstance(`settings`, 'GET'));

  const mutation = useMutation(
    async (newBehaviorDirective: string) =>
      fetchWithWixInstance(`settings`, 'POST', {
        behaviorDirective: newBehaviorDirective,
      }),
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
