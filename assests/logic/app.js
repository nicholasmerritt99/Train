$(document).ready(function(){
    var config = {
        apiKey: "AIzaSyB-g1pPmAqRfAhgT4gC1NQIBvJGi3aVQ64",
        authDomain: "the-best-f49f0.firebaseapp.com",
        databaseURL: "https://the-best-f49f0.firebaseio.com",
        projectId: "the-best-f49f0",
        storageBucket: "the-best-f49f0.appspot.com",
        messagingSenderId: "344363012839"
     };
     
     firebase.initializeApp(config);

    
    var database = firebase.database();

    
    var name;
    var destination;
    var firstTrain;
    var frequency = 0;

    $("#addTrain").on("click", function() {
        event.preventDefault();
        name = $("#trainName").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#firstTrain").val().trim();
        frequency = $("#frequency").val().trim();

        
        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("form")[0].reset();
    });

    database.ref().on("child_added", function(childSnapshot) {
        var nextArr;
        var minAway;
        
        var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
        
        var diffTime = moment().diff(moment(firstTrainNew), "minutes");
        var remainder = diffTime % childSnapshot.val().frequency;
        
        var minAway = childSnapshot.val().frequency - remainder;
       
        var nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");

        $("#addRow").append("<tr><td>" + childSnapshot.val().name +
                "</td><td>" + childSnapshot.val().destination +
                "</td><td>" + childSnapshot.val().frequency +
                "</td><td>" + nextTrain + 
                "</td><td>" + minAway + "</td></tr>");

            
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
    });

    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
        
        $("#nameDisplay").html(snapshot.val().name);
        $("#emailDisplay").html(snapshot.val().email);
        $("#ageDisplay").html(snapshot.val().age);
        $("#commentDisplay").html(snapshot.val().comment);
    });
});