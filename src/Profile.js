import React, { useContext, useEffect, useState } from "react";
import { saveSecretProfileValue, readSecretProfileValue } from "./gunSecrets";
import { AuthContext } from "./Auth";
import { Link } from "react-router-dom";

function Profile() {
  const { gunUser } = useContext(AuthContext);
  const pair = gunUser.pair();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const update = () => {
    readSecretProfileValue(gunUser, "email").then(email => setEmail(email));
    readSecretProfileValue(gunUser, "name").then(name => setName(name));
  };

  useEffect(() => {
    gunUser.get("profile").on(update, { wait: 99 });
    update();
  }, []);
  const save = e => {
    e.preventDefault();
    console.log({ name, email });

    saveSecretProfileValue(gunUser, "email", email);
    saveSecretProfileValue(gunUser, "name", name);
  };
  const addPubkeyEmail = () => {
    const pubkey = prompt("Set pubkey");
    saveSecretProfileValue(gunUser, "email", email, pubkey);
  };
  const addPubkeyName = () => {
    const pubkey = prompt("Set pubkey");
    saveSecretProfileValue(gunUser, "name", name, pubkey);
  };
  return (
    <div>
      <h3>Profile</h3>
      <form onSubmit={e => e.preventDefault()}>
        <div>
          <label>Pubkey </label>
          <input disabled value={pair.epub} />
          <Link to={`/profile/${pair.epub}`}>Profile</Link>
        </div>
        <div>
          <label>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} />
          <button onClick={addPubkeyName}>Add</button>
        </div>
        <div>
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} />
          <button onClick={addPubkeyEmail}>Add</button>
        </div>
        <button onClick={save}>Save</button>
      </form>
    </div>
  );
}
export default Profile;
