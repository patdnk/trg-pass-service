const { PKPass, NFC } = require('passkit-generator');
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const salesforceService = require('../services/salesforce');

var fs = require('file-system');
var path = require('path');

async function getMemberDetails(memberId) {
    try {
        const memberDetails = await salesforceService.getMemberDetails(memberId);
    } catch (error) {
        console.log(error(error.message));
        return undefined;
    }
}

async function generatePass(type, memberId) {
    if (type == "ios") {
        const member = await getMemberDetails(memberId);

    }

}

function generateApplePass(memberId) {
    const passName =
		"trg_membership" +
		"_" +
		new Date().toISOString().split("T")[0].replace(/-/gi, "");

        PKPass.from({
            model: "./server/models/membership.pass",
            certificates: {
                wwdr: fs.fs.readFileSync("./server/data/certs/wwdrg4.pem"),
                signerCert: fs.fs.readFileSync("./server/data/certs/signerCert.pem"),
                signerKey: fs.fs.readFileSync("./server/data/certs/signerKey.pem"),
                signerKeyPassphrase: "_sec_R00fGarden$!", //pass via env+aws+OP
            },

        },
            {
                authenticationToken: "vxwxd7J8AlNNFPS8k0a0FfUFtq0ewzFdc",
                webServiceURL: "https://pass.theroofgardens.com/pass",
                serialNumber: "PASS-00666", //memberNumber
                description: "The Roof Gardens membership pass",
                logoText: "The Roof Gardens",
                foregroundColor: "rgb(39, 39, 39)",
                backgroundColor: "rgb(171, 189, 181)",
            })
            .then(async (newPass) => {
                newPass.primaryFields.push(
                    {
                        key: "primary",
                        label: "req.label", //Member
                        value: "req.value" // Firstname Lastname
                    }
                ),
                newPass.setNFC(NFC)

                // const buffer = Buffer.from(response.data, "utf-8");
                const bufferData = newPass.getAsBuffer();
                // fs.writeFileSync("new.pkpass", bufferData);

                // -->

                // response.status(200).send({
                //     "pass": request.url,
                //     "status": "Pass successfully generated on server.",
                //     "result": "SUCCESS",
                // })
                const stream = newPass.getAsStream();
                response.set({
                    "Content-type": newPass.mimeType,
                    "Content-disposition": `attachment: filename=${passName}.pkpass`
                });
                stream.pipe(response);

                // const stream = newPass.getAsStream()
                //         .then((stream) => {
                //             console.log(stream);
                //         })
                //         .catch((err) => {
                //             console.log(err);
                //         });


                // storageRef.file("passes/custom.pkpass")
                //     .save(bufferData, (error) => {
                //         if (!error) {
                //             console.log("pass uploaded");
                //             response.status(200).send({
                //                 "pass": request.url,
                //                 "status": "Pass successfully generated on server.",
                //                 "result": "SUCCESS",
                //             });
                //         } else {
                //             console.log("Error Uploading pass " + error);
                //             response.send({
                //                 "explanation": error.message,
                //                 "result": "FAILED",
                //             });
                //     })
            })
}

function generateGooglePass(memberId) {

}

module.exports = {
    generatePass,
  };