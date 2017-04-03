const echo = {
  command: 'echo [whatever...]',
  description: 'A simple echo plugin',
  action: args => console.log(args)
};

module.exports = {
  echo
};
