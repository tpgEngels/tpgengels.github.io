Math.seedrandom('test');
var warehouse = null

var nAisles = 8
var nProd = 12
// Make a grid of the warehouse
var gridSizeX = 3 * nAisles
var gridSizeY = nProd + 2
var ordersize = 8

const LminusDict = {
  "UU1C": [[1, "UU1C"]],
  "E01C": [[2, "E01C"], [4, "EE2C"], [5, "001C"]],
  "0E1C": [[3, "0E1C"], [4, "EE2C"], [5, "001C"]],
  "EE1C": [[2, "E01C"], [3, "0E1C"], [4, "EE1C"], [5, "001C"]],
  "EE2C": [[4, "EE2C"]],
  "000C": [[5, "000C"]],
  "001C": [[5, "001C"]]
}
// const LplusDict = {
//   "UU1C": [[1, "EE1C"], [2, "UU1C"], [3, "UU1C"], [4, "UU1C"], [5, "UU1C"], [6, "UU1C"]],
//   "E01C": [[1, "UU1C"], [2, "E01C"], [3, "EE2C"], [4, "EE2C"], [5, "EE1C"], [6, "E01C"]],
//   "0E1C": [[1, "UU1C"], [2, "EE2C"], [3, "0E1C"], [4, "EE2C"], [5, "EE1C"], [6, "0E1C"]],
//   "EE1C": [[1, "UU1C"], [2, "EE1C"], [3, "EE1C"], [4, "EE1C"], [5, "EE1C"], [6, "EE1C"]],
//   "EE2C": [[1, "UU1C"], [2, "EE2C"], [3, "EE2C"], [4, "EE2C"], [5, "EE1C"], [6, "EE2C"]],
//   "000C": [[1, "UU1C"], [2, "E01C"], [3, "0E1C"], [4, "EE2C"], [5, "EE1C"], [6, "000C"]],
//   "001C": [[6, "001C"]]
// }
const LplusDict = {
  "UU1C": [[1, "EE1C"], [2, "UU1C"], [3, "UU1C"], [4, "UU1C"], [5, "UU1C"]],
  "E01C": [[1, "UU1C"], [2, "E01C"], [3, "EE2C"], [4, "EE2C"], [5, "E01C"]],
  "0E1C": [[1, "UU1C"], [2, "EE2C"], [3, "0E1C"], [4, "EE2C"], [5, "0E1C"]],
  "EE1C": [[1, "UU1C"], [2, "EE1C"], [3, "EE1C"], [4, "EE1C"], [5, "EE1C"]],
  "EE2C": [[1, "UU1C"], [2, "EE2C"], [3, "EE2C"], [4, "EE2C"], [5, "EE2C"]],
  "000C": [[1, "UU1C"], [2, "E01C"], [3, "0E1C"], [4, "EE2C"], [5, "000C"]],
  "001C": [[5, "001C"]]
}


// Class used for the cross-aisle detection and drawing of lines
class crossAisle {
  constructor(elem, crossPoint, inx, route, top = 1) {
    this.elem = elem
    this.crossPoint = crossPoint
    this.route = route
    this.inx = inx

    var c3 = document.createElement("div")
    c3.className = "crossAisle"
    c3.id = "crossAisle"
    c3.style.position = "absolute"
    c3.style.top = elem.clientHeight * 1 / 3 * top + "px"
    c3.style.left = 0
    c3.style.width = elem.style.width
    c3.style.height = elem.clientHeight * 2 / 3 + "px"
    c3.style.zIndex = -10
    c3.style.pointerEvents = "none"
    this.aisle = c3
    this.elem.appendChild(c3)

    this.visits = 0
    this.elem.addEventListener("mouseenter", this.mouseEnter.bind(this))
    this.lineElems = []
  }

  mouseEnter(e) {
    this.route.crossAisleEnter(e, this)
  }

