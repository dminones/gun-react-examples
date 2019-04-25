import Gun from "gun/gun";
import "gun/sea";
import "gun/lib/path";
import "gun/lib/open.js";
import "gun/lib/load.js";
const initGunDB = () => {
  if (!global.gun) {
    if (process.env.NODE_ENV === "test") {
      global.gun = Gun();
    } else {
      global.gun = Gun(["http://localhost:8081/gun"]);
    }

    const gunUser = global.gun.user();
    gunUser.create("bob", "bob", ackBob => {
      gunUser.create("alice", "alice", ackAlice =>
        console.log("registered...", ackAlice, ackBob)
      );
    });

    console.log("Initialized gundb");
    var sea = Gun.SEA;
    sea.pair().then(pair => console.log({ pair }));
  }
  return global.gun;
};

export default initGunDB();
