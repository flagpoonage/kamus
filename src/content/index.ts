import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import { Root } from './components/Root';

const root_el = 'x-kamus-root';

function getRootElement() {
  const [el] = document.getElementsByTagName(root_el);
  if (el) {
    return el;
  }

  const new_el = document.createElement(root_el);
  document.body.appendChild(new_el);
  return new_el;
}

function onReady() {
  const react_root = createRoot(getRootElement());
  react_root.render(createElement(Root));
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', onReady)
  : onReady();
