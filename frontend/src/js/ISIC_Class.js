Parse.initialize('CarbonCalculator', 'CarbonCalculator1510');

Parse.serverURL = "http://localhost:1336/parse";



//          Create ISIC_Class

async function CreateISIC_Class(Name,Image){

    const ISIC_Classes = Parse.Object.extend("ISIC_Class");
    const ISIC_Class=new ISIC_Classes();
    ISIC_Class.set("Name",Name)
    ISIC_Class.set("Image",Image)
    await ISIC_Class.save()
    .then((savedISIC_Class=>{
        console.log(`ISIC_Class Saved Successfully ${savedISIC_Class}`)
    }))
    .catch(error=>{
        console.log(`Error while creating ${error}`)
    });
}

//          Read ISIC_Classs

async function ReadISIC_Classs() {
    try {
        const ISIC_Class = new Parse.Query("ISIC_Class");
        const classes = await ISIC_Class.find();

        return classes;
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}
//         Read ISIC_Class By Id

async function GetISIC_ClassById(Id){
    const ISIC_Class= new Parse.Query("ISIC_Class");
    ISIC_Class.get(Id).then(ISIC_Class=>{

        return ISIC_Class
    })
    .then(UpdatedISIC_Class=>{
            console.log(`ISIC_Class ${UpdatedISIC_Class}`)
        }).catch(error=>{
            console.log(`Error : ${error}`)
        })
}

//         Update ISIC_Class By Id

async function UpdateISIC_Class(Id,Name,Image){
    const ISIC_Class= new Parse.Query("ISIC_Class");
    ISIC_Class.get(Id).then(ISIC_Class=>{

        ISIC_Class.set("Name",Name)
        ISIC_Class.set("Image",Image)
        return ISIC_Class.save()
    })
    .then(UpdatedISIC_Class=>{
            console.log(`Updated ISIC_Class ${UpdatedISIC_Class}`)
        }).catch(error=>{
            console.log(`Error : ${error}`)
        })
}


//          Delete ISIC_Class

async function DeleteISIC_Class(Id){
    const ISIC_Classs=new Parse.Query("ISIC_Class");
    ISIC_Classs.get(Id).then(ISIC_Class=>{
        ISIC_Class.destroy();
        return ISIC_Class
    })
    .then(DelISIC_Class=>{
        console.log(`ISIC_Class Deleted: ${DelISIC_Class}`)
    })
    .catch(error=>{
        console.log(`error: ${error}`)
    })
}


// CreateISIC_Class("0116:Growing of fibre crops",)
// GetISIC_ClassById('I6MGVGcyTC')
// UpdateISIC_Class('I6MGVGcyTC','Name',)
// DeleteISIC_Class('I6MGVGcyTC')
// ReadISIC_Classs()