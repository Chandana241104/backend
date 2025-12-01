const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin'),
    defaultValue: 'admin'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'admins',
  timestamps: false,
  hooks: {
    beforeCreate: async (admin) => {
      if (admin.password_hash) {
        admin.password_hash = await bcrypt.hash(admin.password_hash, 12);
      }
    }
  }
});

Admin.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password_hash);
};

module.exports = Admin;