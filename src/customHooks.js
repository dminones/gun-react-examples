import Gun from "gun/gun";

import { useState, useEffect, useDebugValue } from "react";

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

export const useGunUserNode = gunUser => {
  const pair = gunUser.pair();

  const node = gunUser.get("profile");
  const [state, setState] = useState({});
  const [count, setCount] = useState(0);
  console.log({ state });
  useDebugValue(`updated ${count} times`);
  // const putOnNode = node => async (data, putPath) => {
  //   const nextNode = putPath ? node.path(putPath) : node;
  //   if (typeof data === "object" && data !== null) {
  //     Object.keys(data).forEach(key => putOnNode(nextNode)(data[key], key));
  //   } else {
  //     const encrypted = await Gun.SEA.encrypt(
  //       data,
  //       await Gun.SEA.secret(pair.epub, pair)
  //     );
  //     nextNode.put(encrypted);
  //   }
  // };

  // const put = putOnNode(node);

  useEffect(() => {
    const update = data => {
      console.log({ data });
      Object.keys(data).forEach(async key => {
        const value = data[key];
        const decryptedValue = await Gun.SEA.decrypt(
          value,
          await Gun.SEA.secret(pair.epub, pair)
        );
        //const decryptedValue = await node.get(key).decrypt();
        console.log({ pair, value, decryptedValue });
        setState({ ...state, [key]: decryptedValue });
      });

      // To force re-render
      setCount(count => count + 1);
    };
    const subscribe = () => {
      // node.open(update);
      node.on(update, { wait: 99 });
    };
    subscribe();
  }, []);

  // const del = key => {
  //   put(key, null);
  //   node.load(data => setState(data));
  // };
  return [state];
};
