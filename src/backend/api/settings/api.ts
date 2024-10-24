import { getBehaviorDirective, saveBehaviorDirective } from "../../database";
import { appInstances } from "@wix/app-management";

export async function GET() {
  try {
    const { instance } = await appInstances.getAppInstance();

    if (!instance?.instanceId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const behaviorDirective = await getBehaviorDirective(instance.instanceId);

    return new Response(JSON.stringify({ behaviorDirective }));
  } catch (error) {
    console.log(`Error getting settings for an instance`, error);
    return new Response("Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const settingsUpdate = await req.json();
  console.log({ settingsUpdate });

  try {
    const { instance } = await appInstances.getAppInstance();

    if (!instance?.instanceId) {
      return new Response("Unauthorized", { status: 401 });
    }

    console.log("Updating settings for", instance.instanceId, settingsUpdate);
    await saveBehaviorDirective(instance.instanceId, settingsUpdate);
    return new Response("Success");
  } catch (error) {
    console.error("Error updating settings", error);
    return new Response("Error", { status: 500 });
  }
}