  addVisit() {
    this.visits += 1
    if (this.visits == 1) {
      const line = document.createElement("div");
      line.className = "visitLine";
      line.style.position = "absolute";
      line.style.height = "2px";
      line.style.width = "100%"
      line.style.backgroundColor = "red";
      line.style.top = `50%`;
      this.aisle.appendChild(line);
      this.lineElems.unshift(line)
    }
    if (this.visits == 2) {
      this.lineElems[0].style.top = "25%"
      const line = document.createElement("div");
      line.className = "visitLine";
      line.style.position = "absolute";
      line.style.height = "2px";
      line.style.width = "100%"
      line.style.backgroundColor = "red";
      line.style.top = `75%`;
      this.aisle.appendChild(line);
      this.lineElems.unshift(line)
    }
    if (this.visits == 3) {
      const line = document.createElement("div");
      line.className = "visitLine";
      line.style.position = "absolute";
      line.style.height = "2px";
      line.style.width = "100%"
      line.style.backgroundColor = "red";
      line.style.top = `50%`;
      this.aisle.appendChild(line);
      this.lineElems.unshift(line)
    }
  }

  addCrossing() {
    this.visits += 1

    if (this.visits == 1) {
      // Making of the ``roundabout"

      for (var i = 0; i <= 75; i = i + 75) {
        for (var j = 25; j <= 75; j = j + 25) {
          var line = document.createElement("div")
          line.style.position = "absolute"
          line.style.top = `${j}%`
          if (j == 50) {
            var x = "25%"
            var y = `${i}%`
          }
          else {
            var x = "100%"
            var y = "0%"
          }
          line.style.left = y
          line.style.width = x
          line.style.height = `2px`
          line.style.backgroundColor = "red"
          this.aisle.appendChild(line)

          line = document.createElement("div")
          line.style.position = "absolute"
          line.style.top = y
          line.style.left = `${j}%`
          line.style.height = x
          line.style.width = `2px`
          line.style.backgroundColor = "red"
          this.aisle.appendChild(line)

        }
      }

    }
  }

  removeReturn() {
  }

  removeRoute() {
    this.visits = 0
    while (this.aisle.lastElementChild) {
      this.aisle.removeChild(this.aisle.lastElementChild)
    }
  }

  removeVisit() {
    this.visits += - 1
    if (this.crossPoint & this.visits == 0) {
      while (this.aisle.firstChild) {
        this.aisle.removeChild(this.aisle.firstChild);
      }
    }
    if (!this.crossPoint) {
      const x = this.visits
      this.visits = 0
      while (this.aisle.firstChild) {
        this.aisle.removeChild(this.aisle.firstChild);
      }
      for (var i = 0; i < Math.min(x, 3); i++) {
        this.addVisit()
      }
    }
  }
}

// Class used for the aisle detection and drawing of lines
class Aisle {
  constructor(elem, inx, route, prodLocs) {
    this.elem = elem
    this.inx = inx
    this.route = route

    this.prodLocs = prodLocs

    // Add the routing shell
    var c3 = document.createElement("div")
    c3.className = "Aisle"
    c3.id = "Aisle"
    c3.style.position = "absolute"
    c3.style.top = 0
    c3.style.left = elem.clientWidth / 3 + "px"
    c3.style.width = elem.clientWidth / 3 + "px"
    c3.style.height = elem.style.height
    c3.style.zIndex = -10
    c3.style.pointerEvents = "none"
    this.aisle = c3
    this.return = false
    this.elem.appendChild(c3)
    this.pickLocations = []

    // For the making of the routes, add a listener and keep track of visits
    this.visits = 0
    this.lineElems = []
    this.elem.addEventListener("mouseenter", this.mouseEnter.bind(this))
  }

  addItem(right) {
    this.pickLocations.push(right)
    var el = this.prodLocs[right]
    el.style.backgroundColor = 'black'
  }

  pickItem() {
    for (var i = 0; i < this.pickLocations.length; i++) {
      var el = this.prodLocs[this.pickLocations[i]]
      el.style.backgroundColor = 'green'
    }
  }

  removeRoute() {
    this.visits = 0
    this.return = false
    while (this.aisle.lastElementChild) {
      this.aisle.removeChild(this.aisle.lastElementChild)
    }
    for (var i = 0; i < this.pickLocations.length; i++) {
      var el = this.prodLocs[this.pickLocations[i]]
      el.style.backgroundColor = 'black'
    }
  }

  mouseEnter(e) {
    this.route.aisleEnter(e, this)
  }

