//&name dummy
//&desc literally bigass

exports.init = function(client) {
  console.log("bro its "+client.user.username+"!")
}

exports.message = function(message) {
  if(message.author.bot) return;
  message.channel.send(message.content + " bruh")
}
