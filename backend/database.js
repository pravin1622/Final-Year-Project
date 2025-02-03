const { MongoClient } = require('mongodb');
require('dotenv').config({path: '../.env'});

// Connection URI
const uri = process.env.DB_URL;

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Insert function to be exported
const db_insert_case = async ( caseNo, caseName, fileName, fileType, ipfsHash) => {
    try {
        await client.connect();

        // Access a database and collection
        const database = client.db('Evidence');
        const collection = database.collection('Case');

        
        // Checking if that Case is already present or not in the DB
        const result = await collection.findOne({ Case_no: caseNo });
        if (result) {
            console.log("Document exists!");
            const returnedstatement = await update_doc(collection, caseNo, caseName, fileName, fileType, ipfsHash);   //Updating in this case
            client.close();
            return returnedstatement;
        } else {
            console.log("Document does not exist.");
            await insert_doc(collection, caseNo, caseName, fileName, fileType, ipfsHash);  //Inserting in this case
            client.close();
            return true;
        }


    } catch (error) {
     console.log(error);  
     client.close(); 
    }
}
//

//Insert document if new case number is registered
const insert_doc = async (collection_name, case_No, case_Name, file_Name, file_Type, ipfsHash) => {
    const query = { 
            Case_no: case_No,
            Case_name: case_Name,
            Evidences: [{
                File_name: file_Name,
                File_type: file_Type,
                File_hash: ipfsHash
            }]
        }
    const result = await collection_name.insertOne(query);
    console.log(`${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`);
}

//Update document to store more evidences in case of the case number already present
const update_doc = async (collection_name, case_No, case__Name, file_Name, file_Type, ipfsHash) => {
    const query = {Case_no: case_No};
    const projection = {Case_name: 1};
    const update = {
        $push: {
            Evidences: {
                File_name: file_Name,
                File_type: file_Type,
                File_hash: ipfsHash
            }
        }
    };

    const finding = await collection_name.findOne(query, {projection});

    if (finding) {
        if (finding.Case_name !== case__Name) {
            return false;
        }
    } else {
        console.log('No document found.');
    }
  
    try {
        const result = await collection_name.updateOne(query, update);
        console.log(result);
        return true;
    } catch (err) {
        console.log('Error updating document:', err);
    }
}


//For verifying id
const check_id = async (_id_) => {
    try {
        //Connect to MongoDB
        await client.connect();

        //Access DB and collection
        const database = client.db('Evidence');
        const collection = database.collection('People');

        const query = {id: _id_};

        // Check for id using find one
        const result = await collection.findOne(query);

        if(result){
            return true;
        } else{
            return false;
        }
        
    } catch (error) {
        console.log(error);
    }
}

const getEvidences = async (_caseNo_, _fileNames_) => {
    const result = {};
    try {
        // Access the MongoDB database and collection
        const database = client.db('Evidence');
        const collection = database.collection('Case');

        // Fetch evidence links from the database
        const query = { Case_no: _caseNo_ };
        const caseData = await collection.findOne(query);
        
        if (!caseData) {
            console.log(`No evidence found for case number ${_caseNo_}`);
            return result;
        }

        const evidences = caseData.Evidences;

        // Loop through the requested file names
        for (let i = 0; i < _fileNames_.length; i++) {
            const fileName = _fileNames_[i];
            const evidence = evidences.find(e => e.File_name === fileName);

            if (evidence) {
                result[fileName] = {
                    file_hash_ipfs: "http://127.0.0.1:8081/ipfs/" + evidence.File_hash,
                    id: evidence._id // Assuming MongoDB default _id
                };
            } else {
                console.log(`Evidence not found for file ${fileName}`);
            }
        }

        return result;
    } catch (error) {
        console.error('Error fetching evidence links from the database:', error);
        return false;
    }
}




const find_evidences = async (_caseNo_) => {
    try {
        //Connect to MongoDB
        await client.connect();

        //Access DB and collection
        const database = client.db('Evidence');
        const collection = database.collection('Case');

        const query = {Case_no: _caseNo_};
        
        const result = await collection.findOne(query);

        if (result) {
            const evidences = result.Evidences;
            const fileNames = evidences.map(evidence => evidence.File_name);
            const fileTypes = evidences.map(evidence => evidence.File_type);
            const filehash = evidences.map(evidence => evidence.File_hash);
            client.close()
            return [fileNames, fileTypes, filehash];
        }else{
            console.log("No result found");
            client.close();
            return [false]
        }

    } catch (error) {
        console.log(error);
    }


}

module.exports = {db_insert_case, check_id, find_evidences, getEvidences};