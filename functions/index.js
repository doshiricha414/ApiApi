const functions = require('firebase-functions');
var admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
var firestore = admin.firestore();
 exports.webhook = functions.https.onRequest((request, response) => {
    console.log("request.body.result.parameters: ", request.body.result.parameters);


    switch(request.body.result.action){
    case 'hotelbooking' :
    let params = request.body.result.parameters;
        var docRef = firestore.collection('orders')
                    .add(params)
                    .then(() => {
                        response.send({
                            speech :'${params.name} your hotel booking request for ${params.Room-Type} room is forwarded for ${params.person} persons, we will contact you on ${$params.email} soon'

                    });
              })
              .catch((e=>{
                        response.send({
                                  speech : "Something went wrong while writing to database"
                              });
              }));
       break;

    case 'countBookings' :
    firestore.collection('orders').get()
             .then(snapshot => {
                    var orders = [];
                   snapshot.forEach(doc => {orders.push(doc.data())});

                 response.send({
                    speech : `you have ${orders.length} orders would you like to see them?\n`
                 });

                 })
                 .catch(err => {
                       console.log('Error getting documents', err);
                       response.send({
                                           speech : "Something went wrong while reading from database"
                                        });
                     });


     break;


    case 'showBookings' :
    firestore.collection('orders').get()
             .then(snapshot => {
                    var orders = [];
                   snapshot.forEach(doc => {orders.push(doc.data())});


                 var speech = 'Here are your orders\n'

                 orders.forEach((eachOrder, index) => {
                    speech += `number ${index+1} is room  ${eachOrder.person} persons, ordered by ${eachOrder.name} contact email is ${eachOrder.email}`
                 })

                 response.send({
                    speech : speech
                 });

                 })
                 .catch(err => {
                       console.log('Error getting documents', err);
                       response.send({
                                           speech : "Something went wrong two"
                                        });
                     });


     break;


    default :
    response.send({
        speech : "No action matched in webhook"
    });
    }


 });
