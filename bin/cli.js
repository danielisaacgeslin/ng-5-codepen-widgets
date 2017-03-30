const blessed = require('blessed');
const services = require('./services');

const screen = blessed.screen({ smartCSR: true });
screen.title = 'seedtag CLI';

const box = blessed.box({ content: '{center}seedtag CLI{/}', tags: true });

/* Sync part */
const syncForm = blessed.form({
  parent: box,
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

confirm.on('press', () => {
  const servicesToSync = checkboxes.filter(c => c.value).map(c => c.text);
  if (servicesToSync.length === 0) {
    box.setContent('You have to select at least one service');
    return screen.render();
  }
  return screen.exec('st', ['sync'].concat(servicesToSync));
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

cancel.on('press', () => {
  screen.remove(box);
  const newBox = blessed.box({ content: 'Cancelado', tags: true });
  newBox.on('click', () => {
    screen.remove(newBox);
    screen.append(box);
    screen.render();
  });
  screen.append(newBox);
  screen.render();
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

const actions = [
  {
    name: 'Sync',
    callback: () => {
      box.remove(mainForm);
      box.append(syncForm);
      screen.render();
    },
  },
  {
    name: 'DB Dump',
    callback: () => {
      screen.exec('st', ['db_dump']);
    }
  },
  {
    name: 'DB Dump',
    callback: () => {
      screen.exec('st', ['db_dump']);
    }
  }
];

// const DBDump = blessed.button({
//   content: 'Cancel',
//   parent: syncForm,
//   bottom: 1,
//   shrink: true,
//   keys: true,
//   border: { type: 'line' },
//   left: 10,
//   shadow: true,
//   mouse: true,
//   style: {
//     focus: { fg: 'black', bg: 'white' },
//     hover: { fg: 'black', bg: 'white' }
//   }
// });

// DBDump.on('press', () => {
//   screen.remove(box);
//   const newBox = blessed.box({ content: 'Cancelado', tags: true });
//   newBox.on('click', () => {
//     screen.remove(newBox);
//     screen.append(box);
//     screen.render();
//   });
//   screen.append(newBox);
//   screen.render();
// });

// const DBRestore = blessed.button({
//   content: 'Sync',
//   parent: syncForm,
//   bottom: 1,
//   shrink: true,
//   keys: true,
//   border: { type: 'line' },
//   left: 3,
//   shadow: true,
//   mouse: true,
//   style: {
//     focus: { fg: 'black', bg: 'white' },
//     hover: { fg: 'black', bg: 'white' }
//   }
// });

// DBRestore.on('press', () => {
//   const servicesToSync = checkboxes.filter(c => c.value).map(c => c.text);
//   if (servicesToSync.length === 0) {
//     box.setContent('You have to select at least one service');
//     return screen.render();
//   }
//   return screen.exec('st', ['sync'].concat(servicesToSync));
// });

screen.render();

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], (ch, key) => process.exit(0));
