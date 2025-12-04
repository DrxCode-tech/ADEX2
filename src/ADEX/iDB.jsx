import { openDB } from "idb";

export const initDB = () => {
    return openDB("ADEXusers", 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains("users")) {
                db.createObjectStore("users"); // no keyPath → manual keys allowed
            }
        }
    });
};

export const addUser = async (userObj) => {
    localStorage.setItem("currentUser", JSON.stringify(userObj));

    const db = await initDB();
    const tx = db.transaction("users", "readwrite");

    await tx.store.put(userObj, "current");  // store using fixed key
    await tx.done;
};

export const getUser = async () => {
    const db = await initDB();
    const tx = db.transaction("users", "readonly");
    return await tx.store.get("current");
};

export const deleteUser = async () => {
    localStorage.removeItem("currentUser");

    const db = await initDB();
    const tx = db.transaction("users", "readwrite");
    await tx.store.delete("current");
    await tx.done;
};
