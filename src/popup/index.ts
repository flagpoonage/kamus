import { createRoot } from 'react-dom/client';
import { Root } from './components/Root';
import { createElement } from 'react';
const root_id = 'root';

function getRootElement() {
  const el = document.getElementById(root_id);
  if (el) {
    return el;
  }

  const new_el = document.createElement('div');
  new_el.id = root_id;
  document.body.appendChild(new_el);
  return new_el;
}

document.addEventListener('DOMContentLoaded', () => {
  const react_root = createRoot(getRootElement());
  react_root.render(createElement(Root));
});
