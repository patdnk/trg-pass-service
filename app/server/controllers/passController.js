// const { PKPass, NFC } = require('passkit-generator');
var fs = require('file-system');
var path = require('path');

const passService = require('../services/pass');

const { Error } = require("../models").error;

const salesforceService = require('../services/salesforce');

exports.members = async (request, response) => {
    console.log(request.url);
    response.setTimeout(15000, () => {
        response.status(408);
      return response.send("Request timeout");
    });

    try {
      const member = await salesforceService.getMemberDetails(request.params.memberId);
      console.log(`member received: ${member}`);
      return response.status(200).send(member);
    } catch(error) {
      return response.status(400).send("error");
    }
}

// exports.member = async (request, response) => {
    // console.log(request.url);
    // var memberDetails;
    // try {
    //     memberDetails = await salesforceService.getMemberDetails(request.params.memberId);
    //     // console.log(`member received: ${member}`);
    //     // response.status(200).send(memberDetails);

    // } catch {
    // //     console.error("no member found");
    //     // response.status(404).send(memberDetails == true);
    // }

//     ///------------old
//     console.log(request.url);
//     response.setTimeout(15000, () => {
//         response.status(408);
//       return response.send("Request timeout");
//     });

//     try {
//       const member = await salesforceService.getMemberDetails(request.params.id);
//       console.log(`member received: ${member}`);
//       return response.status(200).send(member);
//     } catch(error) {
//       return response.status(400).send("error");
//     }
// }

exports.pass = async (request, response) => {
    try {
        console.log(request.url);
        response.setTimeout(15000, () => {
            response.status(408);
            return response.send("Request timeout");
        });

        // set the origin of the pass for generator
        var passOrigin;
        if (!('user-agent' in request.headers)) {
            let error = new Error({
                "code": "00010",
                "description": request.url,
                "status": "no agent header present ",
                "result": "FAILURE"
            })
            response.status(400).send(error);
        } else {
            //check for apple and google device types
            let userAgent = request.headers['user-agent'];
            if (userAgent == 'iOS') {
                passOrigin = PassOrigin.iOS;
            } else if (deviceType == 'android') {
                passOrigin = PassOrigin.iOS;
            } else {
                let error = new Error({
                    "code": "00020",
                    "description": request.url,
                    "status": "no agent present",
                    "result": "FAILURE"
                })
                response.status(400).send(error);
            }
        }

        var memberDetails;
        try {
            memberDetails = await salesforceService.getMemberDetails(request.params.memberId);
        } catch (err) {
            console.log(error);
            // response.status(400).send(err);
        }

        console.log("started await passService.generatePass(passOrigin, memberDetails);");

        try {
            const passObject = await passService.generatePass(passOrigin, memberDetails);
            console.log("finished? await passService.generatePass(passOrigin, memberDetails);");

            if (passObject == undefined) {
                let error = new Error({
                    "code": "00030",
                    "description": request.url,
                    "status": "issue generating pass",
                    "result": "FAILURE"
                })
                response.status(500).send(error);
            }

            if (passOrigin == PassOrigin.iOS) {

                console.log('define stream for ios');
                const passName = "trg_membership_" + new Date().toISOString().split("T")[0].replace(/-/gi, "");
                const stream = passObject.getAsStream();
                response.set({
                    "Content-type": passObject.mimeType,
                    "Content-disposition": `attachment: filename=${passName}.pkpass`
                });
                stream.pipe(response);
                // response.send(200);

            } else if (passOrigin == PassOrigin.iOS) {

            } else {
                let error = new Error({
                    "code": "00032",
                    "description": request.url,
                    "status": "no origin",
                    "result": "FAILURE"
                })
                response.status(400).send(error);
            }
        } catch {
            let error = new Error({
                "code": "00031",
                "description": request.url,
                "status": "issue generating pass",
                "result": "FAILURE"
            })
            response.status(500).send(error);
        }




        // const passName =
		// "trg_membership" +
		// "_" +
		// new Date().toISOString().split("T")[0].replace(/-/gi, "");

        // PKPass.from({
        //     model: "./server/models/apple/membership.pass",
        //     certificates: {
        //         wwdr: fs.fs.readFileSync("./server/data/certs/wwdrg4.pem"),
        //         signerCert: fs.fs.readFileSync("./server/data/certs/signerCert.pem"),
        //         signerKey: fs.fs.readFileSync("./server/data/certs/signerKey.pem"),
        //         signerKeyPassphrase: "_sec_R00fGarden$!", //pass via env+aws+OP
        //     },

        // },
        //     {
        //         authenticationToken: "vxwxd7J8AlNNFPS8k0a0FfUFtq0ewzFdc",
        //         webServiceURL: "https://pass.theroofgardens.com/pass",
        //         serialNumber: "PASS-00666", //memberNumber
        //         description: "The Roof Gardens membership pass",
        //         logoText: "The Roof Gardens",
        //         foregroundColor: "rgb(39, 39, 39)",
        //         backgroundColor: "rgb(171, 189, 181)",
        //     })
        //     .then(async (newPass) => {
        //         newPass.primaryFields.push(
        //             {
        //                 key: "primary",
        //                 label: "req.label", //Member
        //                 value: "req.value" // Firstname Lastname
        //             }
        //         ),
        //         newPass.setNFC(NFC)

        //         // const buffer = Buffer.from(response.data, "utf-8");
        //         const bufferData = newPass.getAsBuffer();
        //         // fs.writeFileSync("new.pkpass", bufferData);

        //         // -->

        //         // response.status(200).send({
        //         //     "pass": request.url,
        //         //     "status": "Pass successfully generated on server.",
        //         //     "result": "SUCCESS",
        //         // })
        //         const stream = newPass.getAsStream();
        //         response.set({
        //             "Content-type": newPass.mimeType,
        //             "Content-disposition": `attachment: filename=${passName}.pkpass`
        //         });
        //         stream.pipe(response);

        //         // const stream = newPass.getAsStream()
        //         //         .then((stream) => {
        //         //             console.log(stream);
        //         //         })
        //         //         .catch((err) => {
        //         //             console.log(err);
        //         //         });


        //         // storageRef.file("passes/custom.pkpass")
        //         //     .save(bufferData, (error) => {
        //         //         if (!error) {
        //         //             console.log("pass uploaded");
        //         //             response.status(200).send({
        //         //                 "pass": request.url,
        //         //                 "status": "Pass successfully generated on server.",
        //         //                 "result": "SUCCESS",
        //         //             });
        //         //         } else {
        //         //             console.log("Error Uploading pass " + error);
        //         //             response.send({
        //         //                 "explanation": error.message,
        //         //                 "result": "FAILED",
        //         //             });
        //         //     })
        //     })
    } catch (err) {
        console.log("something went wrong");
        let error = new Error({
            "code": "00020",
            "description": request.url,
            "status": "Pass creation error: " + err,
            "result": "FAILURE"
        });
    }

};


const PassOrigin = Object.freeze({
    iOS: 'iOS',
    android: 'android',
})

exports.test = async (request, response) => {
    response.send(
        { passReady: true }
    );
};

