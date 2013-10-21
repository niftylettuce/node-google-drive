[![Gittip](http://badgr.co/gittip/niftylettuce.png)](https://www.gittip.com/niftylettuce/)

# node-google-drive <sup>[![Version Badge](http://vb.teelaun.ch/niftylettuce/node-google-drive.svg)](https://npmjs.org/package/google-drive)</sup>

Node.js library to access [Google Drive's API](https://developers.google.com/drive/v2/reference/).


## Index

* [Quick Start](#quick-start)
* [Resources](#resources)
* [Contributors](#contributors)
* [License](#license)


## Quick Start

Work in progress -- needs to integrate with OAuth example client/secret, also look into client id stuff.

```bash
npm install google-drive
```

```js
var googleDrive = require('google-drive')

// ...
// add stuff here which gets you a token, fileId, and callback
// ...

var token = 'abc123456'
  , fileId = 'def123456'

function getFile(token, fileId, callback) {
  googleDrive(token).files(fileId).get(callback)
}

function listFiles(token, callback) {
  googleDrive(token).files().get(callback)
}

function callback(err, response, body) {
  if (err) return console.log('err', err)
  console.log('response', response)
  console.log('body', JSON.parse(body))
}
```


## Resources

All API endpoints match the Google Drive documentation here:
<https://developers.google.com/drive/v2/reference/>

Here are a few examples to get you started:

```js
// Files - Get
googleDrive(token).files(id).get(params, callback)

// Files - Insert
googleDrive(token).files().insert(meta, params, callback)

// Files - Patch
googleDrive(token).files(id).patch(meta, params, callback)

// Files - Update
googleDrive(token).files(id).update(meta, params, callback)

// Files - Copy
googleDrive(token).files(id).copy(meta, params, callback)

// Files - Delete
googleDrive(token).files(id).del(callback)

// Files - List
googleDrive(token).files().list(params, callback)

// Files - Touch
googleDrive(token).files(id).touch(callback)

// Files - Trash
googleDrive(token).files(id).trash(callback)

// Files - Untrash
googleDrive(token).files(id).untrash(callback)

// Changes - List
googleDrive(token).changes.list(params, callback)

// Changes - Get
googleDrive(token).chances.get(params, callback)
```


## Contributors

* Nick Baugh <niftylettuce@gmail.com> (http://niftylettuce.com)
* healdessme <hello@coggle.it> (http://coggle.it)
* Zlati Pehlivanov <zlati.pehlivanov@gmail.com>


## License

The MIT License

Copyright (c) 2012- Nick Baugh <niftylettuce@gmail.com> (http://niftylettuce.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

