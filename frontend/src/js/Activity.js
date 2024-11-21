
Parse.initialize('CarbonCalculator', 'CarbonCalculator1510');

Parse.serverURL = "http://localhost:1336/parse";

async function createActivity(activityId, carbon, sectorId, geographyId, isicClassId) {
    const Activity = Parse.Object.extend("CarbonEmissions");
    const activity = new Activity();

    activity.set("Carbon", carbon);
    activity.set("Activity", 
        {
         __type: "Pointer",
        className: "Activity",
        objectId: activityId

        });
    activity.set("Sector", {
        __type: "Pointer",
        className: "Sector",
        objectId: sectorId
    });
    activity.set("Geography", {
        __type: "Pointer",
        className: "Geography",
        objectId: geographyId
    });
    activity.set("ISICClass", {
        __type: "Pointer",
        className: "ISICClass",
        objectId: isicClassId
    });

    try {
        const savedActivity = await activity.save();
        console.log(`Activity created successfully with ID: ${savedActivity.id}`);
    } catch (error) {
        console.error(`Error creating activity: ${error.message}`);
    }
}

async function readActivity(activityId) {
    const Activity = Parse.Object.extend("CarbonEmissions");
    const query = new Parse.Query(Activity);

    try {
        const activity = await query.get(activityId);
        console.log(`Activity: ${activity.get("Activity")}, Carbon: ${activity.get("Carbon")}`);
        return activity;
    } catch (error) {
        console.error(`Error reading activity: ${error.message}`);
    }
}


async function updateActivity(activityId, newActivityId, newCarbon, newSectorId, newGeographyId, newIsicClassId) {
    const Activity = Parse.Object.extend("CarbonEmissions");
    const query = new Parse.Query(Activity);

    try {
        const activity = await query.get(activityId);
        activity.set("Carbon", newCarbon);
        if (newActivityId) {
        activity.set("Activity", 
            {
             __type: "Pointer",
            className: "Activity",
            objectId: newActivityId
    
            });
        }
        if (newSectorId) {
            activity.set("Sector", {
                __type: "Pointer",
                className: "Sector",
                objectId: newSectorId
            });
        }
        
        if (newGeographyId) {
            activity.set("Geography", {
                __type: "Pointer",
                className: "Geography",
                objectId: newGeographyId
            });
        }
        
        if (newIsicClassId) {
            activity.set("ISICClass", {
                __type: "Pointer",
                className: "ISICClass",
                objectId: newIsicClassId
            });
        }

        await activity.save();
        console.log(`Activity updated successfully with ID: ${activity.id}`);
    } catch (error) {
        console.error(`Error updating activity: ${error.message}`);
    }
}

async function deleteActivity(activityId) {
    const Activity = Parse.Object.extend("CarbonEmissions");
    const query = new Parse.Query(Activity);

    try {
        const activity = await query.get(activityId);
        await activity.destroy();
        console.log(`Activity with ID: ${activityId} deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting activity: ${error.message}`);
    }
}
 const sectorId = "3tBMu8cpow"; 
    const geographyId = "0o8vZMjqYX";
    const isicClassId = "cocubiw36Q"; 



async function readAllActivities() {
    const Activity = Parse.Object.extend("CarbonEmissions");
    const query = new Parse.Query(Activity);

    try {
        const activities = await query.find(); 
        console.log(`Total Activities: ${activities.length}`);
        return activities;
    } catch (error) {
        console.error(`Error reading activities: ${error.message}`);
    }
}


// createActivity('DRtXehaayy',"Manufacturing",  sectorId, geographyId, isicClassId);
// readAllActivities()
// const activityId = "";
// readActivity(activityId);
// updateActivity(activityId, "Updated Manufacturing", 250, sectorId, geographyId, isicClassId);
// deleteActivity(activityId);