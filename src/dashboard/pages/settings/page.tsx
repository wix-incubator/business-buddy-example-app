import { useDashboard } from "@wix/dashboard-react";
import {
  Button,
  Card,
  EmptyState,
  FormField,
  InputArea,
  Loader,
  Page,
  SectionHeader,
} from "@wix/design-system";
import "@wix/design-system/styles.global.css";
import React from "react";
import { httpClient } from "@wix/essentials";
import { useMutation, useQuery } from "react-query";
import { withProviders } from "../../withProviders";

async function getSettings() {
  const data = await httpClient.fetchWithAuth(
    `${import.meta.env.BASE_API_URL}/settings`,
  );
  const settings = await data.json();
  return settings;
}

async function saveSettings(behaviorDirective: string) {
  return httpClient.fetchWithAuth(`${import.meta.env.BASE_API_URL}/settings`, {
    method: "POST",
    body: JSON.stringify({ behaviorDirective }),
  });
}

export default withProviders(function SettingsPage() {
  const { data, isLoading, isError } = useQuery("settings", getSettings);
  const [behaviorDirective, setBehaviorDirective] = React.useState(
    data?.behaviorDirective,
  );
  const { showToast } = useDashboard();

  const mutation = useMutation(
    async (newBehaviorDirective: string) => saveSettings(newBehaviorDirective),
    {
      onSuccess: () => {
        showToast({
          message: "Changes saved!",
          type: "success",
        });
      },
    },
  );

  if (isLoading) {
    return (
      <Page>
        <Page.Content>
          <Loader />
        </Page.Content>
      </Page>
    );
  }

  if (isError) {
    return (
      <EmptyState
        theme="page-no-border"
        title="We couldn't load settings"
        subtitle="Looks like there was a technical issue."
      />
    );
  }

  return (
    <Page>
      <Page.Header title="Behavior Settings" />
      <Page.Content>
        <Card>
          <Card.Header
            title="Behavior Directive"
            suffix={
              <Button
                size="small"
                onClick={() => {
                  mutation.mutate(behaviorDirective);
                }}
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? <Loader size="tiny" /> : "Save"}
              </Button>
            }
          ></Card.Header>
          <SectionHeader title="Give Business Buddy directives on how to answer your questions" />
          <Card.Content>
            <FormField label="Directive">
              <InputArea
                placeholder={
                  data?.behaviorDirective ??
                  "You always end your messages with a Spanish goodbye."
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
