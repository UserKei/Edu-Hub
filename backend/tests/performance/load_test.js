const autocannon = require('autocannon');

async function runTest() {
  console.log('Starting load test on http://localhost:3000/api/courses ...');

  const result = await autocannon({
    url: 'http://localhost:3000/api/courses',
    connections: 10, // Number of concurrent connections
    pipelining: 1,   // Number of pipelined requests
    duration: 10     // Duration of the test in seconds
  });

  console.log('\n--- Performance Test Report ---');
  console.log(`URL: ${result.url}`);
  console.log(`Duration: ${result.duration} seconds`);
  console.log(`Connections: ${result.connections}`);
  console.log('\n[Latency]');
  console.log(`Average: ${result.latency.average} ms`);
  console.log(`Min: ${result.latency.min} ms`);
  console.log(`Max: ${result.latency.max} ms`);
  console.log(`p99: ${result.latency.p99} ms`);
  
  console.log('\n[Throughput]');
  console.log(`Requests/sec: ${result.requests.average}`);
  console.log(`Bytes/sec: ${result.throughput.average}`);
  
  console.log('\n[Errors]');
  console.log(`Timeouts: ${result.errors}`);
  console.log(`Non-2xx: ${result.non2xx}`);
  console.log('-------------------------------\n');
}

runTest();
