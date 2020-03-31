/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-fallthrough */
/* global  */

import './styles.scss';

const root = document.querySelector('.root');

// Create block for features
const block = document.createElement('div');
block.classList.add('features');
block.innerHTML = `
<ul>
<li>Hold BACKSPACE key with mouse to delete characters continuously</li>
<li>Input characters from physical keyboard are typed in language of virtual keyboard instead system language</li>
<li>Arrow keys for now are not working</li>
</ul>`;
root.appendChild(block);

// Create textarea for keyboard input
const element = document.createElement('textarea');
element.setAttribute('name', 'keyboard');
element.setAttribute('cols', '100');
element.setAttribute('rows', '5');
element.setAttribute('resize', 'false');
element.placeholder = 'Type some text';
element.id = 'textInput';
root.appendChild(element);
const textValue = document.getElementById('textInput');
const Keyboard = {
  layout: {
    mainContainer: null,
    keysContainer: null,
    keys: [],
  },
  keysArray: {
    english: [
      '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
      'tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\',
      'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'enter',
      'shiftL', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'shiftR',
      'ctrl', 'alt', 'commandL', 'space', 'commandR', 'alt', 'leftArr', 'upArr', 'downArr', 'rightArr',
    ],
    english__shift: [
      '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '\u232b',
      'tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|',
      'caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'enter',
      'shiftL', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', 'shiftR',
      'ctrl', 'alt', 'commandL', 'space', 'commandR', 'alt', 'leftArr', 'upArr', 'downArr', 'rightArr',
    ],
    rus: [
      ']', '1', '2', '3', '4', '5', '6', '7', '8', '(', ')', '-', '=', 'backspace',
      'tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', 'ё',
      'caps', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'enter',
      'shiftL', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '/', 'shiftR',
      'ctrl', 'alt', 'commandL', 'space', 'commandR', 'alt', 'leftArr', 'upArr', 'downArr', 'rightArr',
    ],
    rus__shift: [
      '[', '!', '"', '№', '%', ':', ',', '.', ';', '(', ')', '_', '+', 'backspace',
      'tab', 'Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ', 'Ё',
      'caps', 'Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э', 'enter',
      'shiftL', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', '?', 'shiftR',
      'ctrl', 'alt', 'commandL', 'space', 'commandR', 'alt', 'leftArr', 'upArr', 'downArr', 'rightArr',
    ],
    physicalKeyCodes: [
      'null', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'null',
      'null', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash',
      'null', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'null',
      'null', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'null',
      'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null',
    ],
  },
  currentState: {
    value: textValue.value,
    layoutLang: 'en',
    caretPosition: 0,
    capsLock: false,
    shiftKey: false,
    shiftKeySide: null,
    altKey: false,
    ctrlKey: false,
  },
  init() {
    // Create layout for keyboard
    this.layout.mainContainer = document.createElement('div');
    this.layout.keysContainer = document.createElement('div');
    this.layout.mainContainer.classList.add('keyboardContainer');
    this.layout.keysContainer.classList.add('keyboardContainer__keys');
    this.layout.mainContainer.appendChild(this.layout.keysContainer);
    root.appendChild(this.layout.mainContainer);
    // Check localStorage if there is saved last layout language
    switch (this.currentState.layoutLang) {
      case 'ru':
        this.layout.keysContainer.appendChild(this.createKeys(this.keysArray.rus));
        break;
      default:
        this.layout.keysContainer.appendChild(this.createKeys(this.keysArray.english));
    }
    this.layout.keys = this.layout.keysContainer.querySelectorAll('.keyboardContainer__key');

    const label = document.createElement('span');
    const tip = document.createElement('span');
    tip.classList.add('tip');
    tip.innerHTML = 'Input source switch: <b>Shift + Alt</b>';
    label.classList.add('label');
    this.layout.keysContainer.appendChild(label);
    this.layout.keysContainer.appendChild(tip);
    label.textContent = this.currentState.layoutLang.toUpperCase();
    Keyboard.textAreaInput();
    Keyboard.focusOn();
    Keyboard.inputValue();
    Keyboard.keyboardEvents();
  },
  createKeys(langArray) {
    const keys = document.createDocumentFragment();
    langArray.forEach((key) => {
      const btn = document.createElement('button');
      const lineBreak = ['backspace', '\\', 'enter', 'shiftR'].indexOf(key) !== -1; // if the key is one of this, create <br> tag
      btn.setAttribute('type', 'button');
      let interval;
      let timer;
      const deleteChar = () => {
        this.currentState.value = this.currentState.value.substring(0, this.currentState.value.length - 1);
        textValue.value = this.currentState.value;
      };
      switch (key) {
        // Backspace button
        case 'backspace':
          btn.classList.add('keyboardContainer__key', 'keyboardContainer__key-cmd');
          btn.dataset.btnType = 'backspace';
          btn.id = 'backspace';
          btn.innerHTML = '\u232b';
          btn.addEventListener('click', () => {
            deleteChar();
            this.focusOn();
            if (this.currentState.altKey) { // if ALT key is active, turn off when clicking BACKSPACE
              this.altKeyToggle();
            }
          });
          // Add mousedown/up event to implement continuous deletion when holding BACKSPACE button
          btn.addEventListener('mousedown', () => {
            timer = setTimeout(() => {
              interval = setInterval(deleteChar, 50);
            }, 1000);
          });
          btn.addEventListener('mouseup', () => {
            clearInterval(interval);
            clearTimeout(timer);
          });
          break;
          // ENTER button
        case 'enter':
          btn.classList.add('keyboardContainer__key', 'keyboardContainer__key-wide', 'functional');
          btn.innerHTML = 'enter &#8629;';
          btn.id = 'enter';
          btn.addEventListener('click', () => {
            this.currentState.value += '\n';
            this.focusOn();
            if (this.currentState.altKey) {
              this.altKeyToggle();
            }
          });
          break;
          // CAPS-LOCK button
        case 'caps':
          btn.classList.add('keyboardContainer__key', 'keyboardContainer__key-wide', 'functional');
          btn.id = 'capsLock';
          btn.innerHTML = 'caps lock';
          btn.addEventListener('click', () => {
            this.capsLockToggle();
            this.focusOn();
          });
          break;
          // TAB button
        case 'tab':
          btn.classList.add('keyboardContainer__key', 'keyboardContainer__key-cmd', 'functional');
          btn.innerHTML = 'tab &RightArrowBar;';
          btn.id = 'tab';
          btn.addEventListener('click', () => {
            this.tabEvent();
          });
          break;
          // CTRL button
        case 'ctrl':
          btn.classList.add('keyboardContainer__key', 'keyboardContainer__key-wide', 'functional');
          btn.innerHTML = 'ctrl';
          btn.id = 'ctrl';
          this.focusOn();
          break;
          // COMMAND button
        case 'commandL':
          btn.classList.add('keyboardContainer__key', 'keyboardContainer__key-cmd', 'functional');
          btn.innerHTML = '&#8984;&nbsp; cmd';
          btn.id = 'CMDLeft';
          btn.dataset.btnType = 'cmd';
          this.focusOn();
          break;
        case 'commandR':
          btn.classList.add('keyboardContainer__key', 'keyboardContainer__key-cmd', 'functional');
          btn.innerHTML = '&#8984;&nbsp; cmd';
          btn.id = 'CMDRight';
          btn.dataset.btnType = 'cmd';
          this.focusOn();
          break;
          // LEFT SHIFT button
        case 'shiftL':
          btn.classList.add('keyboardContainer__key', 'keyboardContainer__shiftKey', 'functional');
          btn.innerHTML = '&#8679; &nbsp; shift';
          btn.dataset.btnType = 'shift';
          btn.id = 'ShiftLeft';

          btn.addEventListener('click', () => {
            this.shiftKeyToggle('L');
            this.currentState.shiftKeySide = 'L';
          });
          break;
          // RIGHT SHIFT button
        case 'shiftR':
          btn.classList.add('keyboardContainer__key', 'keyboardContainer__shiftKey', 'functional');
          btn.innerHTML = 'shift &nbsp; &#8679;';
          btn.dataset.btnType = 'shift';
          btn.id = 'ShiftRight';
          btn.addEventListener('click', () => {
            this.shiftKeyToggle('R');
            this.currentState.shiftKeySide = 'R';
          });
          break;
          // ALT buttons
        case 'alt':
          btn.classList.add('keyboardContainer__key', 'keyboardContainer__key-cmd', 'functional');
          btn.innerHTML = '&#8997; &nbsp; alt';
          btn.dataset.btnType = 'alt';
          btn.addEventListener('click', () => {
            this.altKeyToggle();
          });
          break;
          // SPACEBAR button
        case 'space':
          btn.classList.add('keyboardContainer__key', 'keyboardContainer__key-extraWide');
          btn.dataset.btnType = 'space';
          btn.id = 'spacebar';
          btn.addEventListener('click', () => {
            this.currentState.value += ' ';
            if (this.currentState.altKey) {
              this.altKeyToggle();
            }
            this.focusOn();
          });
          break;
          // ARROW buttons
        case 'leftArr':
          btn.classList.add('keyboardContainer__key');
          btn.innerHTML = '&#9664;';
          btn.dataset.btnType = 'arrow';
          btn.id = 'leftArr';
          btn.addEventListener('click', () => {
            this.setCaret();
          });
          break;
        case 'rightArr':
          btn.classList.add('keyboardContainer__key');
          btn.innerHTML = '&#9654;';
          btn.dataset.btnType = 'arrow';
          btn.id = 'rightArr';
          break;
        case 'upArr':
          btn.classList.add('keyboardContainer__key');
          btn.innerHTML = '&#9650;';
          btn.dataset.btnType = 'arrow';
          btn.id = 'upArr';
          break;
        case 'downArr':
          btn.classList.add('keyboardContainer__key');
          btn.innerHTML = '&#9660;';
          btn.dataset.btnType = 'arrow';
          btn.id = 'downArr';
          break;
        default: // default action for remaining KEYS
          btn.classList.add('keyboardContainer__key');
          btn.dataset.btnType = 'symbol';
          btn.innerHTML = this.currentState.capsLock ? key.toUpperCase() : key.toLowerCase();
      }
      keys.appendChild(btn);
      if (lineBreak) {
        keys.appendChild(document.createElement('br')); // line break for layout to start a new row
      }
    });
    return keys;
  },
  capsLockToggle() {
    this.currentState.capsLock = !this.currentState.capsLock;
    const capsLock = document.getElementById('capsLock');
    capsLock.classList.toggle('capsLock-active');
    this.layout.keys.forEach((key) => {
      if (this.currentState.capsLock && key.textContent.length === 1) {
        key.textContent = key.textContent.toUpperCase();
      } else {
        key.textContent = key.textContent.toLowerCase();
      }
      if (this.currentState.altKey) {
        this.altKeyToggle();
      }
    });
  },
  shiftKeyToggle(pos) {
    this.currentState.shiftKey = !this.currentState.shiftKey;
    if (this.currentState.altKey) {
      this.altKeyToggle();
    }
    const ShiftLeft = document.getElementById('ShiftLeft');
    const ShiftRight = document.getElementById('ShiftRight');
    const toggleClass = (el) => {
      if (this.currentState.shiftKey) {
        switch (el.id) {
          case 'ShiftLeft':
            ShiftLeft.classList.add('active');
            ShiftRight.classList.remove('active');
            this.currentState.shiftKeySide = 'L';
            break;
          case 'ShiftRight':
            ShiftRight.classList.add('active');
            ShiftLeft.classList.remove('active');
            this.currentState.shiftKeySide = 'R';
            break;
          default: this.currentState.shiftKeySide = '';
        }
      } else {
        ShiftRight.classList.remove('active');
        ShiftLeft.classList.remove('active');
      }
    };
    switch (pos) {
      case 'L':
        toggleClass(ShiftLeft);
        break;
      case 'R':
        toggleClass(ShiftRight);
        break;
      default:
        ShiftRight.classList.remove('active');
        ShiftLeft.classList.remove('active');
        this.currentState.shiftKeySide = null;
    }
    this.switchShiftSymbol();
  },
  switchShiftSymbol() { // fire this method to switch symbols to UPPERCASE or LOWERCASE
    this.layout.keys.forEach((key, index) => {
      if (this.currentState.shiftKey && key.dataset.btnType === 'symbol') {
        if (this.currentState.layoutLang === 'ru') {
          key.textContent = this.keysArray.rus__shift[index];
        } else if (this.currentState.layoutLang === 'en') {
          key.textContent = this.keysArray.english__shift[index];
        }
      } else if (!this.currentState.shiftKey && key.dataset.btnType === 'symbol') {
        if (this.currentState.layoutLang === 'ru') {
          key.textContent = this.keysArray.rus[index];
        } else if (this.currentState.layoutLang === 'en') {
          key.textContent = this.keysArray.english[index];
        }
      }
      if (this.currentState.altKey && !this.currentState.shiftKey) {
        this.altKeyToggle();
      }
      this.focusOn();
    });
  },
  changeLang() { // this method changes input language
    if (this.currentState.layoutLang === 'en') {
      this.currentState.layoutLang = 'ru';
      this.shiftKeyToggle();
    } else {
      this.currentState.layoutLang = 'en';
      this.shiftKeyToggle();
    }
    this.langLabel();
  },
  altKeyToggle() {
    const alt = document.querySelectorAll('[data-btn-type="alt"]');
    this.currentState.altKey = !this.currentState.altKey;
    if (this.currentState.shiftKey) {
      this.changeLang();
    }
    alt.forEach((key) => {
      key.classList.toggle('active');
    });
  },
  tabEvent() {
    this.currentState.value += '    ';
    this.focusOn();
    if (this.currentState.altKey) {
      this.altKeyToggle();
    }
  },
  inputValue() { // this method assigns clicked symbol from virtual keyboard to TEXTAREA
    const keys = document.querySelectorAll('[data-btn-type="symbol"]');
    keys.forEach((key) => {
      key.addEventListener('click', () => {
        this.inputValueEvent(key);
      });
    });
    this.currentState.shiftKeySide = '';
  },
  inputValueEvent(elem) {
    this.currentState.value += (this.currentState.capsLock || this.currentState.shiftKey) ? elem.innerHTML.toUpperCase() : elem.innerHTML.toLowerCase();
    if (this.currentState.shiftKey === true) { // if SHIFT is active, get UPPERCASE symbol & turn it off after input
      this.shiftKeyToggle(this.currentState.shiftKeySide);
    }
    if (this.currentState.altKey) {
      this.altKeyToggle();
    }
    textValue.value = this.currentState.value;
    this.currentState.caretPosition += 1;
    this.focusOn();
  },
  textAreaInput() { // event listener for textarea input change
    textValue.addEventListener('input', () => {
      this.currentState.value = textValue.value;
    });
  },
  focusOn() { // this method sets the caret to certain position, not so good for now, but it works somehow :)
    const pos = this.currentState.value.length;
    textValue.setSelectionRange(pos, pos);
    textValue.focus();
  },
  langLabel() { // this method changes input language label
    const label = document.querySelector('.label');
    label.textContent = this.currentState.layoutLang.toUpperCase();
  },
  setLang() { // sets input language when app is initialized
    const lang = localStorage.getItem('Keyboard__props');
    if (lang) {
      this.currentState.layoutLang = JSON.parse(lang);
    }
    return 'en';
  },
  keyboardEvents() { // connecting physical keyboard events with virtual one
    const altKey = document.querySelectorAll('[data-btn-type="alt"]');
    const ctrlKey = document.getElementById('ctrl');
    const LShift = document.getElementById('ShiftLeft');
    const RShift = document.getElementById('ShiftRight');
    const cmd = document.querySelectorAll('[data-btn-type="cmd"]');
    const enter = document.getElementById('enter');
    const bs = document.getElementById('backspace');
    const tab = document.getElementById('tab');
    const caps = document.getElementById('capsLock');
    const space = document.getElementById('spacebar');
    const leftArr = document.getElementById('leftArr');
    const rightArr = document.getElementById('rightArr');
    const upArr = document.getElementById('upArr');
    const downArr = document.getElementById('downArr');
    const switchClass = (el) => {
      if (el instanceof NodeList) {
        el.forEach((key) => {
          key.classList.add('active');
        });
      } else {
        el.classList.add('active');
      }
    };
    window.addEventListener('keydown', (e) => {
      const typedChar = e.code;
      let indexOfKey = null;
      this.keysArray.physicalKeyCodes.forEach((key, index) => {
        if (key === typedChar) {
          indexOfKey = index;
        }
      });
      switch (e.code) {
        case 'ShiftLeft':
          switchClass(LShift);
          this.currentState.shiftKey = true;
          this.switchShiftSymbol();
          break;
        case 'ShiftRight':
          switchClass(RShift);
          this.currentState.shiftKey = true;
          this.switchShiftSymbol();
          break;
        case 'AltLeft': switchClass(altKey);
          break;
        case 'AltRight': switchClass(altKey);
          break;
        case 'ControlLeft': switchClass(ctrlKey);
          break;
        case 'MetaLeft': switchClass(cmd);
          break;
        case 'MetaRight': switchClass(cmd);
          break;
        case 'Enter': switchClass(enter);
          break;
        case 'Backspace': switchClass(bs);
          break;
        case 'Tab':
          e.preventDefault();
          this.tabEvent();
          switchClass(tab);
          break;
        case 'CapsLock':
          caps.classList.add('active');
          this.capsLockToggle();
          caps.classList.remove('active');
          break;
        case 'Space': switchClass(space);
          break;
        case 'ArrowLeft': switchClass(leftArr);
          break;
        case 'ArrowRight': switchClass(rightArr);
          break;
        case 'ArrowUp': switchClass(upArr);
          break;
        case 'ArrowDown': switchClass(downArr);
          break;
        default:
          e.preventDefault();
          switchClass(this.layout.keys[indexOfKey]);
          this.inputValueEvent(this.layout.keys[indexOfKey]);
      }
      if (e.shiftKey && e.altKey) {
        this.changeLang();
      }
    });
    this.currentState.shiftKey = false;

    window.addEventListener('keyup', () => {
      caps.classList.remove('active');
      this.currentState.shiftKey = false;
      this.switchShiftSymbol();
      this.layout.keys.forEach((key) => {
        key.classList.remove('active');
      });
    });
  },
};

window.addEventListener('DOMContentLoaded', () => {
  Keyboard.setLang();
  Keyboard.init();
});

window.addEventListener('unload', () => {
  localStorage.setItem('Keyboard__props', JSON.stringify(Keyboard.currentState.layoutLang));
});
