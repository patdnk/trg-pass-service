const { PKPass, NFC } = require('passkit-generator');
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const salesforceService = require('../services/salesforce');

var fs = require('file-system');
var path = require('path');

const { member } = require('../models');

const PassOrigin = Object.freeze({
    iOS: 'iOS',
    android: 'android',
})

async function generatePass(origin, memberDetails) {

    var memberDetails;
    try {
        if (origin == "iOS") {
            try {
                const pass = generateApplePass(memberDetails);
                return pass;
            } catch (err) {
                console.log("apple pass generation error: " + err);s
            }
        } else if (origin == "android") {
            try {
                const pass = generateGooglePass(memberDetails);
                return pass;
            } catch (err) {
                console.log("apple pass generation error: " + err);
            }
        } else {
            console.log("unknown origin");
        }
    } catch (error) {
        // throw(error);
        console.log("unknown origin");
    }

}

async function generateApplePass(member) {
    const passName =
        "trg_" + member.memberId + "_" + new Date().toISOString().split("T")[0].replace(/-/gi, "");

    PKPass.from({
        model: "./server/models/apple/membership.pass",
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
            serialNumber: "trg-" + member.memberId, //memberNumber
            description: "The Roof Gardens membership pass",
            logoText: "The Roof Gardens",
            foregroundColor: "rgb(39, 39, 39)",
            backgroundColor: "rgb(229, 229, 205)",
        })
        .then(async (newPass) => {
            newPass.primaryFields.push(
                {
                    key: "primary",
                    label: "req.label", //Member
                    value: member.firstName + " " + member.lastName
                }
            ),
                newPass.setNFC(NFC);
                // console.log("newPass: " + newPass);

            // const buffer = Buffer.from(response.data, "utf-8");
            const bufferData = newPass.getAsBuffer();
            fs.writeFileSync("trg_membership.pkpass", bufferData);

            // console.log("newPass: " + newPass);
            // console.log("bufferData: " + bufferData);
            console.log("passService generateApplePass(member)");
            return newPass;

            // -->

            // response.status(200).send({
            //     "pass": request.url,
            //     "status": "Pass successfully generated on server.",
            //     "result": "SUCCESS",
            // })
            // const stream = newPass.getAsStream();
            // response.set({
            //     "Content-type": newPass.mimeType,
            //     "Content-disposition": `attachment: filename=${passName}.pkpass`
            // });
            // stream.pipe(response);

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