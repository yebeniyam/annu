const { DataTypes } = require('sequelize');
const crypto = require('crypto');

module.exports = (sequelize, Sequelize) => {
  const VerificationToken = sequelize.define('VerificationToken', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users', // This references the 'users' table
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: true,
    tableName: 'verification_tokens',
    hooks: {
      beforeCreate: (token) => {
        // Set expiration to 24 hours from now
        token.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      }
    }
  });

  // Class method to generate a new verification token
  VerificationToken.generateToken = function() {
    return crypto.randomBytes(32).toString('hex');
  };

  // Set up the association with User
  VerificationToken.associate = (models) => {
    VerificationToken.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return VerificationToken;
};
