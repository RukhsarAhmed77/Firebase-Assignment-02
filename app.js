// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    getDoc, 
    setDoc, 
    deleteDoc 
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBSCrZtF_ukhztYr673W-YtspekvHo3trg",
    authDomain: "my-first-project-5dba2.firebaseapp.com",
    projectId: "my-first-project-5dba2",
    storageBucket: "my-first-project-5dba2.firebasestorage.app",
    messagingSenderId: "402032367468",
    appId: "1:402032367468:web:bd10e779f48bf644224549"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const firstInput = document.querySelector("#first_input");
const secondInput = document.querySelector("#second_input");
const emailInput = document.querySelector("#email_input");
const addUser = document.querySelector("#add_data");
const userList = document.querySelector("#user_list");

addUser.addEventListener("click", addUserToDB);

const usersCollection = collection(db, "users");

getUserDataFromDB();

async function addUserToDB() {
    try {
        const docRef = await addDoc(usersCollection, {
            first: firstInput.value,
            last: secondInput.value,
            email: emailInput.value,
        });

        firstInput.value = "";
        secondInput.value = "";
        emailInput.value = "";
        getUserDataFromDB();
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

async function getUserDataFromDB() {
    const querySnapshot = await getDocs(usersCollection);
    userList.innerHTML = `
        <tr class="table_head">
            <th>Fullname</th>
            <th>Email</th>
            <th colspan="2">Action</th>
        </tr>
    `;

    querySnapshot.forEach((doc) => {
        const { first, last, email } = doc.data();
        const userInfo = `
        <tr class="users">
            <td>${first} ${last}</td>
            <td>${email}</td>
            <td><button class="action_btn" onclick="updateData('${doc.id}')">Update</button></td>
            <td><button class="action_btn" onclick="deleteUser('${doc.id}')">Delete</button></td>
        </tr>
        `;
        userList.innerHTML += userInfo;
    });
}

window.deleteUser = async function (id) {
    try {
        await deleteDoc(doc(db, "users", id));
        getUserDataFromDB();
    } catch (e) {
        console.error("Error deleting document: ", e);
    }
};

window.updateData = async function (id) {
    try {
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const { first, last, email } = docSnap.data();
            firstInput.value = first;
            secondInput.value = last;
            emailInput.value = email;

            addUser.textContent = "Update User";
            addUser.removeEventListener("click", addUserToDB);

            addUser.addEventListener("click", async function updateUser() {
                try {
                    await setDoc(docRef, {
                        first: firstInput.value,
                        last: secondInput.value,
                        email: emailInput.value,
                    });

                    console.log("Document updated successfully!");

                    firstInput.value = "";
                    secondInput.value = "";
                    emailInput.value = "";
                    addUser.textContent = "Add User";
                    addUser.removeEventListener("click", updateUser);
                    addUser.addEventListener("click", addUserToDB);

                    getUserDataFromDB();
                } catch (e) {
                    console.error("Error updating document: ", e);
                }
            });
        } else {
            console.error("No such document!");
        }
    } catch (e) {
        console.error("Error fetching document for update: ", e);
    }
};

document.addEventListener("contextmenu", (e) => e.preventDefault() );

// document.addEventListener("keydown", (e) => {
//     if (
//         (e.key === "F12") ||
//         (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "C" || e.key === "J")) ||
//         (e.ctrlKey && e.key === "U")
//     ) {
//         e.preventDefault();
//         window.location.href = "./error-code-404.html";
//     }
// });