  addReturn(direction) {
    this.return = true
    this.visits += 1
    this.lineElems[0].style.left = `25%`

    // Add a horizontal line
    var line = document.createElement("div")
    line.className = "returnLine";
    line.id = "returnLine"
    line.style.position = "absolute";
    line.style.width = `50%`;
    line.style.height = "2px";
    line.style.left = `25%`;
    line.style.top = `${(50 - direction * 50)}%`;
    line.style.backgroundColor = "red";
    this.aisle.appendChild(line);
    this.returnLine = line

    // add the returning line
    line = document.createElement("div")
    line.className = "visitLine";
    line.style.position = "absolute";
    line.style.width = "2px";
    line.style.height = "100%";
    line.style.left = `75%`;
    line.style.backgroundColor = "red";
    this.aisle.appendChild(line);
  }

  addVisit() {
    this.visits += 1
    if (this.visits == 1) {
      const line = document.createElement("div");
      line.className = "visitLine";
      line.style.position = "absolute";
      line.style.width = "2px";
      line.style.height = "100%"
      line.style.backgroundColor = "red";
      line.style.left = `50%`;
      this.aisle.appendChild(line);
      this.lineElems.unshift(line)
    }
    if (this.visits == 2) {
      this.lineElems[0].style.left = "25%"
      const line = document.createElement("div");
      line.className = "visitLine";
      line.style.position = "absolute";
      line.style.width = "2px";
      line.style.height = "100%"
      line.style.backgroundColor = "red";
      line.style.left = `75%`;
      this.aisle.appendChild(line);
      this.lineElems.unshift(line)
    }
    if (this.visits == 3) {
      const line = document.createElement("div");
      line.className = "visitLine";
      line.style.position = "absolute";
      line.style.width = "2px";
      line.style.height = "100%"
      line.style.backgroundColor = "red";
      line.style.left = `50%`;
      this.aisle.appendChild(line);
      this.lineElems.unshift(line)
    }
  }

  removeVisit() {
    this.visits += -1 - this.return
    if (!this.return | this.visit <= 1) {
      this.return = false
      const x = this.visits
      this.visits = 0
      while (this.aisle.firstChild) {
        this.aisle.removeChild(this.aisle.firstChild);
      }
      for (var i = 0; i < Math.min(x, 3); i++) {
        this.addVisit()
      }
    }
    if (this.return & this.visits == 2) {
      lineElems[0].remove()
    }
  }

  removeReturn() {
    if (this.return & this.visits == 2) {
      this.visits = 0
      while (this.aisle.firstChild) {
        this.aisle.removeChild(this.aisle.firstChild);
      }
      this.addVisit()
    }
  }
}

// Class used for the saving of the route
class Route {
  constructor(wh) {
    this.wh = wh
    this.cellDict = wh.cellDict

    // STARTING VISIT LOCATION IS I/O POINT
    this.cur = [1, gridSizeY]
    // make the list of visits
    this.routeList = [[1, gridSizeY]]

    this.started = false
    this.visitList = []
    this.visitLeft = []
  }

  getdist(i, j, inew, jnew) {
    return Math.abs(i - inew) + Math.abs(j - jnew)
  }

  checkVisit(l) {
    return this.visitList.some((value) => (value[0] == l[0]) & (value[1] == l[1]))
  }

  IOClick() {
    if (!this.started) {
      this.newRoute()
      this.started = true
    }
    else {
      if ((this.visitLeft.length == 0) & (this.cur[0] == 1) & (this.cur[1] == gridSizeY - 1)) {
        this.wh.pushRoute(this.routeList)
        console.log(this.routeList)
      }
    }
  }

  newRoute() {
    for (var key in this.cellDict) {
      this.cellDict[key]["cell"].removeRoute()
    }

    this.visitLeft = this.visitList
    // STARTING VISIT LOCATION IS I/O POINT
    this.cur = [1, gridSizeY]
    // make the list of visits
    this.routeList = [[1, gridSizeY]]

    this.started = false
  }

