var promise = require("bluebird");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return promise.each(
      [
        function () {
          return queryInterface.addColumn("builds", "platform_name", {
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
          return queryInterface.removeColumn("builds", "platform_name");
        },
      ],
      function (action) {
        return action();
      }
    );
  },
};
