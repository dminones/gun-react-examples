import Gun from "gun/gun";
import gun from "./gundb";
export const saveSecretProfileValue = async (gunUser, key, data, pubkey) => {
  const pair = gunUser.pair();
  const epub = pubkey || pair.epub;
  console.log({ pubkey, epub });

  const secretPair = await Gun.SEA.secret(epub, pair);
  console.log({ epub, secretPair });
  const encrypted = await Gun.SEA.encrypt(data, secretPair);
  if (!encrypted) {
    console.error(Gun.SEA.err);
  }

  gunUser
    .get("profile")
    .get(key)
    .get(epub)
    .put(encrypted);
  gun
    .get("users")
    .get(pair.epub)
    .put(gunUser.get("profile"));
};

export const readSecretProfileValue = async (gunUser, key, pubkey) => {
  const pair = gunUser.pair();
  const epub = pubkey || pair.epub;

  const value = await gun
    .get("users")
    .get(epub)
    .get(key)
    .get(pair.epub);
  const secretPair = await Gun.SEA.secret(epub, pair);
  const decryptedValue = await Gun.SEA.decrypt(value, secretPair);
  if (!decryptedValue) {
    console.error(Gun.SEA.err);
  }

  return decryptedValue;
};