  aisleEnter(e, aislecell) {
    if (this.started) {
      const [i, j] = aislecell.inx

      var [lasti, lastj] = this.routeList[0]
      var dist = this.getdist(this.cur[0], this.cur[1], i, j)
      var curCell = this.cellDict["cell" + this.cur[0] + "_" + this.cur[1]]["cell"]

      if (dist == 1) {
        // if last then remove this visit
        if (this.getdist(lasti, lastj, i, j) == 0) {
          if (!this.checkVisit(this.cur) | curCell.visits >= 2) {
            this.routeList.shift()
            var oldc = this.cellDict["cell" + this.cur[0] + "_" + this.cur[1]]["cell"]
            oldc.removeVisit()
            aislecell.removeReturn()
            this.cur = [i, j]
          } else {
            const direction = j - this.cur[1]
            curCell.addReturn(direction)
            this.routeList.unshift(this.cur)
            this.cur = [i, j]
            aislecell.addVisit()
          }
        }
        else {
          // Check direction we move into the aisle
          aislecell.addVisit()
          if (this.checkVisit([i, j])) {
            this.visitLeft = this.visitLeft.filter((x) => (x[0] != i | x[1] != j))
            aislecell.pickItem()
          }
          this.routeList.unshift(this.cur)
          this.cur = [i, j]
        }
      }
    }

  }

  crossAisleEnter(e, aislecell) {
    if (this.started) {
      const [i, j] = aislecell.inx

      var [lasti, lastj] = this.routeList[0]
      var dist = this.getdist(this.cur[0], this.cur[1], i, j)

      if (dist == 1) {
        // if last then remove this visit
        if (this.getdist(lasti, lastj, i, j) == 0) {
          var curCell = this.cellDict["cell" + this.cur[0] + "_" + this.cur[1]]["cell"]
          if (!this.checkVisit(this.cur) | curCell.visit >= 2) {
            this.routeList.shift()
            curCell.removeVisit()
            aislecell.removeReturn()
            this.cur = [i, j]
          } else {
            const direction = j - this.cur[1]
            curCell.addReturn(direction)
            this.routeList.unshift(this.cur)
            this.cur = [i, j]
          }
        }
        else {
          this.routeList.unshift(this.cur)
          this.cur = [i, j]
          if (i % 3 == 1) {
            aislecell.addCrossing()
          }
          else {
            aislecell.addVisit()
          }
        }
      }
    }
  }
}

