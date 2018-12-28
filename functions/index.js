const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

/**
 * Test case
 */
exports.addFile = functions.https.onRequest((req, res) => {
    return admin.database().ref('/allotments').push({
        person: {emailAddress: "test@gmail.com", name: "Test"},
        files: [{filename: "abc.mp3"},{filename: "bcd.mp3"}]
    }).then(snaphshot => {
        return res.redirect(303, snaphshot.ref.toString());
    });
});

/**
 * Cloud Function to make changes to allotment
 */
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