import { appInstances } from '@wix/app-management';

// This is a mock implementation of a collection of behavior directives.
// It is used to store the behavior directive for each instance of the app.

export async function getBehaviorDirective() {
  const { instance } = await appInstances.getAppInstance();
  return `This is the behavior directive of intanceId: ${instance.instanceId}. In a real implementation, this would be stored in a database.`
}

export async function saveBehaviorDirective(directive) {
  // store data for this instance id
  console.log(`Storing directive: ${directive}`)
}