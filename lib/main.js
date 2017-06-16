
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

  function make_request(p, multipart) {
    if (arguments.callee.length == 1) multipart = true;
    var options = defaults;
    options.qs = extend(options.qs, p.params);
    if (multipart && p.meta) {
      options.multipart = [{
        'content-type': 'application/json',
        body: JSON.stringify(p.meta)
      }];
    } else  {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(p.meta);
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
          list: function(params, cb) {
            var p = extract_params(undefined, params, cb);
            return make_request(p).get(base_uri + '/files/' + fileId + '/permissions', p.cb);
          },
          patch: function(meta, params, cb) {
            var p = extract_params(meta, params, cb);
            return make_request(p).patch(base_uri + '/files/' + fileId + '/permissions/' + permId, p.cb);
          },
          update: function(meta, params, cb) {
            var p = extract_params(meta, params, cb);
            return make_request(p).put(base_uri + '/files/' + fileId + '/permissions/' + permId, p.cb);
          },
          insert: function(meta, params, cb) {
            var p = extract_params(meta, params, cb);
            return make_request(p).post(base_uri + '/files/' + fileId + '/permissions', p.cb);
          },
          getIdForEmail: function(email, params, cb) {
            var p = extract_params(undefined, params, cb);
            return make_request(p).get(base_uri + '/permissionIds/' + email, p.cb);
          }
        }
      }
    }
  }

  resources.about = function(fileId) {

    return {
      get: function(params, cb) {
        var p = extract_params(undefined, params, cb);
        return make_request(p).get(base_uri + '/about', p.cb);
      },
    }
  }

	/*
		Changes
		For Changes Resource details, see below about Resource representations.
		Method	HTTP request	Description
		URIs relative to https://www.googleapis.com/drive/v2, unless otherwise noted
		get		GET  /changes/changeId	 	Gets a specific change.
		list	GET  /changes	 			Lists the changes for a user.
		
		Resource representations
		Representation of a change to a file.
		{
		  "kind": "drive#change",
		  "id": long,
		  "fileId": string,
		  "selfLink": string,
		  "deleted": boolean,
		  "file": files Resource
		}
		Property name	Value			Description	Notes
		kind			string			This is always drive#change.	
		id				long			The ID of the change.	
		fileId			string			The ID of the file associated with this change.	
		selfLink		string			A link back to this change.	
		deleted			boolean			Whether the file has been deleted.	
		file			nested object	The updated state of the file. Present if the file has not been deleted.
	*/
  
	resources.changes = function(changeId) {
		return {
			list: function(params, cb) {
				var p = extract_params(undefined, params, cb);
				return make_request(p).get(base_uri + '/changes', p.cb);
			},
			get: function(params, cb) {
				var p = extract_params(undefined, params, cb);
				return make_request(p).get(base_uri + '/changes/' + changeId, p.cb);
			}
		}
	}
  
  resources.changes.watch = function(channel_id, callback_address, token, ttl, params, cb) {
    var body = {
      id: channel_id,
      type: "web_hook",
      address: callback_address,
      token:token,
      params:{
        ttl: ttl
      }
    }
    var p = extract_params(body, params, cb);
    return make_request(p, false).post(base_uri + '/changes/watch', p.cb);
  }

  return resources;
}
