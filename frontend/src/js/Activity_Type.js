Parse.initialize('CarbonCalculator', 'CarbonCalculator1510');

Parse.serverURL = "http://localhost:1336/parse";


//          Create ActivityType

async function CreateActivityType(Name,Image){

    const ActivityTypes = Parse.Object.extend("ActivityType");
    const ActivityType=new ActivityTypes();
    ActivityType.set("Name",Name)
    ActivityType.set("Image",Image)
    await ActivityType.save()
    .then((savedActivityType=>{
        console.log(`ActivityType Saved Successfully ${savedActivityType}`)
    }))
    .catch(error=>{
        console.log(`Error while creating ${error}`)
    });
}

//          Read ActivityTypes

async function ReadActivityTypes(){
    try{

        const ActivityType=new Parse.Query("ActivityType");
        const Activites= await  ActivityType.find()
        return Activites
            
        }
    catch(err){
        console.log(`Error: ${error}`)
    }
}

//         Read ActivityType By Id

async function GetActivityTypeById(Id){
    const ActivityType= new Parse.Query("ActivityType");
    ActivityType.get(Id).then(ActivityType=>{

        return ActivityType
    })
    .then(UpdatedActivityType=>{
            console.log(`ActivityType ${UpdatedActivityType}`)
        }).catch(error=>{
            console.log(`Error : ${error}`)
        })
}

//         Update ActivityType By Id

async function UpdateActivityType(Id,Name,Image){
    const ActivityType= new Parse.Query("ActivityType");
    ActivityType.get(Id).then(ActivityType=>{

        ActivityType.set("Name",Name)
        ActivityType.set("Image",Image)
        return ActivityType.save()
    })
    .then(UpdatedActivityType=>{
            console.log(`Updated ActivityType ${UpdatedActivityType}`)
        }).catch(error=>{
            console.log(`Error : ${error}`)
        })
}


//          Delete ActivityType

async function DeleteActivityType(Id){
    const ActivityTypes=new Parse.Query("ActivityType");
    ActivityTypes.get(Id).then(ActivityType=>{
        ActivityType.destroy();
        return ActivityType
    })
    .then(DelActivityType=>{
        console.log(`ActivityType Deleted: ${DelActivityType}`)
    })
    .catch(error=>{
        console.log(`error: ${error}`)
    })
}


// CreateActivityType("yarn production, silk, short fibre",)
// GetActivityTypeById('I6MGVGcyTC')
// UpdateActivityType('I6MGVGcyTC','Name',)
// DeleteActivityType('I6MGVGcyTC')
// ReadActivityTypes()