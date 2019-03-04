-- local inspect = require('inspect')

wrk.method = "POST"
wrk.body   = '{ "name": "nick" }'
wrk.headers["Content-Type"] = "application/json"
wrk.headers["Authorization"] = "Basic ${AUTH}"

local threads = {}

function setup(thread)
   table.insert(threads, thread)

   local invokerAssignment = {}
   thread:set("invokerAssignment", invokerAssignment)

   local L1 = {queryView=0, kafka=0, loadbalancer=0, getDocument=0, activationInit=0, activationRun=0, blockingActivation=0, collectLogs=0, clientServer=0, backsideQueueing=0, frontsideQueueing=0}
   L1["runc.resume"] = 0
   L1["docker.run"] = 0
   L1["docker.unpause"] = 0
   thread:set("L1", L1)
   thread:set("nL1", 0)

   local L2 = {queryView=0, kafka=0, loadbalancer=0, getDocument=0, activationInit=0, activationRun=0, blockingActivation=0, collectLogs=0, clientServer=0, backsideQueueing=0, frontsideQueueing=0}
   L2["runc.resume"] = 0
   L2["docker.run"] = 0
   L2["docker.unpause"] = 0
   thread:set("L2", L2)
   thread:set("nL2", 0)

   local L3 = {queryView=0, kafka=0, loadbalancer=0, getDocument=0, activationInit=0, activationRun=0, blockingActivation=0, collectLogs=0, clientServer=0, backsideQueueing=0, frontsideQueueing=0}
   L3["runc.resume"] = 0
   L3["docker.run"] = 0
   L3["docker.unpause"] = 0
   thread:set("L3", L3)
   thread:set("nL3", 0)

   local L4 = {queryView=0, kafka=0, loadbalancer=0, getDocument=0, activationInit=0, activationRun=0, blockingActivation=0, collectLogs=0, clientServer=0, backsideQueueing=0, frontsideQueueing=0}
   L4["runc.resume"] = 0
   L4["docker.run"] = 0
   L4["docker.unpause"] = 0
   thread:set("L4", L4)
   thread:set("nL4", 0)
end

-- duration is in microseconds
function response(status, headers, body, duration)
   local invoker = headers["X-Invoker-Assignment"]
--   if (invokerAssignment[invoker] == nil) then
--      invokerAssignment[invoker] = 1
--   else
--      invokerAssignment[invoker] = invokerAssignment[invoker] + 1
--   end

   local raw = headers["X-Latency-Stack"]
   local latencyStack = {}

   local sum = 0
   if (raw ~= nil) then
      local delimiter = " "
      for component in (raw..delimiter):gmatch("(.-)"..delimiter) do
         local k,v = component:match("(.*)=(.*)")
         latencyStack[k] = v
         sum = sum + v
      end
   end

--   sum = 0
--   for _,v in pairs(latencyStack) do
--      sum = sum + v
--   end

   -- print(inspect(latencyStack))
   local A = nil
   local base = 40000
   if (duration < base) then
       A = L1
       nL1 = nL1 + 1
   elseif (duration < 10*base) then
       A = L2
       nL2 = nL2 + 1
   elseif (duration < 25*base) then
       A = L3
       nL3 = nL3 + 1
   else
       A = L4
       nL4 = nL4 + 1
   end

   if (A ~= nil) then
      for k,v in pairs(latencyStack) do
          A[k] = A[k] + v
      end

      -- duration in micros; sum in millis
      if (sum > 0) then
         local clientServer = (duration/1000 - sum)
         A["clientServer"] = A["clientServer"] + math.max(0, clientServer)
      end
   end
end

function summarize(var, nvar, threshold)
   local nInLayer = 0
   local latency = {queryView=0, kafka=0, loadbalancer=0, getDocument=0, activationInit=0, activationRun=0, blockingActivation=0, collectLogs=0, clientServer=0, backsideQueueing=0, frontsideQueueing=0}
   latency["runc.resume"] = 0
   latency["docker.run"] = 0
   latency["docker.unpause"] = 0

   for index, thread in pairs(threads) do
       nInLayer = nInLayer + thread:get(nvar)
       if (var ~= nil) then
          if (nInLayer > 0) then
             local tvar = thread:get(var)
             for k,v in pairs(tvar) do
                latency[k] = latency[k] + v
             end
          end
          thread:set(var,nil)
       end
   end

   io.write(string.format("{\"threshold\": \"%s\", \"N\": %d", threshold, nInLayer))
   if (nInLayer > 0 and var ~= nil) then
      io.write(", \"breakdown\": {")
      local idx = 0
      for k,v in pairs(latency) do
         if (v > 0) then
	    local sep = ", "
	    if (idx == 0) then
	       sep = ""
	    end
	    idx = idx + 1
            io.write(string.format("%s\"%s\": %d", sep, k, v/nInLayer))
	 end
      end
      io.write("}")
   end
   io.write("}")
   latency = nil
end

function done(summary, latency, requests)
   io.write("{")

   local invokerAssignment = {}
   for index, thread in pairs(threads) do
      for invoker,v in pairs(thread:get("invokerAssignment")) do
         local idx = tonumber(invoker)
         if (invokerAssignment[idx] == nil) then
            invokerAssignment[idx] = v
	 else
	    invokerAssignment[idx] = invokerAssignment[idx] + v
	 end
      end
   end
   io.write("\"invokerAssignment\": {")
   
--   local idx = 0
   for idx=0,23 do
--   for invoker,v in pairs(invokerAssignment) do
      if (idx > 0) then
         io.write(",")
      end
--      idx = idx + 1
      io.write("\"")
      io.write(idx)
      io.write("\"")
      io.write(":")
      if (invokerAssignment[idx] == nil) then
         io.write("0")
      else
         io.write(invokerAssignment[idx])
      end
   end
   io.write("}")

   local base = 40

   io.write(", \"latencyStacks\": [")
   io.write("")
   summarize("L1", "nL1", string.format("<%dms", base))
   io.write(",")
   summarize("L2", "nL2", string.format("<%dms", 10*base))
   io.write(",")
   summarize("L3", "nL3", string.format(">=%dms", 25*base))
   io.write(",")
   summarize("L4", "nL4", string.format(">=%dms", 25*base))
   print("]}")
end
