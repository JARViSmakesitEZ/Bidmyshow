const amqp = require("amqplib/callback_api");

amqp.connect(
  "amqps://pjebsnyx:n_K171rYbA5dY5fTL-29I3id6y9j5UJV@puffin.rmq2.cloudamqp.com/pjebsnyx",
  function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      var queue = "hello";
      var msg = { message: "Hello, JSON message!" }; // Your JSON object

      // Convert JSON object to string
      var jsonMsg = JSON.stringify(msg);

      channel.assertQueue(queue, {
        durable: false,
      });

      channel.sendToQueue(queue, Buffer.from(jsonMsg));
      console.log(" [x] Sent %s", jsonMsg);
    });

    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  }
);
