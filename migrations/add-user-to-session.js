var promise = require("bluebird");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return promise.each(
      [
        function () {
          return queryInterface.addColumn("session", "user", {
            type: Sequelize.TEXT,
            allowNull: true,
          });
        },
      ],
      function (action) {
        return action();
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return promise.each(
      [
        function () {
          return queryInterface.removeColumn("session", "user");
        },
      ],
      function (action) {
        return action();
      }
    );
  },
};
