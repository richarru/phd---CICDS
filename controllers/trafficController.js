const fs = require("fs");
const csvtojson = require("csvtojson");
const { formatData } = require("./formatController");

// const { createLog } = require("../controllers/logController");

const filename = "Logs/capture.csv";

const getTrafficData = (req, res) => {
    const index = req.query.dataCount;
    csvtojson()
        .fromFile(filename)
        .then((data) => {
            let d = [];
            let cols = [];
            if (data.length) {
                data.forEach((datum) => {
                    d.push(Object.values(datum));
                });
                cols = Object.keys(data[0]);
            }
            d = d.slice(index);
            res.json({ data: d, cols: cols });
        });
};

const watchCaptureFile = () => {
    let prevData = "";
    console.log(`Watching ${filename} for changes`);
    fs.watchFile(filename, (curr, prev) => {
        fs.readFile(filename, "utf-8", (err, data) => {
            if (err) {
                console.error(err);
            } else {
                if (prevData !== data) {
                    const newData = data.substring(prevData.length);
                    prevData = data;
                    const formattedData = formatData(newData);
                    console.log(formattedData[0]);
                    // The index of captured data have been properly modified.
                    // TODO ---> Feed this new data to the machine learning model in order to predict
                    // create a new log entry if an attack is predicted
                    // predicted = predict(someData)
                    // if(predicted.class == "attack") {
                    //      createLog(predicted);
                    // }
                }
            }
        });
    });
};

module.exports = { getTrafficData, watchCaptureFile };
