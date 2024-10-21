import { getBehaviorDirective, saveBehaviorDirective } from "../../database";
import { appInstances } from '@wix/app-management';

export async function GET(req: Request) {
  const instanceId = req.headers.get('Authorization');

  if (!instanceId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const settings = await getBehaviorDirective()
  return new Response(JSON.stringify(settings));
}

export async function POST(req: Request) {
  const settingsUpdate = await req.json();
  const { instance } = await appInstances.getAppInstance();
  const { instanceId } = instance;
  
  if (!instanceId) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    console.log('Updating settings for', instanceId, settingsUpdate);
    await saveBehaviorDirective(settingsUpdate);
    return new Response('Success');
  } catch (error) {
    console.error(`Error updating settings for ${instanceId}`, error);
    return new Response('Error', { status: 500 });
  }
}
