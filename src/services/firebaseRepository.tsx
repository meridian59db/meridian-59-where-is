import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import { TObject } from '../types/TObject';
import { parseData } from '../utils';

export async function getAllDocuments(
  collectionToSearch?: any,
): Promise<any[]> {
  try {
    // Reference to the collection
    const collectionRef = collection(
      db,
      collectionToSearch || (process.env.REACT_APP_COLLECTION ?? ''),
    );

    // Execute the query to get all documents in the collection
    const querySnapshot = await getDocs(collectionRef);

    // Check if there are any documents in the collection
    if (querySnapshot.empty) {
      console.log('No documents found in the collection.');
      return []; // Return an empty array if the collection is empty
    }

    // Array to store the retrieved documents
    const documents: any[] = [];

    // Loop through the documents in the collection
    querySnapshot.forEach(document => {
      documents.push({ id: document.id, data: document.data() }); // Push document data into the array
    });

    return documents; // Return the array containing all document data
  } catch (e) {
    console.error('Error getting documents: ', e);
    throw e; // Re-throw the error to be caught by the caller
  }
}

export async function addDocumentToCollection(
  data: TObject,
  document?: string,
): Promise<any> {
  try {
    // Reference to the collection
    const collectionRef = collection(
      db,
      document || (process.env.REACT_APP_COLLECTION ?? ''),
    );

    // Add a new document with a generated ID
    const docRef = await addDoc(collectionRef, data);
    console.log('Document written with ID: ', docRef.id);
    return docRef;
  } catch (e) {
    return 'Error adding document: ';
  }
}

// Function to get a document by a field value
export async function getDocumentByField(
  field: string,
  value: string,
): Promise<any> {
  try {
    // Reference to the collection
    const collectionRef = collection(
      db,
      process.env.REACT_APP_COLLECTION ?? '',
    );

    // Create a query to find documents where the specified field matches the value
    const q = query(collectionRef, where(field, '==', value));

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Check if there are any documents that match the query
    if (querySnapshot.empty) {
      console.log('No matching documents.');
      return [];
    }

    // Array to store the retrieved documents
    const documents: TObject[] = [];

    // Loop through the documents that match the query
    querySnapshot.forEach(document => {
      documents.push({ id: document.id, data: document.data() }); // Push document data into the array
    });

    return documents;
  } catch (e) {
    console.error('Error getting documents: ', e);
    return [];
  }
}

// Function to update a specific document
export async function updateDocument(
  docId: string,
  newData: TObject,
  collectionName?: string | undefined,
): Promise<any> {
  try {
    // Reference to the document
    const docRef = doc(
      db,
      collectionName || (process.env.REACT_APP_COLLECTION ?? ''),
      docId,
    );

    // Update the document with the new data
    await updateDoc(docRef, newData);

    return 'Document successfully updated!';
  } catch (e) {
    return 'Error updating document';
  }
}

export function onSnap(collectionName: string): any {
  // Reference to the 'positions' collection
  const positionsCollection = collection(db, collectionName);

  // Subscribe to changes in the 'positions' collection
  onSnapshot(
    positionsCollection,
    snapshot => {
      snapshot.docChanges().forEach((change: any): any => {
        if (change.type === 'added') {
          console.log('New position: ', change.doc.data());
        }
        if (change.type === 'modified') {
          console.log('Modified position: ', change.doc.data());
        }
        if (change.type === 'removed') {
          console.log('Removed position: ', change.doc.data());
        }
      });
    },
    error => {
      console.error('Error getting positions collection: ', error);
    },
  );
}

export const onSnapPositions = (setMyVotes: any): void => {
  // Reference to the 'positions' collection
  const positionsCollection = collection(
    db,
    process.env.REACT_APP_COLLECTION ?? '',
  );

  // Subscribe to changes in the 'positions' collection
  onSnapshot(
    positionsCollection,
    snapshot => {
      snapshot.docChanges().forEach((change: any): any => {
        const retorno = change.doc.data();
        let votesParsed;

        // update votes
        if (retorno !== undefined && retorno?.length) {
          votesParsed = parseData(retorno).map((position: any) => {
            return { name: position.name, votes: position.votes };
          });
          setMyVotes(votesParsed);
        }

        if (retorno?.votes?.length === 0 && retorno?.where) {
          localStorage.removeItem(retorno?.name);
        } else {
          const voted = retorno?.votes?.find(
            (vote: any) => vote.userId === localStorage.getItem('userId'),
          );
          if (voted) {
            localStorage.setItem(retorno?.name, `true`);
          }
        }
      });
    },
    error => {
      console.log('Error getting positions collection: ', error);
    },
  );
};
