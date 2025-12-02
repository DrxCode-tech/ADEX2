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

/*function autoLoginIfStored() {
      const local = DB.getItem('currentUser') ;
      let localResult = local ? JSON.parse(local) : null;
      console.log(localResult);
      const request = indexedDB.open('AdexUsers',2);
      request.onupgradeneeded = (e)=>{
        const db = e.target.result;
        if(!db.objectStoreNames.contains('users')){
          db.createObjectStore('users');
          console.log('users created successfully')
        }
      }
      request.onsuccess = function (e) {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('users') && !localResult) return console.log('users not found!');
        const tx = db.transaction('users', 'readonly');
        const store = tx.objectStore('users');
        const getUser = store.get('currentUser');

        getUser.onsuccess = () => {
          if (getUser.result) {
            showSpinner(`${getUser.result.name || 'User'} logging in...`);
            console.log(getUser.result);
            setTimeout(() => window.location.href = 'V3ADEX.html', 5000);
            
          }
          else if(localResult){
            showSpinner(`${localResult.name || 'User'} logging in...`);
            console.log(localResult);
            setTimeout(() => window.location.href = 'V3ADEX.html', 5000);
          }
          db.close();
        };
        getUser.onerror = (e)=>{
          if(localResult){
            showSpinner(`${localResult.name || 'User'} logging in...`);
            setTimeout(() => window.location.href = 'V3ADEX.html', 5000);
            console.log('error occur in indexedDB...fetch data from local');
          }else{
            console.log('error occur in indexedDB');
            return;
          }
          db.close();
        }
      };
      request.onerror = (e)=>{
        if(localResult){
          showSpinner(`${localResult.name || 'User'} logging in...`);
          setTimeout(() => window.location.href = 'V3ADEX.html', 5000);
          console.log('onupgradeneeded error occur ..but fetched successfully from localStorage');
          return;
        }
        console.log('onupgradeneeded error occured');
      }
    }
    
    autoLoginIfStored();
  </script>
</body>
</html>

*/