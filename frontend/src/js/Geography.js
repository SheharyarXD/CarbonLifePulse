Parse.initialize('CarbonCalculator', 'CarbonCalculator1510');

Parse.serverURL = "http://localhost:1336/parse";


//          Create Geography

async function CreateGeography(Name,Image){

    const Geographys = Parse.Object.extend("Geography");
    const Geography=new Geographys();
    Geography.set("Name",Name)
    Geography.set("Image",Image)
    await Geography.save()
    .then((savedGeography=>{
        console.log(`Geography Saved Successfully ${savedGeography}`)
    }))
    .catch(error=>{
        console.log(`Error while creating ${error}`)
    });
}

//          Read Geographys

async function ReadGeographys(){
    try{
        const Geography=new Parse.Query("Geography");
        const Geographys=await Geography.find()
        console.log(`Geographys: ${Geographys}`)
        return Geographys
    }
    catch(error){
        console.log(`Error: ${error}`)
    }
}

//         Read Geography By Id

async function GetGeographyById(Id){
    const Geography= new Parse.Query("Geography");
    Geography.get(Id).then(Geography=>{

        return Geography
    })
    .then(UpdatedGeography=>{
            console.log(`Geography ${UpdatedGeography}`)
        }).catch(error=>{
            console.log(`Error : ${error}`)
        })
}

//         Update Geography By Id

async function UpdateGeography(Id,Name,Image){
    const Geography= new Parse.Query("Geography");
    Geography.get(Id).then(Geography=>{

        Geography.set("Name",Name)
        Geography.set("Image",Image)
        return Geography.save()
    })
    .then(UpdatedGeography=>{
            console.log(`Updated Geography ${UpdatedGeography}`)
        }).catch(error=>{
            console.log(`Error : ${error}`)
        })
}


//          Delete Geography

async function DeleteGeography(Id){
    const Geographys=new Parse.Query("Geography");
    Geographys.get(Id).then(Geography=>{
        Geography.destroy();
        return Geography
    })
    .then(DelGeography=>{
        console.log(`Geography Deleted: ${DelGeography}`)
    })
    .catch(error=>{
        console.log(`error: ${error}`)
    })
}


// CreateGeography("Canada, QuÃ©bec (CA-QC)",)
// GetGeographyById('I6MGVGcyTC')
// UpdateGeography('I6MGVGcyTC','Name',)
// DeleteGeography('I6MGVGcyTC')
ReadGeographys()