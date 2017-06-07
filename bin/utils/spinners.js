const MultispinnerLib = require('multispinner');
const cliSpinners = require('cli-spinners');
const Spinners = require('multispinner/lib/spinners');

module.exports.Multilogger = class Multilogger {
  addLogger(id, text) { //eslint-disable-line
    console.log(text);
  }
  setText(id, text) { //eslint-disable-line
    console.log(text);
  }
  setSuccess(id) {} // eslint-disable-line
  setError(id) {} // eslint-disable-line
};

module.exports.Multispinner = class Multispinner {
  static getInitialSpinner(id, text) {
    const baseSpinner = {};
    baseSpinner[id] = text;
    return baseSpinner;
  }

  addLogger(id, text) {
    if (this.multispinner) {
      this.multispinner.spinners[id] = Spinners.prototype.spinnerObj(text);
      return;
    }
    this.multispinner = new MultispinnerLib(Multispinner.getInitialSpinner(id, text), {
      frames: cliSpinners.dots.frames
    });
  }
  setText(id, text) {
    this.multispinner.spinners[id].text = text;
  }
  setSuccess(id) {
    this.multispinner.success(id);
  }
  setError(id) {
    this.multispinner.error(id);
  }
};

module.exports.Logger = class Logger {
  constructor(multilogger, id, initial) {
    this._multilogger = multilogger;
    this._id = id;
    this._txt = initial;
    this._multilogger.addLogger(id, this.getText());
  }

  getText() {
    return `${this._id} ${this._txt}`;
  }

  set text(txt) {
    this._txt = txt;
    this._multilogger.setText(this._id, this.getText());
  }

  success(txt) {
    this._multilogger.setSuccess(this._id);
    this.text = txt;
  }
  error(txt) {
    this._multilogger.setError(this._id);
    this.text = txt;
  }
};
