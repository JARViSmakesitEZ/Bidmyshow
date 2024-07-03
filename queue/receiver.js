#!/usr/bin/env node

var amqp = require("amqplib/callback_api");

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

      channel.assertQueue(queue, {
        durable: false,
      });
      console.log(
        " [*] Waiting for messages in %s. To exit press CTRL+C",
        queue
      );
      channel.consume(
        queue,
        function (msg) {
          var message = msg.content.toString();
          try {
            var jsonMessage = JSON.parse(message);
            console.log(" [x] Received JSON:", jsonMessage);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        },
        {
          noAck: true,
        }
      );
    });
  }
);
