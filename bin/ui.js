#!/usr/bin/env node

const blessed = require('blessed');
const repositories = require('./repositories');
const childProcess = require('child_process');

const screen = blessed.screen({ smartCSR: true });
screen.title = 'seedtag CLI';

const box = blessed.box({ content: '{center}seedtag CLI{/}', tags: true });

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

const selectAll = blessed.checkbox({
  text: 'Select all',
  parent: syncForm,
  top: 0,
  left: 1,
  mouse: true
});

const checkboxes = Object.keys(repositories).map((r, index) => blessed.checkbox({
  text: r,
  parent: syncForm,
  top: index + 1,
  left: 2,
  mouse: true,
  style: {
    focus: { fg: 'black', bg: 'white' },
    hover: { fg: 'black', bg: 'white' }
  }
}));

const actions = [
  {
    name: 'Sync selected repos',
    callback: (cb) => {
      const reposToSync = checkboxes.filter(c => c.value).map(c => c.text);
      if (reposToSync.length === 0) {
        box.setContent('You have to select at least one repo');
        return screen.render();
      }
      screen.destroy();
      return childProcess.spawn('st', ['sync'].concat(reposToSync), { stdio: 'inherit' });
    },
  },
  {
    name: 'DB Dump',
    callback: (cb) => {
      screen.destroy();
      console.log('Dumping db');
      screen.exec('st', ['db_dump'], {}, () => process.exit());
    }
  },
  {
    name: 'DB Restore',
    callback: (cb) => {
      screen.destroy();
      console.log('Restoring today\'s db');
      screen.exec('st', ['db_restore'], {}, () => process.exit());
    }
  },
  {
    name: 'Exit (q/Esc/Ctrl+c)',
    callback: (cb) => {
      console.log('Ciao!');
      process.exit();
    }
  }
];

selectAll.on('check', obj => {
  checkboxes.forEach(c => c.check());
  screen.render();
});

selectAll.on('uncheck', obj => {
  checkboxes.forEach(c => c.uncheck());
  screen.render();
});

actions.map((a, i) => {
  const button = blessed.button({
    content: a.name,
    parent: syncForm,
    bottom: 2,
    width: 21,
    height: 3,
    shrink: true,
    keys: true,
    border: { type: 'line' },
    left: i * 24,
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

screen.append(box);
box.append(syncForm);
syncForm.focus();
screen.render();

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], (ch, key) => process.exit(0));
