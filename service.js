const bodyParser = require('body-parser')
const express = require('express')
const request = require('request')
const fs = require('fs')
const app = express()

class Service {
    constructor() {}

    accessData(url) {
        return new Promise((resolve, reject) => {
            request({
                url: url,
                gzip: true
            }, function (err, response, body) {
                if (err) {
                    console.log("Cannot connect json path: " + url)
                } else {
                    resolve(JSON.parse(body.trim()))
                }
            });
        })
    }

    checkFiles() {
        return new Promise((resolve, reject) => {
            fs.readFile(`${__dirname}/latest.json`,'utf-8', function (err, data) {
                if (err) {
                    console.log("Cannot find local file!")
                } else {
                    resolve(data)
                }
            })
        })
    }


    compareData(webData, localData) {
        return new Promise((resolve, reject) => {
            localData = JSON.parse(localData)
            if (webData[0].id == localData[0] && webData[0].date == localData[1]) {
                console.log("Local data is up-to-date")
            } else {
                console.log("Passing web data to local...")
    
                resolve(webData)
            }
        })

    }


    copyData(data) {
        return new Promise((resolve, reject) => {
            let latestData = [data[0].id, data[0].date, data[0].no, data[0].sno, data[0].p1, data[0].p1u]
            let uData = JSON.stringify(latestData)
            fs.writeFile('latest.json', uData, 'utf8', (err) => {
                if (err) {
                    console.log("Cannot write latest.json")
                } else {
                    console.log("Successfully create latest.json")
                    resolve(latestData)
                }
            })
        })
    }
}






module.exports = Service