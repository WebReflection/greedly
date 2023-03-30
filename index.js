const {max, min} = Math;

/**
 * Parse a generic string to understand the underlying grid.
 * @param {string} layout
 * @returns {string}
 */
const normalize = layout => {
  let width = 0;
  let start = Infinity;
  const lines = [];
  for (const line of layout.split(/[\r\n]+/)) {
    const endLength = line.trimEnd().length;
    if (endLength) {
      width = max(width, endLength);
      start = min(start, line.length - line.trimStart().length);
      lines.push(line);
    }
  }
  return lines.map(
    line => line.slice(start).padEnd(width - start)
  ).join('\n');
};

/**
 * Given a generic string representing a grid or just a row,
 * returns an utility able to apply the grid to a generic element
 * or to a generic selector as string.
 * @param {string} layout
 */
export default layout => {
  let p = '';
  let row = [];
  const area = [row];
  for (const c of normalize(layout)) {
    switch (c) {
      case ' ':
      case '\t':
        if (c === p) {
          p = '';
          row.push('.');
        }
        else
          p = c;
        break;
      case '\n':
        area.push(row = []);
        break;
      default:
        p = c;
        // use unique identifiers and allow emoji too (or any other special char)
        row.push('g' + c.split('').map(c => c.charCodeAt(0).toString(36)).join('-'));
        break;
    }
  }
  const ids = area.flat().filter(id => id !== '.');
  layout = area.map(row => `"${row.join(' ')}"`).join(' ');
  return {
    /**
     * Enforces the grid layout to the element and its direct children.
     * @param {Element} element
     */
    applyTo(element) {
      let i = 0;
      const map = new Map;
      const {children, style} = element;
      style.display = 'grid';
      style['grid-template-areas'] = layout;
      for (const id of ids) {
        if (!map.has(id)) {
          const child = children[i++];
          child.style['grid-area'] = id;
          map.set(id, child);
        }
      }
      return element;
    },

    /**
     * Returns valid CSS usable to enforce the grid layout to the specified selector.
     * @param {string} selector
     */
    cssFor(selector) {
      let i = 0;
      const set = new Set;
      const output = [`${selector}{display:grid;grid-template-areas:${layout}}`];
      for (const id of ids) {
        if (!set.has(id)) {
          output.push(`${selector}>*:nth-child(${++i}){grid-area:${id}}`);
          set.add(id);
        }
      }
      return output.join('\n');
    }
  };
};

// BROKEN ⚠  the emoji might fail due multiple combinators.
//            it's much safer to reason about ASCII chars
// const normalize = layout => {
//   let width = 0;
//   let start = Infinity;
//   const lines = [];
//   for (const line of layout.split(/[\r\n]+/)) {
//     const endLength = [...line.trimEnd()].length;
//     if (endLength) {
//       width = max(width, endLength);
//       start = min(start, [...line].length - [...line.trimStart()].length);
//       lines.push(line);
//     }
//   }
//   return lines.map(
//     line => {
//       const row = [...line].slice(start);
//       return Array.from(
//         {length: width - start},
//         (_, i) => (i < row.length ? row[i] : ' ')
//       ).join('');
//     }
//   ).join('\n');
// };
