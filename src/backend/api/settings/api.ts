import { appInstances } from "@wix/app-management";
import { getBehaviorDirective, saveBehaviorDirective } from "../../database";

export async function GET() {
  try {
    const { instance } = await appInstances.getAppInstance();

    if (!instance?.instanceId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const behaviorDirective = await getBehaviorDirective(instance.instanceId);

    return Response.json({ behaviorDirective });
  } catch (error) {
    console.log(`Error getting settings for an instance`, error);
    return Response.error();
  }
}

export async function POST(req: Request) {
  const settingsUpdate = await req.json();

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
    return Response.error();
  }
}
