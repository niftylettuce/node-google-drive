
//     node-google-drive
//     Copyright (c) 2012- Nick Baugh <niftylettuce@gmail.com> (http://niftylettuce.com)
//     MIT Licensed

// Open source node.js module for accessing Google Drive's API:
// <https://developers.google.com/drive/v1/reference/>

// * Author: [@niftylettuce](https://twitter.com/#!/niftylettuce)
// * Source: <https://github.com/niftylettuce/node-google-drive>

// # node-google-drive

var base_uri = 'https://www.googleapis.com/drive/v2'
  , request = require('request')


function extend(a,b) {
  for (var x in b) a[x] = b[x];
  return a;
}

module.exports = function(access_token) {

  var defaults = {
    headers: {
      Authorization: "Bearer " + access_token
    },
    qs: {}
  }

  function make_request(p) {
    var options = defaults;
    options.qs = extend(options.qs, p.params);
    if (p.meta) {
      options.multipart = [{
        'content-type': 'application/json',
        body: JSON.stringify(p.meta)
      }];
    }
    return request.defaults(options);
  }

  function extract_params(meta, params, cb) {
    if ((!cb) && (!params) && (typeof meta === 'function' ))
      return {meta:{}, params: {}, cb: meta};
    else if ((!cb) && (typeof params === 'function' ))
      return {meta:meta, params: {}, cb: params};
    else return {meta: meta, params:params, cb: cb};
  }

  var resources = {}

  resources.files = function(fileId) {

    return {
      list: function(params, cb) {
        var p = extract_params(undefined, params, cb);
        return make_request(p).get(base_uri + '/files', p.cb);
      },
      insert: function(meta, params, cb) {
        var p = extract_params(meta, params, cb);
        return make_request(p).post(base_uri + '/files', p.cb);
      },
      get: function(params, cb) {
        var p = extract_params(undefined, params, cb);
        return make_request(p).get(base_uri + '/files/' + fileId, p.cb);
      },
      patch: function(meta, params, cb) {
        var p = extract_params(meta, params, cb);
        return make_request(p).patch(base_uri + '/files/' + fileId, p.cb);
      },
      update: function(meta, params, cb) {
        var p = extract_params(meta, params, cb);
        return make_request(p).put(base_uri + '/files/' + fileId, p.cb);
      },
      copy: function(meta, params, cb) {
        var p = extract_params(meta, params, cb);
        return make_request(p).post(base_uri + '/files/' + fileId + '/copy', p.cb);
      },
      del: function(cb) {
        var p = extract_params(undefined, undefined, cb);
        return make_request(p).del(base_uri + '/files/' + fileId, p.cb);
      },
      touch: function(cb) {
        var p = extract_params(undefined, undefined, cb);
        return make_request(p).post(base_uri + '/files/' + fileId, p.cb);
      },
      trash: function(cb) {
        var p = extract_params(undefined, undefined, cb);
        return make_request(p).post(base_uri + '/files/' + fileId + '/trash', p.cb);
      },
      untrash: function(cb) {
        var p = extract_params(undefined, undefined, cb);
        return make_request(p).post(base_uri + '/files/' + fileId + '/untrash', p.cb);
      },

      permissions: function(permId) {
        return {
          list: function(fileId, params, cb) {
            var p = extract_params(undefined, params, cb);
            return make_request(p).get(base_uri + '/files/' + fileId + '/permissions', p.cb);
          },
          patch: function(fileId, permId, params, cb) {
            var p = extract_params(undefined, params, cb);
            return make_request(p).patch(base_uri + '/files/' + fileId + '/permissions/' + permId, p.cb);
          }
        }
      }

    }
  }


  return resources;
}
