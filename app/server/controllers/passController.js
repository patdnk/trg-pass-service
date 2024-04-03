const { PKPass, NFC } = require('passkit-generator');
var fs = require('file-system');
var path = require('path');

const passService = require('../services/pass');

exports.pass = (request, response) => {
    try {
        console.log(request.url);
        response.setTimeout(15000, () => {
            response.status(408);
            return response.send("Request timeout");
        });

        //token validation
        //pass retrieval/generation
        //---
        // check the headers for the device type
        passService.generatePass(type, request.params.memberId)
        //---

        const passName =
		"trg_membership" +
		"_" +
		new Date().toISOString().split("T")[0].replace(/-/gi, "");

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
    } catch (err) {
        response.status(400).send({
            "pass": request.url,
            "status": "Pass creation error: " + err,
            "result": "FAILURE",
        })
    }

};

exports.test = (request, response) => {
    response.send({ passReady: true });
};