// Class of the warehouse environment with the visual shell
class Warehouse {
  constructor() {
    // Build the warehouse and the IO point
    var warehouse = document.getElementById("warehouse");
    var dimensions = warehouse.getBoundingClientRect()
    var xoff = dimensions.x + warehouse.clientWidth * 25 / 1000; var yoff = dimensions.y + warehouse.clientHeight * 25 / 1000
    var width = warehouse.clientWidth * 95 / 100; var length = warehouse.clientHeight * 90 / 100
    this.warehouse = warehouse
    // Add the IO point
    var io = document.createElement("div")
    io.id = "IO"
    io.style.top = "92.5%"
    io.style.position = "absolute"
    io.style.left = width / (2 * gridSizeX) + warehouse.clientWidth * 25 / 1000 + "px"
    io.style.width = 2 * width / gridSizeX + "px"
    io.style.border = "1px solid black"
    io.innerHTML = "I/O"
    io.style.textAlign = "center"
    io.style.height = warehouse.clientHeight * 75 / 1000 + "px"
    io.style.lineHeight = io.style.height
    this.io = io
    this.warehouse.appendChild(io)

    // Make an instance of the route-class
    this.route = new Route(this)
    // Make an empty visitList that will later be passed to the route
    this.visitList = []

    // Make aisles and cross-aisles for mousemovement detection
    this.cellDict = {};
    this.itemLocs = [];
    // Make item locations and the aisle used for detection 
    for (var i = 0; i < nAisles; i++) {
      for (var j = 1; j <= nProd; j++) {
        var c = document.createElement("div")
        c.className = "gridsquare"
        c.id = "cell" + (3 * i + 1) + "_" + j
        c.style.position = "absolute"
        c.style.top = yoff + j * (length / gridSizeY) + "px"
        c.style.left = xoff + width / nAisles * i + "px"
        c.style.width = 3 * width / gridSizeX + "px"
        c.style.height = 1 * (length / gridSizeY) + "px"
        c.style.zIndex = 100
        document.body.appendChild(c)

        var prodloc = document.createElement("div")
        prodloc.className = "ProductLoc"
        prodloc.id = "ProdLoc_1"
        prodloc.style.position = "absolute"
        prodloc.style.top = 0
        prodloc.style.left = 0
        prodloc.style.width = c.clientWidth / 3 + "px"
        prodloc.style.height = c.style.height
        prodloc.style.border = "1px solid black"
        prodloc.style.zIndex = -2
        prodloc.style.pointerEvents = "none"
        c.appendChild(prodloc)

        this.itemLocs.push(prodloc)

        var prodloc2 = document.createElement("div")
        prodloc2.className = "ProductLoc"
        prodloc2.id = "ProdLoc_2"
        prodloc2.style.position = "absolute"
        prodloc2.style.top = 0
        prodloc2.style.left = 2 * c.clientWidth / 3 + "px"
        prodloc2.style.width = c.clientWidth / 3 + "px"
        prodloc2.style.height = c.style.height
        prodloc2.style.border = "1px solid black"
        prodloc2.style.zIndex = -2
        prodloc2.style.pointerEvents = "none"
        c.appendChild(prodloc2)

        this.itemLocs.push(prodloc2)


        var aisleCell = new Aisle(c, [i * 3 + 1, j], this.route, [prodloc, prodloc2])
        this.cellDict[c.id] = { cell: aisleCell, type: "aisle" }
      }
    }
    // The making of the cross-aisle detection cells
    for (var i = 0; i < gridSizeX; i++) {
      // Upper cross aisle
      var c = document.createElement("div")
      c.className = "gridsquare"
      c.id = "cell" + i + "_0"
      c.style.position = "absolute"
      c.style.top = yoff - 0.5 * (length / gridSizeY) + "px"
      c.style.left = xoff + width / gridSizeX * i + "px"
      c.style.width = width / gridSizeX + "px"
      c.style.height = 1.5 * (length / gridSizeY) + "px"
      c.style.zIndex = 100
      document.body.appendChild(c)
      if (i % 3 == 1) {
        var crosspoint = true
      }
      else {
        var crosspoint = false
      }
      var crossaisleCell = new crossAisle(c, crosspoint, [i, 0], this.route)

      this.cellDict[c.id] = { cell: crossaisleCell, type: "cross-aisle" }

      // Lower cross aisle
      var c = document.createElement("div")
      c.className = "gridsquare"
      c.id = "cell" + i + "_" + (gridSizeY - 1)
      c.style.position = "absolute"
      c.style.top = yoff + (length / gridSizeY) * (gridSizeY - 1) + "px"
      c.style.left = xoff + width / gridSizeX * i + "px"
      c.style.width = width / gridSizeX + "px"
      c.style.height = 1.5 * (length / gridSizeY) + "px"
      c.style.zIndex = 100
      document.body.appendChild(c)

      var crossaisleCell = new crossAisle(c, crosspoint, [i, gridSizeY - 1], this.route, 0)
      this.cellDict[c.id] = { cell: crossaisleCell, type: "cross-aisle" }
    }

    this.route.cellDict = this.cellDict
    // Add that the IO point is initialized as a start/end route button
    this.io.addEventListener("click", this.route.IOClick.bind(this.route))

    // Adding of the button that sets a new order
    this.orderButton = document.getElementById("orderbutton")
    this.orderButton.onclick = this.setOrder.bind(this)

    // Adding of the button that starts a route
    this.routebutton = document.getElementById("routebutton")
    this.routebutton.onclick = this.route.newRoute.bind(this.route)
  }

  setOrder() {
    this.route.newRoute()
    for (const key in this.cellDict) {
      const c = this.cellDict[key]["cell"]
      c.pickLocations = []
    }
    this.visitList = []
    this.itemLocs.map((x) => x.style.backgroundColor = "white")
    for (var n = 0; n < ordersize; n++) {
      var aisle = Math.floor(Math.random() * nAisles)
      var prodLoc = Math.floor(Math.random() * nProd)
      var right = Math.round(Math.random())
      var [i, j] = [3 * aisle + 1, prodLoc + 1]

      var c = this.cellDict["cell" + i + "_" + j]["cell"]

      this.visitList.push([i, j])
      c.addItem(right)
    }
    this.route.visitList = this.visitList
    this.visitLeft = this.visitList
  }

