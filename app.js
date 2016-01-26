var cluster = require('cluster');

// Listen for dying workers
cluster.on('exit', function (worker, code, signal) {
    console.log('worker %d died (%s). restarting...',
                 worker.process.pid, signal || code);
    cluster.fork();
});

if (cluster.isMaster) {
    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i ++) {
        cluster.fork();
    }

    console.log('Master is running');
} else {
    var express = require('express');
    var app = express();

    app.get('/', function (req, res){
        res.send('Hello World!');
    });

    app.get('/whoami', function(req, res){
        res.send('I\'m ' + cluster.worker.id);
    });

    app.listen(3000);
    console.log('Worker %d running!', cluster.worker.id);
}
