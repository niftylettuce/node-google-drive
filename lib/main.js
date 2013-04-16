
//     node-google-drive
//     Copyright (c) 2012- Nick Baugh <niftylettuce@gmail.com> (http://niftylettuce.com)
//     MIT Licensed

// Open source node.js module for accessing Google Drive's API:
// <https://developers.google.com/drive/v1/reference/>

// * Author: [@niftylettuce](https://twitter.com/#!/niftylettuce)
// * Source: <https://github.com/niftylettuce/node-google-drive>

// # node-google-drive

var base_uri = 'www.googleapis.com/drive/v2'
  , querystring = require('querystring')

function responseHandler(req, callback) {

  if (typeof callback !== "function")
    return console.error("missing callback")

  req.on('response', function(res) {
    var response = ''
    res.setEncoding('utf8')
    res.on('data', function(chunk) {
      response += chunk
    })
    res.on('end', function() {
      var err = 200 === res.statusCode ? null : res.statusCode
      try {
        response = JSON.parse(response)
      } catch(e) {
        err = 1
        response = { error : { message : "Invalid JSON from " + base_uri } }
      }
      if (err) err = { statusCode: err, response: response }
      callback(err, response)
    })
  })
}

module.exports = function(access_token) {

  function prepareRequest(method, path, data, cb) {

    if (typeof cb !== 'function')
      return console.error('node-google-drive missing callback')

    Object.keys(data).forEach(function(key) {
      if (typeof data[key] === 'object' && data[key] !== null) {
        var o = data[key];
        delete data[key]
        Object.keys(o).forEach(function(k) {
          var new_key = key + "[" + k + "]"
          data[new_key] = o[k]
        })
      }
    })

    var requestData = querystring.stringify(data);
    requestData = 'access_token=' + access_token + '&' + requestData

    var headers = {
      'Accept'              : 'application/json',
      'User-Agent'          : 'node-google-drive',
      'X-Node-Google-Drive' : '0.0.2'
    }

    var post = false

    switch (method) {
      case 'POST':
        headers['Content-Length'] = requestData.length
        headers['Content-Type']   = 'application/x-www-form-urlencoded'
        /*
        // TODO: Implement Access Token headers
        var auth = 'Basic' + new Buffer(access_token + ':').toString('base64');
        headers.Authorization = auth;
        */
        post = true
        break
      case 'GET':
      case 'PATCH':
      case 'PUT':
        path = path + '?' + requestData
        break
    }

    var http = require('https')
      , port = '443'
      , requestOptions = {
          host    : base_uri,
          port    : port,
          path    : path,
          method  : method,
          headers : headers
        }
    var req = http.request(requestOptions)
    responseHandler(req, cb)
    if (post) req.write(requestData)
    req.end()
  }

  var get = function(path, data, cb) {
        prepareRequest('GET', path, data, cb)
      }
    , post = function(path, data, cb) {
        prepareRequest('POST', path, data, cb)
      }
    , patch = function(path, data, cb) {
        prepareRequest('PATCH', path, data, cb)
      }
    , put = function(path, data, cb) {
        prepareRequest('PUT', path, data, cb)
      }
    , del = function(path, data, cb) {
        prepareRequest('DELETE', path, data, cb)
      }


  var resources = {}

  resources.files = {
    get: function(id, data, cb) {
      get('/files/' + id, data, cb)
    },
    insert: function(data, cb) {
      post('/files', data, cb)
    },
    patch: function(id, data, cb) {
      patch('/files/' + id, data, cb)
    },
    update: function(id, data, cb) {
      put('/files/' + id, data, cb)
    },
    copy: function(id, data, cb) {
      put('/files/' + id + '/copy', data, cb)
    },
    del: function(id, cb) {
      // TODO
    }
  }


  return resources

}
