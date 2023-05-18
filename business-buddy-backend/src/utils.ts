import { createHmac } from "crypto";
import express from "express";

export function parseInstance(
  instance: string,
  appSecret: string
): {
  instanceId: string;
  appDefId: string;
  signDate: string;
  uid: string;
  permissions: "OWNER";
  demoMode: boolean;
  siteOwnerId: string;
  siteMemberId: string;
  expirationDate: string;
  loginAccountId: string;
  pai: null;
  lpai: null;
} | null {
  var parts = instance.split("."),
    hash = parts[0],
    payload = parts[1];

  if (!payload) {
    return null;
  }

  if (!validateInstance(hash, payload, appSecret)) {
    console.log("Provided instance is invalid: " + instance);
    return null;
  }

  return JSON.parse(base64Decode(payload, "utf8"));
}

function validateInstance(hash: string, payload: string, secret: string) {
  if (!hash) {
    return false;
  }

  hash = base64Decode(hash);

  var signedHash = createHmac("sha256", secret)
    .update(payload)
    .digest("base64");

  return hash === signedHash;
}

function base64Decode(input: string, encoding: "base64" | "utf8" = "base64") {
  return Buffer.from(
    input.replace(/-/g, "+").replace(/_/g, "/"),
    "base64"
  ).toString(encoding);
}

export function authorizeWixRequest(req: express.Request) {
  const authorization = req.headers.authorization;
  if (!authorization) throw new Error("No authorization header");
  const instance = parseInstance(
    authorization,
    process.env.WIX_APP_SECRET as string
  );
  if (!instance) throw new Error("Invalid instance");
  return instance;
}
