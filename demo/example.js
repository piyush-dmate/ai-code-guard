function login(userInput) {
  // Insecure: user input is directly logged
  console.log("User logged in: " + userInput);

  // TODO: add real authentication
  return true;
}

module.exports = { login };
