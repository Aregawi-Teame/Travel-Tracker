const rules = new Map();
rules.set("alphabet", /^[a-zA-Z\ \' \. \, \-]{2,}$/);
rules.set("number", /^[0-9]+$/);
rules.set("alphaNumeric", /^[a-zA-Z0-9]+$/);
rules.set("description", /^.{6,}$/);

const properties = new Map();
properties.set("country",rules.get("alphabet"));
properties.set("population",rules.get("number"));
properties.set("description", rules.get("description"));
properties.set("name",rules.get("alphabet"));
properties.set("city",rules.get("alphabet"));

const message = new Map();
message.set("country", "Please enter valid Country name (only character, space and .) ");
message.set("population","Please enter valid population number (only number");
message.set("description", "Please enter valid description");
message.set("name", "Please enter valid name");
message.set("city", "Please enter valid city name");


module.exports = {rules, properties, message};