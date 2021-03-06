/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_OCEANCALCULATIONSDB_ARN
	STORAGE_OCEANCALCULATIONSDB_NAME
	STORAGE_OCEANCALCULATIONSDB_STREAMARN
	STORAGE_OCEANCALCULATIONS_ARN
	STORAGE_OCEANCALCULATIONS_NAME
	STORAGE_OCEANCALCULATIONS_STREAMARN
Amplify Params - DO NOT EDIT */ /*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const AWS = require('aws-sdk')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var bodyParser = require('body-parser')
var express = require('express')

const utils = require('./utils/calculations.js')

AWS.config.update({ region: process.env.TABLE_REGION })

const dynamodb = new AWS.DynamoDB.DocumentClient()

let tableName = 'testdata'
if (process.env.ENV && process.env.ENV !== 'NONE') {
  tableName = tableName + '-' + process.env.ENV
}
let tableNameResult = 'testResults'
if (process.env.ENV && process.env.ENV !== 'NONE') {
  tableNameResult = tableNameResult + '-' + process.env.ENV
}

const userIdPresent = false // TODO: update in case is required to use that definition
const partitionKeyName = 'id'
const partitionKeyType = 'S'
const sortKeyName = ''
const sortKeyType = ''
const hasSortKey = sortKeyName !== ''
const path = '/ocean-calculations'
const UNAUTH = 'UNAUTH'
const hashKeyPath = '/:' + partitionKeyName
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : ''
const crypto = require('crypto')
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch (type) {
    case 'N':
      return Number.parseInt(param)
    default:
      return param
  }
}

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + '/object' + hashKeyPath + sortKeyPath, function (req, res) {
  var params = {}
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] =
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH
  } else {
    params[partitionKeyName] = req.params[partitionKeyName]
    try {
      params[partitionKeyName] = convertUrlType(
        req.params[partitionKeyName],
        partitionKeyType
      )
    } catch (err) {
      res.statusCode = 500
      res.json({ error: 'Wrong column type ' + err })
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType)
    } catch (err) {
      res.statusCode = 500
      res.json({ error: 'Wrong column type ' + err })
    }
  }

  let getItemParams = {
    TableName: tableNameResult,
    Key: params,
  }

  dynamodb.get(getItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500
      res.json({ error: 'Could not load items: ' + err.message })
    } else {
      if (data.Item) {
        res.json(data.Item)
      } else {
        res.json(data)
      }
    }
  })
})

/************************************
 * HTTP post method for insert object *
 *************************************/

app.post(path, function (req, res) {
  if (userIdPresent) {
    req.body['userId'] =
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH
  }

  const id = crypto.randomBytes(16).toString('hex')
  const timestamp = new Date().toString()

  let putItemParams = {
    TableName: tableName,
    Item: {
      id,
      timestamp,
      ...req.body,
    },
  }

  dynamodb.put(putItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500
      res.json({ error: err, url: req.url, body: req.body })
    } else {
      const { testdata, sex, age } = req.body
      utils.calculateScores(testdata, sex, age).then((results) => {
        let putItemParamsResult = {
          TableName: tableNameResult,
          Item: {
            id,
            timestamp,
            results: results,
          },
        }
        dynamodb.put(putItemParamsResult, (err, data) => {
          if (err) {
            res.statusCode = 500
            res.json({ error: err, url: req.url, body: req.body })
          } else {
            res.json({
              success: 'post call succeed!',
              id,
              graphData: results,
            })
          }
        })
      })
    }
  })
})

app.listen(3000, function () {
  console.log('App started')
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
