import { getItemFromCollection, updateDataInCollection } from "../../database";

const SETTINGS_COLLECTION = 'settings';

export async function GET(req: Request) {
  const instanceId = req.headers.get('Authorization');
  
  if (!instanceId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const settings = await getItemFromCollection({
    dataCollectionId: SETTINGS_COLLECTION,
    itemId: instanceId
  })

  return new Response(JSON.stringify(settings));
}

export async function POST(req: Request) {
  const instanceId = req.headers.get('Authorization');
  const settingsUpdate = await req.json();

  if (!instanceId) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    console.log('Updating settings for', instanceId, settingsUpdate);
    await updateDataInCollection({
      dataCollectionId: SETTINGS_COLLECTION,
      item: {
        _id: instanceId,
        data: settingsUpdate
      }
    });
    return new Response('Success');
  } catch (error) {
    console.error(`Error updating settings for ${instanceId}`, error);
    return new Response('Error', { status: 500 });
  }
}
