import React, { useContext } from "react";
import { useProfile } from "./customHooks";
import { saveSecretProfileValue } from "./gunSecrets";
import { AuthContext } from "./Auth";

function Profile() {
  const [profile, setProfile, save] = useProfile();
  const { gunUser } = useContext(AuthContext);

  const { email, name, epub } = profile;
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
          <input disabled value={epub} />
        </div>
        <div>
          <label>Name</label>
          <input
            value={name}
            onChange={e => setProfile({ name: e.target.value })}
          />
          <button onClick={addPubkeyName}>Add</button>
        </div>
        <div>
          <label>Email</label>
          <input
            value={email}
            onChange={e => setProfile({ email: e.target.value })}
          />
          <button onClick={addPubkeyEmail}>Add</button>
        </div>
        <button onClick={save}>Save</button>
      </form>
    </div>
  );
}
export default Profile;
