const bodyParser = require('body-parser')
const express = require('express')
const request = require('request')
const fs = require('fs')
const app = express()
const Service = require('./service')
const autoPush = require('./autoPush')

let fbService = new Service()
let jsonUrl = '<--insert-->' //insert your data file! 

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json());

(function run() {
    console.log('Auto checking every 6 hours...')
    let p1 = fbService.accessData(jsonUrl)
    let p2 = fbService.checkFiles()
    Promise.all([p1, p2])
        .then((data) => fbService.compareData(data[0], data[1]))
        .then((data) => fbService.copyData(data))
        .then((data) => autoPush(`Draw Number: ${data[0]} \nDraw Date: ${data[1]} \nDraw Results: ${data[2]}+"${data[3]}" \n1st Division Prize: $${data[4]} \nWinning Unit: ${data[5]}`))
    setTimeout(() => {
        run()
    }, 21600000)
}())