  Sshaped() {
    console.log("start")
    this.route.newRoute()
    this.route.IOClick()
    const visitList = this.visitList
    var aisleList = visitList.map((x) => x[0])
    aisleList.sort(function (a, b) { return a - b });
    aisleList = [... new Set(aisleList)]
    // Start with a step above the IO point
    this.route.crossAisleEnter(null, this.cellDict["cell" + 1 + "_" + (gridSizeY - 1)]["cell"])
    // LOGIC FOR THIS ROUTE: for each aisle pick all items, then there is two choices, if it is the last one, then return to the io
    while (aisleList.length >= 1) {
      const a = aisleList.shift()
      // Move to this aisle
      while (this.route.cur[0] != a) {
        this.route.crossAisleEnter(null, this.cellDict["cell" + (this.route.cur[0] + 1) + "_" + this.route.cur[1]]["cell"])
      }
      if (aisleList.length > 0 | this.route.cur[1] != gridSizeY - 1) {
        const dir = -1 + 2 * (this.route.cur[1] <= 1)
        while (this.route.cur[1] != 1 + (dir > 0) * (gridSizeY - 3)) {
          this.route.aisleEnter(null, this.cellDict["cell" + (this.route.cur[0]) + "_" + (this.route.cur[1] + dir)]["cell"])
        }
        this.route.crossAisleEnter(null, this.cellDict["cell" + (this.route.cur[0]) + "_" + (this.route.cur[1] + dir)]["cell"])
      } else {
        var visits = this.visitList.filter((x) => x[0] == a).map((x) => x[1])
        const min = Math.min(...visits)
        while (this.route.cur[1] != min) {
          this.route.aisleEnter(null, this.cellDict["cell" + (this.route.cur[0]) + "_" + (this.route.cur[1] - 1)]["cell"])
        }
        while (this.route.cur[1] != gridSizeY - 2) {
          this.route.aisleEnter(null, this.cellDict["cell" + (this.route.cur[0]) + "_" + (this.route.cur[1] + 1)]["cell"])
        }
        this.route.crossAisleEnter(null, this.cellDict["cell" + (this.route.cur[0]) + "_" + (this.route.cur[1] + 1)]["cell"])
      }
    }
    while (this.route.cur[0] != 1) {
      this.route.crossAisleEnter(null, this.cellDict["cell" + (this.route.cur[0] - 1) + "_" + this.route.cur[1]]["cell"])
    }
    this.route.IOClick()

  }


  aisleOptions(vL) {
    if (vL.length == 0) {
      return [nProd, 10000, 10000, 10000, 0]
    }
    if (vL.length == 1) {
      return [nProd, 2 * Math.max(...vL), 2 * (nProd + 1 - Math.min(...vL)), 10000, 10000]
    }
    if (vL.length > 1) {
      return [nProd, 2 * Math.max(...vL), 2 * (nProd + 1 - Math.min(...vL)),
        2 * (nProd + 2 - Math.max(...Array.apply(null, { length: vL.length - 1 }).map(Number.call, Number).map((i) => vL[i + 1] - vL[i]))), 10000]
    }
  }

  aisleChoices() {
    var aisles = Array.apply(null, { length: nAisles }).map(Number.call, Number)
    var data = aisles.map(
      (i) => this.visitList.filter(
        (x) => x[0] == i * 3 + 1).map(
          x => x[1]).sort(
            (function (a, b) { return a - b }))
    )
    data[0].push(gridSizeY - 1)
    return [(data.map((x) => this.aisleOptions(x))), data]
  }

