import { openDB } from "idb";

export const initDB = () => {
    return openDB("ADEXusers", 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains("users")) {
                // Store with NO keyPath so we can set our own ID manually
                db.createObjectStore("users");
            }
        }
    });
};

export const addUser = async (userObj) => {
    localStorage.setItem("currentUser", JSON.stringify(userObj));

    const db = await initDB();
    const tx = db.transaction("users", "readwrite");

    // Always store the user under a fixed key
    await tx.store.put(userObj, "current");

    await tx.done;
};

export const getUser = async () => {
    const db = await initDB();
    return await db.get("users", "current");
};

export const deleteUser = async () => {
    localStorage.removeItem("currentUser");
    const db = await initDB();
    await db.delete("users", "current");
};
