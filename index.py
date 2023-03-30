from re import split

class Grid:
  def __init__(self, ids, layout):
    self.ids = ids
    self.layout = layout

  def apply_to(self, element):
    i = 0
    known = {}
    children = element.children
    style = element.style
    style.display = "grid";
    style["grid-template-areas"] = self.layout
    for id in self.ids:
      if known[id] == None:
        known[id] = children[i]
        known[id].style["grid-area"] = id
        i = i + 1
    return element

  def css_for(self, selector):
    i = 0
    known = []
    output = [selector + "{display:grid;grid-template-areas:" + self.layout + "}"]
    for id in self.ids:
      if (id in known) == False:
        i = i + 1
        output.append(selector + ">*:nth-child(" + str(i) + "){grid-area:" + id + "}")
        known.append(id)
    return "\n".join(output)

def normalize(layout):
  width = 0
  start = len(layout)
  lines = []
  for line in split("[\r\n]+", layout):
    endLength = len(line.rstrip())
    if endLength:
      width = max(width, endLength)
      start = min(start, len(line) - len(line.lstrip()))
      lines.append(line)
  return "\n".join(map(lambda line: line[start:].ljust(width - start), lines))


def add_dot(row, c, p):
  if c == p:
    c = ""
    row.append(".")
  return c

def grid(layout):
  p = "";
  row = [];
  area = [row];
  for c in normalize(layout):
    match c:
      case " ":
        p = add_dot(row, c, p)
      case "\t":
        p = add_dot(row, c, p)
      case "\n":
        row = []
        area.append(row)
      case _:
        p = c
        row.append("g" + c)
  ids = filter(
    lambda id: id != ".",
    [identifier for row in area for identifier in row]
  )
  layout = " ".join(map(lambda row: f'"{" ".join(row)}"', area))
  return Grid(ids, layout)

# example
print(
  grid(
    """
      h h h
      m m n
      f f f
    """
  ).css_for(".my-page")
)
