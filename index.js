const fs = require("fs");
const readline = require("readline");
const stream = fs.createReadStream("./team.csv");
const rl = readline.createInterface({ input: stream });
const axios = require("axios");


let data = [];

rl.on("line", (row) => {
  data.push(row.split(","));
})

rl.on("close", () => {
  
  const memberDetails = data.slice(5);
  
  let leaves = [];

  axios.get('http://relay.samagra.io/internalbot/leaves/?name=Chakshu%20Gautam').then(res => {
    leaves = res.data.split('\n') ;
    console.log('leaves: ', leaves);
    leaves = leaves.slice(1)
    let leaveMap = {};

    leaves.forEach(leave => {
      const fields = leave.split(',');
      const startDate = fields[2];
      const endDate = fields[3];

      let [start, startMonth, startYear] = startDate.slice(1, -1).split('-');
      let [end, endMonth, endYear] = endDate.slice(1, -1).split('-');
      
      start = parseInt(start);
      end = parseInt(end);
      startMonth = parseInt(startMonth);
      endMonth = parseInt(endMonth);
      startYear = parseInt(startYear);
      endYear = parseInt(endYear);

      console.log("leave: ", [start, startMonth, startYear], [end, endMonth, endYear]);
      // console.log([end, endMonth, endYear]);

      let monthWiseObj = {};

      if(startYear == endYear) {
        if(startMonth == endMonth) {
          leaveTracker = {};
          for(let i = start; i <=end; i++){
            console.log('in loop 1');
            leaveTracker[i] = true;
          }
          if(!monthWiseObj[startMonth]) monthWiseObj[startMonth] = leaveTracker;
          else monthWiseObj[startMonth] = {...monthWiseObj[startMonth], ...leaveTracker};
        } else {
          for(let i = start; i <= 31; i++) {
            console.log('in loop 2');
            leaveTracker[i] = true;
          }
          if(!monthWiseObj[startMonth]) monthWiseObj[startMonth] = leaveTracker;
          else monthWiseObj[startMonth] = {...monthWiseObj[startMonth], ...leaveTracker};
          for(let i = startMonth+1; i < endMonth ; i++) {
            leaveTracker={};
            console.log('in loop 3');

            for(let j = 1; j <= 31; j++) {
            console.log('in loop 4');

              leaveTracker[j] = true;
            }
            if(!monthWiseObj[i]) monthWiseObj[i] = leaveTracker;
            else monthWiseObj[i] = {...monthWiseObj[i], ...leaveTracker};
          }
          leaveTracker = {};
          for(let i = 1; i <= end; i++) {
            console.log('in loop 5');

            leaveTracker[i] = true;
          }
          if(!monthWiseObj[endMonth]) monthWiseObj[endMonth] = leaveTracker;
          else monthWiseObj[endMonth] = {...monthWiseObj[endMonth], ...leaveTracker};

        }
        
      } else {

      }
      if(!leaveMap[startYear]) leaveMap[startYear] = monthWiseObj;
        else leaveMap[startYear] = {...leaveMap[startYear], ...monthWiseObj};
    });
    console.log('leaveMap: ', leaveMap);
  });
})