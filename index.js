const fs = require('fs');
const path = require('path');
const minify = require('minify');
const https = require('https');

https.get('https://raw.githubusercontent.com/kiipy/whatt/master/build/whatt.min.js', (response) => {
    var data = '';

    response.on('data', (chunk) => {
        data += chunk;
    });

    response.on('end', () => {
        writeFiles(createBundle(data));
    });
}).on('error', (error) => {
    console.log('Error: ' + error.message);
});

const createBundle = (library) => {
    var bundle = '';
    bundle += library + '\n\n';

    for (const file of fs.readdirSync('./src')) {
        bundle += fs.readFileSync(path.join(__dirname, `/src/${file}`)) + '\n\n';
    }

    return bundle;
}

const writeFiles = (bundle) => {
    fs.mkdir(path.join(__dirname, '/build/'), () => {
        fs.writeFile(path.join(__dirname, '/build/walang.js'), bundle, () => {
            minify('./build/walang.js').then((bundle_minified) => {
                fs.writeFileSync(path.join(__dirname, '/build/walang.min.js'), bundle_minified)
            });
        });
    });
}