const hbs = require('hbs');

hbs.registerHelper('checkRole', (userRole, role, options) => {
  if (userRole === role) {
    // return options.inverse(this);
    return options.fn(this);
  }
  // return options.fn(this);
  return options.inverse(this);
});