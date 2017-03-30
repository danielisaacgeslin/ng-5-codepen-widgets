#!/usr/bin/env node

const blessed = require('blessed');
const services = require('./services');
const childProcess = require('child_process');

const screen = blessed.screen({ smartCSR: true });
screen.title = 'seedtag CLI';

const box = blessed.box({ content: '{center}seedtag CLI{/}', tags: true });

/* Sync part */
const syncForm = blessed.form({
  top: 'center',
  left: 'center',
  height: '90%',
  width: '90%',
  // content: 'Hello {bold}seedtag{/bold}',
  tags: true,
  keys: true,
  border: { type: 'line' },
});

let checkboxes;

const selectAll = blessed.checkbox({
  text: 'Select all',
  parent: syncForm,
  top: 0,
  left: 1,
  mouse: true
});

// screen.exec('du', ['-a', '/Users/jivan/tmp']);
selectAll.on('check', obj => {
  checkboxes.forEach(c => c.check());
  screen.render();
});

selectAll.on('uncheck', obj => {
  checkboxes.forEach(c => c.uncheck());
  screen.render();
});


checkboxes = Object.keys(services).map((s, index) => blessed.checkbox({
  text: s,
  parent: syncForm,
  top: index + 1,
  left: 2,
  mouse: true
}));

const confirm = blessed.button({
  content: 'Sync',
  parent: syncForm,
  bottom: 1,
  shrink: true,
  keys: true,
  border: { type: 'line' },
  left: 3,
  shadow: true,
  mouse: true,
  style: {
    focus: { fg: 'black', bg: 'white' },
    hover: { fg: 'black', bg: 'white' }
  }
});

const cancel = blessed.button({
  content: 'Cancel',
  parent: syncForm,
  bottom: 1,
  shrink: true,
  keys: true,
  border: { type: 'line' },
  left: 10,
  shadow: true,
  mouse: true,
  style: {
    focus: { fg: 'black', bg: 'white' },
    hover: { fg: 'black', bg: 'white' }
  }
});

screen.append(box);

/* MAIN PART */
const mainForm = blessed.form({
  // parent: box,
  top: 'center',
  left: 'center',
  height: '90%',
  width: '90%',
  // content: 'Hello {bold}seedtag{/bold}',
  tags: true,
  keys: true,
  border: { type: 'line' },
});

const emptyBox = blessed.box();
const actions = [
  {
    name: 'Sync',
    callback: (cb) => {
      box.remove(mainForm);
      box.append(syncForm);
      syncForm.focus();
      screen.render();
    },
  },
  {
    name: 'DB Dump',
    callback: (cb) => {
      box.remove(mainForm);
      box.append(emptyBox);
      screen.destroy();
      childProcess.exec('st db_dump', {}, () => process.exit());
      // screen.exec('st', ['db_dump'], {}, () => {
      //   process.exit();
      //   screen.render();
      //   box.append(mainForm);
      // });
    }
  },
  {
    name: 'DB Restore',
    callback: (cb) => {
      screen.realloc();
      box.remove(mainForm);
      box.append(emptyBox);
      screen.exec('st', ['db_restore'], {}, () => {
        // process.exit();
        // box.append(mainForm);
        // screen.render();
      });
    }
  }
];


actions.map((a, i) => {
  const button = blessed.button({
    content: a.name,
    parent: mainForm,
    top: i * 3,
    width: 15,
    height: 3,
    // shrink: true,
    keys: true,
    border: { type: 'line' },
    left: 4,
    shadow: true,
    mouse: true,
    style: {
      focus: { fg: 'black', bg: 'white' },
      hover: { fg: 'black', bg: 'white' }
    }
  });
  button.on('press', () => a.callback());
  return button;
});

box.append(mainForm);
mainForm.focus();

confirm.on('press', () => {
  const servicesToSync = checkboxes.filter(c => c.value).map(c => c.text);
  if (servicesToSync.length === 0) {
    box.setContent('You have to select at least one service');
    return screen.render();
  }
  // Don't know how to clear screen
  box.remove(syncForm);
  box.append(emptyBox);
  screen.render();
  // screen.remove(box);
  // screen.append(blessed.box());
  // screen.realloc();
  return screen.exec('st', ['sync'].concat(servicesToSync));
});

cancel.on('press', () => {
  box.remove(syncForm);
  box.append(mainForm);
  mainForm.focus();
  screen.render();
});

screen.render();

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], (ch, key) => process.exit(0));
