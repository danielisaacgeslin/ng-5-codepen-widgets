const blessed = require('blessed');
const services = require('../services');

const box = blessed.box({ content: '{center}seedtag CLI{/}', tags: true });
const form = blessed.form({
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
  parent: form,
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
  parent: form,
  top: index + 1,
  left: 2,
  mouse: true
}));

const confirm = blessed.button({
  content: 'Sync',
  parent: form,
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
  parent: form,
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

// const cancel = blessed.button({
//   text: 'Cancel',
//   parent: form,
//   bottom: 1,
//   left: 5
// });

form.focus();

module.exports = box;
