const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// exports.addMessage = functions.https.onRequest((req, res) => {
//     const original = req.query.text;

//     return admin.database().ref('/message').push({original: original})
//     .then(snaphshot => {
//         return res.redirect(303, snaphshot.ref.toString());
//     });
// });


exports.addFile = functions.https.onRequest((req, res) => {
    const original = req.query.text;

    return admin.database().ref('/allotments').push({
        person: {emailAddress: "test@gmail.com", name: "Test"},
        files: [{filename: "abc.mp3"},{filename: "bcd.mp3"}]
    }).then(snaphshot => {
        return res.redirect(303, snaphshot.ref.toString());
    });
});

// // exports.makeUppercase = functions.database.ref(`message/{pushId}/original`)
// // .onCreate((snaphshot, context) => {
// //     const original = snaphshot.val();

// //     console.log("Uppercasing", context.params.pushId, original);

// //     const uppercase = original.toUpperCase();

// //     return snaphshot.ref.parent.child('uppercase').set(uppercase);
// // });

exports.makeUpdatex = functions.database.ref(`allotments/{pushId}/`)
.onCreate((snaphshot, context) => {
    const allotment = snaphshot.val();
    console.log(allotment);

    console.log("Making Updates", context.params.pushId, allotment);

    
    if (allotment.files) {
        allotment.files.forEach(file => {
            file.status = "Given";
        });

        console.log(allotment.files);
        snaphshot.ref.child('files').set(allotment.files);
    }

    admin.database().ref('/emails/').push({
        email: allotment.person.emailAddress,
        body: "",
        subject: "",
        recipient: "",
        pushId: context.params.pushId
    });

    return new Promise((resolve, reject) => {
        resolve('success');
    });
});