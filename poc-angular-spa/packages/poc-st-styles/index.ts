import { writeFile } from 'fs'
import { render as renderSass } from 'node-sass';

const filesToCompile: string[] = ['core', 'globals'];

const options: any = {
    // file: './lib/core.scss',
    outputStyle: 'compressed',
    sourceComments: false
};

filesToCompile.map(name => {
    let file: string = `./lib/${name}.scss`;
    renderSass({ ...options, file }, (sassError, result) => {
        if (sassError) return console.error('error', sassError);
        console.log('success', result)
        writeFile(`./dist/${name}.min.css`, result.css, writeError => {
            if(writeError) console.error('error writing file', writeError)
        })
    });
});

