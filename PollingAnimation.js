let ctx = document.getElementById('mychart');
    
    const down = (ctx, value) => ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;
    const up = (ctx, value) => ctx.p0.parsed.y < ctx.p1.parsed.y ? value : undefined;



    Math.seedrandom('any string you like');
    let container = document.getElementById("container")
    
    let r = 250;
    function getLoc(x){
        return [r + r*Math.sin(x*2*Math.PI),r-r*Math.cos(x*2*Math.PI)]
    }


    
    let param = {clockwise: parseInt(document.getElementById("clockwise").value), 
                        counterclockwise: parseInt(document.getElementById("counter-clockwise").value),
                        servicetime: document.getElementById("serviceTime").value}

    let t = 0;
    let mu = 3;
    let arrRate = 5;


    // Simulation calls
    function sSim(){
        let u = Math.random();
        return -Math.log(u)*param.servicetime/10;
    }

    function arrSim(){
        let u = Math.random();
        return -Math.log(u)/arrRate;
    }

    class simulate{
        constructor(){
            this.curtime = 0
            // Main simulation properties:
            this.queue = [];
            this.FES = {
                eventqueue: [], times: [], custqueue: [], serverqueue: []
            };
            this.serverList_C = {locations: [], servers: []};
            this.serverList_CC = {locations: [], servers: []};
            this.serverList = {locations: [], servers: []};
            let c = param.clockwise + param.counterclockwise;
            
            this.serverindexCounter = c;

            this.chart = new Chart(ctx, {
                    type: 'line',
                    options: {
                        scales: {
                            xAxes: {
                                type: "linear",
                                bounds: "ticks",
                                max: 3,
                                min: 0,
                                ticks: {
                                    display: false,
                                    stepSize: 1
                                }
                            },
                            y: {
                                type: 'linear',
                                min: 0,
                                max: 1,
                            },
                        },
                        parsing: {
                            xAxisKey: "x",
                            yAxisKey: "y"
                        },
                        interaction: {
                            intersect: false
                        },
                        fill: false,
                        radius: 0,
                        hover: {mode: "label"},
                        plugins: {
                            legend: {
                                display: false
                            }
                        } 
                    }
                })


            // Add the servers to the animation
            for(let i = 0; i< param.clockwise;i ++){
                this.addServer(i/c,i,1)
            }
            for(let i = 0; i< param.counterclockwise;i ++){
                this.addServer((i+param.clockwise)/c,i+param.clockwise, 0)
            }
                    
            // Start of simulation, simulate first arrival
            this.ncust  = 0;


            let interArrival = arrSim(); 
            let newlocation = Math.random();
            let newcust = makeCustomer(this.ncust, newlocation, interArrival + t);

            // Initialization of first arrival
            this.FES.custqueue.push(newcust)
            this.FES.eventqueue.push("Arrival")
            this.FES.times.push(interArrival)
            this.FES.serverqueue.push(undefined)
            this.event = undefined
            this.cust = undefined
            this.nextTime = interArrival
            this.server = undefined


            this.delta = 400 // Can be increased when needed
            this.frames = Math.ceil(this.nextTime*this.delta)
            this.step = this.nextTime / this.frames

        

            
            this.id = null
            this.nextEvent = false
        }
        
        animateFrame(){
            // If there is no frame left to animate, the event takes place.
            if(this.frames == 0){

                this.event = this.FES.eventqueue.pop()
                this.cust = this.FES.custqueue.pop()
                this.nextTime = this.FES.times.pop()
                this.server = this.FES.serverqueue.pop()

                if(this.event == "Arrival"){
                    addCustomer(this.cust);
                    this.ncust ++;
                    let interArrival = arrSim();
                    let newlocation = Math.random();

                    let newcust = makeCustomer(this.ncust, newlocation, interArrival + this.nextTime);
                    // Add new event to the FutureEventSet
                    this.FES.custqueue.push(newcust);
                    this.FES.eventqueue.push("Arrival");
                    this.FES.times.push(interArrival + this.curtime);
                    this.FES.serverqueue.push(undefined) 

                    // Add customer to the queue
                    this.queue.push(this.cust)
                }
                if(this.event == "Departure"){
                    removeCustomer(this.cust);
                    this.server.idle = true;
                    this.plotSavepoint(this.server)
                    this.server.cust = null;
                }
                if(this.event == "Service"){
                    this.server.idle = false
                    this.server.cust = this.cust
                    let custInx = this.queue.indexOf(this.cust)

                    this.plotSavepoint(this.server)

                    if (custInx > -1) {
                        this.queue.splice(custInx, 1);
                    }

                    let serviceTime = sSim()
                    this.FES.custqueue.push(this.cust)
                    this.FES.eventqueue.push("Departure")
                    this.FES.times.push(this.curtime + serviceTime)
                    this.FES.serverqueue.push(this.server)
                }


                // After the events are handled, schedule the next service start if it is sooner than the next event!
                this.addClosest()

                // Sort the events based on the time
                this.FES = sortEvents(this.FES)
                

                // After simulating the event, determine the time till next event.
                this.getNextEvent()



                if(this.nextEvent){
                    this.nextEvent = false
                    clearInterval(this.id)
                }
            }
            else{
                this.curtime = this.step + this.curtime
                this.serverList = moveServers(this.serverList, this.step)
                this.frames = this.frames - 1

                this.updatePlot()
            }
        }
        
        addServer(initLoc, id, direction = 0){
            this.serverList.locations.push(initLoc);
            if(direction == 0){
                this.serverList_C.locations.push(initLoc)
            }
            else{
                this.serverList_CC.locations.push(initLoc)
            }
            
            let x = getLoc(initLoc);
            var server = document.createElement("server"+ id)
            server.className = "server"

            server.style.top = x[1] + "px";
            server.style.left = x[0] + "px";

            container.appendChild(server)
            // Make a new server entity with following attributes:
            //  id: unique number to server, location: current location, idle: boolean indicating state
            //  direction: direction of server, elem: html element of server, cust: current customer in service
            //  data: latest location data of server, counter: how often the server crossed the border [0,1]
            let news = {id: id, location: initLoc, idle: true, direction: direction, elem: server, 
                cust: null,
                data: [{x: this.curtime, y: initLoc}], counter: 0}
            
            this.serverList.servers.push(news)
            if(direction == 1){
                this.serverList_C.servers.push(news)
                            // Add the data to the chart -> important to keep indexing!
                this.chart.data.datasets.push(
                    {label: id,
                    data: news.data,
                    borderColor: 'rgb(75, 192, 192)',
                    segment: {
                        borderColor: ctx => down(ctx, 'rgba(0,0,0,0.1)'),
                        borderDash: ctx => down(ctx, [6, 6]),
                    }}
                )
            }
            else{
                this.serverList_CC.servers.push(news)
                this.chart.data.datasets.push(
                    {label: id,
                    data: news.data,
                    borderColor: 'rgb(192, 75, 75)',
                    segment: {
                        borderColor: ctx => up(ctx, 'rgba(0,0,0,0.1)'),
                        borderDash: ctx => up(ctx, [6, 6]),
                    }}
                )
            }

        }

        plotSavepoint(s){
            s.data.push({x:this.curtime, y:s.location})
        }


        updatePlot(){
            for(const s of this.serverList.servers){
                this.chart.data.datasets[s.id].data = s.data.concat([{x: this.curtime, y:s.location}])
                if ((s.direction == 1) & (s.location > 1-this.step)){
                    s.data.push({x:this.curtime, y: 1})
                    s.data.push({x:this.curtime, y: 0})
                }
                if ((s.direction == 0) & (s.location < this.step)){
                    s.data.push({x:this.curtime, y: 0})
                    s.data.push({x:this.curtime, y: 1})
                }
            }
            this.chart.options.scales.xAxes.min = Math.max(this.curtime - 10, 0) 
            this.chart.options.scales.xAxes.max = Math.max(this.curtime  ,3)
            this.chart.update("none")
        }

        addClosest(){
            if(this.queue.length > 0){
                    let [closestDist, closestCust, closestServer]  = closest(this.queue, this.serverList)
                    if(closestDist + this.curtime < Math.min.apply(Math, this.FES.times)){
                        // If there is a closest, be sure that this will be the only service start in the event queue
                        let inx = this.FES.eventqueue.indexOf("Service")
                        if(inx > -1){
                            for(const prop in this.FES){this.FES[prop].splice(inx,1)}
                        }

                        this.FES.custqueue.push(closestCust)
                        this.FES.eventqueue.push("Service")
                        this.FES.times.push(this.curtime + closestDist)
                        this.FES.serverqueue.push(closestServer)
                    }
                }

        }

        getNextEvent(){
            let dist = this.FES.times[this.FES.times.length - 1] - this.curtime
                this.frames = Math.ceil(dist*this.delta)
                this.step = dist/this.frames
        }

        playAnimation(){
            this.id = setInterval(this.animateFrame.bind(this), 10)
        }

        pauseAnimation(){
            clearInterval(this.id)
        }

        nextEventAnimation(){
            clearInterval(this.id)
            this.nextEvent = true
            this.id = setInterval(this.animateFrame.bind(this), 10)
        }
    }

    // Functions for the movement of servers 
    function moveServers(servers,delta){
        const newlocs = [];
        for(const s of servers.servers){
            if(s.idle){
                newloc = moveServer(s, delta)
            }
            else{
                newloc = s.location
            }
            newlocs.push(newloc)
        }
        servers.locations = newlocs
        return servers
    }



    var sim = new simulate()
   
    function PlayAnimation(){
        sim.playAnimation()
    }
    function PauseAnimation(){
        sim.pauseAnimation()
    }
    function NextEvent(){
        sim.nextEventAnimation()
    }
    
    function makeCustomer(id, location, arrtime){
            return {id: id, location: location, arrtime: arrtime, animationElement: undefined, server: undefined}
        }

    function addCustomer(cust){
            let id = cust.id
            let location = cust.location
            

            let x = getLoc(location);
            var job = document.createElement("job"+ id)
            job.className = "job"

            job.style.top = x[1] + "px";
            job.style.left = x[0] + "px";

            container.appendChild(job)
            cust.elem = job
        }
    
    function removeCustomer(cust){
            cust.elem.remove()
        }

    function moveServer(s, delta){
        if(s.direction == 1){
            newloc = s.location + delta;
            if(newloc > 1){
                newloc = newloc - 1;
            }
            let x = getLoc(newloc);

            s.elem.style.top = x[1] + "px";
            s.elem.style.left = x[0] + "px";
            s.location = newloc; 
        } else{
            newloc = s.location - delta;
            if(newloc < 0){
                newloc = newloc + 1;
            }
            let x = getLoc(newloc);

            s.elem.style.top = x[1] + "px";
            s.elem.style.left = x[0] + "px";
            s.location = newloc; 
        }
        return newloc
    }

    function closest(qL , sL){
        function dist(x,y, direction){
            if(direction == 0){
                let d = y-x;
                if(d < 0){
                    d = d+ 1;
                }
                return d
            }
            if(direction == 1){
                let d = x-y;
                if(d < 0){
                    d = d + 1;
                }
                return d
            }
        }

        let minDist = 1000000;
        let cust = undefined
        let server = undefined
        let queueLoc = qL.map((value, inx) => value.location)
        for(s of sL.servers){
           if(s.idle){
                let distarr = queueLoc.map((value,inx) => dist(value, s.location, s.direction));
                let curmin = Math.min.apply(Math, distarr);
                if(curmin < minDist){
                        minDist = curmin;
                        cust = qL[distarr.indexOf(curmin)]
                        server = s
                }
           }
        }
        return [minDist, cust, server]
    }

    function sortEvents(FES){
        times = FES.times.slice()
        let sortedTimes = times.slice().sort(((a,b)=> b-a));
        let sortedEvents = []
        let sortedCustomers = []
        let sortedServers = []

        for(let i = 0; i < times.length; i++){
            let inx = times.indexOf(sortedTimes[i])
            sortedEvents.push(FES.eventqueue[inx])
            sortedCustomers.push(FES.custqueue[inx])
            sortedServers.push(FES.serverqueue[inx])
        }
        FES.times = sortedTimes
        FES.eventqueue = sortedEvents
        FES.custqueue = sortedCustomers
        FES.serverqueue = sortedServers

        return FES
    }

    function changeClockwise(val){
        if(val < 0){
            alert("The number of servers does not make sense.")
        }
        val = parseInt(Math.round(val))
        if(val > param.clockwise){
            newloc = Math.random()
            id = sim.serverindexCounter
            sim.serverindexCounter++;
            sim.addServer(newloc, id ,1)
        }
        if(val < param.clockwise){
            server_instance = sim.serverList_C.servers.pop()
            sim.serverList_C.locations.pop()

            inx = sim.serverList.servers.indexOf(server_instance)
            server_instance.elem.remove()

            sim.serverList.servers.splice(inx, 1)
            sim.serverList.locations.splice(inx, 1)

            inx = sim.FES.serverqueue.indexOf(server_instance)
            if(inx > -1){
                for(prop in sim.FES){sim.FES[prop].splice(inx,1)}
            }
            
            if(server_instance.cust){
                removeCustomer(server_instance.cust)
            }
        }

        sim.addClosest()
        sim.getNextEvent()
        sim.FES = sortEvents(sim.FES)
        param.clockwise = val
    }

    function changecounterClockwise(val){
        if(val < 0){
            alert("The number of servers does not make sense.")
        }
        val = parseInt(Math.round(val))
        if(val > param.counterclockwise){
            newloc = Math.random()
            id = sim.serverindexCounter
            sim.serverindexCounter++;
            sim.addServer(newloc, id ,0)
        }
        if(val < param.counterclockwise){
            server_instance = sim.serverList_CC.servers.pop()
            server_instance.elem.remove()
            sim.serverList_CC.locations.pop()

            inx = sim.serverList.servers.indexOf(server_instance)
            sim.serverList.servers.splice(inx, 1)
            sim.serverList.locations.splice(inx, 1)

            inx = sim.FES.serverqueue.indexOf(server_instance)
            if(inx > -1){
                for(prop in sim.FES){sim.FES[prop].splice(inx,1)}
            }
            for(prop in sim.FES){sim.FES[prop].splice(inx,1)}

            if(server_instance.cust){
                removeCustomer(server_instance.cust)
            }
        }
        sim.addClosest()
        sim.getNextEvent()
        sim.FES = sortEvents(sim.FES)
        param.counterclockwise = val
    }

    function changeService(val){
        param.servicetime = val
    }
    


