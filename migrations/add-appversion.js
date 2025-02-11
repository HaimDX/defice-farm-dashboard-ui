var promise = require("bluebird");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return promise.each(
      [
        function () {
          return queryInterface.addColumn("session", "app_version", {
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
          return queryInterface.removeColumn("session", "app_version");
        },
      ],
      function (action) {
        return action();
      }
    );
  },
};
