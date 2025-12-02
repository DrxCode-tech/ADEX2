import { openDB } from "idb";

export const initDB = () => {
    return openDB("ADEXusers", 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains("users")) {
                db.createObjectStore("users", { keyPath: "id", autoIncrement: true });
            }
        }
    });
}

export const addUser = async (userObj) => {
    localStorage.setItem('currentUser', JSON.stringify(Array.from(Object.entries(userObj))));
    const db = await initDB();
    const tx = db.transaction("users", "readwrite");
    const store = tx.objectStore("users");
    await store.add(userObj);
    await tx.done;
}