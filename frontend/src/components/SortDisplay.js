/**
 * Component to create visualizations of algorithms.
 * Takes the algorithm name as string and its display
 * name. Makes request to the server at the endpoint
 * specified by the display name.
 * 
 * @author Evan Ohme
 */
import { BarChart, YAxis, XAxis, Bar } from 'recharts';
import { useState } from 'react';
import { useRef, useEffect } from 'react';
import { Button, Slider } from '@mui/material';

function SortDisplay({ algorithm, displayName }) {

  var idx = 0;

  const [ snapshot, setSnapshot ] = useState([{index: 0, value: 0}]);
  const [ list, setList ] = useState([[{index: 0, value: 0}]]);
  const isRunning = useRef(false);
  const isSorted = useRef(false);
  const intervalId = useRef(null);

  const [ size, setSize ] = useState(20);

  function update() {
    if (idx >= list.length) {
      clearInterval(intervalId.current);
      setSnapshot(list[idx-1]);
      isRunning.current = false;
      isSorted.current = true;
      return;
    }
    setSnapshot(list[idx++]);
  }

  function randomize() {
    if (isRunning.current)
      return;
    fetch(`http://174.138.108.50:8080/${algorithm}?size=${size}`)
    .then((res) => {
      return res.json();
    })
    .then((snapshots) => {
      setList(convertSnapshots(snapshots));
      isSorted.current = false;
    });
  }

  function sort() {
    if (!isRunning.current && !isSorted.current) {
      intervalId.current = setInterval(update, 800/size);
      isRunning.current = true;
    }
  }

  function convertSnapshots(snapshots) {
    var retval = [];
    snapshots.forEach((snapshot) => {
      var i = 0;
      var newSS = [];
      snapshot.forEach((val) => {
        let o = {index:i++, value:val};
        newSS.push(o);
      });
      retval.push(newSS);
    });
    return retval;
  }

  useEffect(() => {
    randomize();
    // the below comment is needed, it ignores an annoying warning
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // <- empty array means 'run once on first render'

  useEffect(() => {
    setSnapshot(list[0]);
  }, [list]); 

  return (
    <div className="SortDisplay">
      <h2>{displayName}</h2>
      <BarChart width={500} height={250} data={snapshot}>
        <XAxis dataKey="index" tick={false} />
        <YAxis hide={true} />
        <Bar dataKey="value" fill="white" />
      </BarChart>
      <span>
        <Button variant="outlined"
          onClick={sort}
          sx={{ m: 4, borderColor: 'white', color: 'white', background: '#282c34' }}
        >Sort</Button>
        <Button variant="outlined"
          onClick={randomize}
          sx={{ m: 4, borderColor: 'white', color: 'white', background: '#282c34' }}
        >Randomize</Button>
      </span>
      <br/>
      <span>
        <span style={{marginTop: 2, fontSize: "large", fontWeight: "bold"}}>
          Size
        </span>
        <Slider id="sizeSlider"
          defaultValue={20}
          valueLabelDisplay="auto"
          min={1}
          max={100}
          onChange={(_, value) => {
            setSize(value);
          }}
          onChangeCommitted={(_, value) => {
            setSize(value);
            randomize();
          }}
        />
      </span>
    </div>
  );
}

export default SortDisplay;