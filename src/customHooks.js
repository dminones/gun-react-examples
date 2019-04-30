import Gun from "gun/gun";
import { AuthContext } from "./Auth";

import { useContext, useState, useEffect, useDebugValue } from "react";
import { saveSecretProfileValue, readSecretProfileValue } from "./gunSecrets";

export const useGunHash = node => {
  const [state, setState] = useState({});
  const [updateCount, setUpdateCount] = useState(0);
  useDebugValue(`updated ${updateCount} times`);

  const put = (key, data) => node.get(key).put(data);
  useEffect(() => {
    const update = data => {
      setState(data);
      // To force re-render
      setUpdateCount(updateCount => updateCount + 1);
    };
    node.open(update, { wait: 99 });
  }, []);

  const del = key => {
    put(key, null);
  };
  return [state, put, del];
};

const objectToArray = obj =>
  Object.keys(obj)
    .filter(key => obj[key])
    .map(key => obj[key])
    .sort((a, b) => a._index > b._index);

export const useGunArray = node => {
  const [state, setState] = useState([]);
  const [updateCount, setUpdateCount] = useState(0);
  useDebugValue(`updated ${updateCount} times`);

  state.push = data => node.get(state.length).put(data);
  state.pop = () => node.get(state.length - 1).put(null);

  useEffect(() => {
    const update = data => {
      const arr = objectToArray(data);
      console.log({ arr });
      setState(arr);
      // To force re-render
      setUpdateCount(updateCount => updateCount++);
    };
    node.open(update, { wait: 99 });
  }, []);

  const setArray = arr => {
    node.load(
      nodeData => {
        Object.keys(nodeData).forEach(key => node.get(key).put(null));
        arr.forEach((arrItem, index) => {
          node.get(index).put(arrItem);
        });
      },
      { wait: 99 }
    );
  };
  return [state, setArray];
};

export const useProfile = () => {
  const { gunUser } = useContext(AuthContext);
  console.log({ gunUser });
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  // const [epub, setEpub] = useState("");
  // const [alias, setAlias] = useState("");
  const { epub } = gunUser.pair();
  const alias = gunUser.alias;
  const update = () => {
    readSecretProfileValue(gunUser, "email").then(email => setEmail(email));
    readSecretProfileValue(gunUser, "name").then(name => setName(name));
  };

  useEffect(() => {
    gunUser.open(user => {
      console.log("open user", user);
      // setEpub(user.epub);
      // setAlias(user.alias);
      update();
    });

    //gunUser.get("profile").on(update, { wait: 99 });
    update();
  }, []);
  const save = e => {
    e.preventDefault();
    console.log({ name, email });

    saveSecretProfileValue(gunUser, "email", email);
    saveSecretProfileValue(gunUser, "name", name);
  };
  const profile = { email, name, epub, alias };
  console.log({ profile }, "customHooks");
  const setProfile = profileObject => {
    if (profileObject.email) setEmail(profileObject.email);
    if (profileObject.name) setName(profileObject.name);
  };
  return [profile, setProfile, save];
};
