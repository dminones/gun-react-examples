import React, { useContext, useEffect, useState } from "react";
import gundb from "./gundb";
import { saveSecretProfileValue, readSecretProfileValue } from "./gunSecrets";
import { AuthContext } from "./Auth";

function ViewProfile(props) {
  const { gunUser } = useContext(AuthContext);
  const pair = gunUser.pair();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const pubkey = props.match.params.pubkey;
  console.log("params", pubkey);

  const update = () => {
    readSecretProfileValue(gunUser, "email", pubkey).then(email =>
      setEmail(email)
    );
    readSecretProfileValue(gunUser, "name", pubkey).then(name => setName(name));
  };

  useEffect(() => {
    gundb
      .get("users")
      .get(pubkey)
      .get("profile")
      .on(update, { wait: 99 });
    update();
  }, []);

  return (
    <div>
      <h3>Profile</h3>
      <div>
        <label>Pubkey </label>
        <input disabled value={pair.epub} />
      </div>
      <div>
        <label>Name </label>
        <input disabled value={name} />
      </div>
      <div>
        <label>Email </label>
        <input disabled value={email} />
      </div>
    </div>
  );
}
export default ViewProfile;
