// This is a mock implementation of a collection of behavior directives.
// It is used to store the behavior directive for each instance of the app.
// In a real implementation, this would be stored in a database.

let behaviorDirectives: { [instanceId: string]: string } = {};

export function saveBehaviorDirective(instanceId: string, directive: string) {
  behaviorDirectives[instanceId] = directive;
}

export function getBehaviorDirective(instanceId: string) {
  return behaviorDirectives[instanceId];
}