  findOptimalRoute() {
    // We start with the first aisle, in which we always have to "pick" the IO point
    const [choices, aisleVisits] = this.aisleChoices()
    const lastAisle = (Math.max(...this.visitList.map(x => x[0])) - 1) / 3
    const choices2 = [4, 4, 4, 8, 10000]
    var aisles = Array.apply(null, { length: nAisles }).map(Number.call, Number)
    var a = aisles.shift() + 1
    // first aisle
    var choiceDict = {
      "UU1C": { "val": choices[0][0], "prev": [], "choice": [1] },
      "E01C": { "val": choices[0][1], "prev": [], "choice": [2] },
      "0E1C": { "val": choices[0][2], "prev": [], "choice": [3] },
      "EE1C": { "val": 10000, "prev": [], "choice": [10000] },
      "EE2C": { "val": choices[0][3], "prev": [], "choice": [4] },
      "000C": { "val": 10000, "prev": [], "choice": [10000] },
      "001C": { "val": 10000, "prev": [], "choice": [10000] }
    }

    function help(acc, [key, value]) {
      var t = LminusDict[key].map((x) => (
        {
          [x[1]]: {
            "val": value.val + choices2[x[0] - 1],
            "prev": value.prev.concat(key),
            "choice": value.choice.concat(x[0])
          }
        }))
      return (acc.concat(t))
    }

    function agg(acc, [key, value]) {
      var key = Object.keys(value)[0]
      // If the key is not already in acc or the new value is lower
      if (!(key in acc) || value[key].val < acc[key].val) {
        // Update or add the entry in acc
        acc[key] = value[key];
      }
      return acc;
    }

    var choiceDict2 = Object.entries(choiceDict).reduce((acc, entry) => help(acc, entry), [])
    var choiceDict2 = Object.entries(choiceDict2).reduce(agg, {})

    while (aisles.length > 0) {
      console.log("for aisle", a, " results are: +", choiceDict)
      console.log("for aisle", a, " results are: -", choiceDict2)

      a = aisles.shift() + 1

      function help2(acc, [key, value]) {
        var t = LplusDict[key].map((x) => ({
          [x[1]]: {
            "val": value.val + choices[a - 1][x[0] - 1],
            "prev": value.prev.concat(key),
            "choice": value.choice.concat(x[0])
          }
        }))
        return (acc.concat(t))
      }
      if (a > lastAisle) {
        choices2[4] = 0
      }

      var choiceDict = Object.entries(choiceDict2).reduce((acc, entry) => help2(acc, entry), [])
      var choiceDict = Object.entries(choiceDict).reduce(agg, {})

      if (a < nAisles) {
        var choiceDict2 = Object.entries(choiceDict).reduce((acc, entry) => help(acc, entry), [])
        var choiceDict2 = Object.entries(choiceDict2).reduce(agg, {})
      }
    }

    var curmax = 100000
    var curchoices = []
    for (var key of ["E01C", "0E1C", "EE1C", "001C"]) {
      console.log(key)
      if (choiceDict[key].val < curmax) {
        curmax = choiceDict[key].val
        curchoices = choiceDict[key].choice
      }
    }



    // MAKING THE ROUTE
    this.route.newRoute()
    this.route.IOClick()
    for (var i = 0; i < curchoices.length; i++) {
      var ch = curchoices[i]
      if (i % 2 == 0) {
        a = i / 2
        if (ch == 1) {
          // Walk through entire aisle
          this.cellDict[`cell${3 * a + 1}_${0}`]["cell"].addCrossing()
          this.cellDict[`cell${3 * a + 1}_${gridSizeY - 1}`]["cell"].addCrossing()
          for (var j = 1; j < gridSizeY - 1; j++) {
            this.cellDict[`cell${3 * a + 1}_${j}`]["cell"].addVisit()
            this.cellDict[`cell${3 * a + 1}_${j}`]["cell"].pickItem()
          }
        }
        if (ch == 2) {
          // Return from top
          this.cellDict[`cell${3 * a + 1}_${0}`]["cell"].addCrossing()
          const max = Math.max(...aisleVisits[a])
          for (var j = 1; j < max; j++) {
            this.cellDict[`cell${3 * a + 1}_${j}`]["cell"].addVisit()
            this.cellDict[`cell${3 * a + 1}_${j}`]["cell"].addVisit()
            this.cellDict[`cell${3 * a + 1}_${j}`]["cell"].pickItem()
          }
          if (max < gridSizeY - 1) {
            this.cellDict[`cell${3 * a + 1}_${max}`]["cell"].addVisit()
            this.cellDict[`cell${3 * a + 1}_${max}`]["cell"].addReturn(-1)
            this.cellDict[`cell${3 * a + 1}_${max}`]["cell"].pickItem()
          }

        }
        if (ch == 3) {
          // Return from bottom
          this.cellDict[`cell${3 * a + 1}_${gridSizeY - 1}`]["cell"].addCrossing()
          const min = Math.min(...aisleVisits[a])
          for (var j = gridSizeY - 2; j > min; j--) {
            this.cellDict[`cell${3 * a + 1}_${j}`]["cell"].addVisit()
            this.cellDict[`cell${3 * a + 1}_${j}`]["cell"].addVisit()
            this.cellDict[`cell${3 * a + 1}_${j}`]["cell"].pickItem()
          }
          if (min < gridSizeY - 1) {
            this.cellDict[`cell${3 * a + 1}_${min}`]["cell"].addVisit()
            this.cellDict[`cell${3 * a + 1}_${min}`]["cell"].addReturn()
            this.cellDict[`cell${3 * a + 1}_${min}`]["cell"].pickItem()
          }

          if (ch == 4) {
            // Largest Gap

          }
        }
      }
      else {
        var a = (i - 1) / 2
        if (ch == 1) {
          // Single line both sides
          this.cellDict[`cell${3 * a + 2}_${0}`]["cell"].addVisit()
          this.cellDict[`cell${3 * a + 3}_${0}`]["cell"].addVisit()

          this.cellDict[`cell${3 * a + 2}_${gridSizeY - 1}`]["cell"].addVisit()
          this.cellDict[`cell${3 * a + 3}_${gridSizeY - 1}`]["cell"].addVisit()

          this.cellDict[`cell${3 * a + 4}_${0}`]["cell"].addCrossing()
          this.cellDict[`cell${3 * a + 4}_${gridSizeY - 1}`]["cell"].addCrossing()
        }
        if (ch == 2) {
          // Double on top
          this.cellDict[`cell${3 * a + 2}_${0}`]["cell"].addVisit()
          this.cellDict[`cell${3 * a + 3}_${0}`]["cell"].addVisit()
          this.cellDict[`cell${3 * a + 2}_${0}`]["cell"].addVisit()
          this.cellDict[`cell${3 * a + 3}_${0}`]["cell"].addVisit()

          this.cellDict[`cell${3 * a + 4}_${0}`]["cell"].addCrossing()
        }
        if (ch == 3) {
          // Double on bottom
          this.cellDict[`cell${3 * a + 2}_${gridSizeY - 1}`]["cell"].addVisit()
          this.cellDict[`cell${3 * a + 3}_${gridSizeY - 1}`]["cell"].addVisit()
          this.cellDict[`cell${3 * a + 2}_${gridSizeY - 1}`]["cell"].addVisit()
          this.cellDict[`cell${3 * a + 3}_${gridSizeY - 1}`]["cell"].addVisit()

          this.cellDict[`cell${3 * a + 4}_${gridSizeY - 1}`]["cell"].addCrossing()
        }
        if (ch == 4) {
          // Double both sides
          this.cellDict[`cell${3 * a + 2}_${0}`]["cell"].addVisit()
          this.cellDict[`cell${3 * a + 3}_${0}`]["cell"].addVisit()
          this.cellDict[`cell${3 * a + 2}_${0}`]["cell"].addVisit()
          this.cellDict[`cell${3 * a + 3}_${0}`]["cell"].addVisit()

          this.cellDict[`cell${3 * a + 2}_${gridSizeY - 1}`]["cell"].addVisit()
          this.cellDict[`cell${3 * a + 3}_${gridSizeY - 1}`]["cell"].addVisit()
          this.cellDict[`cell${3 * a + 2}_${gridSizeY - 1}`]["cell"].addVisit()
          this.cellDict[`cell${3 * a + 3}_${gridSizeY - 1}`]["cell"].addVisit()

          this.cellDict[`cell${3 * a + 4}_${0}`]["cell"].addCrossing()
          this.cellDict[`cell${3 * a + 4}_${gridSizeY - 1}`]["cell"].addCrossing()
        }
      }
    }
    this.route.IOClick()
    debugger;
  }

  pushRoute(rList) {

  }
}

// Initialize warehouse and set the first order
wh = new Warehouse()
wh.setOrder()
// wh.Sshaped()
// wh.findOptimalRoute()
