// const Parse = require('parse/node');
// Parse.initialize("CarbonCalculator");
Parse.initialize('CarbonCalculator', 'CarbonCalculator1510');

Parse.serverURL = "http://localhost:1336/parse";


//          Create Sector

async function CreateSector(Name,Image){

    const Sector = Parse.Object.extend("Sector");
    const sector=new Sector();
    sector.set("Name",Name)
    sector.set("Image",Image)
    await sector.save()
    .then((savedSector=>{
        console.log(`Sector Saved Successfully ${savedSector}`)
    }))
    .catch(error=>{
        console.log(`Error while creating ${error}`)
    });
}

//          Read Sectors

async function ReadSectors() {
    const Sector = new Parse.Query("Sector");
    try {
        const sectors = await Sector.find(); 
        console.log(`Sectors:`, sectors); 
        return sectors;
    } catch (error) {
        console.error(`Error: ${error}`); 
        return []; 
    }
}


//         Read Sector By Id

async function GetSectorById(Id){
    const Sector= new Parse.Query("Sector");
    Sector.get(Id).then(sector=>{

        return sector
    })
    .then(UpdatedSector=>{
            console.log(`sector ${UpdatedSector}`)
        }).catch(error=>{
            console.log(`Error : ${error}`)
        })
}

//         Update Sector By Id

async function UpdateSector(Id,Name,Image){
    const Sector= new Parse.Query("Sector");
    Sector.get(Id).then(sector=>{

        sector.set("Name",Name)
        sector.set("Image",Image)
        return sector.save()
    })
    .then(UpdatedSector=>{
            console.log(`Updated sector ${UpdatedSector}`)
        }).catch(error=>{
            console.log(`Error : ${error}`)
        })
}


//          Delete Sector

async function DeleteSector(Id){
    const Sectors=new Parse.Query("Sector");
    Sectors.get(Id).then(sector=>{
        sector.destroy();
        return sector
    })
    .then(DelSector=>{
        console.log(`Sector Deleted: ${DelSector}`)
    })
    .catch(error=>{
        console.log(`error: ${error}`)
    })
}


// CreateSector("Textiles",)
// GetSectorById('sJAs5Vckbz')
// UpdateSector('sJAs5Vckbz','Name',)
// DeleteSector('sJAs5Vckbz')
// ReadSectors()